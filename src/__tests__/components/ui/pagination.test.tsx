import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Pagination } from '@/components/ui/pagination';

// Mock the next/link component
jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
      <a href={href}>{children}</a>
    ),
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
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    basePath: '/test-path',
    currentSort: 'default',
    totalItems: 50,
    pageSize: 10
  };

  it('renders pagination with correct number of pages', () => {
    render(<Pagination {...defaultProps} />);
    
    // Should render page buttons (1 is current, so it's a span, not a link)
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('highlights the current page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    // Current page should have a different style (bg-gold class)
    const currentPageElement = screen.getByText('3');
    const currentPageSpan = currentPageElement.closest('span');
    expect(currentPageSpan).toHaveClass('bg-gold');
  });

  it('generates correct URLs for page links', () => {
    render(<Pagination {...defaultProps} />);
    
    // Check URL for page 2 (which should be visible)
    const page2Link = screen.getByText('2').closest('a');
    expect(page2Link).toHaveAttribute('href', '/test-path?sort=default&page=2');
  });

  it('disables first and previous buttons on first page', () => {
    render(<Pagination {...defaultProps} />);
    
    const firstPageSpan = screen.getByLabelText('Go to first page').closest('span');
    const prevSpan = screen.getByLabelText('Go to previous page').closest('span');
    
    expect(firstPageSpan).toHaveClass('cursor-not-allowed');
    expect(prevSpan).toHaveClass('cursor-not-allowed');
  });

  it('disables next and last buttons on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    
    const nextSpan = screen.getByLabelText('Go to next page').closest('span');
    const lastSpan = screen.getByLabelText('Go to last page').closest('span');
    
    expect(nextSpan).toHaveClass('cursor-not-allowed');
    expect(lastSpan).toHaveClass('cursor-not-allowed');
  });

  it('shows correct item range', () => {
    render(<Pagination {...defaultProps} currentPage={2} />);
    expect(screen.getByText('Showing 11-20 of 50 items')).toBeInTheDocument();
  });

  it('handles edge case with single page', () => {
    render(
      <Pagination
        {...defaultProps}
        currentPage={1}
        totalPages={1}
        totalItems={5}
        pageSize={10}
      />
    );
    
    // Component should return null for single page
    expect(document.body.textContent).toBe('');
  });

  it('shows navigation links correctly for middle pages', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    const firstPageLink = screen.getByLabelText('Go to first page');
    const prevPageLink = screen.getByLabelText('Go to previous page');
    const nextPageLink = screen.getByLabelText('Go to next page');
    const lastPageLink = screen.getByLabelText('Go to last page');
    
    expect(firstPageLink).toHaveAttribute('href', '/test-path?sort=default&page=1');
    expect(prevPageLink).toHaveAttribute('href', '/test-path?sort=default&page=2');
    expect(nextPageLink).toHaveAttribute('href', '/test-path?sort=default&page=4');
    expect(lastPageLink).toHaveAttribute('href', '/test-path?sort=default&page=5');
  });

  it('does not render pagination when there are no items', () => {
    render(
      <Pagination
        {...defaultProps}
        totalItems={0}
      />
    );
    
    // Component should return null
    expect(document.body.textContent).toBe('');
  });

  it('truncates page numbers when there are many pages', () => {
    render(
      <Pagination
        {...defaultProps}
        currentPage={5}
        totalPages={10}
        totalItems={100}
        pageSize={10}
      />
    );
    
    // Should show ellipsis
    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBeGreaterThan(0);
    
    // Should show first and last pages
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    
    // Should show current page and adjacent pages
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('uses custom basePath when provided', () => {
    render(
      <Pagination
        {...defaultProps}
        basePath="/custom-path"
      />
    );
    
    // Check URL for page 2 with custom base URL
    const page2Link = screen.getByText('2').closest('a');
    expect(page2Link).toHaveAttribute('href', '/custom-path?sort=default&page=2');
  });

  it('shows correct truncation for first few pages', () => {
    render(
      <Pagination
        {...defaultProps}
        currentPage={2}
        totalPages={10}
        totalItems={100}
        pageSize={10}
      />
    );
    
    // Should not show first ellipsis but show last ellipsis
    const ellipses = screen.getAllByText('...');
    expect(ellipses).toHaveLength(1);
    
    // Should show first few pages
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows correct truncation for last few pages', () => {
    render(
      <Pagination
        {...defaultProps}
        currentPage={9}
        totalPages={10}
        totalItems={100}
        pageSize={10}
      />
    );
    
    // Should show first ellipsis but not last ellipsis
    const ellipses = screen.getAllByText('...');
    expect(ellipses).toHaveLength(1);
    
    // Should show last few pages
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });
}); 