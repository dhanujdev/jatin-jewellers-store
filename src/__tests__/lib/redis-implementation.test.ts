/**
 * Tests for the Redis implementation
 * 
 * These tests focus on the browser implementation of the Redis client
 * which uses localStorage and in-memory Map for caching.
 */

import { 
  getRedisClient, 
  cacheImage, 
  getCachedImage, 
  isImageCached, 
  clearCache,
  injectDependencies,
  resetCache
} from '@/lib/redis';

describe('Redis Client Implementation', () => {
  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn()
  };
  
  // Create a real Map instance for the in-memory cache
  const mockMemoryCache = new Map();
  
  // Mock Date.now for consistent expiry testing
  const originalDateNow = Date.now;
  
  // Mock console.error to prevent noise in test output
  const originalConsoleError = console.error;
  
  let client: ReturnType<typeof getRedisClient>;
  
  beforeAll(() => {
    // Mock Date.now
    Date.now = jest.fn(() => 1000); // Fixed timestamp for tests
    
    // Mock console.error
    console.error = jest.fn();
    
    // Inject our mocks
    injectDependencies({
      cache: mockMemoryCache,
      storage: localStorageMock as unknown as Storage
    });
  });
  
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    mockMemoryCache.clear();
    
    // Get a fresh client for each test
    client = getRedisClient();
  });
  
  afterAll(() => {
    // Restore original implementations
    console.error = originalConsoleError;
    Date.now = originalDateNow;
    
    // Reset the cache
    resetCache();
  });
  
  describe('getRedisClient', () => {
    it('returns a client with the expected methods', () => {
      expect(client).toBeDefined();
      expect(typeof client.set).toBe('function');
      expect(typeof client.get).toBe('function');
      expect(typeof client.exists).toBe('function');
      expect(typeof client.del).toBe('function');
    });
  });
  
  describe('set method', () => {
    it('stores data in memory and localStorage', async () => {
      await client.set('test-key', 'test-value');
      
      // Check memory cache
      expect(mockMemoryCache.get('test-key')).toEqual({ 
        data: 'test-value', 
        expiry: null 
      });
      
      // Check localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'redis:test-key',
        JSON.stringify({ data: 'test-value', expiry: null })
      );
    });
    
    it('stores data with expiry when ttl is provided', async () => {
      await client.set('test-key', 'test-value', 'EX', 60);
      
      // Check memory cache with expiry
      expect(mockMemoryCache.get('test-key')).toEqual({ 
        data: 'test-value', 
        expiry: 61000 // 1000 (mock time) + 60000 (60 seconds)
      });
      
      // Check localStorage with expiry
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'redis:test-key',
        JSON.stringify({ data: 'test-value', expiry: 61000 })
      );
    });
    
    it('handles errors gracefully', async () => {
      // Make localStorage.setItem throw an error
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      
      // Should not throw
      await expect(client.set('test-key', 'test-value')).resolves.not.toThrow();
      
      // Should log the error
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  describe('get method', () => {
    it('retrieves data from memory cache', async () => {
      // Set up test data in memory cache
      mockMemoryCache.set('test-key', { data: 'test-value', expiry: null });
      
      const result = await client.get('test-key');
      
      expect(result).toBe('test-value');
      expect(localStorageMock.getItem).not.toHaveBeenCalled();
    });
    
    it('retrieves data from localStorage when not in memory', async () => {
      // Set up localStorage to return data
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({ data: 'test-value', expiry: null })
      );
      
      const result = await client.get('test-key');
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('redis:test-key');
      expect(result).toBe('test-value');
      
      // Should add to memory cache
      expect(mockMemoryCache.get('test-key')).toEqual({ 
        data: 'test-value', 
        expiry: null 
      });
    });
    
    it('returns null for expired data', async () => {
      // Set up localStorage to return expired data
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({ data: 'test-value', expiry: 500 }) // Expired (before mock time 1000)
      );
      
      const result = await client.get('test-key');
      
      expect(result).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('redis:test-key');
    });
    
    it('returns null for non-existent keys', async () => {
      // Ensure localStorage returns null
      localStorageMock.getItem.mockReturnValueOnce(null);
      
      const result = await client.get('non-existent-key');
      
      expect(result).toBeNull();
    });
    
    it('handles localStorage errors gracefully', async () => {
      // Mock getItem to throw an error
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('localStorage error');
      });
      
      const result = await client.get('test-key');
      
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  describe('exists method', () => {
    it('returns true for existing keys in memory', async () => {
      // Set up test data in memory
      mockMemoryCache.set('test-key', { data: 'test-value', expiry: null });
      
      const result = await client.exists('test-key');
      
      expect(result).toBe(1); // Redis exists returns 1 for existing keys
      expect(localStorageMock.getItem).not.toHaveBeenCalled();
    });
    
    it('returns true for existing keys in localStorage', async () => {
      // Set up localStorage to return data
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({ data: 'test-value', expiry: null })
      );
      
      const result = await client.exists('test-key');
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('redis:test-key');
      expect(result).toBe(1);
      
      // Should add to memory cache
      expect(mockMemoryCache.get('test-key')).toEqual({ 
        data: 'test-value', 
        expiry: null 
      });
    });
    
    it('returns false for expired keys', async () => {
      // Set up localStorage to return expired data
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({ data: 'test-value', expiry: 500 }) // Expired (before mock time 1000)
      );
      
      const result = await client.exists('test-key');
      
      expect(result).toBe(0);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('redis:test-key');
    });
    
    it('returns false for non-existent keys', async () => {
      // Ensure localStorage returns null
      localStorageMock.getItem.mockReturnValueOnce(null);
      
      const result = await client.exists('non-existent-key');
      
      expect(result).toBe(0);
    });
    
    it('handles localStorage errors gracefully', async () => {
      // Mock getItem to throw an error
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('localStorage error');
      });
      
      const result = await client.exists('test-key');
      
      expect(result).toBe(0);
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  describe('del method', () => {
    it('removes data from memory and localStorage', async () => {
      // Set up test data
      mockMemoryCache.set('test-key', { data: 'test-value', expiry: null });
      
      await client.del('test-key');
      
      // Should remove from memory
      expect(mockMemoryCache.has('test-key')).toBe(false);
      
      // Should remove from localStorage
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('redis:test-key');
    });
    
    it('handles localStorage errors gracefully', async () => {
      // Set up test data
      mockMemoryCache.set('test-key', { data: 'test-value', expiry: null });
      
      // Make removeItem throw an error
      localStorageMock.removeItem.mockImplementationOnce(() => {
        throw new Error('localStorage error');
      });
      
      await client.del('test-key');
      
      // Should still remove from memory
      expect(mockMemoryCache.has('test-key')).toBe(false);
      
      // Should log the error
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  describe('cacheImage', () => {
    it('caches an image URL', async () => {
      const imageBuffer = Buffer.from('test-image-data');
      
      await cacheImage('image-key', imageBuffer);
      
      // Should call set with base64 encoded data
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'redis:image-key',
        expect.stringContaining('"data":"dGVzdC1pbWFnZS1kYXRh"')
      );
    });
  });
  
  describe('getCachedImage', () => {
    it('retrieves a cached image URL', async () => {
      // Set up test data
      mockMemoryCache.set('image-key', { 
        data: Buffer.from('test-image-data').toString('base64'),
        expiry: null 
      });
      
      const result = await getCachedImage('image-key');
      
      // Add null check to satisfy TypeScript
      expect(result).not.toBeNull();
      expect(Buffer.isBuffer(result)).toBe(true);
      expect(result?.toString()).toBe('test-image-data');
    });
  });
  
  describe('isImageCached', () => {
    it('returns true for cached images', async () => {
      // Set up test data
      mockMemoryCache.set('image-key', { data: 'test-image-data', expiry: null });
      
      const result = await isImageCached('image-key');
      
      expect(result).toBe(true);
    });
    
    it('returns false for non-cached images', async () => {
      // Ensure localStorage returns null
      localStorageMock.getItem.mockReturnValueOnce(null);
      
      const result = await isImageCached('non-existent-key');
      
      expect(result).toBe(false);
    });
  });
  
  describe('clearCache', () => {
    it('clears specific cached data', async () => {
      // Set up test data
      mockMemoryCache.set('test-key-1', { data: 'test-value-1', expiry: null });
      
      await clearCache('test-key-1');
      
      // Should remove from memory and localStorage
      expect(mockMemoryCache.has('test-key-1')).toBe(false);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('redis:test-key-1');
    });
  });
}); 