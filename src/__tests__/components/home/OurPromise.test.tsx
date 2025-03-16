import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OurPromise from '@/components/home/OurPromise';

// Mock the Lucide icons
jest.mock('lucide-react', () => ({
  ArrowLeftRight: () => <div data-testid="mock-arrow-left-right-icon" />,
  Award: () => <div data-testid="mock-award-icon" />,
  Package: () => <div data-testid="mock-package-icon" />,
  Shield: () => <div data-testid="mock-shield-icon" />,
  Lock: () => <div data-testid="mock-lock-icon" />,
  Truck: () => <div data-testid="mock-truck-icon" />,
}));

describe('OurPromise Component', () => {
  it('renders the section with title and description', () => {
    render(<OurPromise />);
    
    // Check if title and description are rendered
    expect(screen.getByText('Our Promise')).toBeInTheDocument();
    expect(screen.getByText(/At Jatin Jewellers, we take pride in our commitment to quality/i)).toBeInTheDocument();
  });
  
  it('renders all promise cards with icons', () => {
    render(<OurPromise />);
    
    // Check if all promise cards are rendered
    const promiseCards = screen.getAllByText(/80% Buyback|100% Exchange|Certified Jewelry|Secure Packaging|Hallmarked Gold|Easy 15 Day Returns/).map(
      title => {
        const card = title.closest('div')?.closest('div');
        return card instanceof HTMLElement ? card : null;
      }
    ).filter(Boolean);
    expect(promiseCards).toHaveLength(6);
    
    // Check if icons are rendered
    expect(screen.getAllByTestId('mock-arrow-left-right-icon')).toHaveLength(2);
    expect(screen.getByTestId('mock-award-icon')).toBeInTheDocument();
    expect(screen.getByTestId('mock-lock-icon')).toBeInTheDocument();
    expect(screen.getByTestId('mock-shield-icon')).toBeInTheDocument();
    expect(screen.getByTestId('mock-package-icon')).toBeInTheDocument();
  });
  
  it('renders all promise titles and descriptions', () => {
    render(<OurPromise />);
    
    // Check if all promise titles are rendered
    expect(screen.getByText('80% Buyback')).toBeInTheDocument();
    expect(screen.getByText('100% Exchange')).toBeInTheDocument();
    expect(screen.getByText('Certified Jewelry')).toBeInTheDocument();
    expect(screen.getByText('Secure Packaging')).toBeInTheDocument();
    expect(screen.getByText('Hallmarked Gold')).toBeInTheDocument();
    expect(screen.getByText('Easy 15 Day Returns')).toBeInTheDocument();
    
    // Check if all promise descriptions are rendered
    expect(screen.getByText('Get up to 80% of your original value back when you return your jewelry.')).toBeInTheDocument();
    expect(screen.getByText('Exchange your jewelry with any other piece of equal or higher value.')).toBeInTheDocument();
    expect(screen.getByText('All our diamonds come with IGI or GIA certification.')).toBeInTheDocument();
    expect(screen.getByText('Every piece is carefully packaged to ensure it reaches you in perfect condition.')).toBeInTheDocument();
    expect(screen.getByText('All our gold jewelry is BIS Hallmarked for quality assurance.')).toBeInTheDocument();
    expect(screen.getByText('Not satisfied? Return within 15 days for a full refund.')).toBeInTheDocument();
  });
  
  it('has the correct accessibility structure', () => {
    render(<OurPromise />);
    
    // Check if heading has the correct level
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Our Promise');
  });
  
  it('has the correct styling', () => {
    render(<OurPromise />);
    
    // Check if section has the correct classes
    const section = screen.getByText('Our Promise').closest('section');
    expect(section).toHaveClass('py-16');
    expect(section).toHaveClass('bg-white');
    
    // Check if promise cards have the correct styling
    // Get the promise titles
    const promiseTitles = [
      screen.getByText('80% Buyback'),
      screen.getByText('100% Exchange'),
      screen.getByText('Certified Jewelry'),
      screen.getByText('Secure Packaging'),
      screen.getByText('Hallmarked Gold'),
      screen.getByText('Easy 15 Day Returns')
    ];
    
    // For each title, find the parent card element
    promiseTitles.forEach(title => {
      // Navigate up to the card container
      const card = title.parentElement?.parentElement;
      expect(card).toHaveClass('flex');
      expect(card).toHaveClass('items-start');
      expect(card).toHaveClass('bg-gray-50');
      expect(card).toHaveClass('rounded-lg');
    });
  });
}); 