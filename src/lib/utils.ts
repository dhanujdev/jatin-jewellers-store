import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names and merges Tailwind CSS classes efficiently
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a random price between 5000 and 50000
 */
export function generateRandomPrice(): number {
  return Math.floor(Math.random() * 45000) + 5000;
}
