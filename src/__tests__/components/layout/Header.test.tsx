import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '@/components/layout/Header';

// Mock the components used in Header
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, className }: any) => {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
}));

// Mock the Lucide icons
jest.mock('lucide-react', () => ({
  Menu: () => <div data-testid="mock-menu-icon" />,
  Search: () => <div data-testid="mock-search-icon" />,
  X: () => <div data-testid="mock-x-icon" />,
}));

// Mock the navigation hooks
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn()
    };
  },
  usePathname() {
    return '/';
  }
}));

// Mock the lib/products module
jest.mock('@/lib/products', () => ({
  getCategoryInfo: () => ({
    categories: ['rings', 'earrings', 'necklaces', 'bangles', 'waistbands']
  })
}));

// Mock the Sheet component
jest.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: any) => <div data-testid="mock-sheet">{children}</div>,
  SheetContent: ({ children, side, className }: any) => (
    <div data-testid="mock-sheet-content" className={className} data-side={side}>
      {children}
    </div>
  ),
  SheetTitle: ({ children, className }: any) => (
    <div data-testid="mock-sheet-title" className={className}>
      {children}
    </div>
  ),
  SheetDescription: ({ children, className }: any) => (
    <div data-testid="mock-sheet-description" className={className}>
      {children}
    </div>
  ),
  SheetTrigger: ({ children, asChild, className }: any) => (
    <div data-testid="mock-sheet-trigger" className={className}>
      {children}
    </div>
  ),
  SheetClose: ({ children, asChild, className }: any) => (
    <div data-testid="mock-sheet-close" className={className}>
      {children}
    </div>
  ),
}));

describe('Header Component', () => {
  it('renders the header with logo', () => {
    render(<Header />);
    
    // Check if the logo text is rendered - use a more specific selector
    const logoContainer = screen.getByRole('link', { name: 'JATIN JEWELLERS' });
    expect(logoContainer).toBeInTheDocument();
    expect(logoContainer).toHaveAttribute('href', '/');
    
    const logoText = logoContainer.querySelector('span');
    expect(logoText).toHaveClass('text-xl md:text-3xl font-bold text-gold font-serif');
  });
  
  it('renders navigation links', () => {
    render(<Header />);
    
    // Find the desktop navigation by its class
    const desktopNav = document.querySelector('.hidden.md\\:flex.justify-center.space-x-8.mt-4');
    expect(desktopNav).toBeInTheDocument();
    
    // Check if all category links are rendered
    const categoryLinks = desktopNav?.querySelectorAll('a');
    expect(categoryLinks?.length).toBe(6); // Home + 5 categories
    
    // Check if the links have the correct hrefs
    const hrefs = Array.from(categoryLinks || []).map(link => link.getAttribute('href'));
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/category/rings');
    expect(hrefs).toContain('/category/earrings');
    expect(hrefs).toContain('/category/necklaces');
    expect(hrefs).toContain('/category/bangles');
    expect(hrefs).toContain('/category/waistbands');
  });
  
  it('renders mobile menu trigger', () => {
    render(<Header />);
    
    // Check if mobile menu trigger is rendered
    const mobileMenuTrigger = screen.getByTestId('mock-sheet-trigger');
    expect(mobileMenuTrigger).toBeInTheDocument();
    
    // Check if the trigger contains a button with the menu icon
    const menuIconContainer = mobileMenuTrigger.querySelector('button');
    expect(menuIconContainer).toBeInTheDocument();
    expect(menuIconContainer).toHaveClass('w-8 h-8 flex items-center justify-center text-black');
    
    // Check if the menu icon is inside the button
    const menuIcon = screen.getByTestId('mock-menu-icon');
    expect(menuIcon).toBeInTheDocument();
  });
  
  it('renders search button', () => {
    render(<Header />);
    
    // Check if search button is rendered
    const searchButton = screen.getByText('Search');
    expect(searchButton).toBeInTheDocument();
    expect(searchButton).toHaveAttribute('href', '/search');
  });
  
  it('renders mobile menu content', () => {
    render(<Header />);
    
    // Check if mobile menu content is rendered
    const sheetContent = screen.getByTestId('mock-sheet-content');
    expect(sheetContent).toBeInTheDocument();
    expect(sheetContent).toHaveAttribute('data-side', 'left');
    
    // Check if mobile menu has the correct title
    const sheetTitle = screen.getByTestId('mock-sheet-title');
    expect(sheetTitle).toHaveTextContent('JATIN JEWELLERS');
  });
  
  it('has the correct accessibility attributes', () => {
    render(<Header />);
    
    // Check if header has the correct role
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    // Check if header has the correct classes
    expect(header).toHaveClass('sticky top-0 z-50 bg-white border-b border-gray-200');
    
    // Check if sheet description has the correct accessibility text
    const sheetDescription = screen.getByTestId('mock-sheet-description');
    expect(sheetDescription).toHaveClass('sr-only');
    expect(sheetDescription).toHaveTextContent('Navigation menu for mobile devices with search and category links');
  });
}); 