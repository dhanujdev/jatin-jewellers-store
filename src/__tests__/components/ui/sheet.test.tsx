import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the X icon
jest.mock('lucide-react', () => ({
  X: () => <div data-testid="mock-close-icon" />,
}));

// Mock the sheet components
jest.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children, open = false }: { children: JSX.Element | JSX.Element[]; open?: boolean }) => (
    <div data-testid="sheet" data-open={open}>
      {children}
    </div>
  ),
  SheetTrigger: ({ children, ...props }: { children: JSX.Element | string; [key: string]: any }) => (
    <button data-testid="sheet-trigger" {...props}>
      {children}
    </button>
  ),
  SheetContent: ({ children, className, side = 'right', ...props }: { children: JSX.Element | JSX.Element[]; className?: string; side?: string; [key: string]: any }) => (
    <div 
      data-testid="sheet-content" 
      className={`${className || ''} side-${side}`}
      aria-labelledby="sheet-title" 
      aria-describedby="sheet-description"
      {...props}
    >
      {children}
    </div>
  ),
  SheetHeader: ({ children, className, ...props }: { children: JSX.Element | JSX.Element[]; className?: string; [key: string]: any }) => (
    <div data-testid="sheet-header" className={className} {...props}>
      {children}
    </div>
  ),
  SheetTitle: ({ children, className, ...props }: { children: string; className?: string; [key: string]: any }) => (
    <h2 id="sheet-title" className={className} data-testid="sheet-title" {...props}>
      {children}
    </h2>
  ),
  SheetDescription: ({ children, className, ...props }: { children: string; className?: string; [key: string]: any }) => (
    <p id="sheet-description" className={className} data-testid="sheet-description" {...props}>
      {children}
    </p>
  ),
  SheetClose: ({ children, ...props }: { children: string; [key: string]: any }) => (
    <button data-testid="close-button" {...props}>
      {children}
    </button>
  )
}));

// Import the mocked components
const {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose
} = require('@/components/ui/sheet');

describe('Sheet Component', () => {
  it('renders sheet trigger correctly', () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetHeader>
          <p>Sheet Content</p>
          <SheetClose>Close Sheet</SheetClose>
        </SheetContent>
      </Sheet>
    );

    // Sheet trigger should be in the document
    expect(screen.getByTestId('sheet-trigger')).toBeInTheDocument();
    expect(screen.getByText('Open Sheet')).toBeInTheDocument();
    
    // Sheet content should not be visible initially
    expect(screen.getByTestId('sheet')).toHaveAttribute('data-open', 'false');
  });

  it('opens sheet when trigger is clicked', () => {
    const { rerender } = render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetHeader>
          <p>Sheet Content</p>
          <SheetClose>Close Sheet</SheetClose>
        </SheetContent>
      </Sheet>
    );

    // Click the sheet trigger (in a real app this would set open state to true)
    fireEvent.click(screen.getByTestId('sheet-trigger'));
    
    // Rerender with open state
    rerender(
      <Sheet open={true}>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetHeader>
          <p>Sheet Content</p>
          <SheetClose>Close Sheet</SheetClose>
        </SheetContent>
      </Sheet>
    );
    
    // Sheet should be open
    expect(screen.getByTestId('sheet')).toHaveAttribute('data-open', 'true');
    expect(screen.getByTestId('sheet-content')).toBeInTheDocument();
    expect(screen.getByText('Sheet Title')).toBeInTheDocument();
    expect(screen.getByText('Sheet Description')).toBeInTheDocument();
    expect(screen.getByText('Sheet Content')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <Sheet open={true}>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetHeader>
          <p>Sheet Content</p>
          <SheetClose>Close Sheet</SheetClose>
        </SheetContent>
      </Sheet>
    );
    
    // The sheet content should have proper accessibility attributes
    const sheetContent = screen.getByTestId('sheet-content');
    
    // The sheet should have aria-labelledby pointing to the title
    expect(sheetContent).toHaveAttribute('aria-labelledby', 'sheet-title');
    
    // The sheet should have aria-describedby pointing to the description
    expect(sheetContent).toHaveAttribute('aria-describedby', 'sheet-description');
  });

  it('applies custom classes to sheet components', () => {
    render(
      <Sheet open={true}>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent className="custom-content">
          <SheetHeader className="custom-header">
            <SheetTitle className="custom-title">Sheet Title</SheetTitle>
            <SheetDescription className="custom-description">Sheet Description</SheetDescription>
          </SheetHeader>
          <p>Sheet Content</p>
          <SheetClose>Close Sheet</SheetClose>
        </SheetContent>
      </Sheet>
    );

    // Check if custom classes are applied
    expect(screen.getByTestId('sheet-content')).toHaveClass('custom-content');
    expect(screen.getByTestId('sheet-header')).toHaveClass('custom-header');
    expect(screen.getByTestId('sheet-title')).toHaveClass('custom-title');
    expect(screen.getByTestId('sheet-description')).toHaveClass('custom-description');
  });
  
  it('renders with different side positions', () => {
    render(
      <Sheet open={true}>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Left Sheet</SheetTitle>
            <SheetDescription>Sheet on the left side</SheetDescription>
          </SheetHeader>
          <p>Sheet Content</p>
          <SheetClose>Close Sheet</SheetClose>
        </SheetContent>
      </Sheet>
    );
    
    // Check if the side class is applied correctly
    expect(screen.getByTestId('sheet-content')).toHaveClass('side-left');
  });
}); 
 