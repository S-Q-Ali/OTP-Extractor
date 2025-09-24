// controllers/authController.js
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const logger = require("../utils/logger");
const cache = require("../utils/userCache"); // Import the cache

const usersFilePath = path.join(__dirname, "../user.json");
const CACHE_KEY = "users_data";
const CACHE_TTL = 180000; // 5 minutes

// Helpers with cache support
const readUsers = () => {
  // Try to get from cache first
  const cachedUsers = cache.get(CACHE_KEY);
  if (cachedUsers) {
    return cachedUsers;
  }

  // If not in cache, read from file and cache it
  const fileUsers = fs.existsSync(usersFilePath)
    ? JSON.parse(fs.readFileSync(usersFilePath))
    : { users: {} };

  cache.set(CACHE_KEY, fileUsers, CACHE_TTL);
  return fileUsers;
};

const writeUsers = (users) => {
  // Write to file
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  // Update cache
  cache.set(CACHE_KEY, users, CACHE_TTL);
};

// Helper to invalidate cache when needed
const invalidateUsersCache = () => {
  cache.delete(CACHE_KEY);
};


// Helper to get client IP
const getClientIp = (req) => {
  return (
    req.clientIp ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : "unknown")
  );
};

// REGISTER (updated with cache invalidation)
async function register(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      await logger.logRegister(email, "failure", "missing_credentials", {
        ip: getClientIp(req),
      });
      return res.status(400).json({ message: "Email and password required" });
    }

    const users = readUsers();
    if (users.users[email]) {
      await logger.logRegister(email, "failure", "user_already_exists", {
        ip: getClientIp(req),
      });
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const secret = speakeasy.generateSecret({ name: `OTP-App (${email})` });
    const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url);

    users.users[email] = {
      id: email,
      name: name || email,
      password: hashedPassword,
      secret: secret.base32,
      qrCode: qrCodeDataUrl,
      is_verified: false,
    };

    writeUsers(users); // This will update both file and cache

    // Log successful registration
    await logger.logRegister(email, "success", "new_user_created", {
      ip: getClientIp(req),
      has_2fa: true,
    });

    res.json({
      message: "User registered successfully",
      qrCode: qrCodeDataUrl,
      email,
    });
  } catch (err) {
    // Invalidate cache on error to ensure consistency
    invalidateUsersCache();

    await logger.logRegister(req.body.email, "error", "internal_server_error", {
      ip: getClientIp(req),
      error: err.message,
    });

    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

// LOGIN (benefits from cache)
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const users = readUsers(); // This will use cache if available
    const user = users.users[email];

    if (!user) {
      await logger.logLogin(email, "failure", "user_not_found", {
        ip: getClientIp(req),
      });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await logger.logLogin(email, "failure", "invalid_password", {
        ip: getClientIp(req),
      });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Log successful password validation
    await logger.logLogin(email, "success", "password_valid", {
      ip: getClientIp(req),
      requires_otp: true,
    });

    res.json({ message: "Password valid, enter OTP", requiresOtp: true });
  } catch (err) {
    await logger.logLogin(req.body.email, "error", "internal_server_error", {
      ip: getClientIp(req),
      error: err.message,
    });

    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

// VERIFY TOTP (updated with cache)
async function verifyTotp(req, res) {
  try {
    const { email, token } = req.body;
    const users = readUsers(); // Uses cache
    const user = users.users[email];

    if (!user) {
      await logger.logVerifyTotp(email, "failure", "user_not_found", {
        ip: getClientIp(req),
        method: "totp",
      });
      return res.status(401).json({ message: "Invalid user" });
    }

    console.log("TOTP Verification Attempt:", {
      email: email,
      token: token,
      secret: user.secret,
      time: new Date().toISOString(),
    });

    const isValid = speakeasy.totp.verify({
      secret: user.secret,
      encoding: "base32",
      token: token,
      window: 6,
      step: 30,
    });

    console.log("TOTP Verification Result:", isValid);

    if (!isValid) {
      await logger.logVerifyTotp(email, "failure", "invalid_or_expired_totp", {
        ip: getClientIp(req),
        method: "totp",
        provided_token: token,
      });

      const currentToken = speakeasy.totp({
        secret: user.secret,
        encoding: "base32",
        step: 30,
      });

      console.log("Server expected token around this time:", currentToken);
      return res.status(401).json({
        message:
          "Invalid or expired TOTP. Please make sure your device time is synchronized.",
      });
    }

    user.is_verified = true;
    writeUsers(users); // Updates both file and cache

    await logger.logVerifyTotp(email, "success", "otp_verified", {
      ip: getClientIp(req),
      method: "totp",
    });

    console.log("✅ TOTP Verification Successful for:", email);
    res.json({
      message: "Login successful ✅",
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    invalidateUsersCache(); // Invalidate cache on error

    await logger.logVerifyTotp(
      req.body.email,
      "error",
      "internal_server_error",
      {
        ip: getClientIp(req),
        method: "totp",
        error: err.message,
      }
    );

    console.error("❌ TOTP Verification Error:", err);
    res.status(500).json({
      message: "Server error during verification",
      error: err.message,
    });
  }
}


// Ultra-compact cache diagnostics endpoint
async function getCacheDiagnostics(req, res) {
  try {
    const { action, iterations = 100 } = req.query;
    
    // Handle cache operation if specified
    if (action) {
      if (action === 'clear') cache.clear();
      else if (action === 'refresh') cache.delete(CACHE_KEY);
    }

    // Performance test (core metric)
    const fileStart = Date.now();
    for (let i = 0; i < iterations; i++) {
      if (fs.existsSync(usersFilePath)) JSON.parse(fs.readFileSync(usersFilePath));
    }
    const fileTime = Date.now() - fileStart;
    
    const cacheStart = Date.now();
    for (let i = 0; i < iterations; i++) cache.get(CACHE_KEY);
    const cacheTime = Date.now() - cacheStart;

    // Basic cache vs file comparison
    const cached = cache.get(CACHE_KEY);
    const fileData = fs.existsSync(usersFilePath) ? JSON.parse(fs.readFileSync(usersFilePath)) : { users: {} };

    res.json({
      performance: {
        fileTime: `${fileTime}ms`,
        cacheTime: `${cacheTime}ms`,
        speedup: `${((fileTime - cacheTime) / fileTime * 100).toFixed(0)}% faster`
      },
      data: {
        cacheUsers: cached ? Object.keys(cached.users || {}).length : 0,
        fileUsers: Object.keys(fileData.users || {}).length,
        matches: JSON.stringify(cached) === JSON.stringify(fileData)
      },
      cache: {
        size: cache.cache.size,
        hasUsers: !!cached
      },
      ...(action && { action: `${action} completed` })
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
  register,
  login,
  verifyTotp,
  getCacheDiagnostics,
};
