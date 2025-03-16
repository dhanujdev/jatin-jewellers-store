import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategorySection from '@/components/home/CategorySection';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ href, children, className }: { href: string; children: JSX.Element | string; className?: string }) => (
    <a href={href} data-testid="mock-link" className={className}>
      {children}
    </a>
  );
});

// Mock Next.js Image component
jest.mock('next/image', () => {
  return ({ src, alt, className, fill }: { src: string; alt: string; className?: string; fill?: boolean }) => (
    <img src={src as string} alt={alt} className={className} data-testid="mock-image" />
  );
});

describe('CategorySection Component', () => {
  it('renders the category section with title and description', () => {
    render(<CategorySection />);
    
    // Check if the section title and description are rendered
    expect(screen.getByText('Shop by Category')).toBeInTheDocument();
    expect(screen.getByText('Explore our curated collections of fine diamond jewelry for every occasion')).toBeInTheDocument();
  });

  it('renders all category cards', () => {
    render(<CategorySection />);
    
    // Check if all category cards are rendered
    const categoryImages = screen.getAllByTestId('mock-image');
    expect(categoryImages.length).toBe(4); // 4 categories: Rings, Necklaces, Earrings, Bracelets
    
    // Check if category names are rendered
    expect(screen.getByText('Rings')).toBeInTheDocument();
    expect(screen.getByText('Necklaces')).toBeInTheDocument();
    expect(screen.getByText('Earrings')).toBeInTheDocument();
    expect(screen.getByText('Bracelets')).toBeInTheDocument();
  });

  it('renders links to category pages', () => {
    render(<CategorySection />);
    
    // Check if links to category pages are rendered
    const links = screen.getAllByTestId('mock-link');
    expect(links.length).toBe(4);
    
    // Check if links have correct hrefs
    expect(links[0]).toHaveAttribute('href', '/category/rings');
    expect(links[1]).toHaveAttribute('href', '/category/necklaces');
    expect(links[2]).toHaveAttribute('href', '/category/earrings');
    expect(links[3]).toHaveAttribute('href', '/category/bracelets');
  });

  it('renders category images with correct attributes', () => {
    render(<CategorySection />);
    
    // Check if category images are rendered with correct attributes
    const images = screen.getAllByTestId('mock-image');
    
    // Check alt text for images
    const altTexts = images.map(img => img.getAttribute('alt'));
    expect(altTexts).toContain('Rings');
    expect(altTexts).toContain('Necklaces');
    expect(altTexts).toContain('Earrings');
    expect(altTexts).toContain('Bracelets');
    
    // Check if images have appropriate classes
    images.forEach(img => {
      expect(img).toHaveClass('object-cover');
    });
  });

  it('has proper accessibility structure', () => {
    render(<CategorySection />);
    
    // Check if the section has proper heading structure
    const heading = screen.getByRole('heading', { name: 'Shop by Category' });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('section-title');
    
    // Check if the section has proper semantic structure
    const section = heading.closest('section');
    expect(section).toHaveClass('py-16 md:py-24 bg-white');
  });

  it('renders category cards with proper styling', () => {
    render(<CategorySection />);
    
    // Check if category cards have proper styling
    const categoryCards = screen.getAllByTestId('mock-link');
    
    categoryCards.forEach(card => {
      expect(card).toHaveClass('group');
    });
  });

  it('renders category names with proper styling', () => {
    render(<CategorySection />);
    
    // Check if category names have proper styling
    const categoryNames = [
      screen.getByText('Rings'),
      screen.getByText('Necklaces'),
      screen.getByText('Earrings'),
      screen.getByText('Bracelets')
    ];
    
    categoryNames.forEach(name => {
      expect(name).toHaveClass('text-xl font-playfair text-white');
    });
  });
}); 