import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeaturedProducts from '@/components/home/FeaturedProducts';

// Mock the components used in FeaturedProducts
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} data-testid="mock-image" />;
  }
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: any) => {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
}));

// Mock the Carousel component
jest.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children }: any) => <div data-testid="mock-carousel">{children}</div>,
  CarouselContent: ({ children }: any) => <div data-testid="mock-carousel-content">{children}</div>,
  CarouselItem: ({ children }: any) => <div data-testid="mock-carousel-item">{children}</div>,
  CarouselPrevious: () => <button data-testid="mock-carousel-previous">Previous</button>,
  CarouselNext: () => <button data-testid="mock-carousel-next">Next</button>,
}));

// Mock the products data
jest.mock('@/lib/products', () => ({
  getFeaturedProducts: () => [
    {
      id: '1',
      title: 'Diamond Ring',
      category: 'rings',
      imagePath: '/images/products/ring1.jpg',
    },
    {
      id: '2',
      title: 'Gold Necklace',
      category: 'necklaces',
      imagePath: '/images/products/necklace1.jpg',
    }
  ]
}));

// Mock the random price generation to return consistent values for testing
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useState: jest.fn().mockImplementation((init) => [true, jest.fn()]),
    useEffect: jest.fn().mockImplementation((fn) => fn()),
  };
});

describe('FeaturedProducts Component', () => {
  it('renders the featured products section with title', () => {
    render(<FeaturedProducts />);
    
    // Check if title is rendered
    expect(screen.getByText('Featured Products')).toBeInTheDocument();
    expect(screen.getByText('Discover our most popular and exquisite jewelry pieces')).toBeInTheDocument();
  });
  
  it('renders product cards for each featured product', () => {
    render(<FeaturedProducts />);
    
    // Check if product cards are rendered with product names
    const diamondRings = screen.getAllByText('Diamond Ring');
    const goldNecklaces = screen.getAllByText('Gold Necklace');
    
    // We should have 2 of each (mobile and desktop views)
    expect(diamondRings.length).toBe(2);
    expect(goldNecklaces.length).toBe(2);
  });
  
  it('renders product prices', () => {
    render(<FeaturedProducts />);
    
    // Check if product prices are rendered (we can't check exact values due to random generation)
    const priceElements = screen.getAllByText(/₹/);
    expect(priceElements.length).toBeGreaterThanOrEqual(2);
  });
  
  it('renders product images', () => {
    render(<FeaturedProducts />);
    
    // Check if product images are rendered
    const images = screen.getAllByTestId('mock-image');
    
    // We have 4 images: 2 in mobile view and 2 in desktop view
    expect(images.length).toBe(4);
    
    // Check if images have correct src attributes
    expect(images[0]).toHaveAttribute('src', '/images/products/ring1.jpg');
    expect(images[1]).toHaveAttribute('src', '/images/products/necklace1.jpg');
    expect(images[2]).toHaveAttribute('src', '/images/products/ring1.jpg');
    expect(images[3]).toHaveAttribute('src', '/images/products/necklace1.jpg');
  });
  
  it('renders view all products link', () => {
    render(<FeaturedProducts />);
    
    // Check if view all products link is rendered
    const viewAllLink = screen.getByText('View All Products');
    expect(viewAllLink).toBeInTheDocument();
    expect(viewAllLink.closest('a')).toHaveAttribute('href', '/collections/new-arrivals');
  });
  
  it('has the correct accessibility structure', () => {
    render(<FeaturedProducts />);
    
    // Check if section has the correct structure
    const section = document.querySelector('section');
    expect(section).toHaveClass('py-16');
    
    // Check if heading has the correct level
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Featured Products');
  });
}); 