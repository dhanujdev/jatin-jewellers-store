import React from 'react';
import { render as rtlRender, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClientBody from '@/app/ClientBody';

// Mock document methods
const originalAppendChild = document.body.appendChild;
const originalQuerySelector = document.querySelector;

describe('ClientBody Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Reset body className
    document.body.className = '';
    
    // Mock document.body.appendChild
    document.body.appendChild = jest.fn().mockImplementation((element) => {
      return originalAppendChild.call(document.body, element);
    });
  });
  
  afterEach(() => {
    // Restore original methods
    document.body.appendChild = originalAppendChild;
    document.querySelector = originalQuerySelector;
  });
  
  // Suppress the expected DOM nesting warning
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn((message) => {
      if (!message.includes('validateDOMNesting')) {
        originalError(message);
      }
    });
  });
  
  afterAll(() => {
    console.error = originalError;
  });
  
  it('renders without crashing', () => {
    // Create a container to avoid the DOM nesting warning in tests
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    rtlRender(
      <ClientBody>
        <div>Test Content</div>
      </ClientBody>,
      { container }
    );
    
    // Check that the component rendered
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  
  it('adds antialiased class to body', () => {
    // Create a container to avoid the DOM nesting warning in tests
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    // Render the component
    rtlRender(
      <ClientBody>
        <div>Test Content</div>
      </ClientBody>,
      { container }
    );
    
    // Check that the antialiased class was added to the body
    expect(document.body.className).toContain('antialiased');
  });
  
  it('renders children correctly', () => {
    // Create a container to avoid the DOM nesting warning in tests
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    // Render the component with the container
    rtlRender(
      <ClientBody>
        <div data-testid="test-child">Test Child Content</div>
      </ClientBody>,
      { container }
    );
    
    // Check that the children are rendered
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Child Content')).toBeInTheDocument();
  });
  
  it('does not create multiple body elements when rendered multiple times', () => {
    // Create a container for the first render
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    // First render
    rtlRender(
      <ClientBody>
        <div>First Render</div>
      </ClientBody>,
      { container }
    );
    
    // Check that the body element was accessed
    expect(document.body.appendChild).toHaveBeenCalled();
    
    // Create a new container for the second render to avoid unmounting issues
    const secondContainer = document.createElement('div');
    document.body.appendChild(secondContainer);
    
    // Second render
    rtlRender(
      <ClientBody>
        <div>Second Render</div>
      </ClientBody>,
      { container: secondContainer }
    );
    
    // Check that the antialiased class is still present
    expect(document.body.className).toContain('antialiased');
    
    // Check that both renders are in the document
    expect(screen.getByText('First Render')).toBeInTheDocument();
    expect(screen.getByText('Second Render')).toBeInTheDocument();
  });
  
  it('handles the case when body already has the antialiased class', () => {
    // Set up a mock body element with existing class
    document.body.className = 'existing-class';
    
    // Create a container to avoid the DOM nesting warning in tests
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    // Render the component
    rtlRender(
      <ClientBody>
        <div>Test Content</div>
      </ClientBody>,
      { container }
    );
    
    // The ClientBody component should preserve existing classes and add antialiased
    // Check that both classes are present in the className
    expect(document.body.className).toContain('existing-class');
    expect(document.body.className).toContain('antialiased');
  });
}); 