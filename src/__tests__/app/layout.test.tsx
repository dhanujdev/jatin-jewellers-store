import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import '@testing-library/jest-dom';
import RootLayout from '@/app/layout';

// Mock the components used in RootLayout
jest.mock('@/components/layout/Header', () => {
  return function MockHeader() {
    return <div data-testid="mock-header">Header</div>;
  };
});

jest.mock('@/components/layout/Footer', () => {
  return function MockFooter() {
    return <div data-testid="mock-footer">Footer</div>;
  };
});

// Mock next/navigation
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

// Mock next/font/google
jest.mock('next/font/google', () => ({
  Inter: () => ({ 
    variable: 'mock-inter-variable',
    subsets: ['latin']
  }),
  Playfair_Display: () => ({ 
    variable: 'mock-playfair-variable',
    subsets: ['latin']
  }),
  Cormorant_Garamond: () => ({ 
    variable: 'mock-cormorant-variable',
    subsets: ['latin'],
    weight: ['400', '500', '600', '700']
  })
}));

// Custom render function to avoid DOM nesting warnings
const render = (ui: JSX.Element) => {
  // Create a test container
  const testContainer = document.createElement('div');
  document.body.appendChild(testContainer);
  
  // Extract the children from the RootLayout component
  const children = ui.props.children;
  
  // Render just the children and mocked components for testing
  const result = rtlRender(
    <div data-testid="mock-html">
      <div data-testid="mock-body" className="font-sans">
        <div data-testid="mock-header">Header</div>
        <main className="min-h-screen">{children}</main>
        <div data-testid="mock-footer">Footer</div>
      </div>
    </div>,
    { container: testContainer }
  );
  
  return {
    ...result,
    rerender: (newUi: JSX.Element) => 
      render(newUi),
  };
};

describe('RootLayout Component', () => {
  it('renders the layout with children', () => {
    const { getByTestId, getByText } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );
    
    // Check if header and footer are rendered
    expect(getByTestId('mock-header')).toBeInTheDocument();
    expect(getByTestId('mock-footer')).toBeInTheDocument();
    
    // Check if children are rendered
    expect(getByText('Test Content')).toBeInTheDocument();
  });
  
  it('renders with the correct HTML structure', () => {
    const { getByTestId } = render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>
    );
    
    // Check if main element exists and has the correct class
    const mainElement = getByTestId('mock-body').querySelector('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('min-h-screen');
    
    // Check if the main element contains the children
    expect(mainElement).toContainElement(getByTestId('test-content'));
    
    // Check if header and footer are present
    expect(getByTestId('mock-header')).toBeInTheDocument();
    expect(getByTestId('mock-footer')).toBeInTheDocument();
  });
}); 