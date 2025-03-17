// Server-side Redis implementation
import { promises as fs } from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';

// For testing purposes
let localCache: Map<string, { data: string; expiry: number | null }> = new Map();

// Server-side Redis client
let redisClient: Redis | null = null;

// Initialize Redis client for server-side
export async function getServerRedisClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Server Redis client should not be used in browser');
  }

  if (!redisClient) {
    try {
      // Check for Vercel KV environment variables first
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        redisClient = new Redis({
          url: process.env.KV_REST_API_URL,
          token: process.env.KV_REST_API_TOKEN,
        });
        console.log('Connected to Vercel KV');
      } 
      // Fall back to Upstash Redis environment variables
      else if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        redisClient = new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
        console.log('Connected to Upstash Redis');
      } else {
        // Fallback for local development if Redis env vars aren't available
        console.warn('Redis credentials not found, using mock Redis client');
        return getMockRedisClient();
      }
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
      const expiry = options?.ex ? Date.now() + options.ex * 1000 : null;
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

// Server-side cache functions
export async function cacheData(key: string, data: any, ttl = 3600): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      console.error('cacheData should not be called from client-side code');
      return;
    }

    try {
      // Use server-side Redis in Node.js
      const redis = await getServerRedisClient();
      await redis.set(key, JSON.stringify(data), {
        ex: ttl
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
      console.error('getCachedData should not be called from client-side code');
      return null;
    }

    try {
      // Use server-side Redis in Node.js
      const redis = await getServerRedisClient();
      const cachedData = await redis.get(key);
      
      if (cachedData) {
        try {
          return JSON.parse(cachedData as string) as T;
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
      console.error('invalidateCache should not be called from client-side code');
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

// Image cache functions
export async function cacheImage(key: string, imageBuffer: Buffer): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      console.error('cacheImage should not be called from client-side code');
      return;
    }

    try {
      // Use server-side Redis in Node.js
      const redis = await getServerRedisClient();
      await redis.set(key, imageBuffer.toString('base64'), {
        ex: 86400 // 24 hours
      });
    } catch (error) {
      console.error('Error using server Redis for image caching:', error);
      // No fallback for images in local cache as they're too large
    }
  } catch (error) {
    console.error(`Error caching image with key "${key}":`, error);
  }
}

export async function getCachedImage(key: string): Promise<Buffer | null> {
  try {
    if (typeof window !== 'undefined') {
      console.error('getCachedImage should not be called from client-side code');
      return null;
    }

    try {
      // Use server-side Redis in Node.js
      const redis = await getServerRedisClient();
      const cachedImage = await redis.get(key);
      
      if (cachedImage) {
        return Buffer.from(cachedImage as string, 'base64');
      }
    } catch (error) {
      console.error('Error using server Redis for image retrieval:', error);
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting cached image with key "${key}":`, error);
    return null;
  }
}

export async function isImageCached(key: string): Promise<boolean> {
  try {
    if (typeof window !== 'undefined') {
      console.error('isImageCached should not be called from client-side code');
      return false;
    }

    try {
      // Use server-side Redis in Node.js
      const redis = await getServerRedisClient();
      const exists = await redis.exists(key);
      return exists === 1;
    } catch (error) {
      console.error('Error checking if image is cached:', error);
      return false;
    }
  } catch (error) {
    console.error(`Error checking if image is cached with key "${key}":`, error);
    return false;
  }
}

// For testing - allows resetting the state
export const resetCache = () => {
  localCache.clear();
}; 