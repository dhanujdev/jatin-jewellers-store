import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeatureSection from '@/components/home/FeatureSection';

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Gem: () => <svg data-testid="gem-icon" />,
  Award: () => <svg data-testid="award-icon" />,
  Star: () => <svg data-testid="star-icon" />,
  RotateCcw: () => <svg data-testid="rotate-ccw-icon" />,
  Truck: () => <svg data-testid="truck-icon" />,
}));

describe('FeatureSection Component', () => {
  it('renders the feature section with all features', () => {
    render(<FeatureSection />);
    
    // Check if all features are rendered
    expect(screen.getByText('Exquisite Craftsmanship')).toBeInTheDocument();
    expect(screen.getByText('Certified Diamonds')).toBeInTheDocument();
    expect(screen.getByText('Premium Quality')).toBeInTheDocument();
    expect(screen.getByText('Bespoke Designs')).toBeInTheDocument();
  });

  it('renders feature descriptions', () => {
    render(<FeatureSection />);
    
    // Check if feature descriptions are rendered
    expect(screen.getByText('Each piece is meticulously crafted by our skilled artisans with attention to every detail.')).toBeInTheDocument();
    expect(screen.getByText('All our diamonds are certified for authenticity, exceptional quality, and ethical sourcing.')).toBeInTheDocument();
    expect(screen.getByText('We use only the finest materials to ensure exceptional quality in every piece we create.')).toBeInTheDocument();
    expect(screen.getByText('Custom-designed jewelry created to your specifications for truly unique pieces.')).toBeInTheDocument();
  });

  it('renders feature icons', () => {
    render(<FeatureSection />);
    
    // Check if feature icons are rendered
    expect(screen.getByTestId('gem-icon')).toBeInTheDocument();
    expect(screen.getByTestId('award-icon')).toBeInTheDocument();
    expect(screen.getByTestId('star-icon')).toBeInTheDocument();
    expect(screen.getByTestId('rotate-ccw-icon')).toBeInTheDocument();
  });

  it('renders features with proper styling', () => {
    render(<FeatureSection />);
    
    // Check if features have proper styling
    const featureCards = screen.getAllByText(/Exquisite Craftsmanship|Certified Diamonds|Premium Quality|Bespoke Designs/).map(title => 
      title.closest('div')
    ).filter(Boolean);
    
    featureCards.forEach(card => {
      expect(card).toHaveClass('flex flex-col items-center text-center p-6');
    });
  });

  it('has proper section structure', () => {
    render(<FeatureSection />);
    
    // Check if the section has proper structure
    const section = screen.getByText('Exquisite Craftsmanship').closest('section');
    expect(section).toHaveClass('py-16 bg-white border-t border-b border-gray-200');
    
    // Check if the feature grid has proper structure
    const container = screen.getByText('Exquisite Craftsmanship').closest('div.container');
    const featureGrid = container?.querySelector('div.grid');
    expect(featureGrid).toHaveClass('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8');
  });

  it('renders feature titles with proper styling', () => {
    render(<FeatureSection />);
    
    // Check if feature titles have proper styling
    const featureTitles = [
      screen.getByText('Exquisite Craftsmanship'),
      screen.getByText('Certified Diamonds'),
      screen.getByText('Premium Quality'),
      screen.getByText('Bespoke Designs')
    ];
    
    featureTitles.forEach(title => {
      expect(title).toHaveClass('text-xl font-medium text-black mb-2');
    });
  });

  it('renders feature descriptions with proper styling', () => {
    render(<FeatureSection />);
    
    // Check if feature descriptions have proper styling
    const featureDescriptions = [
      screen.getByText('Each piece is meticulously crafted by our skilled artisans with attention to every detail.'),
      screen.getByText('All our diamonds are certified for authenticity, exceptional quality, and ethical sourcing.'),
      screen.getByText('We use only the finest materials to ensure exceptional quality in every piece we create.'),
      screen.getByText('Custom-designed jewelry created to your specifications for truly unique pieces.')
    ];
    
    featureDescriptions.forEach(description => {
      expect(description).toHaveClass('text-gray-600');
    });
  });
}); 