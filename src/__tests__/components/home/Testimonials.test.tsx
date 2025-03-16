import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Testimonials from '@/components/home/Testimonials';

// Mock the components used in Testimonials
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} data-testid="mock-image" />;
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

// Mock the Lucide React icons
jest.mock('lucide-react', () => ({
  Star: (props: any) => <span data-testid="star-icon" {...props} />
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

describe('Testimonials Component', () => {
  it('renders the testimonials section with title', () => {
    render(<Testimonials />);
    
    // Check if title is rendered
    expect(screen.getByText('Customer Reviews')).toBeInTheDocument();
  });
  
  it('renders testimonial cards', () => {
    render(<Testimonials />);
    
    // Check if testimonial cards are rendered
    expect(screen.getAllByTestId('mock-carousel-item').length).toBeGreaterThan(0);
  });
  
  it('renders customer names', () => {
    render(<Testimonials />);
    
    // Check if customer names are rendered
    expect(screen.getByText('Priya Sharma')).toBeInTheDocument();
    expect(screen.getByText('Aditya Patel')).toBeInTheDocument();
    expect(screen.getByText('Meera Singh')).toBeInTheDocument();
  });
  
  it('renders testimonial text', () => {
    render(<Testimonials />);
    
    // Check if testimonial text is rendered
    expect(screen.getByText(/The ring I purchased from Jatin Jewellers exceeded my expectations/i)).toBeInTheDocument();
    expect(screen.getByText(/My wife absolutely loved the anniversary gift/i)).toBeInTheDocument();
  });
  
  it('renders star ratings', () => {
    render(<Testimonials />);
    
    // Check if star ratings are rendered
    const stars = screen.getAllByTestId('star-icon');
    expect(stars.length).toBeGreaterThan(0);
  });
  
  it('renders carousel navigation', () => {
    render(<Testimonials />);
    
    // Check if carousel navigation is rendered
    expect(screen.getByTestId('mock-carousel-previous')).toBeInTheDocument();
    expect(screen.getByTestId('mock-carousel-next')).toBeInTheDocument();
  });
  
  it('renders the link to Google reviews', () => {
    render(<Testimonials />);
    
    // Check if link to Google reviews is rendered
    const link = screen.getByText('View all reviews on Google');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', 'https://www.google.com/maps/place/Jatin+Jewellers');
    expect(link.closest('a')).toHaveAttribute('target', '_blank');
  });
}); 