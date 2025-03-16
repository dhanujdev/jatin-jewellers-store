import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestimonialsSection from '@/components/home/TestimonialsSection';

// Mock the components used in TestimonialsSection
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

describe('TestimonialsSection Component', () => {
  it('renders the section with title and description', () => {
    render(<TestimonialsSection />);
    
    // Check if the section title and description are rendered
    expect(screen.getByText('What Our Customers Say')).toBeInTheDocument();
    expect(screen.getByText('Discover why our customers choose Jatin Jewellers for their most precious moments')).toBeInTheDocument();
  });

  it('renders the carousel component', () => {
    render(<TestimonialsSection />);
    
    // Check if carousel is rendered
    expect(screen.getByTestId('mock-carousel')).toBeInTheDocument();
    expect(screen.getByTestId('mock-carousel-content')).toBeInTheDocument();
  });
  
  it('renders multiple testimonials', () => {
    render(<TestimonialsSection />);
    
    // Check if multiple testimonials are rendered
    const testimonialItems = screen.getAllByTestId('mock-carousel-item');
    expect(testimonialItems.length).toBeGreaterThan(1);
  });
  
  it('renders testimonials with customer names', () => {
    render(<TestimonialsSection />);
    
    // Check if testimonials have customer names
    expect(screen.getByText('Priya Sharma')).toBeInTheDocument();
    expect(screen.getByText('Rahul Patel')).toBeInTheDocument();
    expect(screen.getByText('Ananya Reddy')).toBeInTheDocument();
  });
  
  it('renders testimonials with customer locations', () => {
    render(<TestimonialsSection />);
    
    // Check if testimonials have customer locations
    expect(screen.getByText('Hyderabad')).toBeInTheDocument();
    expect(screen.getByText('Mumbai')).toBeInTheDocument();
    expect(screen.getByText('Bangalore')).toBeInTheDocument();
  });
  
  it('has proper accessibility structure', () => {
    render(<TestimonialsSection />);
    
    // Check if the section has proper heading
    const heading = screen.getByRole('heading', { name: 'What Our Customers Say' });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('section-title');
    
    // Check if the section has proper semantic structure
    const section = heading.closest('section');
    expect(section).toHaveClass('py-16 md:py-24 bg-cream-light');
  });
  
  it('renders testimonial carousel with proper styling', () => {
    render(<TestimonialsSection />);
    
    // Check if carousel has proper navigation
    expect(screen.getByTestId('mock-carousel-previous')).toBeInTheDocument();
    expect(screen.getByTestId('mock-carousel-next')).toBeInTheDocument();
  });
}); 