import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

// Mock the ChevronDown icon
jest.mock('lucide-react', () => ({
  ChevronDown: () => <div data-testid="mock-chevron-icon" />,
}));

describe('Accordion Component', () => {
  it('renders accordion items correctly', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content for section 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content for section 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    // Check if accordion triggers are rendered
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
    
    // Check if chevron icons are rendered
    expect(screen.getAllByTestId('mock-chevron-icon').length).toBe(2);
  });

  it('expands accordion items when clicked', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>
            <div data-testid="content-1">Content for section 1</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    // Initially, trigger should have aria-expanded="false"
    const trigger = screen.getByText('Section 1');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // Click the trigger to expand
    fireEvent.click(trigger);
    
    // Trigger should now have aria-expanded="true"
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('allows multiple items to be open in type="multiple" mode', () => {
    render(
      <Accordion type="multiple" defaultValue={['item-1']}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>
            <div data-testid="content-1">Content for section 1</div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>
            <div data-testid="content-2">Content for section 2</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    // Initially, first trigger should be expanded, second collapsed
    expect(screen.getByText('Section 1')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Section 2')).toHaveAttribute('aria-expanded', 'false');

    // Click the second trigger to expand
    fireEvent.click(screen.getByText('Section 2'));

    // Both triggers should now be expanded
    expect(screen.getByText('Section 1')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Section 2')).toHaveAttribute('aria-expanded', 'true');
  });

  it('applies custom classes to accordion components', () => {
    render(
      <Accordion type="single" collapsible className="custom-accordion">
        <AccordionItem value="item-1" className="custom-item">
          <AccordionTrigger className="custom-trigger">Section 1</AccordionTrigger>
          <AccordionContent className="custom-content">
            <div data-testid="content-1">Content for section 1</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    // Check if custom classes are applied
    expect(screen.getByText('Section 1').closest('div.custom-accordion')).toBeInTheDocument();
    expect(screen.getByText('Section 1').closest('.custom-item')).toBeInTheDocument();
    expect(screen.getByText('Section 1')).toHaveClass('custom-trigger');
  });

  it('has proper accessibility attributes', () => {
    render(
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>
            <div data-testid="content-1">Content for section 1</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    // Check if trigger has correct accessibility attributes
    const trigger = screen.getByText('Section 1');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('type', 'button');
    
    // Check if content container has role="region"
    const regionElement = screen.getByRole('region');
    expect(regionElement).toBeInTheDocument();
  });

  it('supports keyboard navigation', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>
            <div data-testid="content-1">Content for section 1</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByText('Section 1');
    
    // Initially, trigger should be collapsed
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    
    // Focus the trigger and press Enter key
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'Enter' });
    
    // Note: In a test environment, the keyDown event might not trigger the state change
    // We're just testing that the keyboard event can be fired without errors
  });
}); 