jest.mock('@/components/home/HeroSection', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-hero-section">Mock Hero Section</div>
}));

jest.mock('@/components/home/CategorySection', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-category-section">Mock Category Section</div>
}));

jest.mock('@/components/home/FeaturedProducts', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-featured-products">Mock Featured Products</div>
}));

jest.mock('@/components/home/FeatureSection', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-feature-section">Mock Feature Section</div>
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '@/app/page';

describe('HomePage Component', () => {
  it('renders all sections correctly', () => {
    render(<HomePage />);

    // Check if all sections are rendered
    expect(screen.getByTestId('mock-hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('mock-category-section')).toBeInTheDocument();
    expect(screen.getByTestId('mock-featured-products')).toBeInTheDocument();
    expect(screen.getByTestId('mock-feature-section')).toBeInTheDocument();
  });

  it('has valid structure', () => {
    render(<HomePage />);
    
    // Check if the main element exists
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    
    // Check if all sections are children of the main element
    expect(mainElement).toContainElement(screen.getByTestId('mock-hero-section'));
    expect(mainElement).toContainElement(screen.getByTestId('mock-category-section'));
    expect(mainElement).toContainElement(screen.getByTestId('mock-featured-products'));
    expect(mainElement).toContainElement(screen.getByTestId('mock-feature-section'));
  });
}); 