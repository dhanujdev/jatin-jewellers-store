"use client";

// Mock Redis implementation for static export
// In a real production environment, you would use a serverless Redis service
// or implement a different caching strategy

// For testing purposes
export let localCache: Map<string, { data: string; expiry: number | null }>;
export let localStorage: Storage;

// Initialize dependencies
const initDependencies = () => {
  // Use global localStorage if available, otherwise create a mock
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage = window.localStorage;
  } else {
    // Mock for SSR or testing
    localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null
    };
  }
  
  // Create a new Map for the local cache
  localCache = new Map();
};

// Initialize dependencies on module load
initDependencies();

// For testing - allows resetting the state
export const resetCache = () => {
  localCache.clear();
};

// For testing - allows injecting mocks
export const injectDependencies = (deps: { 
  cache?: Map<string, { data: string; expiry: number | null }>,
  storage?: Storage
}) => {
  if (deps.cache) localCache = deps.cache;
  if (deps.storage) localStorage = deps.storage;
};

// Server-side Redis client
let redisClient: any = null;

// Initialize Redis client for server-side
export async function getServerRedisClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Server Redis client should not be used in browser');
  }

  if (!redisClient) {
    try {
      // Dynamically import Redis to avoid issues with client-side builds
      const redis = await import('redis');
      
      // Use environment variables for Redis connection
      const url = process.env.REDIS_URL || 'redis://localhost:6379';
      
      redisClient = redis.createClient({
        url,
      });

      redisClient.on('error', (err: Error) => {
        console.error('Redis Client Error:', err);
      });

      await redisClient.connect();
    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
      // Return a mock client as fallback
      return getMockRedisClient();
    }
  }

  return redisClient;
}

// Get a mock Redis client for fallback
function getMockRedisClient() {
  return {
    set: async (key: string, value: string, options?: any) => {
      const expiry = options?.EX ? Date.now() + options.EX * 1000 : null;
      localCache.set(key, { data: value, expiry });
      return 'OK';
    },
    get: async (key: string) => {
      const cached = localCache.get(key);
      if (!cached) return null;
      if (cached.expiry && cached.expiry < Date.now()) {
        localCache.delete(key);
        return null;
      }
      return cached.data;
    },
    exists: async (key: string) => {
      return localCache.has(key) ? 1 : 0;
    },
    del: async (key: string) => {
      localCache.delete(key);
      return 1;
    }
  };
}

// Initialize Redis client (mock for client-side)
export function getRedisClient() {
  return {
    set: async (key: string, value: string, expiryMode?: string, time?: number) => {
      try {
        const expiry = time ? Date.now() + time * 1000 : null;
        localCache.set(key, { data: value, expiry });
        
        // Also store in localStorage for persistence
        try {
          localStorage.setItem(
            `redis:${key}`,
            JSON.stringify({ data: value, expiry })
          );
        } catch (error) {
          console.error(`Error storing key "${key}" in localStorage:`, error);
          // Continue execution since we still have the value in memory cache
        }
        
        return 'OK';
      } catch (error) {
        console.error(`Unexpected error in Redis set operation for key "${key}":`, error);
        return 'ERROR';
      }
    },
    
    get: async (key: string) => {
      try {
        // Check memory cache first
        const cached = localCache.get(key);
        
        // If not in memory, try localStorage
        if (!cached) {
          try {
            const storedItem = localStorage.getItem(`redis:${key}`);
            if (storedItem) {
              try {
                const parsed = JSON.parse(storedItem);
                localCache.set(key, parsed);
                
                // Check if expired
                if (parsed.expiry && parsed.expiry < Date.now()) {
                  localCache.delete(key);
                  localStorage.removeItem(`redis:${key}`);
                  return null;
                }
                
                return parsed.data;
              } catch (parseError) {
                console.error(`Error parsing stored data for key "${key}":`, parseError);
                // Remove corrupted data
                localStorage.removeItem(`redis:${key}`);
                return null;
              }
            }
          } catch (storageError) {
            console.error(`Error retrieving key "${key}" from localStorage:`, storageError);
          }
          
          return null;
        }
        
        // Check if expired
        if (cached.expiry && cached.expiry < Date.now()) {
          localCache.delete(key);
          try {
            localStorage.removeItem(`redis:${key}`);
          } catch (error) {
            console.error(`Error removing expired key "${key}" from localStorage:`, error);
          }
          return null;
        }
        
        return cached.data;
      } catch (error) {
        console.error(`Unexpected error in Redis get operation for key "${key}":`, error);
        return null;
      }
    },
    
    exists: async (key: string) => {
      try {
        // Check memory cache first
        if (localCache.has(key)) {
          const cached = localCache.get(key);
          
          // Check if expired
          if (cached?.expiry && cached.expiry < Date.now()) {
            localCache.delete(key);
            try {
              localStorage.removeItem(`redis:${key}`);
            } catch (error) {
              console.error(`Error removing expired key "${key}" from localStorage:`, error);
            }
            return 0;
          }
          
          return 1;
        }
        
        // Try localStorage
        try {
          const storedItem = localStorage.getItem(`redis:${key}`);
          if (storedItem) {
            try {
              const parsed = JSON.parse(storedItem);
              
              // Check if expired
              if (parsed.expiry && parsed.expiry < Date.now()) {
                localStorage.removeItem(`redis:${key}`);
                return 0;
              }
              
              // Add to memory cache
              localCache.set(key, parsed);
              return 1;
            } catch (parseError) {
              console.error(`Error parsing stored data for key "${key}" in exists check:`, parseError);
              // Remove corrupted data
              localStorage.removeItem(`redis:${key}`);
              return 0;
            }
          }
        } catch (storageError) {
          console.error(`Error checking key "${key}" in localStorage:`, storageError);
        }
        
        return 0;
      } catch (error) {
        console.error(`Unexpected error in Redis exists operation for key "${key}":`, error);
        return 0;
      }
    },
    
    del: async (key: string) => {
      try {
        localCache.delete(key);
        try {
          localStorage.removeItem(`redis:${key}`);
        } catch (error) {
          console.error(`Error removing key "${key}" from localStorage:`, error);
        }
        return 1;
      } catch (error) {
        console.error(`Unexpected error in Redis del operation for key "${key}":`, error);
        return 0;
      }
    },
    
    on: (event: string, callback: (error: Error) => void) => {
      // No-op for mock implementation
      return { event, callback };
    }
  };
}

