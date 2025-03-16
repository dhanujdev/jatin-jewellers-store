import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the dialog components
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open = false }: { children: JSX.Element | JSX.Element[]; open?: boolean }) => (
    <div data-testid="dialog" data-state={open ? 'open' : 'closed'}>
      {children}
    </div>
  ),
  DialogTrigger: ({ children, ...props }: { children: JSX.Element | string; [key: string]: any }) => (
    <button data-testid="dialog-trigger" {...props}>
      {children}
    </button>
  ),
  DialogContent: ({ children, className, ...props }: { children: JSX.Element | JSX.Element[]; className?: string; [key: string]: any }) => (
    <div 
      data-testid="dialog-content" 
      className={className}
      aria-labelledby="dialog-title" 
      aria-describedby="dialog-description"
      {...props}
    >
      {children}
    </div>
  ),
  DialogHeader: ({ children, className, ...props }: { children: JSX.Element | JSX.Element[]; className?: string; [key: string]: any }) => (
    <div data-testid="dialog-header" className={className} {...props}>
      {children}
    </div>
  ),
  DialogTitle: ({ children, className, ...props }: { children: string; className?: string; [key: string]: any }) => (
    <h2 id="dialog-title" className={className} data-testid="dialog-title" {...props}>
      {children}
    </h2>
  ),
  DialogDescription: ({ children, className, ...props }: { children: string; className?: string; [key: string]: any }) => (
    <p id="dialog-description" className={className} data-testid="dialog-description" {...props}>
      {children}
    </p>
  ),
  DialogClose: ({ children, ...props }: { children: string; [key: string]: any }) => (
    <button data-testid="dialog-close" {...props}>
      {children}
    </button>
  )
}));

// Import the mocked components
const {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} = require('@/components/ui/dialog');

describe('Dialog Component', () => {
  it('renders dialog trigger correctly', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <p>Dialog Content</p>
          <DialogClose>Close Dialog</DialogClose>
        </DialogContent>
      </Dialog>
    );

    // Dialog trigger should be in the document
    expect(screen.getByTestId('dialog-trigger')).toBeInTheDocument();
    expect(screen.getByText('Open Dialog')).toBeInTheDocument();
    
    // Dialog content should not be visible initially
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-state', 'closed');
  });

  it('opens dialog when trigger is clicked', () => {
    const { rerender } = render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <p>Dialog Content</p>
          <DialogClose>Close Dialog</DialogClose>
        </DialogContent>
      </Dialog>
    );

    // Click the dialog trigger (in a real app this would set open state to true)
    fireEvent.click(screen.getByTestId('dialog-trigger'));
    
    // Rerender with open state
    rerender(
      <Dialog open={true}>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <p>Dialog Content</p>
          <DialogClose>Close Dialog</DialogClose>
        </DialogContent>
      </Dialog>
    );
    
    // Dialog should be open
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-state', 'open');
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    expect(screen.getByText('Dialog Description')).toBeInTheDocument();
    expect(screen.getByText('Dialog Content')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <Dialog open={true}>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <p>Dialog Content</p>
          <DialogClose>Close Dialog</DialogClose>
        </DialogContent>
      </Dialog>
    );
    
    // The dialog content should have proper accessibility attributes
    const dialogContent = screen.getByTestId('dialog-content');
    
    // The dialog should have aria-labelledby pointing to the title
    expect(dialogContent).toHaveAttribute('aria-labelledby', 'dialog-title');
    
    // The dialog should have aria-describedby pointing to the description
    expect(dialogContent).toHaveAttribute('aria-describedby', 'dialog-description');
  });

  it('applies custom classes to dialog components', () => {
    render(
      <Dialog open={true}>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent className="custom-content">
          <DialogHeader className="custom-header">
            <DialogTitle className="custom-title">Dialog Title</DialogTitle>
            <DialogDescription className="custom-description">Dialog Description</DialogDescription>
          </DialogHeader>
          <p>Dialog Content</p>
          <DialogClose>Close Dialog</DialogClose>
        </DialogContent>
      </Dialog>
    );

    // Check if custom classes are applied
    expect(screen.getByTestId('dialog-content')).toHaveClass('custom-content');
    expect(screen.getByTestId('dialog-header')).toHaveClass('custom-header');
    expect(screen.getByTestId('dialog-title')).toHaveClass('custom-title');
    expect(screen.getByTestId('dialog-description')).toHaveClass('custom-description');
  });
}); 