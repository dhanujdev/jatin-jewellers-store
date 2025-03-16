import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FaqSection from '@/components/home/FaqSection';

// Mock the Accordion component and its children
jest.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children, type, collapsible }: { children: JSX.Element | JSX.Element[], type: string, collapsible: boolean }) => (
    <div data-testid="mock-accordion" data-type={type} data-collapsible={collapsible.toString()}>
      {children}
    </div>
  ),
  AccordionItem: ({ children, value }: { children: JSX.Element | JSX.Element[], value: string }) => (
    <div data-testid="mock-accordion-item" data-value={value}>
      {children}
    </div>
  ),
  AccordionTrigger: ({ children }: { children: JSX.Element | string }) => (
    <button data-testid="mock-accordion-trigger">
      {children}
    </button>
  ),
  AccordionContent: ({ children }: { children: JSX.Element | JSX.Element[] | string }) => (
    <div data-testid="mock-accordion-content">
      {children}
    </div>
  ),
}));

describe('FaqSection Component', () => {
  it('renders the FAQ section with title and description', () => {
    render(<FaqSection />);
    
    // Check if the section title and description are rendered
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(screen.getByText('Everything you need to know about lab-grown diamonds and our jewelry')).toBeInTheDocument();
  });

  it('renders the accordion component with correct props', () => {
    render(<FaqSection />);
    
    // Check if the accordion is rendered with correct props
    const accordion = screen.getByTestId('mock-accordion');
    expect(accordion).toBeInTheDocument();
    expect(accordion).toHaveAttribute('data-type', 'single');
    expect(accordion).toHaveAttribute('data-collapsible', 'true');
  });

  it('renders multiple FAQ items', () => {
    render(<FaqSection />);
    
    // Check if multiple accordion items are rendered
    const accordionItems = screen.getAllByTestId('mock-accordion-item');
    expect(accordionItems.length).toBeGreaterThan(1);
  });

  it('renders FAQ questions as accordion triggers', () => {
    render(<FaqSection />);
    
    // Check if FAQ questions are rendered as accordion triggers
    const triggers = screen.getAllByTestId('mock-accordion-trigger');
    
    // Check for some expected FAQ questions
    const questionTexts = [
      'What are Lab Grown Diamonds?',
      'Are Lab Grown Diamonds real diamonds?',
      'How do Lab Grown Diamonds compare to natural diamonds?',
      'Are Lab Grown Diamonds graded and certified?',
      'What is your return and exchange policy?'
    ];
    
    questionTexts.forEach(question => {
      expect(screen.getByText(question)).toBeInTheDocument();
    });
  });

  it('renders FAQ answers as accordion content', () => {
    render(<FaqSection />);
    
    // Check if FAQ answers are rendered as accordion content
    const contents = screen.getAllByTestId('mock-accordion-content');
    expect(contents.length).toBeGreaterThan(1);
    
    // Check for some expected FAQ answers
    expect(screen.getByText(/Lab Grown Diamonds are diamonds that are created in a laboratory setting/i)).toBeInTheDocument();
    expect(screen.getByText(/Yes, Lab Grown Diamonds are real diamonds/i)).toBeInTheDocument();
    expect(screen.getByText(/We offer a 15-day return policy for all our products/i)).toBeInTheDocument();
  });

  it('has proper accessibility structure', () => {
    render(<FaqSection />);
    
    // Check if the section has proper heading structure
    const heading = screen.getByRole('heading', { name: 'Frequently Asked Questions' });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-3xl md:text-4xl font-playfair text-center mb-4 text-gray-800');
    
    // Check if the section has proper semantic structure
    const section = screen.getByTestId('mock-accordion').closest('section');
    expect(section).toHaveClass('py-16 bg-white');
  });

  it('renders a "View all FAQs" link', () => {
    render(<FaqSection />);
    
    // Check if the "View all FAQs" link is rendered
    const link = screen.getByText('View all FAQs');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/faqs');
    expect(link.closest('a')).toHaveClass('text-gold-dark hover:text-gold inline-flex items-center font-medium');
  });
}); 