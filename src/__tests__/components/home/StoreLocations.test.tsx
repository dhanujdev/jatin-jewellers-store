import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StoreLocations from '@/components/home/StoreLocations';

// Mock the Lucide icons
jest.mock('lucide-react', () => ({
  MapPin: () => <svg data-testid="map-pin-icon" />,
  Phone: () => <svg data-testid="phone-icon" />,
}));

describe('StoreLocations Component', () => {
  it('renders the store locations section with title and description', () => {
    render(<StoreLocations />);
    
    // Check if the section title and description are rendered
    expect(screen.getByText('Visit Our Stores')).toBeInTheDocument();
    expect(screen.getByText('Experience our exquisite jewelry collection in person at one of our elegantly designed stores.')).toBeInTheDocument();
  });

  it('renders multiple store locations', () => {
    render(<StoreLocations />);
    
    // Check if multiple store locations are rendered
    const storeCards = screen.getAllByRole('heading', { level: 3 });
    expect(storeCards.length).toBeGreaterThan(1);
  });

  it('displays store names for each location', () => {
    render(<StoreLocations />);
    
    // Check for store names
    expect(screen.getByText('New Delhi')).toBeInTheDocument();
    expect(screen.getByText('Mumbai')).toBeInTheDocument();
    expect(screen.getByText('Bengaluru')).toBeInTheDocument();
  });

  it('displays store addresses for each location', () => {
    render(<StoreLocations />);
    
    // Check for store addresses
    expect(screen.getByText('7 Connaught Place, Ground Floor, New Delhi, 110001')).toBeInTheDocument();
    expect(screen.getByText('42 Linking Road, Bandra West, Mumbai, 400050')).toBeInTheDocument();
    expect(screen.getByText('121 Commercial Street, Bengaluru, 560001')).toBeInTheDocument();
  });

  it('displays store hours for each location', () => {
    render(<StoreLocations />);
    
    // Check for store hours label
    const storeHoursLabels = screen.getAllByText('Store Hours:');
    expect(storeHoursLabels.length).toBe(3);
    
    // Check for store hours
    const storeHours = screen.getAllByText('11:00 AM to 8:00 PM');
    expect(storeHours.length).toBe(3);
  });

  it('displays store phone numbers for each location', () => {
    render(<StoreLocations />);
    
    // Check for store phone numbers
    expect(screen.getByText('+91 98765 43210')).toBeInTheDocument();
    expect(screen.getByText('+91 98765 43211')).toBeInTheDocument();
    expect(screen.getByText('+91 98765 43212')).toBeInTheDocument();
  });

  it('has proper accessibility structure', () => {
    render(<StoreLocations />);
    
    // Check if the section has proper heading structure
    const heading = screen.getByRole('heading', { name: 'Visit Our Stores' });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-3xl md:text-4xl font-playfair text-center mb-4 text-gray-800');
    
    // Check if the section has proper semantic structure
    const section = heading.closest('section');
    expect(section).toHaveClass('py-16 relative');
  });

  it('renders store cards with proper styling', () => {
    render(<StoreLocations />);
    
    // Check if store cards have proper styling
    const storeHeadings = screen.getAllByRole('heading', { level: 3 });
    const storeCards = storeHeadings.map(heading => heading.closest('div'));
    
    storeCards.forEach(card => {
      expect(card).toHaveClass('bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow');
    });
  });

  it('renders map pin icons', () => {
    render(<StoreLocations />);
    
    // Check if map pin icons are rendered
    const mapPinIcons = screen.getAllByTestId('map-pin-icon');
    expect(mapPinIcons.length).toBe(3);
  });

  it('renders phone icons', () => {
    render(<StoreLocations />);
    
    // Check if phone icons are rendered
    const phoneIcons = screen.getAllByTestId('phone-icon');
    expect(phoneIcons.length).toBe(3);
  });

  it('renders "Get Directions" links for each location', () => {
    render(<StoreLocations />);
    
    // Check if "Get Directions" links are rendered
    const directionLinks = screen.getAllByText('Get Directions');
    expect(directionLinks.length).toBe(3);
    
    // Check if links have proper attributes
    directionLinks.forEach(link => {
      expect(link.closest('a')).toHaveAttribute('target', '_blank');
      expect(link.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link.closest('a')).toHaveAttribute('href', expect.stringContaining('https://maps.google.com/'));
    });
  });
}); 