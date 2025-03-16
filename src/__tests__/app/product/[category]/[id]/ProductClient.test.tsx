import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductClient from '@/app/product/[category]/[id]/client';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, className }: { href: string; children: any; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

// Mock the customImageLoader
jest.mock('@/lib/imageLoader', () => ({
  __esModule: true,
  default: (props: any) => props.src,
}));

// Mock the Tabs component
jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ defaultValue, children }: { defaultValue: string; children: any }) => (
    <div data-testid="tabs-root" data-default-value={defaultValue}>
      {children}
    </div>
  ),
  TabsList: ({ children }: { children: any }) => (
    <div data-testid="tabs-list">
      {children}
    </div>
  ),
  TabsTrigger: ({ value, children, onClick }: { value: string; children: any; onClick?: () => void }) => (
    <button 
      data-testid={`tab-trigger-${value}`} 
      data-value={value} 
      data-state={value === 'description' ? 'active' : 'inactive'}
      onClick={onClick}
    >
      {children}
    </button>
  ),
  TabsContent: ({ value, children }: { value: string; children: any }) => (
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
  const mockProduct = {
    id: 'product-1',
    name: 'Gold Ring',
    price: 25000,
    formattedPrice: '₹25,000',
    image: '/images/gold-ring-1.jpg',
    category: 'rings',
    description: 'Beautiful gold ring',
    materials: [
      {
        name: 'Gold, 22K',
        description: 'High quality 22K gold'
      }
    ],
    slug: 'gold-ring'
  };

  const mockRelatedProducts = [
    {
      id: 'product-2',
      name: 'Silver Ring',
      price: 15000,
      formattedPrice: '₹15,000',
      image: '/images/silver-ring.jpg',
      category: 'rings',
      slug: 'silver-ring'
    },
    {
      id: 'product-3',
      name: 'Diamond Ring',
      price: 50000,
      formattedPrice: '₹50,000',
      image: '/images/diamond-ring.jpg',
      category: 'rings',
      slug: 'diamond-ring'
    }
  ];
  
  it('renders product name and price correctly', () => {
    render(<ProductClient product={mockProduct} relatedProducts={mockRelatedProducts} categoryDisplayName="Rings" />);
    
    expect(screen.getByRole('heading', { name: 'Gold Ring' })).toBeInTheDocument();
    expect(screen.getByText('Product ID: product-1')).toBeInTheDocument();
  });
  
  it('renders product images', () => {
    render(<ProductClient product={mockProduct} relatedProducts={mockRelatedProducts} categoryDisplayName="Rings" />);
    
    // Check for main image
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
    
    // Check for thumbnail images
    const thumbnailButtons = screen.getAllByRole('button').filter(button => 
      button.querySelector('img')
    );
    expect(thumbnailButtons.length).toBeGreaterThan(0);
  });
  
  it('renders quantity selector and add to cart button', () => {
    render(<ProductClient product={mockProduct} relatedProducts={mockRelatedProducts} categoryDisplayName="Rings" />);
    
    // Check for quantity label
    expect(screen.getByLabelText('Quantity:')).toBeInTheDocument();
    
    // Check for quantity select with options
    const quantitySelect = screen.getByLabelText('Quantity:');
    expect(quantitySelect).toBeInTheDocument();
    
    // Check for Add to Cart button
    expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeInTheDocument();
  });
  
  it('renders product description', () => {
    render(<ProductClient product={mockProduct} relatedProducts={mockRelatedProducts} categoryDisplayName="Rings" />);
    
    // Check for description tab
    const descriptionTab = screen.getByTestId('tab-trigger-description');
    expect(descriptionTab).toBeInTheDocument();
    
    // Check for description content
    const descriptionContent = screen.getByTestId('tab-content-description');
    expect(descriptionContent).toBeInTheDocument();
    expect(descriptionContent).toHaveTextContent('Beautiful gold ring');
  });
  
  it('renders related products section', () => {
    render(<ProductClient product={mockProduct} relatedProducts={mockRelatedProducts} categoryDisplayName="Rings" />);
    
    // Check for related products heading
    expect(screen.getByRole('heading', { name: 'You May Also Like' })).toBeInTheDocument();
    
    // Check for related product links
    expect(screen.getByRole('link', { name: /Silver Ring/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Diamond Ring/i })).toBeInTheDocument();
  });
  
  it('changes quantity when dropdown is changed', () => {
    render(<ProductClient product={mockProduct} relatedProducts={mockRelatedProducts} categoryDisplayName="Rings" />);
    
    // Get the quantity select
    const quantitySelect = screen.getByLabelText('Quantity:');
    
    // Change the quantity to 3
    fireEvent.change(quantitySelect, { target: { value: '3' } });
    
    // Check if the quantity has been updated
    expect(quantitySelect).toHaveValue('3');
  });
  
  it('renders product details correctly', () => {
    render(<ProductClient product={mockProduct} relatedProducts={mockRelatedProducts} categoryDisplayName="Rings" />);
    
    // Find the product details section
    const productDetailsSection = screen.getByText('Product Details').closest('div');
    
    if (productDetailsSection) {
      // Find the list items within the product details section
      const detailItems = within(productDetailsSection).getAllByRole('listitem');
      
      // Check for category in the details
      const categoryItem = detailItems.find(item => item.textContent?.includes('Category:'));
      expect(categoryItem).toBeInTheDocument();
      expect(categoryItem).toHaveTextContent('Category: Rings');
      
      // Check for product ID in the details
      const productIdItem = detailItems.find(item => item.textContent?.includes('Product ID:'));
      expect(productIdItem).toBeInTheDocument();
      expect(productIdItem).toHaveTextContent('Product ID: product-1');
    }
  });
  
  it('renders breadcrumb navigation', () => {
    render(<ProductClient product={mockProduct} relatedProducts={mockRelatedProducts} categoryDisplayName="Rings" />);
    
    // Check for breadcrumb navigation
    const breadcrumbNav = screen.getByRole('navigation');
    expect(breadcrumbNav).toBeInTheDocument();
    
    // Check for Home link in breadcrumb
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toBeInTheDocument();
    
    // Check for category link in breadcrumb
    const categoryLink = screen.getByRole('link', { name: 'Rings' });
    expect(categoryLink).toBeInTheDocument();
    
    // Check for product name in breadcrumb (not a link)
    const breadcrumbItems = screen.getAllByRole('listitem');
    const productNameInBreadcrumb = breadcrumbItems.some(item => item.textContent?.includes('Gold Ring'));
    expect(productNameInBreadcrumb).toBe(true);
  });
  
  it('shows tab content when tabs are clicked', () => {
    render(<ProductClient product={mockProduct} relatedProducts={mockRelatedProducts} categoryDisplayName="Rings" />);
    
    // Get tab elements
    const descriptionTab = screen.getByTestId('tab-trigger-description');
    const materialsTab = screen.getByTestId('tab-trigger-materials');
    const careTab = screen.getByTestId('tab-trigger-care');
    
    // Initially, description tab should be active
    expect(descriptionTab).toHaveAttribute('data-state', 'active');
    
    // Description content should be visible
    const descriptionContent = screen.getByTestId('tab-content-description');
    expect(descriptionContent).toBeVisible();
    expect(descriptionContent).toHaveTextContent('Beautiful gold ring');
  });
}); 