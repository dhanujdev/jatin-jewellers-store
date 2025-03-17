import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '@/components/layout/Footer';

// Mock the components used in Footer
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

describe('Footer Component', () => {
  it('renders the footer with logo', () => {
    render(<Footer />);
    
    // Check if the company name is rendered
    expect(screen.getByText('JATIN JEWELLERS')).toBeInTheDocument();
  });
  
  it('renders the Instagram section', () => {
    render(<Footer />);
    
    // Check if Instagram section is rendered
    expect(screen.getByText('Follow Us on Instagram')).toBeInTheDocument();
    expect(screen.getByText('Stay updated with our latest collections and exclusive designs')).toBeInTheDocument();
    expect(screen.getByText('Follow @jatinjewellershyd')).toBeInTheDocument();
  });
  
  it('renders quick links section', () => {
    render(<Footer />);
    
    // Check if quick links section is rendered
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('New Arrivals')).toBeInTheDocument();
    expect(screen.getByText('Bestsellers')).toBeInTheDocument();
    expect(screen.getByText('Wedding Collection')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });
  
  it('renders store location information', () => {
    render(<Footer />);
    
    // Check if store location information is rendered
    expect(screen.getByText('Visit Our Store')).toBeInTheDocument();
    expect(screen.getByText(/Jatin Jewellers, Road No.36/)).toBeInTheDocument();
    expect(screen.getByText(/Jubilee Hills Checkpost/)).toBeInTheDocument();
    expect(screen.getByText(/Hyderabad, Telangana, 500033/)).toBeInTheDocument();
  });
  
  it('renders contact information', () => {
    render(<Footer />);
    
    // Check if contact information is rendered
    expect(screen.getByText('+91 98661 86960')).toBeInTheDocument();
    expect(screen.getByText('jatinjewellershyd@gmail.com')).toBeInTheDocument();
  });
  
  it('has the correct accessibility attributes', () => {
    render(<Footer />);
    
    // Check if footer has the correct role
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });
}); 