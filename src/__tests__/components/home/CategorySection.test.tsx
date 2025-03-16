jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, className }: { href: string; children: JSX.Element | string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  )
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className, fill }: { src: string; alt: string; className?: string; fill?: boolean }) => (
    <img src={src} alt={alt} className={className} />
  )
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategorySection from '@/components/home/CategorySection';

describe('CategorySection Component', () => {
  it('renders the category section correctly', () => {
    render(<CategorySection />);

    // Check for section title and description
    expect(screen.getByText('Shop by Category')).toBeInTheDocument();
    expect(screen.getByText('Explore our curated collections of fine diamond jewelry for every occasion')).toBeInTheDocument();

    // Check for category cards
    expect(screen.getByText('Rings')).toBeInTheDocument();
    expect(screen.getByText('Necklaces')).toBeInTheDocument();
    expect(screen.getByText('Earrings')).toBeInTheDocument();
    expect(screen.getByText('Bracelets')).toBeInTheDocument();

    // Check for category links
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);
    expect(links[0]).toHaveAttribute('href', '/category/rings');
    expect(links[1]).toHaveAttribute('href', '/category/necklaces');
    expect(links[2]).toHaveAttribute('href', '/category/earrings');
    expect(links[3]).toHaveAttribute('href', '/category/bracelets');

    // Check for category images
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(4);
    expect(images[0]).toHaveAttribute('src', '/products/rings/rings-005/image.jpg');
    expect(images[1]).toHaveAttribute('src', '/products/necklaces/necklaces-010/image.jpg');
    expect(images[2]).toHaveAttribute('src', '/products/earrings/earrings-015/image.jpg');
    expect(images[3]).toHaveAttribute('src', '/products/bangles/bangles-001/image.jpg');

    // Check for accessibility structure
    expect(screen.getByRole('heading', { level: 2, name: 'Shop by Category' })).toBeInTheDocument();
    expect(screen.getByRole('region')).toBeInTheDocument();
  });
}); 