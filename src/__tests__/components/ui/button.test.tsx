import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button, buttonVariants } from '@/components/ui/button';
import { Slot } from '@radix-ui/react-slot';

// Mock the Slot component from Radix UI
jest.mock('@radix-ui/react-slot', () => ({
  Slot: jest.fn(({ children, ...props }) => (
    <div data-testid="slot-component" {...props}>
      {children}
    </div>
  )),
}));

describe('Button Component', () => {
  it('renders a button element by default', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('applies default variant and size classes', () => {
    render(<Button>Default Button</Button>);
    
    const button = screen.getByRole('button', { name: 'Default Button' });
    
    // Check for default variant classes
    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('text-primary-foreground');
    
    // Check for default size classes
    expect(button).toHaveClass('h-9');
    expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('py-2');
  });

  it('applies the destructive variant classes', () => {
    render(<Button variant="destructive">Destructive Button</Button>);
    
    const button = screen.getByRole('button', { name: 'Destructive Button' });
    
    // Check for destructive variant classes
    expect(button).toHaveClass('bg-destructive');
    expect(button).toHaveClass('text-destructive-foreground');
  });

  it('applies the outline variant classes', () => {
    render(<Button variant="outline">Outline Button</Button>);
    
    const button = screen.getByRole('button', { name: 'Outline Button' });
    
    // Check for outline variant classes
    expect(button).toHaveClass('border');
    expect(button).toHaveClass('border-input');
    expect(button).toHaveClass('bg-background');
  });

  it('applies the secondary variant classes', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    
    const button = screen.getByRole('button', { name: 'Secondary Button' });
    
    // Check for secondary variant classes
    expect(button).toHaveClass('bg-secondary');
    expect(button).toHaveClass('text-secondary-foreground');
  });

  it('applies the ghost variant classes', () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    
    const button = screen.getByRole('button', { name: 'Ghost Button' });
    
    // Check for ghost variant classes
    expect(button).toHaveClass('hover:bg-accent');
    expect(button).toHaveClass('hover:text-accent-foreground');
  });

  it('applies the link variant classes', () => {
    render(<Button variant="link">Link Button</Button>);
    
    const button = screen.getByRole('button', { name: 'Link Button' });
    
    // Check for link variant classes
    expect(button).toHaveClass('text-primary');
    expect(button).toHaveClass('hover:underline');
  });

  it('applies small size classes', () => {
    render(<Button size="sm">Small Button</Button>);
    
    const button = screen.getByRole('button', { name: 'Small Button' });
    
    // Check for small size classes
    expect(button).toHaveClass('h-8');
    expect(button).toHaveClass('px-3');
    expect(button).toHaveClass('text-xs');
  });

  it('applies large size classes', () => {
    render(<Button size="lg">Large Button</Button>);
    
    const button = screen.getByRole('button', { name: 'Large Button' });
    
    // Check for large size classes
    expect(button).toHaveClass('h-10');
    expect(button).toHaveClass('px-8');
  });

  it('applies icon size classes', () => {
    render(<Button size="icon">Icon</Button>);
    
    const button = screen.getByRole('button', { name: 'Icon' });
    
    // Check for icon size classes
    expect(button).toHaveClass('h-9');
    expect(button).toHaveClass('w-9');
  });

  it('renders as a Slot component when asChild is true', () => {
    render(<Button asChild>Slot Button</Button>);
    
    // Check that the Slot component was rendered
    expect(screen.getByTestId('slot-component')).toBeInTheDocument();
    expect(screen.getByTestId('slot-component')).toHaveTextContent('Slot Button');
    
    // Verify that Slot was called
    expect(Slot).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    
    const button = screen.getByRole('button', { name: 'Custom Button' });
    
    // Check for custom class
    expect(button).toHaveClass('custom-class');
  });

  it('passes additional props to the button element', () => {
    render(<Button disabled aria-label="Disabled Button">Disabled</Button>);
    
    const button = screen.getByRole('button', { name: 'Disabled Button' });
    
    // Check for disabled attribute
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-label', 'Disabled Button');
  });
}); 