const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

const usersFilePath = path.join(__dirname, "../user.json");

// Helpers
const readUsers = () => (fs.existsSync(usersFilePath) ? JSON.parse(fs.readFileSync(usersFilePath)) : { users: {} });
const writeUsers = (users) => fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

// controllers/authController.js - Add better error handling
async function register(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const users = readUsers();
    
    // Check if user already exists with better error message
    if (users.users[email]) {
      return res.status(400).json({ 
        message: "User already exists. Please login instead or use a different email.",
        existingUser: true
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const secret = speakeasy.generateSecret({ 
      name: `OTP-App (${email})`,
      issuer: 'YourAppName' // Add issuer for better QR code
    });
    
    const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url);

    users.users[email] = {
      id: email,
      name: name || email,
      password: hashedPassword,
      secret: secret.base32,
      qrCode: qrCodeDataUrl,
      is_verified: false,
      created_at: new Date().toISOString()
    };

    writeUsers(users);
    
    console.log('✅ New user registered:', email);
    console.log('🔑 Secret generated:', secret.base32);
    
    res.json({ 
      message: "User registered successfully", 
      qrCode: qrCodeDataUrl, 
      email: email,
      secret: secret.base32 // Include secret for debugging (remove in production)
    });
    
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

// LOGIN
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const users = readUsers();
    const user = users.users[email];

    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid email or password" });

    res.json({ message: "Password valid, enter OTP", requiresOtp: true });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

// VERIFY TOTP - FIXED VERSION
function verifyTotp(req, res) {
  try {
    const { email, token } = req.body;
    const users = readUsers();
    const user = users.users[email];

    if (!user) return res.status(401).json({ message: "Invalid user" });

    console.log('TOTP Verification Attempt:', {
      email: email,
      token: token,
      secret: user.secret,
      time: new Date().toISOString()
    });

    // FIX: Use a larger window and add more debugging
    const isValid = speakeasy.totp.verify({
      secret: user.secret,
      encoding: "base32",
      token: token,
      window: 6, // Increased to 6 (3 steps before and after = 3 minutes total)
      step: 30
    });

    // Additional debugging: Generate tokens for a wider range
    if (!isValid) {
      console.log('Detailed token analysis for debugging:');
      for (let i = -5; i <= 5; i++) {
        const testToken = speakeasy.totp({
          secret: user.secret,
          encoding: "base32",
          time: Date.now() + (i * 30000), // 30-second intervals
          step: 30
        });
        console.log(`Offset ${i * 30} seconds: ${testToken} ${testToken === token ? '← MATCH' : ''}`);
      }
    }

    console.log('TOTP Verification Result:', isValid);

    if (!isValid) {
      // Generate what the server expects right now
      const currentToken = speakeasy.totp({
        secret: user.secret,
        encoding: "base32",
        step: 30
      });
      
      console.log('Server expected token around this time:', currentToken);
      return res.status(401).json({ 
        message: "Invalid TOTP code. Please ensure: 1) Your device time is synchronized 2) You're using the most recent code 3) You've scanned the correct QR code" 
      });
    }

    user.is_verified = true;
    writeUsers(users);
    
    console.log('✅ TOTP Verification Successful for:', email);
    res.json({ 
      message: "Login successful ✅", 
      user: { 
        email: user.email, 
        name: user.name 
      } 
    });
    
  } catch (err) {
    console.error('❌ TOTP Verification Error:', err);
    res.status(500).json({ 
      message: "Server error during verification", 
      error: err.message 
    });
  }
}

// Add a debug endpoint to help troubleshoot
function debugTOTP(req, res) {
  try {
    const { email } = req.body;
    const users = readUsers();
    const user = users.users[email];

    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate current and nearby tokens for debugging
    const currentToken = speakeasy.totp({
      secret: user.secret,
      encoding: "base32",
      step: 30
    });

    const previousToken = speakeasy.totp({
      secret: user.secret,
      encoding: "base32",
      step: 30,
      time: Date.now() - 30000 // 30 seconds ago
    });

    const nextToken = speakeasy.totp({
      secret: user.secret,
      encoding: "base32",
      step: 30,
      time: Date.now() + 30000 // 30 seconds from now
    });

    res.json({
      email: email,
      secret: user.secret,
      currentToken: currentToken,
      previousToken: previousToken,
      nextToken: nextToken,
      serverTime: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

  } catch (err) {
    res.status(500).json({ message: "Debug error", error: err.message });
  }
}

  // Add to authController.js
function getSecret(req, res) {
  try {
    const { email } = req.body;
    const users = readUsers();
    const user = users.users[email];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      email: email,
      secret: user.secret,
      hasSecret: !!user.secret,
      registeredAt: user.created_at
    });

  } catch (err) {
    res.status(500).json({ message: "Error retrieving secret", error: err.message });
  }
}

module.exports = { register, login, verifyTotp, debugTOTP, getSecret};