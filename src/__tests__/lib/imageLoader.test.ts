import { generateImageCacheKey, preloadImage } from '@/lib/imageLoader';
import customImageLoader from '@/lib/imageLoader';
import { isImageCached, cacheImage, getCachedImage, clearCache } from '@/lib/redis';

// Mock localStorage
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

// Mock the Redis module
jest.mock('@/lib/redis', () => ({
  isImageCached: jest.fn(),
  cacheImage: jest.fn(),
  getCachedImage: jest.fn(),
  clearCache: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock FileReader
class MockFileReader {
  onloadend: (() => void) | null = null;
  onerror: ((error: Error) => void) | null = null;
  result: ArrayBuffer | null = null;

  readAsArrayBuffer(blob: Blob): void {
    // Create a simple ArrayBuffer for testing
    this.result = new ArrayBuffer(8);
    // Call onloadend asynchronously to simulate real behavior
    setTimeout(() => {
      if (this.onloadend) this.onloadend();
    }, 0);
  }
}

// Replace the global FileReader with our mock
global.FileReader = MockFileReader as any;

describe('Image Loader Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateImageCacheKey', () => {
    it('generates correct cache key for relative path', () => {
      const key = generateImageCacheKey('/images/test.jpg');
      expect(key).toBe('image:images/test.jpg');
    });

    it('generates correct cache key for path without leading slash', () => {
      const key = generateImageCacheKey('images/test.jpg');
      expect(key).toBe('image:images/test.jpg');
    });

    it('generates correct cache key for absolute URL', () => {
      const key = generateImageCacheKey('https://example.com/images/test.jpg');
      expect(key).toBe('image:https://example.com/images/test.jpg');
    });
  });

  describe('customImageLoader', () => {
    it('adds width and quality parameters to local images', () => {
      const result = customImageLoader({
        src: '/images/test.jpg',
        width: 800,
        quality: 90,
      });
      expect(result).toBe('/images/test.jpg?w=800&q=90');
    });

    it('uses default quality if not provided', () => {
      const result = customImageLoader({
        src: '/images/test.jpg',
        width: 800,
      });
      expect(result).toBe('/images/test.jpg?w=800&q=75');
    });

    it('returns external URLs as is', () => {
      const result = customImageLoader({
        src: 'https://example.com/images/test.jpg',
        width: 800,
        quality: 90,
      });
      expect(result).toBe('https://example.com/images/test.jpg');
    });

    it('handles URLs with existing query parameters correctly', () => {
      const result = customImageLoader({
        src: '/images/test.jpg?existing=param',
        width: 800,
        quality: 90,
      });
      expect(result).toBe('/images/test.jpg?existing=param?w=800&q=90');
    });
  });

  describe('preloadImage', () => {
    it('checks if image is already cached', async () => {
      // Setup mock to return true (image is cached)
      (isImageCached as jest.Mock).mockResolvedValueOnce(true);
      
      await preloadImage('https://example.com/images/test.jpg');
      
      expect(isImageCached).toHaveBeenCalledWith('image:https://example.com/images/test.jpg');
      expect(fetch).not.toHaveBeenCalled();
      expect(cacheImage).not.toHaveBeenCalled();
    });

    it('fetches and caches image if not already cached', async () => {
      // Setup mocks
      (isImageCached as jest.Mock).mockResolvedValueOnce(false);
      
      const mockBlob = new Blob(['test image data'], { type: 'image/jpeg' });
      (fetch as jest.Mock).mockResolvedValueOnce({
        blob: jest.fn().mockResolvedValueOnce(mockBlob)
      });
      
      await preloadImage('https://example.com/images/test.jpg');
      
      expect(isImageCached).toHaveBeenCalledWith('image:https://example.com/images/test.jpg');
      expect(fetch).toHaveBeenCalledWith('https://example.com/images/test.jpg');
      expect(cacheImage).toHaveBeenCalled();
    });

    it('handles errors gracefully', async () => {
      // Setup mocks to throw an error
      (isImageCached as jest.Mock).mockRejectedValueOnce(new Error('Test error'));
      
      // Spy on console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await preloadImage('https://example.com/images/test.jpg');
      
      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy.mock.calls[0][0]).toContain('Error preloading image');
      
      // Restore console.error
      consoleSpy.mockRestore();
    });
  });
}); 