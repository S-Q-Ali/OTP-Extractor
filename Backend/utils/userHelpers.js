// utils/userHelpers.js
const fs = require("fs");
const path = require("path");
const redisClient = require("./redisClient");

const usersFilePath = path.join(__dirname, "../user.json");
const USERS_CACHE_KEY = 'app:users';

// Cache statistics
let cacheHits = 0;
let cacheMisses = 0;
let cacheErrors = 0;

// ✅ Read users.json with Redis caching
async function readUsers() {
  try {
    // First try to get from Redis cache
    const cachedUsers = await redisClient.get(USERS_CACHE_KEY);
    if (cachedUsers) {
      cacheHits++;
      console.log(`📦 Cache hit! Total hits: ${cacheHits}`);
      return cachedUsers;
    }

    // Cache miss - read from file
    cacheMisses++;
    console.log(`❌ Cache miss! Total misses: ${cacheMisses}`);

    // If file doesn't exist, create empty users object
    if (!fs.existsSync(usersFilePath)) {
      const emptyUsers = { users: {} };
      await redisClient.set(USERS_CACHE_KEY, emptyUsers);
      console.log('💾 Created new empty users data and stored in Redis cache');
      return emptyUsers;
    }

    // Read from file system
    const data = fs.readFileSync(usersFilePath, 'utf8');
    const users = JSON.parse(data);
    
    // Store in Redis cache for future requests
    await redisClient.set(USERS_CACHE_KEY, users);
    console.log('💾 Users data stored in Redis cache');
    
    return users;
  } catch (error) {
    cacheErrors++;
    console.error('❌ Error reading users:', error);
    console.log(`⚠️  Total cache errors: ${cacheErrors}`);
    
    // Fallback: try to read directly from file
    try {
      if (fs.existsSync(usersFilePath)) {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
      }
      return { users: {} };
    } catch (fallbackError) {
      console.error('❌ Fallback file read also failed:', fallbackError);
      return { users: {} };
    }
  }
}

// ✅ Write users.json and update Redis cache
async function writeUsers(users) {
  try {
    // Write to file
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    
    // Update Redis cache
    await redisClient.set(USERS_CACHE_KEY, users);
    console.log('💾 Users data updated in Redis cache');
    
    return true;
  } catch (error) {
    console.error('❌ Error writing users:', error);
    
    // If Redis fails, just write to file and continue
    try {
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
      console.log('📝 Fallback: wrote to file only (Redis failed)');
      return true;
    } catch (fileError) {
      console.error('❌ File write also failed:', fileError);
      return false;
    }
  }
}

// ✅ Get specific user from cache
async function getUserByEmail(email) {
  try {
    const users = await readUsers();
    return users.users[email] || null;
  } catch (error) {
    console.error('❌ Error getting user by email:', error);
    return null;
  }
}

// ✅ Check if user exists
async function userExists(email) {
  try {
    const users = await readUsers();
    return !!users.users[email];
  } catch (error) {
    console.error('❌ Error checking if user exists:', error);
    return false;
  }
}

// ✅ Invalidate cache (call this when you need fresh data)
async function invalidateUsersCache() {
  try {
    await redisClient.del(USERS_CACHE_KEY);
    console.log('🗑️ Users cache invalidated');
    return true;
  } catch (error) {
    console.error('❌ Error invalidating cache:', error);
    return false;
  }
}

// ✅ Get cache statistics
function getCacheStats() {
  return {
    hits: cacheHits,
    misses: cacheMisses,
    errors: cacheErrors,
    hitRate: cacheHits + cacheMisses > 0 ? 
             (cacheHits / (cacheHits + cacheMisses) * 100).toFixed(2) + '%' : 
             '0%'
  };
}

// ✅ Reset cache statistics (for testing/monitoring)
function resetCacheStats() {
  cacheHits = 0;
  cacheMisses = 0;
  cacheErrors = 0;
  console.log('🔄 Cache statistics reset');
}

// ✅ Health check for cache system
async function cacheHealthCheck() {
  try {
    await redisClient.connect();
    const testKey = 'health:test';
    const testValue = { timestamp: Date.now() };
    
    await redisClient.set(testKey, testValue, 10); // 10 second expiration
    const retrieved = await redisClient.get(testKey);
    
    const isHealthy = retrieved && retrieved.timestamp === testValue.timestamp;
    console.log(`🩺 Cache health check: ${isHealthy ? '✅ Healthy' : '❌ Unhealthy'}`);
    
    return isHealthy;
  } catch (error) {
    console.error('❌ Cache health check failed:', error);
    return false;
  }
}

// ✅ Preload cache on startup
async function preloadCache() {
  try {
    console.log('🔄 Preloading users cache...');
    if (fs.existsSync(usersFilePath)) {
      const data = fs.readFileSync(usersFilePath, 'utf8');
      const users = JSON.parse(data);
      await redisClient.set(USERS_CACHE_KEY, users);
      console.log('✅ Users cache preloaded successfully');
    } else {
      await redisClient.set(USERS_CACHE_KEY, { users: {} });
      console.log('✅ Empty users cache preloaded');
    }
  } catch (error) {
    console.error('❌ Failed to preload cache:', error);
  }
}

module.exports = {
  readUsers,
  writeUsers,
  getUserByEmail,
  userExists,
  invalidateUsersCache,
  getCacheStats,
  resetCacheStats,
  cacheHealthCheck,
  preloadCache
};