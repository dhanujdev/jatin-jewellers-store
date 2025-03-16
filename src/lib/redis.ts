"use client";

// Mock Redis implementation for static export
// In a real production environment, you would use a serverless Redis service
// or implement a different caching strategy

// Cache storage using browser's localStorage
const localCache = new Map<string, { data: string; expiry: number }>();

// Initialize Redis client (mock for static export)
export function getRedisClient() {
  return {
    set: async (key: string, value: string, expiryMode?: string, time?: number) => {
      const expiry = time ? Date.now() + time * 1000 : 0;
      localCache.set(key, { data: value, expiry });
      
      // Also store in localStorage for persistence
      try {
        localStorage.setItem(
          `redis:${key}`,
          JSON.stringify({ data: value, expiry })
        );
      } catch (error) {
        console.error('Error storing in localStorage:', error);
      }
      
      return 'OK';
    },
    
    get: async (key: string) => {
      // Check memory cache first
      const cached = localCache.get(key);
      
      // If not in memory, try localStorage
      if (!cached) {
        try {
          const storedItem = localStorage.getItem(`redis:${key}`);
          if (storedItem) {
            const parsed = JSON.parse(storedItem);
            localCache.set(key, parsed);
            
            // Check if expired
            if (parsed.expiry && parsed.expiry < Date.now()) {
              localCache.delete(key);
              localStorage.removeItem(`redis:${key}`);
              return null;
            }
            
            return parsed.data;
          }
        } catch (error) {
          console.error('Error retrieving from localStorage:', error);
        }
        
        return null;
      }
      
      // Check if expired
      if (cached.expiry && cached.expiry < Date.now()) {
        localCache.delete(key);
        try {
          localStorage.removeItem(`redis:${key}`);
        } catch (error) {
          console.error('Error removing from localStorage:', error);
        }
        return null;
      }
      
      return cached.data;
    },
    
    exists: async (key: string) => {
      // Check memory cache first
      if (localCache.has(key)) {
        const cached = localCache.get(key);
        
        // Check if expired
        if (cached?.expiry && cached.expiry < Date.now()) {
          localCache.delete(key);
          try {
            localStorage.removeItem(`redis:${key}`);
          } catch (error) {
            console.error('Error removing from localStorage:', error);
          }
          return 0;
        }
        
        return 1;
      }
      
      // Try localStorage
      try {
        const storedItem = localStorage.getItem(`redis:${key}`);
        if (storedItem) {
          const parsed = JSON.parse(storedItem);
          
          // Check if expired
          if (parsed.expiry && parsed.expiry < Date.now()) {
            localStorage.removeItem(`redis:${key}`);
            return 0;
          }
          
          // Add to memory cache
          localCache.set(key, parsed);
          return 1;
        }
      } catch (error) {
        console.error('Error checking localStorage:', error);
      }
      
      return 0;
    },
    
    del: async (key: string) => {
      localCache.delete(key);
      try {
        localStorage.removeItem(`redis:${key}`);
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
      return 1;
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
    const redis = getRedisClient();
    // Store image data with expiration (default: 1 day)
    await redis.set(key, imageData.toString('base64'), 'EX', ttl);
  } catch (error) {
    console.error('Error caching image:', error);
  }
}

// Get cached image data
export async function getCachedImage(key: string): Promise<Buffer | null> {
  try {
    const redis = getRedisClient();
    const cachedData = await redis.get(key);
    
    if (cachedData) {
      return Buffer.from(cachedData, 'base64');
    }
    
    return null;
  } catch (error) {
    console.error('Error getting cached image:', error);
    return null;
  }
}

// Check if an image is cached
export async function isImageCached(key: string): Promise<boolean> {
  try {
    const redis = getRedisClient();
    return !!(await redis.exists(key));
  } catch (error) {
    console.error('Error checking cached image:', error);
    return false;
  }
}

// Clear cache for a specific key
export async function clearCache(key: string): Promise<void> {
  try {
    const redis = getRedisClient();
    await redis.del(key);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
} 