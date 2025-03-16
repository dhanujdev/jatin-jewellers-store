import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if a media query matches
 * @param query The media query to check
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with false for SSR
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Set to true/false based on actual match once mounted
    const media = window.matchMedia(query);
    const updateMatch = () => setMatches(media.matches);
    
    // Set initial value
    updateMatch();
    
    // Add listener for changes
    media.addEventListener('change', updateMatch);
    
    // Clean up
    return () => {
      media.removeEventListener('change', updateMatch);
    };
  }, [query]);

  // Return the match state
  return matches;
}

/**
 * Hook to detect if the component is mounted (client-side)
 * Useful for avoiding hydration mismatches
 */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return mounted;
} 