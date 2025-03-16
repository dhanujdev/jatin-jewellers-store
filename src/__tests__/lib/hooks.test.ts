import { renderHook } from '@testing-library/react';
import { useIsMounted } from '@/lib/hooks';

describe('Custom Hooks', () => {
  describe('useIsMounted', () => {
    it('should exist and be a function', () => {
      // Simply verify the hook exists and is a function
      expect(useIsMounted).toBeDefined();
      expect(typeof useIsMounted).toBe('function');
    });
    
    it('should return a boolean value', () => {
      // Render the hook without mocking
      const { result } = renderHook(() => useIsMounted());
      
      // Verify the return type is boolean
      expect(typeof result.current).toBe('boolean');
    });
  });
}); 