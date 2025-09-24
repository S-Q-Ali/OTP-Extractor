// utils/cache.js
class SimpleCache {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map(); // Time-to-live tracking
  }

  set(key, value, ttlMs = 300000) {
    // Default 5 minutes TTL
    this.cache.set(key, value);
    this.ttl.set(key, Date.now() + ttlMs);
    return true;
  }

  get(key) {
    const value = this.cache.get(key);
    const expiry = this.ttl.get(key);

    // Check if expired
    if (expiry && Date.now() > expiry) {
      this.delete(key);
      return null;
    }

    return value;
  }

  delete(key) {
    this.cache.delete(key);
    this.ttl.delete(key);
  }

  has(key) {
    return (
      this.cache.has(key) &&
      this.ttl.has(key) &&
      Date.now() <= this.ttl.get(key)
    );
  }

  clear() {
    this.cache.clear();
    this.ttl.clear();
  }

  // Optional: Clean up expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, expiry] of this.ttl.entries()) {
      if (now > expiry) {
        this.delete(key);
      }
    }
  }
}

// Create a singleton instance
module.exports = new SimpleCache();
