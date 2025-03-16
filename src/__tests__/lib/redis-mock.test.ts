import { getRedisClient, injectDependencies, resetCache } from '@/lib/redis';

describe('Redis Mock Implementation', () => {
  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    key: jest.fn(),
    length: 0
  };
  
  // Create a real Map instance for the in-memory cache
  const mockMemoryCache = new Map();
  
  // Mock Date.now for consistent expiry testing
  const originalDateNow = Date.now;
  
  // Mock console.error to prevent noise in test output
  const originalConsoleError = console.error;
  
  let client: ReturnType<typeof getRedisClient>;
  
  beforeAll(() => {
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

  it('should set and get a value', async () => {
    // Set a value
    await client.set('test-key', 'test-value');
    
    // Get the value
    const value = await client.get('test-key');
    
    // Check that the value was retrieved correctly
    expect(value).toBe('test-value');
    
    // Check that localStorage.setItem was called
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'redis:test-key',
      expect.any(String) // The value is JSON stringified with expiry
    );
  });

  it('should set a value with expiry', async () => {
    // Mock Date.now to return a specific timestamp
    const now = 1000;
    jest.spyOn(Date, 'now').mockImplementation(() => now);
    
    // Set a value with expiry (expiryMode: 'EX', time: 60)
    await client.set('test-key-expiry', 'test-value', 'EX', 60);
    
    // Get the value
    const value = await client.get('test-key-expiry');
    
    // Check that the value was retrieved correctly
    expect(value).toBe('test-value');
    
    // Check that localStorage.setItem was called with expiry
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'redis:test-key-expiry',
      expect.stringContaining('"data":"test-value"')
    );
    
    // Restore Date.now
    jest.spyOn(Date, 'now').mockRestore();
  });

  it('should return null for non-existent keys', async () => {
    // Get a non-existent value
    const value = await client.get('non-existent-key');
    
    // Check that null was returned
    expect(value).toBeNull();
  });

  it('should delete a key', async () => {
    // Set a value
    await client.set('test-key-delete', 'test-value');
    
    // Delete the key
    await client.del('test-key-delete');
    
    // Try to get the deleted value
    const value = await client.get('test-key-delete');
    
    // Check that null was returned
    expect(value).toBeNull();
    
    // Check that localStorage.removeItem was called
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('redis:test-key-delete');
  });

  it('should check if a key exists', async () => {
    // Set a value
    await client.set('test-key-exists', 'test-value');
    
    // Check if the key exists
    const exists = await client.exists('test-key-exists');
    
    // Check that the key exists
    expect(exists).toBe(1);
    
    // Check if a non-existent key exists
    const nonExists = await client.exists('non-existent-key');
    
    // Check that the key doesn't exist
    expect(nonExists).toBe(0);
  });

  it('should handle expired keys', async () => {
    // Mock Date.now to return a specific timestamp
    const now = 1000;
    jest.spyOn(Date, 'now').mockImplementation(() => now);
    
    // Set a value with a short expiry (expiryMode: 'EX', time: 10)
    await client.set('test-key-expired', 'test-value', 'EX', 10);
    
    // Advance time by 11 seconds (past expiry)
    jest.spyOn(Date, 'now').mockImplementation(() => now + 11000);
    
    // Try to get the expired value
    const value = await client.get('test-key-expired');
    
    // Check that null was returned
    expect(value).toBeNull();
    
    // Restore Date.now
    jest.spyOn(Date, 'now').mockRestore();
  });

  it('should handle localStorage errors', async () => {
    // Mock localStorage.setItem to throw an error
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('localStorage error');
    });
    
    // Set a value (should not throw despite localStorage error)
    await client.set('test-key-error', 'test-value');
    
    // The value should still be in the local cache
    const value = await client.get('test-key-error');
    
    // Check that the value was retrieved correctly from local cache
    expect(value).toBe('test-value');
  });
}); 