// Cache image data with TTL (time to live)
export async function cacheImage(key: string, imageData: Buffer, ttl = 86400): Promise<void> {
  try {
    if (!imageData || !Buffer.isBuffer(imageData)) {
      console.error('Invalid image data provided for caching:', typeof imageData);
      return;
    }
    
    const redis = getRedisClient();
    // Store image data with expiration (default: 1 day)
    await redis.set(key, imageData.toString('base64'), 'EX', ttl);
  } catch (error) {
    console.error(`Error caching image with key "${key}":`, error);
  }
}

// Get cached image data
export async function getCachedImage(key: string): Promise<Buffer | null> {
  try {
    const redis = getRedisClient();
    const cachedData = await redis.get(key);
    
    if (cachedData) {
      try {
        return Buffer.from(cachedData, 'base64');
      } catch (error) {
        console.error(`Error converting cached data to Buffer for key "${key}":`, error);
        // Remove corrupted data
        await redis.del(key);
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting cached image with key "${key}":`, error);
    return null;
  }
}

// Check if an image is cached
export async function isImageCached(key: string): Promise<boolean> {
  try {
    const redis = getRedisClient();
    return (await redis.exists(key)) === 1;
  } catch (error) {
    console.error(`Error checking if image is cached with key "${key}":`, error);
    return false;
  }
}

// Clear cache for a specific key
export async function clearCache(key: string): Promise<void> {
  try {
    const redis = getRedisClient();
    await redis.del(key);
  } catch (error) {
    console.error(`Error clearing cache for key "${key}":`, error);
  }
}

// Server-side cache functions
export async function cacheData(key: string, data: any, ttl = 3600): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      // Use client-side caching in browser
      const redis = getRedisClient();
      await redis.set(key, JSON.stringify(data), 'EX', ttl);
      return;
    }

    try {
      // Use server-side Redis in Node.js
      const redis = await getServerRedisClient();
      await redis.set(key, JSON.stringify(data), {
        EX: ttl
      });
    } catch (error) {
      console.error('Error using server Redis, falling back to local cache:', error);
      // Fallback to local cache
      const expiry = ttl ? Date.now() + ttl * 1000 : null;
      localCache.set(key, { data: JSON.stringify(data), expiry });
    }
  } catch (error) {
    console.error(`Error caching data with key "${key}":`, error);
  }
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    if (typeof window !== 'undefined') {
      // Use client-side caching in browser
      const redis = getRedisClient();
      const cachedData = await redis.get(key);
      
      if (cachedData) {
        try {
          return JSON.parse(cachedData) as T;
        } catch (error) {
          console.error(`Error parsing cached data for key "${key}":`, error);
          await redis.del(key);
          return null;
        }
      }
      
      return null;
    }

    try {
      // Use server-side Redis in Node.js
      const redis = await getServerRedisClient();
      const cachedData = await redis.get(key);
      
      if (cachedData) {
        try {
          return JSON.parse(cachedData) as T;
        } catch (error) {
          console.error(`Error parsing cached data for key "${key}":`, error);
          await redis.del(key);
          return null;
        }
      }
    } catch (error) {
      console.error('Error using server Redis, falling back to local cache:', error);
      // Fallback to local cache
      const cached = localCache.get(key);
      if (cached) {
        if (cached.expiry && cached.expiry < Date.now()) {
          localCache.delete(key);
          return null;
        }
        try {
          return JSON.parse(cached.data) as T;
        } catch (error) {
          console.error(`Error parsing cached data from local cache for key "${key}":`, error);
          localCache.delete(key);
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting cached data with key "${key}":`, error);
    return null;
  }
}

export async function invalidateCache(key: string): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      // Use client-side caching in browser
      const redis = getRedisClient();
      await redis.del(key);
      return;
    }

    try {
      // Use server-side Redis in Node.js
      const redis = await getServerRedisClient();
      await redis.del(key);
    } catch (error) {
      console.error('Error using server Redis, falling back to local cache:', error);
      // Fallback to local cache
      localCache.delete(key);
    }
  } catch (error) {
    console.error(`Error invalidating cache for key "${key}":`, error);
  }
} 