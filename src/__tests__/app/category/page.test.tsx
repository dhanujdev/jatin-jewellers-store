import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryPage, { generateStaticParams } from '@/app/category/[category]/page';

// Mock the products data
jest.mock('@/data/products-by-category.json', () => ({
  rings: [
    { id: 'ring-1', title: 'Diamond Ring', imagePath: '/products/rings/ring-1.jpg', category: 'rings' },
    { id: 'ring-2', title: 'Gold Ring', imagePath: '/products/rings/ring-2.jpg', category: 'rings' }
  ],
  earrings: [
    { id: 'earring-1', title: 'Diamond Earrings', imagePath: '/products/earrings/earring-1.jpg', category: 'earrings' }
  ]
}));

// Mock the CategoryClient component
jest.mock('@/app/category/[category]/client', () => {
  return function MockCategoryClient({ 
    categoryName, 
    categoryDisplayName,
    products, 
    paginationData, 
    currentSort 
  }: { 
    categoryName: string;
    categoryDisplayName?: string;
    products: any[];
    paginationData: any;
    currentSort: string;
  }) {
    return (
      <div data-testid="category-client">
        <h1 data-testid="category-name">{categoryDisplayName || categoryName}</h1>
        <div data-testid="products-count">{products.length}</div>
        <div data-testid="pagination-data">{JSON.stringify(paginationData)}</div>
        <div data-testid="current-sort">{currentSort}</div>
      </div>
    );
  };
});

// Mock the products library
jest.mock('@/lib/products', () => ({
  getCategoryInfo: jest.fn().mockReturnValue({
    categories: ['rings', 'earrings', 'necklaces', 'bangles', 'waistbands']
  }),
  getProductsByCategory: jest.fn(),
  getAllProducts: jest.fn()
}));

describe('CategoryPage Component', () => {
  it('renders the category page with correct props', () => {
    const { getByTestId } = render(
      <CategoryPage params={{ category: 'rings' }} />
    );
    
    // Check if CategoryClient is rendered with correct props
    expect(getByTestId('category-client')).toBeInTheDocument();
    expect(getByTestId('category-name')).toHaveTextContent('Rings');
    expect(getByTestId('products-count')).toHaveTextContent('2');
    
    // Check pagination data
    const paginationData = JSON.parse(getByTestId('pagination-data').textContent || '{}');
    expect(paginationData.currentPage).toBe(1);
    expect(paginationData.totalPages).toBe(1);
    expect(paginationData.totalItems).toBe(2);
    expect(paginationData.pageSize).toBe(12);
    
    // Check sort
    expect(getByTestId('current-sort')).toHaveTextContent('default');
  });
  
  it('renders the category page with unknown category', () => {
    const { getByTestId } = render(
      <CategoryPage params={{ category: 'unknown' }} />
    );
    
    // Check if CategoryClient is rendered with correct props
    expect(getByTestId('category-name')).toHaveTextContent('Unknown');
    expect(getByTestId('products-count')).toHaveTextContent('0');
  });
  
  it('generates static params correctly', () => {
    const params = generateStaticParams();
    
    // Check if all categories are included
    expect(params).toHaveLength(5);
    expect(params).toContainEqual({ category: 'rings' });
    expect(params).toContainEqual({ category: 'earrings' });
    expect(params).toContainEqual({ category: 'necklaces' });
    expect(params).toContainEqual({ category: 'bangles' });
    expect(params).toContainEqual({ category: 'waistbands' });
  });
  
  it('formats products correctly', () => {
    const { getByTestId } = render(
      <CategoryPage params={{ category: 'rings' }} />
    );
    
    // Get the products count to verify they were formatted
    expect(getByTestId('products-count')).toHaveTextContent('2');
  });
}); 