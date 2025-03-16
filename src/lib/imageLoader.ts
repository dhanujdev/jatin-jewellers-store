"use client";

import { cacheImage, getCachedImage, isImageCached } from './redis';

// Generate a cache key for an image
export function generateImageCacheKey(src: string): string {
  // Remove leading slash if present
  const normalizedSrc = src.startsWith('/') ? src.substring(1) : src;
  return `image:${normalizedSrc}`;
}

// Custom image loader for Next.js Image component
export default function customImageLoader({ src, width, quality }: { 
  src: string; 
  width: number; 
  quality?: number;
}): string {
  // For local images, we'll use the default loader
  if (src.startsWith('/')) {
    // Add width and quality parameters
    return `${src}?w=${width}&q=${quality || 75}`;
  }
  
  // For external images, return as is
  return src;
}

// Preload and cache images (can be called on component mount)
export async function preloadImage(src: string): Promise<void> {
  try {
    const cacheKey = generateImageCacheKey(src);
    
    // Check if image is already cached
    if (await isImageCached(cacheKey)) {
      return;
    }
    
    // Fetch the image
    const response = await fetch(src);
    const blob = await response.blob();
    
    // Convert blob to buffer
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(Buffer.from(reader.result));
        } else {
          reject(new Error('Failed to convert blob to buffer'));
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
    
    // Cache the image
    await cacheImage(cacheKey, buffer);
  } catch (error) {
    console.error(`Error preloading image: ${src}`, error);
  }
} 