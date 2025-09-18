const fs = require("fs");
const path = require("path");

// Path to users.json
const usersFilePath = path.join(__dirname, "../user.json");

// ✅ Read users.json
function readUsers() {
  if (!fs.existsSync(usersFilePath)) {
    return { users: {} };
  }
  const data = fs.readFileSync(usersFilePath);
  return JSON.parse(data);
}

// ✅ Write users.json
function writeUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

module.exports = { readUsers, writeUsers };
