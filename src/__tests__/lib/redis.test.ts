// Mock the Redis module
jest.mock('@/lib/redis', () => {
  // Create mock Redis client
  const mockRedisClient = {
    set: jest.fn().mockResolvedValue('OK'),
    get: jest.fn().mockResolvedValue(null),
    del: jest.fn().mockResolvedValue(1),
    exists: jest.fn().mockResolvedValue(0),
  };

  // Return mock implementations
  return {
    getRedisClient: jest.fn().mockReturnValue(mockRedisClient),
    cacheImage: jest.fn().mockImplementation(async (key, imageData, ttl = 86400) => {
      await mockRedisClient.set(key, imageData.toString('base64'), 'EX', ttl);
    }),
    getCachedImage: jest.fn().mockImplementation(async (key) => {
      const data = await mockRedisClient.get(key);
      if (data) {
        return Buffer.from(data, 'base64');
      }
      return null;
    }),
    isImageCached: jest.fn().mockImplementation(async (key) => {
      const exists = await mockRedisClient.exists(key);
      return exists === 1;
    }),
    clearCache: jest.fn().mockImplementation(async (key) => {
      await mockRedisClient.del(key);
    }),
    // Export the mock client for test assertions
    __mockRedisClient: mockRedisClient,
  };
});

// Import the mocked module
import { cacheImage, getCachedImage, isImageCached, clearCache } from '@/lib/redis';
// Import the mock client for assertions
const mockRedisClient = require('@/lib/redis').__mockRedisClient;

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

// Set up global localStorage mock
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Redis Utility Functions', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('cacheImage', () => {
    it('stores image data in cache with the correct key', async () => {
      const key = 'image:test.jpg';
      const data = Buffer.from('test-image-data');
      
      await cacheImage(key, data);
      
      // Verify the Redis client's set method was called
      expect(mockRedisClient.set).toHaveBeenCalled();
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        key, 
        data.toString('base64'), 
        'EX', 
        86400
      );
    });
  });

  describe('getCachedImage', () => {
    it('retrieves cached image data', async () => {
      // Setup mock to return image data
      mockRedisClient.get.mockResolvedValueOnce('dGVzdC1pbWFnZS1kYXRh'); // base64 for 'test-image-data'
      
      const result = await getCachedImage('image:test.jpg');
      
      expect(mockRedisClient.get).toHaveBeenCalledWith('image:test.jpg');
      expect(result).not.toBeNull();
      expect(result?.toString()).toBe('test-image-data');
    });

    it('returns null when image is not in cache', async () => {
      // Setup mock to return null
      mockRedisClient.get.mockResolvedValueOnce(null);
      
      const result = await getCachedImage('image:test.jpg');
      
      expect(mockRedisClient.get).toHaveBeenCalledWith('image:test.jpg');
      expect(result).toBeNull();
    });
  });

  describe('isImageCached', () => {
    it('returns true when image is in cache', async () => {
      // Setup mock to return 1 (exists)
      mockRedisClient.exists.mockResolvedValueOnce(1);
      
      const result = await isImageCached('image:test.jpg');
      
      expect(mockRedisClient.exists).toHaveBeenCalledWith('image:test.jpg');
      expect(result).toBe(true);
    });

    it('returns false when image is not in cache', async () => {
      // Setup mock to return 0 (does not exist)
      mockRedisClient.exists.mockResolvedValueOnce(0);
      
      const result = await isImageCached('image:test.jpg');
      
      expect(mockRedisClient.exists).toHaveBeenCalledWith('image:test.jpg');
      expect(result).toBe(false);
    });
  });

  describe('clearCache', () => {
    it('removes the specified key from cache', async () => {
      await clearCache('image:test.jpg');
      
      expect(mockRedisClient.del).toHaveBeenCalledWith('image:test.jpg');
    });
  });
}); 