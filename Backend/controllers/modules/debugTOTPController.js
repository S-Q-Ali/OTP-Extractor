const fs = require("fs");
const speakeasy = require("speakeasy");
const path = require("path");


const usersFilePath = path.join(__dirname, "../user.json");
const readUsers = () => (fs.existsSync(usersFilePath) ? JSON.parse(fs.readFileSync(usersFilePath)) : { users: {} });


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

module.exports=debugTOTP;