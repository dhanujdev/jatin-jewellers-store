import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Newsletter from '@/components/home/Newsletter';

// Mock console.log to verify it's called with the correct email
const originalConsoleLog = console.log;
beforeEach(() => {
  console.log = jest.fn();
});

afterEach(() => {
  console.log = originalConsoleLog;
});

describe('Newsletter Component', () => {
  it('renders the newsletter section with title and description', () => {
    render(<Newsletter />);
    
    // Check if title and description are rendered
    expect(screen.getByText('Join Our Newsletter')).toBeInTheDocument();
    expect(screen.getByText(/Subscribe to receive updates on new collections/i)).toBeInTheDocument();
  });
  
  it('renders the email input field', () => {
    render(<Newsletter />);
    
    // Check if email input is rendered
    const emailInput = screen.getByPlaceholderText('Your email address');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });
  
  it('renders the subscribe button', () => {
    render(<Newsletter />);
    
    // Check if subscribe button is rendered
    const subscribeButton = screen.getByRole('button', { name: 'Subscribe' });
    expect(subscribeButton).toBeInTheDocument();
  });
  
  it('renders privacy policy text', () => {
    render(<Newsletter />);
    
    // Check if privacy policy text is rendered
    expect(screen.getByText(/By subscribing, you agree to our privacy policy/i)).toBeInTheDocument();
  });
  
  it('has the correct styling', () => {
    render(<Newsletter />);
    
    // Check if section has the correct classes
    const section = document.querySelector('section');
    expect(section).toHaveClass('py-16');
    expect(section).toHaveClass('bg-gold-dark');
  });
  
  it('updates email state when typing in the input field', () => {
    render(<Newsletter />);
    
    // Get the email input
    const emailInput = screen.getByPlaceholderText('Your email address') as HTMLInputElement;
    
    // Type in the email input
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    // Check if the input value is updated
    expect(emailInput.value).toBe('test@example.com');
  });
  
  it('shows success message after form submission', () => {
    render(<Newsletter />);
    
    // Get the email input and submit button
    const emailInput = screen.getByPlaceholderText('Your email address');
    const subscribeButton = screen.getByRole('button', { name: 'Subscribe' });
    
    // Type in the email input and submit the form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(subscribeButton);
    
    // Check if the success message is displayed
    expect(screen.getByText('Thank You for Subscribing!')).toBeInTheDocument();
    expect(screen.getByText(/You've been added to our mailing list/i)).toBeInTheDocument();
    
    // Check if the form is no longer displayed
    expect(screen.queryByPlaceholderText('Your email address')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Subscribe' })).not.toBeInTheDocument();
    
    // Verify console.log was called with the correct email
    expect(console.log).toHaveBeenCalledWith('Subscribing email:', 'test@example.com');
  });
  
  it('prevents form submission with empty email', () => {
    render(<Newsletter />);
    
    // Get the submit button
    const subscribeButton = screen.getByRole('button', { name: 'Subscribe' });
    
    // Try to submit the form without entering an email
    fireEvent.click(subscribeButton);
    
    // Check if the form is still displayed (no success message)
    expect(screen.queryByText('Thank You for Subscribing!')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your email address')).toBeInTheDocument();
    
    // Verify console.log was not called
    expect(console.log).not.toHaveBeenCalled();
  });
}); 