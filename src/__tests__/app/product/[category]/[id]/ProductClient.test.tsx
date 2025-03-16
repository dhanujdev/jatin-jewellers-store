jest.mock('next/image', () => {
  const MockImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img src={src} alt={alt} className={className} />
  );
  MockImage.displayName = 'MockImage';
  return MockImage;
});

jest.mock('next/link', () => {
  const MockLink = ({ href, children }: { href: string; children: any }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductClient from '@/app/product/[category]/[id]/client';

interface Material {
  name: string;
  description: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  image: string;
  images?: string[];
  category: string;
  materials: Material[];
  slug: string;
  details?: string;
  specifications?: string;
  reviews?: any[];
}

interface RelatedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  image: string;
  category: string;
  slug: string;
}

const mockProduct = {
  id: 'test-id',
  name: 'Test Product',
  description: 'Test Description',
  price: 100,
  formattedPrice: '$100',
  image: '/images/rings/test.jpg',
  category: 'rings',
  materials: [],
  slug: 'test-product'
};

const mockRelatedProducts: RelatedProduct[] = [
  {
    id: 'gold-ring',
    name: 'Gold Ring',
    description: 'A beautiful gold ring',
    price: 899.99,
    formattedPrice: '$899.99',
    image: '/images/rings/gold-ring.jpg',
    category: 'rings',
    slug: 'gold-ring'
  },
  {
    id: 'silver-ring',
    name: 'Silver Ring',
    description: 'A beautiful silver ring',
    price: 799.99,
    formattedPrice: '$799.99',
    image: '/images/rings/silver-ring.jpg',
    category: 'rings',
    slug: 'silver-ring'
  }
];

describe('ProductClient Component', () => {
  beforeEach(() => {
    render(
      <ProductClient 
        product={mockProduct} 
        relatedProducts={mockRelatedProducts} 
        categoryDisplayName="Rings"
      />
    );
  });

  it('renders product details correctly', () => {
    render(
      <ProductClient 
        product={mockProduct} 
        relatedProducts={mockRelatedProducts}
        categoryDisplayName="Rings"
      />
    );
    
    const titleElements = screen.getAllByText('Test Product');
    expect(titleElements.length).toBeGreaterThan(0);
    
    const productIdElements = screen.getAllByText(/Product ID: test-id/);
    expect(productIdElements.length).toBeGreaterThan(0);
    
    const descriptionElements = screen.getAllByText('Test Description');
    expect(descriptionElements.length).toBeGreaterThan(0);
  });

  it('renders product images correctly', () => {
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', '/images/rings/test.jpg');
  });

  it('changes main image when thumbnail is clicked', () => {
    render(
      <ProductClient 
        product={mockProduct} 
        relatedProducts={mockRelatedProducts}
        categoryDisplayName="Rings"
      />
    );
    const thumbnails = screen.getAllByRole('button').filter(button => 
      button.querySelector('img')
    );
    const mainImage = screen.getAllByRole('img')[0];
    expect(mainImage).toHaveAttribute('src', mockProduct.image);
  });

  it('renders product tabs correctly', () => {
    render(
      <ProductClient 
        product={mockProduct} 
        relatedProducts={mockRelatedProducts}
        categoryDisplayName="Rings"
      />
    );
    
    const descriptionTabs = screen.getAllByRole('tab', { name: 'Description' });
    const materialsTabs = screen.getAllByRole('tab', { name: 'Materials' });
    const careTabs = screen.getAllByRole('tab', { name: 'Care Instructions' });
    
    expect(descriptionTabs.length).toBeGreaterThan(0);
    expect(materialsTabs.length).toBeGreaterThan(0);
    expect(careTabs.length).toBeGreaterThan(0);
  });

  it('renders related products section', () => {
    expect(screen.getByText('You May Also Like')).toBeInTheDocument();
    expect(screen.getByText('Gold Ring')).toBeInTheDocument();
    expect(screen.getByText('Silver Ring')).toBeInTheDocument();
  });
}); 