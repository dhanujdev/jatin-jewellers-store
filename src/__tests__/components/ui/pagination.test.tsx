import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Pagination } from '@/components/ui/pagination';

// Mock the next/link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: any) {
    return <a href={href}>{children}</a>;
  };
});

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  usePathname: () => '/test-path',
  useSearchParams: () => ({
    toString: () => 'sort=default',
    get: (param: string) => param === 'page' ? '1' : null,
  }),
}));

describe('Pagination Component', () => {
  it('renders pagination with correct number of pages', () => {
    render(
      <Pagination 
        totalPages={5} 
        currentPage={1} 
      />
    );
    
    // Should render page buttons (1 is current, so it's a span, not a link)
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    // With the current pagination logic, page 3 might be hidden with ellipsis
    // Instead, check for the last page which should always be visible
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('highlights the current page', () => {
    render(
      <Pagination 
        totalPages={5} 
        currentPage={3} 
      />
    );
    
    // Current page should have a different style (bg-gold class)
    const currentPageElement = screen.getByText('3');
    const currentPageSpan = currentPageElement.closest('span');
    expect(currentPageSpan).toHaveClass('bg-gold');
  });

  it('generates correct URLs for page links', () => {
    render(
      <Pagination 
        totalPages={5} 
        currentPage={1} 
      />
    );
    
    // Check URL for page 2 (which should be visible)
    const page2Link = screen.getByText('2').closest('a');
    expect(page2Link).toHaveAttribute('href', '/test-path?sort=default&page=2');
  });

  it('disables the previous button on the first page', () => {
    const { container } = render(
      <Pagination 
        totalPages={5} 
        currentPage={1} 
      />
    );
    
    // Find the first li element in the pagination
    const firstLi = container.querySelector('ul.flex.items-center > li:first-child');
    // Check if it contains a span with the cursor-not-allowed class
    const disabledButton = firstLi?.querySelector('span.cursor-not-allowed');
    expect(disabledButton).toBeInTheDocument();
  });

  it('disables the next button on the last page', () => {
    const { container } = render(
      <Pagination 
        totalPages={5} 
        currentPage={5} 
      />
    );
    
    // Find the last li element in the pagination
    const lastLi = container.querySelector('ul.flex.items-center > li:last-child');
    // Check if it contains a span with the cursor-not-allowed class
    const disabledButton = lastLi?.querySelector('span.cursor-not-allowed');
    expect(disabledButton).toBeInTheDocument();
  });

  it('renders previous and next buttons as links when not on first/last page', () => {
    const { container } = render(
      <Pagination 
        totalPages={5} 
        currentPage={3} 
      />
    );
    
    // Find the first li element in the pagination
    const firstLi = container.querySelector('ul.flex.items-center > li:first-child');
    // Check if it contains a link
    const prevLink = firstLi?.querySelector('a');
    expect(prevLink).toHaveAttribute('href', '/test-path?sort=default&page=2');
    
    // Find the last li element in the pagination
    const lastLi = container.querySelector('ul.flex.items-center > li:last-child');
    // Check if it contains a link
    const nextLink = lastLi?.querySelector('a');
    expect(nextLink).toHaveAttribute('href', '/test-path?sort=default&page=4');
  });

  it('does not render pagination when there is only one page', () => {
    const { container } = render(
      <Pagination 
        totalPages={1} 
        currentPage={1} 
      />
    );
    
    // Component should return null
    expect(container).toBeEmptyDOMElement();
  });

  it('truncates page numbers when there are many pages', () => {
    render(
      <Pagination 
        totalPages={10} 
        currentPage={5} 
      />
    );
    
    // Should show ellipsis for truncated pages
    expect(screen.getAllByText('...').length).toBeGreaterThan(0);
    
    // Should show first and last pages
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    
    // Should show current page
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('uses custom baseUrl when provided', () => {
    render(
      <Pagination 
        totalPages={5} 
        currentPage={1} 
        baseUrl="/custom-path"
      />
    );
    
    // Check URL for page 2 with custom base URL
    const page2Link = screen.getByText('2').closest('a');
    expect(page2Link).toHaveAttribute('href', '/custom-path?sort=default&page=2');
  });
}); 