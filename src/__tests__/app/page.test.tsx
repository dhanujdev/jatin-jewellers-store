import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '@/app/page';

// Mock the components used in HomePage
jest.mock('@/components/home/HeroSection', () => () => <div data-testid="mock-hero-section">Mock Hero Section</div>);
jest.mock('@/components/home/CategorySection', () => () => <div data-testid="mock-category-section">Mock Category Section</div>);
jest.mock('@/components/home/FeaturedProducts', () => () => <div data-testid="mock-featured-products">Mock Featured Products</div>);
jest.mock('@/components/home/FeatureSection', () => () => <div data-testid="mock-feature-section">Mock Feature Section</div>);

describe('HomePage Component', () => {
  it('renders the home page with all sections', () => {
    render(<HomePage />);
    
    // Check if all sections are rendered
    expect(screen.getByTestId('mock-hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('mock-feature-section')).toBeInTheDocument();
    expect(screen.getByTestId('mock-category-section')).toBeInTheDocument();
    expect(screen.getByTestId('mock-featured-products')).toBeInTheDocument();
  });
  
  it('renders with the correct structure', () => {
    const { container } = render(<HomePage />);
    
    // Check if the component renders without errors
    expect(container).toBeInTheDocument();
    
    // Check if main element is rendered
    const mainElement = container.querySelector('main');
    expect(mainElement).toBeInTheDocument();
  });
}); 