import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryPage from '@/app/category/[category]/page';
import { getCategoryInfo, getProductsByCategory } from '@/lib/products';

// Mock the CategoryClient component
jest.mock('@/app/category/[category]/client', () => {
  return function MockCategoryClient({ categoryName, categoryDisplayName, products, paginationData, currentSort }: any) {
    return (
      <div data-testid="category-client">
        <div data-testid="category-name">{categoryName}</div>
        <div data-testid="category-display-name">{categoryDisplayName}</div>
        <div data-testid="products-length">{products.length}</div>
        <div data-testid="current-page">{paginationData.currentPage}</div>
        <div data-testid="total-pages">{paginationData.totalPages}</div>
        <div data-testid="current-sort">{currentSort}</div>
      </div>
    );
  };
});

// Mock the products by category data
jest.mock('@/data/products-by-category.json', () => ({
  rings: Array.from({ length: 24 }, (_, i) => ({
    id: `ring-${i + 1}`,
    title: `Ring ${i + 1}`,
    description: `Description for Ring ${i + 1}`,
    category: 'rings',
    imagePath: `/images/rings/ring-${i + 1}.jpg`
  }))
}));

// Mock the products library
jest.mock('@/lib/products', () => ({
  getCategoryInfo: jest.fn(),
  getProductsByCategory: jest.fn(),
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
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('renders category page with default pagination and sorting', async () => {
    const params = { category: 'rings' };
    const searchParams = {};

    const { getByTestId } = render(await CategoryPage({ params, searchParams }));

    expect(getByTestId('category-name')).toHaveTextContent('rings');
    expect(getByTestId('category-display-name')).toHaveTextContent('Rings');
    expect(getByTestId('current-page')).toHaveTextContent('1');
    expect(getByTestId('current-sort')).toHaveTextContent('default');
  });

  it('handles pagination correctly', async () => {
    const params = { category: 'rings' };
    const searchParams = { page: '2' };

    const { getByTestId } = render(await CategoryPage({ params, searchParams }));

    expect(getByTestId('current-page')).toHaveTextContent('2');
    expect(getByTestId('total-pages')).toHaveTextContent('2'); // 24 items with 12 per page = 2 pages
  });

  it('handles sorting correctly', async () => {
    const params = { category: 'rings' };
    const searchParams = { sort: 'price-desc' };

    const { getByTestId } = render(await CategoryPage({ params, searchParams }));

    expect(getByTestId('current-sort')).toHaveTextContent('price-desc');
  });

  it('handles missing search parameters', async () => {
    const params = { category: 'rings' };
    const searchParams = {};

    const { getByTestId } = render(await CategoryPage({ params, searchParams }));

    expect(getByTestId('current-page')).toHaveTextContent('1');
    expect(getByTestId('current-sort')).toHaveTextContent('default');
  });

  it('handles invalid page numbers by defaulting to page 1', async () => {
    const params = { category: 'rings' };
    const searchParams = { page: 'invalid' };

    const { getByTestId } = render(await CategoryPage({ params, searchParams }));

    expect(getByTestId('current-page')).toHaveTextContent('1');
  });

  it('handles page numbers beyond total pages by using the last valid page', async () => {
    const params = { category: 'rings' };
    const searchParams = { page: '999' };

    const { getByTestId } = render(await CategoryPage({ params, searchParams }));

    const totalPages = Number(getByTestId('total-pages').textContent);
    expect(Number(getByTestId('current-page').textContent)).toBe(totalPages);
  });

  it('capitalizes category name when no display name is found', async () => {
    const params = { category: 'newcategory' };
    const searchParams = {};

    const { getByTestId } = render(await CategoryPage({ params, searchParams }));

    expect(getByTestId('category-display-name')).toHaveTextContent('Newcategory');
  });
}); 