import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryPage from '@/app/category/[category]/page';

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

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/test-path'),
  useSearchParams: jest.fn().mockReturnValue({
    get: (param: string) => param === 'page' ? '1' : 'default',
    toString: () => 'sort=default'
  })
}));

describe('CategoryPage', () => {
  it('renders correctly with default props', async () => {
    const props = {
      params: { category: 'rings' },
      searchParams: { page: '1', sort: 'default' }
    };

    const { container } = render(await CategoryPage(props));
    expect(container).toBeInTheDocument();
  });

  it('renders the category page with correct props', async () => {
    const props = {
      params: { category: 'rings' },
      searchParams: { page: '1', sort: 'default' }
    };

    const { getByTestId } = render(await CategoryPage(props));
    
    expect(getByTestId('category-client')).toBeInTheDocument();
    expect(getByTestId('category-name')).toHaveTextContent('Rings');
    expect(getByTestId('products-count')).toHaveTextContent('2');
    
    const paginationData = JSON.parse(getByTestId('pagination-data').textContent || '{}');
    expect(paginationData.currentPage).toBe(1);
    expect(paginationData.totalPages).toBe(1);
    expect(paginationData.totalItems).toBe(2);
    expect(paginationData.pageSize).toBe(12);
    
    expect(getByTestId('current-sort')).toHaveTextContent('default');
  });
  
  it('renders the category page with unknown category', async () => {
    const props = {
      params: { category: 'unknown' },
      searchParams: { page: '1', sort: 'default' }
    };

    const { getByTestId } = render(await CategoryPage(props));
    
    expect(getByTestId('category-client')).toBeInTheDocument();
    expect(getByTestId('category-name')).toHaveTextContent('Unknown');
    expect(getByTestId('products-count')).toHaveTextContent('0');
  });
}); 