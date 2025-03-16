import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

// Mock Radix UI Dialog primitive to avoid actual DOM rendering issues in tests
jest.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children }: { children: JSX.Element | JSX.Element[] }) => <div data-testid="dialog-root">{children}</div>,
  Trigger: ({ children }: { children: JSX.Element | JSX.Element[] | string }) => <button data-testid="dialog-trigger">{children}</button>,
  Portal: ({ children }: { children: JSX.Element | JSX.Element[] }) => <div data-testid="dialog-portal">{children}</div>,
  Overlay: jest.fn().mockImplementation(({ children }) => <div data-testid="dialog-overlay">{children}</div>),
  Content: jest.fn().mockImplementation(({ children }) => <div data-testid="dialog-content">{children}</div>),
  Title: jest.fn().mockImplementation(({ children }) => <h2 data-testid="dialog-title">{children}</h2>),
  Description: jest.fn().mockImplementation(({ children }) => <p data-testid="dialog-description">{children}</p>),
  Close: ({ children }: { children: JSX.Element | JSX.Element[] | string }) => <button data-testid="dialog-close">{children}</button>,
}));

// Mock the X icon from lucide-react
jest.mock('lucide-react', () => ({
  X: () => <span data-testid="x-icon">X</span>,
}));

describe('Dialog Component', () => {
  it('exports all necessary components', () => {
    // This test simply verifies that all components are exported
    expect(Dialog).toBeDefined();
    expect(DialogTrigger).toBeDefined();
    expect(DialogContent).toBeDefined();
    expect(DialogTitle).toBeDefined();
    expect(DialogDescription).toBeDefined();
    expect(DialogClose).toBeDefined();
  });

  it('renders dialog trigger correctly', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
      </Dialog>
    );
    
    expect(screen.getByTestId('dialog-trigger')).toBeInTheDocument();
    expect(screen.getByText('Open Dialog')).toBeInTheDocument();
  });

  it('renders dialog content with title and description', () => {
    // Note: In a real scenario, DialogContent would be rendered in a portal
    // For testing purposes, we're mocking the portal behavior
    render(
      <DialogContent>
        <DialogTitle>Test Title</DialogTitle>
        <DialogDescription>Test Description</DialogDescription>
      </DialogContent>
    );
    
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-title')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-description')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(
      <DialogClose>Close Dialog</DialogClose>
    );
    
    expect(screen.getByTestId('dialog-close')).toBeInTheDocument();
    expect(screen.getByText('Close Dialog')).toBeInTheDocument();
  });
}); 