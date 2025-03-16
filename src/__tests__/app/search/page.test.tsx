import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchPage from '@/app/search/page';

// Mock the SearchClient component
jest.mock('@/app/search/client', () => {
  return function MockSearchClient({ 
    allProducts, 
    initialPagination 
  }: { 
    allProducts: any[];
    initialPagination: any;
  }) {
    return (
      <div data-testid="search-client">
        <div data-testid="products-count">{allProducts.length}</div>
        <div data-testid="pagination-data">{JSON.stringify(initialPagination)}</div>
      </div>
    );
  };
});

// Mock the products library
jest.mock('@/lib/products', () => ({
  getAllProducts: jest.fn().mockReturnValue([
    { 
      id: 'product-1', 
      title: 'Diamond Ring', 
      imagePath: '/products/rings/ring-1.jpg', 
      category: 'rings',
      description: 'A beautiful diamond ring',
      tags: ['diamond', 'ring', 'gold']
    },
    { 
      id: 'product-2', 
      title: 'Gold Earrings', 
      imagePath: '/products/earrings/earring-1.jpg', 
      category: 'earrings',
      description: 'Elegant gold earrings',
      tags: ['gold', 'earrings']
    }
  ])
}));

// Mock React's Suspense component
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    Suspense: ({ children }: { children: JSX.Element }) => children
  };
});

describe('SearchPage Component', () => {
  it('renders the search page with correct props', () => {
    const { getByTestId } = render(<SearchPage />);
    
    // Check if SearchClient is rendered with correct props
    expect(getByTestId('search-client')).toBeInTheDocument();
    expect(getByTestId('products-count')).toHaveTextContent('2');
    
    // Check pagination data
    const paginationData = JSON.parse(getByTestId('pagination-data').textContent || '{}');
    expect(paginationData.currentPage).toBe(1);
    expect(paginationData.perPage).toBe(12);
  });
  
  it('formats products correctly', () => {
    const { getByTestId } = render(<SearchPage />);
    
    // Get the products count to verify they were formatted
    expect(getByTestId('products-count')).toHaveTextContent('2');
  });
}); 