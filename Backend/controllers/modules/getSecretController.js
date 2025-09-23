const fs = require("fs");
const path = require("path");
const usersFilePath = path.join(__dirname, "../user.json");
const readUsers = () => (fs.existsSync(usersFilePath) ? JSON.parse(fs.readFileSync(usersFilePath)) : { users: {} });



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

module.exports=getSecret;