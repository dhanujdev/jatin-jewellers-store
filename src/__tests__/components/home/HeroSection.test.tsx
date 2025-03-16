jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img src={src} alt={alt} className={className} />
  )
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, className }: { href: string; children: JSX.Element | string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  )
}));

jest.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children }: { children: JSX.Element | JSX.Element[] }) => (
    <div data-testid="mock-carousel">{children}</div>
  ),
  CarouselContent: ({ children }: { children: JSX.Element | JSX.Element[] }) => (
    <div data-testid="mock-carousel-content">{children}</div>
  ),
  CarouselItem: ({ children }: { children: JSX.Element | JSX.Element[] }) => (
    <div data-testid="mock-carousel-item">{children}</div>
  ),
  CarouselPrevious: () => <button data-testid="mock-carousel-previous">Previous</button>,
  CarouselNext: () => <button data-testid="mock-carousel-next">Next</button>
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeroSection from '@/components/home/HeroSection';

describe('HeroSection Component', () => {
  it('renders the hero section correctly', () => {
    render(<HeroSection />);

    // Check if carousel components are rendered
    expect(screen.getByTestId('mock-carousel')).toBeInTheDocument();
    expect(screen.getByTestId('mock-carousel-content')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-carousel-item')).toHaveLength(3);
    expect(screen.getByTestId('mock-carousel-previous')).toBeInTheDocument();
    expect(screen.getByTestId('mock-carousel-next')).toBeInTheDocument();

    // Check for carousel images
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
    expect(images[0]).toHaveAttribute('src', '/products/rings/rings-001/image.jpg');
    expect(images[1]).toHaveAttribute('src', '/products/rings/rings-010/image.jpg');
    expect(images[2]).toHaveAttribute('src', '/products/necklaces/necklaces-001/image.jpg');

    // Check if call-to-action buttons are rendered
    expect(screen.getByText('Shop Now')).toBeInTheDocument();
    expect(screen.getByText('Explore Collection')).toBeInTheDocument();
    expect(screen.getByText('View Collection')).toBeInTheDocument();
  });
}); 