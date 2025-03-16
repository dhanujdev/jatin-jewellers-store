import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductClient from '@/app/product/[category]/[id]/client';

// Mock window.open and window.alert
const mockWindowOpen = jest.fn();
const mockAlert = jest.fn();

beforeEach(() => {
  window.open = mockWindowOpen;
  window.alert = mockAlert;
  jest.clearAllMocks();
});

// Mock Next.js Image component
jest.mock('next/image', () => {
  const MockImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img src={src} alt={alt} className={className} />
  );
  MockImage.displayName = 'MockImage';
  return MockImage;
});

// Mock the next/link component
jest.mock('next/link', () => {
  const MockLink = ({ href, children }: { href: string; children: any }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock the customImageLoader
jest.mock('@/lib/imageLoader', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((props) => {
    return `https://example.com/${props.src}?w=${props.width}`;
  })
}));

// Mock the Tabs component from Radix UI
jest.mock('@radix-ui/react-tabs', () => ({
  Root: ({ children, defaultValue }: any) => (
    <div data-testid="tabs-root" data-default-value={defaultValue}>{children}</div>
  ),
  List: ({ children }: any) => <div data-testid="tabs-list">{children}</div>,
  Trigger: ({ children, value }: any) => (
    <button 
      data-testid={`tab-trigger-${value}`} 
      data-value={value} 
      data-state={value === 'description' ? 'active' : 'inactive'}
      onClick={() => {
        // Simulate tab switching by updating data-state attributes
        const triggers = document.querySelectorAll('[data-testid^="tab-trigger-"]');
        triggers.forEach(trigger => {
          trigger.setAttribute('data-state', 'inactive');
        });
        document.querySelector(`[data-testid="tab-trigger-${value}"]`)?.setAttribute('data-state', 'active');
        
        // Update content visibility
        const contents = document.querySelectorAll('[data-testid^="tab-content-"]');
        contents.forEach(content => {
          content.setAttribute('data-state', 'inactive');
        });
        document.querySelector(`[data-testid="tab-content-${value}"]`)?.setAttribute('data-state', 'active');
      }}
    >
      {children}
    </button>
  ),
  Content: ({ children, value }: any) => (
    <div 
      data-testid={`tab-content-${value}`} 
      data-value={value} 
      data-state={value === 'description' ? 'active' : 'inactive'}
    >
      {children}
    </div>
  ),
}));

describe('ProductClient Component', () => {
  // Mock product data
  const mockProduct = {
    id: '1',
    name: 'Diamond Ring',
    description: 'A beautiful diamond ring',
    price: 1000,
    formattedPrice: '$1,000',
    image: '/images/rings/diamond-ring.jpg',
    category: 'rings',
    materials: [
      { name: 'Gold', description: 'High quality gold' },
      { name: 'Diamond', description: 'Premium diamonds' }
    ],
    dimensions: { width: '10mm', height: '5mm', depth: '10mm' },
    care: 'Clean with soft cloth',
    slug: 'diamond-ring',
    additionalImages: ['/images/rings/diamond-ring.jpg', '/images/rings/diamond-ring-2.jpg']
  };

  const mockRelatedProducts = [
    { 
      id: '2', 
      name: 'Gold Ring', 
      price: 800, 
      formattedPrice: '$800',
      image: '/images/rings/gold-ring.jpg',
      category: 'rings', 
      slug: 'gold-ring' 
    },
    { 
      id: '3', 
      name: 'Silver Ring', 
      price: 500, 
      formattedPrice: '$500',
      image: '/images/rings/silver-ring.jpg',
      category: 'rings', 
      slug: 'silver-ring' 
    }
  ];

  it('renders the product title and price information', () => {
    render(
      <ProductClient 
        product={mockProduct} 
        relatedProducts={mockRelatedProducts}
        categoryDisplayName="Rings"
      />
    );
    
    // Use a more specific query to find the product title in the h1 element
    const heading = screen.getByRole('heading', { name: 'Diamond Ring' });
    expect(heading).toBeInTheDocument();
    
    // Check for product ID which should contain the ID from our mock
    expect(screen.getByText(`Product ID: ${mockProduct.id}`)).toBeInTheDocument();
  });

  it('renders the product description', () => {
    render(
      <ProductClient 
        product={mockProduct} 
        relatedProducts={mockRelatedProducts}
        categoryDisplayName="Rings"
      />
    );
    
    // Find the description in the product details section
    const descriptionContent = screen.getByTestId('tab-content-description');
    expect(within(descriptionContent).getByText(/A beautiful diamond ring/i)).toBeInTheDocument();
  });

  it('renders the product materials', () => {
    render(
      <ProductClient 
        product={mockProduct} 
        relatedProducts={mockRelatedProducts}
        categoryDisplayName="Rings"
      />
    );
    
    // Click on the materials tab to make it visible
    fireEvent.click(screen.getByTestId('tab-trigger-materials'));
    
    // Look for material names in the materials tab content
    const materialsContent = screen.getByTestId('tab-content-materials');
    
    // Use getAllByText to handle multiple elements with the same text
    mockProduct.materials.forEach(material => {
      const elements = within(materialsContent).getAllByText(new RegExp(material.name, 'i'));
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('renders related products', () => {
    render(
      <ProductClient 
        product={mockProduct} 
        relatedProducts={mockRelatedProducts}
        categoryDisplayName="Rings"
      />
    );
    
    // Find the related products section
    const relatedProductsSection = screen.getByRole('heading', { name: /You May Also Like/i }).parentElement;
    
    // Check for related products by their names within that section
    mockRelatedProducts.forEach(product => {
      expect(within(relatedProductsSection!).getByText(product.name)).toBeInTheDocument();
    });
  });

  it('renders breadcrumb navigation', () => {
    render(
      <ProductClient 
        product={mockProduct} 
        relatedProducts={mockRelatedProducts}
        categoryDisplayName="Rings"
      />
    );
    
    // Find the navigation element
    const nav = screen.getByRole('navigation');
    
    // Check for Home link
    const homeLink = within(nav).getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('href', '/');
    
    // Check for category link
    const categoryLink = within(nav).getByRole('link', { name: 'Rings' });
    expect(categoryLink).toHaveAttribute('href', '/category/rings');
    
    // The product name should be in the last breadcrumb item
    const breadcrumbItems = within(nav).getAllByRole('listitem');
    const lastItem = breadcrumbItems[breadcrumbItems.length - 1];
    expect(lastItem).toHaveTextContent('Diamond Ring');
  });

  // Tests for interactive features

  it('updates main image when thumbnail is clicked', () => {
    render(
      <ProductClient 
        product={mockProduct} 
        relatedProducts={mockRelatedProducts}
        categoryDisplayName="Rings"
      />
    );
    const mainImage = screen.getAllByRole('img')[0];
    const thumbnails = screen.getAllByRole('button').filter(button => 
      button.querySelector('img')
    );
    
    fireEvent.click(thumbnails[0]);
    expect(mainImage).toHaveAttribute('src', mockProduct.image);
  });

  it('allows navigation between tabs', () => {
    render(
      <ProductClient 
        product={mockProduct} 
        relatedProducts={mockRelatedProducts}
        categoryDisplayName="Rings"
      />
    );
    
    // Click on materials tab
    fireEvent.click(screen.getByTestId('tab-trigger-materials'));
    
    // Materials tab content should be visible
    const materialsContent = screen.getByTestId('tab-content-materials');
    expect(materialsContent).toBeInTheDocument();
    
    // Use getAllByText for elements that appear multiple times
    const goldElements = within(materialsContent).getAllByText(/Gold/i);
    expect(goldElements.length).toBeGreaterThan(0);
    
    // Click on care tab
    fireEvent.click(screen.getByTestId('tab-trigger-care'));
    
    // Care tab content should be visible
    const careContent = screen.getByTestId('tab-content-care');
    expect(careContent).toBeInTheDocument();
    
    // Check for list items in the care instructions
    const careListItems = within(careContent).getAllByRole('listitem');
    expect(careListItems.length).toBeGreaterThan(0);
    
    // Check that at least one list item contains text about cleaning
    const hasCleaningInstruction = careListItems.some(item => 
      item.textContent && item.textContent.toLowerCase().includes('clean')
    );
    expect(hasCleaningInstruction).toBe(true);
  });

  it('displays correct content in each tab', () => {
    render(
      <ProductClient 
        product={mockProduct} 
        relatedProducts={mockRelatedProducts}
        categoryDisplayName="Rings"
      />
    );
    
    // Get tab triggers and contents
    const descriptionTab = screen.getByTestId('tab-trigger-description');
    const materialsTab = screen.getByTestId('tab-trigger-materials');
    const careTab = screen.getByTestId('tab-trigger-care');
    
    const descriptionContent = screen.getByTestId('tab-content-description');
    const materialsContent = screen.getByTestId('tab-content-materials');
    const careContent = screen.getByTestId('tab-content-care');
    
    // Check description tab content
    expect(within(descriptionContent).getByText(/Product Description/i)).toBeVisible();
    expect(within(descriptionContent).getByText(/A beautiful diamond ring/i)).toBeVisible();
    
    // Click the materials tab
    fireEvent.click(materialsTab);
    
    // Check materials tab content - use getAllByRole instead of getByRole
    const materialsHeadings = within(materialsContent).getAllByRole('heading');
    expect(materialsHeadings.length).toBeGreaterThan(0);

    // Use getAllByText for elements that appear multiple times
    const goldElements = within(materialsContent).getAllByText(/Gold/i);
    expect(goldElements.length).toBeGreaterThan(0);

    const diamondElements = within(materialsContent).getAllByText(/Diamond/i);
    expect(diamondElements.length).toBeGreaterThan(0);
    
    // Click the care tab
    fireEvent.click(careTab);
    
    // Check care tab content
    expect(within(careContent).getByRole('heading')).toBeVisible();
    expect(within(careContent).getByText(/Store your jewelry/i, { exact: false })).toBeVisible();
  });
}); 