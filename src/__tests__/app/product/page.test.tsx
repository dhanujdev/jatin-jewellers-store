import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductPage, { generateStaticParams } from '@/app/product/[category]/[id]/page';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  notFound: jest.fn()
}));

// Mock the ProductClient component
jest.mock('@/app/product/[category]/[id]/client', () => {
  return function MockProductClient({ 
    product, 
    relatedProducts, 
    categoryDisplayName 
  }: { 
    product: any;
    relatedProducts: any[];
    categoryDisplayName: string;
  }) {
    return (
      <div data-testid="product-client">
        <h1 data-testid="product-name">{product.name}</h1>
        <div data-testid="product-price">{product.formattedPrice}</div>
        <div data-testid="product-category">{categoryDisplayName}</div>
        <div data-testid="related-products-count">{relatedProducts.length}</div>
      </div>
    );
  };
});

// Mock the products library
jest.mock('@/lib/products', () => ({
  getProductById: jest.fn().mockImplementation((id) => {
    if (id === 'test-product') {
      return Promise.resolve({
        id: 'test-product',
        title: 'Test Product',
        description: 'This is a test product',
        imagePath: '/products/test-product.jpg',
        category: 'rings',
        materials: ['Gold', 'Diamond']
      });
    }
    return Promise.resolve(null);
  }),
  getRelatedProducts: jest.fn().mockResolvedValue([
    {
      id: 'related-1',
      title: 'Related Product 1',
      imagePath: '/products/related-1.jpg',
      category: 'rings'
    },
    {
      id: 'related-2',
      title: 'Related Product 2',
      imagePath: '/products/related-2.jpg',
      category: 'rings'
    }
  ]),
  getAllProducts: jest.fn().mockResolvedValue([
    { id: 'product-1', category: 'rings' },
    { id: 'product-2', category: 'earrings' }
  ])
}));

describe('ProductPage Component', () => {
  it('renders the product page with correct props', async () => {
    const { getByTestId } = await render(
      await ProductPage({ params: { category: 'rings', id: 'test-product' } })
    );
    
    // Check if ProductClient is rendered with correct props
    expect(getByTestId('product-client')).toBeInTheDocument();
    expect(getByTestId('product-name')).toHaveTextContent('Test Product');
    expect(getByTestId('product-category')).toHaveTextContent('Rings');
    expect(getByTestId('related-products-count')).toHaveTextContent('2');
  });
  
  it('calls notFound when product is not found', async () => {
    const notFound = require('next/navigation').notFound;
    
    try {
      await ProductPage({ params: { category: 'rings', id: 'non-existent' } });
    } catch (e) {
      // This is expected
    }
    
    expect(notFound).toHaveBeenCalled();
  });
  
  it('generates static params correctly', async () => {
    const params = await generateStaticParams();
    
    // Check if all products are included
    expect(params).toHaveLength(2);
    expect(params).toContainEqual({ category: 'rings', id: 'product-1' });
    expect(params).toContainEqual({ category: 'earrings', id: 'product-2' });
  });
}); 