import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryClient from '@/app/category/[category]/client';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className }: { src: string, alt: string, className?: string }) => (
    <img src={src} alt={alt} className={className} />
  ),
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, className }: { href: string, children: any, className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

// Mock the components used in CategoryClient
jest.mock('@/components/ui/breadcrumb', () => ({
  Breadcrumb: ({ items }: { items: Array<{ label: string; href?: string }> }) => (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex text-sm">
        {items.map((item, index) => (
          <li key={index} className={index === items.length - 1 ? "text-gray-800" : "mr-2"}>
            {item.href ? (
              <a href={item.href} className="text-gray-500 hover:text-gold">
                {item.label}
              </a>
            ) : (
              <span className="text-gray-800">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  ),
}));

// Mock custom image loader
jest.mock('@/lib/imageLoader', () => ({
  __esModule: true,
  default: () => 'https://example.com/image.jpg',
}));

describe('CategoryClient Component', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  };
  
  const mockSearchParams = {
    get: jest.fn(),
    toString: jest.fn(),
  };
  
  const mockProducts = [
    { id: '1', name: 'Diamond Ring', price: 1000, formattedPrice: '$1,000', category: 'rings', image: '/images/diamond-ring.jpg', slug: 'diamond-ring', description: 'A beautiful diamond ring' },
    { id: '2', name: 'Gold Ring', price: 800, formattedPrice: '$800', category: 'rings', image: '/images/gold-ring.jpg', slug: 'gold-ring', description: 'An elegant gold ring' },
  ];
  
  // Default pagination data
  const mockPaginationData = {
    currentPage: 1,
    pageSize: 12,
    totalItems: mockProducts.length,
    totalPages: 1
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    
    // Default search params
    mockSearchParams.get.mockImplementation((param) => {
      if (param === 'page') return '1';
      if (param === 'sort') return 'price-asc';
      return null;
    });
    
    mockSearchParams.toString.mockReturnValue('page=1&sort=price-asc');
  });
  
  it('renders category title correctly', () => {
    render(
      <CategoryClient 
        categoryName="rings" 
        products={mockProducts} 
        paginationData={mockPaginationData}
        currentSort="price-asc"
      />
    );
    
    // The component renders the category name in lowercase in the h1 element
    const headings = screen.getAllByRole('heading');
    const categoryHeading = headings.find(heading => heading.textContent === 'rings');
    expect(categoryHeading).toBeInTheDocument();
  });
  
  it('renders product cards for each product', () => {
    render(
      <CategoryClient 
        categoryName="rings" 
        products={mockProducts} 
        paginationData={mockPaginationData}
        currentSort="price-asc"
      />
    );
    
    // Check for product names in the rendered cards
    expect(screen.getByText('Diamond Ring')).toBeInTheDocument();
    expect(screen.getByText('Gold Ring')).toBeInTheDocument();
    
    // Check for product links using href attribute instead of data-testid
    const diamondRingLink = screen.getByRole('link', { name: /Diamond Ring/i });
    const goldRingLink = screen.getByRole('link', { name: /Gold Ring/i });
    
    expect(diamondRingLink).toHaveAttribute('href', '/product/rings/diamond-ring');
    expect(goldRingLink).toHaveAttribute('href', '/product/rings/gold-ring');
  });
  
  it('renders sort options', () => {
    render(
      <CategoryClient 
        categoryName="rings" 
        products={mockProducts} 
        paginationData={mockPaginationData}
        currentSort="price-asc"
      />
    );
    
    // Check for sort options
    expect(screen.getByText('Sort by:')).toBeInTheDocument();
    expect(screen.getByText('Price: Low to High')).toBeInTheDocument();
    expect(screen.getByText('Price: High to Low')).toBeInTheDocument();
  });
  
  it('displays no products message when no products are available', () => {
    render(
      <CategoryClient 
        categoryName="rings" 
        products={[]} 
        paginationData={{
          currentPage: 1,
          pageSize: 12,
          totalItems: 0,
          totalPages: 0
        }}
        currentSort="price-asc"
      />
    );
    
    // The actual message in the component
    expect(screen.getByText('No products found. Please try a different category or filter.')).toBeInTheDocument();
  });
  
  it('displays breadcrumb navigation', () => {
    render(
      <CategoryClient 
        categoryName="necklaces" 
        products={mockProducts} 
        paginationData={mockPaginationData}
        currentSort="price-asc"
      />
    );
    
    // Check for breadcrumb elements
    expect(screen.getByText('Home')).toBeInTheDocument();
    
    // Find the necklaces text in the breadcrumb navigation
    const breadcrumbItems = screen.getAllByRole('listitem');
    const necklacesBreadcrumb = breadcrumbItems.find(item => item.textContent?.includes('necklaces'));
    expect(necklacesBreadcrumb).toBeInTheDocument();
  });
}); 