// Type declarations for Next.js modules
declare module 'next/link';
declare module 'next/image';
declare module 'next/navigation';
declare module 'lucide-react';
declare module 'react';

// Add JSX namespace to fix JSX element errors
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Add Next.js page props type
declare namespace NextJS {
  interface PageProps {
    params?: Record<string, string>;
    searchParams?: Record<string, string | string[]>;
  }
} 