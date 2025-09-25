// utils/userCache.js
const cacheStore = new Map();
const ttlStore = new Map();

// Set with TTL
function set(key, value, ttlMs = 300000) {
  cacheStore.set(key, value);
  ttlStore.set(key, Date.now() + ttlMs);
  return true;
}

// Get with expiry check
function get(key) {
  const value = cacheStore.get(key);
  const expiry = ttlStore.get(key);

  if (expiry && Date.now() > expiry) {
    del(key);
    return null;
  }
  return value;
}

// Delete
function del(key) {
  cacheStore.delete(key);
  ttlStore.delete(key);
}

// Has
function has(key) {
  return (
    cacheStore.has(key) &&
    ttlStore.has(key) &&
    Date.now() <= ttlStore.get(key)
  );
}

// Clear all
function clear() {
  cacheStore.clear();
  ttlStore.clear();
}

// Cleanup expired entries
function cleanup() {
  const now = Date.now();
  for (const [key, expiry] of ttlStore.entries()) {
    if (now > expiry) {
      del(key);
    }
  }
}

module.exports = {
  set,
  get,
  del,
  has,
  clear,
  cleanup,
  // for diagnostics
  cache: cacheStore,
};
