import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeroSection from '@/components/home/HeroSection';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    const { loader, fill, priority, ...imgProps } = props;
    return <img 
      {...imgProps} 
      data-fill={fill ? "true" : undefined}
      data-priority={priority ? "true" : undefined}
    />;
  },
}));

// Mock the next/link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: any) {
    return <a href={href}>{children}</a>;
  };
});

// Mock the carousel components
jest.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children, className }: any) => (
    <div data-testid="mock-carousel" className={className}>
      {children}
    </div>
  ),
  CarouselContent: ({ children }: any) => (
    <div data-testid="mock-carousel-content">
      {children}
    </div>
  ),
  CarouselItem: ({ children, className }: any) => (
    <div data-testid="mock-carousel-item" className={className}>
      {children}
    </div>
  ),
  CarouselPrevious: ({ className }: any) => (
    <button data-testid="mock-carousel-previous" className={className} aria-label="Previous slide">
      Previous
    </button>
  ),
  CarouselNext: ({ className }: any) => (
    <button data-testid="mock-carousel-next" className={className} aria-label="Next slide">
      Next
    </button>
  ),
}));

describe('HeroSection Component', () => {
  it('renders the carousel with slides', () => {
    render(<HeroSection />);
    
    // Check for slide titles
    expect(screen.getByText('Elegance in Every Detail')).toBeInTheDocument();
    expect(screen.getByText('Timeless Solitaires')).toBeInTheDocument();
    expect(screen.getByText('Bespoke Creations')).toBeInTheDocument();
  });

  it('renders slide subtitles', () => {
    render(<HeroSection />);
    
    // Check for slide subtitles
    expect(screen.getByText('Discover our exquisite collection of custom diamond jewelry')).toBeInTheDocument();
    expect(screen.getByText('Handcrafted Diamond Jewelry of Exceptional Quality')).toBeInTheDocument();
    expect(screen.getByText('Custom-designed Jewelry for Your Special Moments')).toBeInTheDocument();
  });

  it('renders call-to-action buttons with correct links', () => {
    render(<HeroSection />);
    
    // Check for CTA buttons
    const shopNowButton = screen.getByText('Shop Now');
    expect(shopNowButton).toBeInTheDocument();
    expect(shopNowButton.closest('a')).toHaveAttribute('href', '/collections/new-arrivals');
    
    const exploreButton = screen.getByText('Explore Collection');
    expect(exploreButton).toBeInTheDocument();
    expect(exploreButton.closest('a')).toHaveAttribute('href', '/category/rings');
    
    const viewButton = screen.getByText('View Collection');
    expect(viewButton).toBeInTheDocument();
    expect(viewButton.closest('a')).toHaveAttribute('href', '/collections/new-arrivals');
  });

  it('renders carousel navigation buttons', () => {
    render(<HeroSection />);
    
    // Check for carousel navigation buttons
    const prevButton = screen.getByTestId('mock-carousel-previous');
    const nextButton = screen.getByTestId('mock-carousel-next');
    
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('renders images with correct attributes', () => {
    render(<HeroSection />);
    
    // Check for images
    const images = screen.getAllByRole('img');
    expect(images.length).toBe(3); // One for each slide
    
    // Check first image attributes
    expect(images[0]).toHaveAttribute('src', '/products/rings/rings-001/image.jpg');
    expect(images[0]).toHaveAttribute('alt', 'Elegance in Every Detail');
  });
}); 