// utils/logger.js
const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logsDir = path.join(__dirname, '../logs');
    this.logFile = path.join(this.logsDir, 'logs.json');
    this.ensureLogsDirectory();
    this.initializeLogFile();
  }

  ensureLogsDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  initializeLogFile() {
    // Create the log file if it doesn't exist with an empty array
    if (!fs.existsSync(this.logFile)) {
      fs.writeFileSync(this.logFile, JSON.stringify([], null, 2));
    }
  }

  async appendLog(data) {
    try {
      // Read existing logs
      let logs = [];
      if (fs.existsSync(this.logFile)) {
        const fileContent = fs.readFileSync(this.logFile, 'utf8');
        try {
          logs = JSON.parse(fileContent);
          // Ensure it's an array
          if (!Array.isArray(logs)) {
            logs = [];
          }
        } catch (e) {
          // If file is corrupted, start with empty array
          logs = [];
        }
      }
      
      // Add new log entry
      logs.push({
        timestamp: new Date().toISOString(),
        ...data
      });
      
      // Write back to file
      fs.writeFileSync(this.logFile, JSON.stringify(logs, null, 2));
      
    } catch (error) {
      console.error('Failed to write log:', error);
      // Don't throw error to avoid breaking the application
    }
  }

  // Specific log methods
  async logRegister(email, status, reason, meta = {}) {
    await this.appendLog({
      action: 'register',
      email,
      status,
      reason,
      meta
    });
  }

  async logLogin(email, status, reason, meta = {}) {
    await this.appendLog({
      action: 'login',
      email,
      status,
      reason,
      meta
    });
  }

  async logVerifyTotp(email, status, reason, meta = {}) {
    await this.appendLog({
      action: 'verify-totp',
      email,
      status,
      reason,
      meta
    });
  }

  // Method to get all logs (for debugging/admin purposes)
  async getLogs() {
    try {
      if (fs.existsSync(this.logFile)) {
        const fileContent = fs.readFileSync(this.logFile, 'utf8');
        return JSON.parse(fileContent);
      }
      return [];
    } catch (error) {
      console.error('Failed to read logs:', error);
      return [];
    }
  }

  // Method to clear logs (for debugging/admin purposes)
  async clearLogs() {
    try {
      fs.writeFileSync(this.logFile, JSON.stringify([], null, 2));
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  }
}

// Create a singleton instance
module.exports = new Logger();