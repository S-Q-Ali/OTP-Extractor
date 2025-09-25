// utils/logger.js
const fs = require("fs");
const path = require("path");

const logsDir = path.join(__dirname, "../logs");
const logFile = path.join(logsDir, "logs.json");

// ✅ Ensure logs directory exists
function ensureLogsDirectory() {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
}

// ✅ Initialize log file if missing
function initializeLogFile() {
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, JSON.stringify([], null, 2));
  }
}

// ✅ Append log entry
async function appendLog(data) {
  try {
    ensureLogsDirectory();
    initializeLogFile();

    let logs = [];
    if (fs.existsSync(logFile)) {
      const fileContent = fs.readFileSync(logFile, "utf8");
      try {
        logs = JSON.parse(fileContent);
        if (!Array.isArray(logs)) logs = [];
      } catch (e) {
        logs = [];
      }
    }

    logs.push({
      timestamp: new Date().toISOString(),
      ...data,
    });

    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error("❌ Failed to write log:", error);
  }
}

// ✅ Log specific actions
async function logRegister(email, status, reason, meta = {}) {
  await appendLog({ action: "register", email, status, reason, meta });
}

async function logLogin(email, status, reason, meta = {}) {
  await appendLog({ action: "login", email, status, reason, meta });
}

async function logVerifyTotp(email, status, reason, meta = {}) {
  await appendLog({ action: "verify-totp", email, status, reason, meta });
}

// ✅ Read all logs
async function getLogs() {
  try {
    if (fs.existsSync(logFile)) {
      const fileContent = fs.readFileSync(logFile, "utf8");
      return JSON.parse(fileContent);
    }
    return [];
  } catch (error) {
    console.error("❌ Failed to read logs:", error);
    return [];
  }
}

// ✅ Clear all logs
async function clearLogs() {
  try {
    fs.writeFileSync(logFile, JSON.stringify([], null, 2));
  } catch (error) {
    console.error("❌ Failed to clear logs:", error);
  }
}

module.exports = {
  logRegister,
  logLogin,
  logVerifyTotp,
  getLogs,
  clearLogs,
};
