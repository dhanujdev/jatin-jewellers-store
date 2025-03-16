import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

// Mock the embla-carousel-react module
jest.mock('embla-carousel-react', () => {
  const mockScrollPrev = jest.fn();
  const mockScrollNext = jest.fn();
  const mockCanScrollPrev = jest.fn().mockReturnValue(true);
  const mockCanScrollNext = jest.fn().mockReturnValue(true);
  const mockOn = jest.fn();
  const mockOff = jest.fn();

  const mockApi = {
    scrollPrev: mockScrollPrev,
    scrollNext: mockScrollNext,
    canScrollPrev: mockCanScrollPrev,
    canScrollNext: mockCanScrollNext,
    on: mockOn,
    off: mockOff,
  };

  return {
    __esModule: true,
    default: jest.fn().mockReturnValue([
      // First element is the ref
      { current: document.createElement('div') },
      // Second element is the API
      mockApi,
    ]),
  };
});

// Mock the button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-testid="mock-button"
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock the arrow icons
jest.mock('lucide-react', () => ({
  ArrowLeft: () => <div data-testid="mock-arrow-left" />,
  ArrowRight: () => <div data-testid="mock-arrow-right" />,
}));

describe('Carousel Component', () => {
  it('renders the carousel with content', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
          <CarouselItem>Slide 3</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    // Check if slides are rendered
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
    expect(screen.getByText('Slide 3')).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );

    // Check if navigation buttons are rendered
    expect(screen.getByText('Previous slide')).toBeInTheDocument();
    expect(screen.getByText('Next slide')).toBeInTheDocument();
  });

  it('handles previous button click', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
      </Carousel>
    );

    // Click the previous button
    const prevButton = screen.getByText('Previous slide').closest('button');
    if (prevButton) {
      fireEvent.click(prevButton);
    }

    // The mock scrollPrev function should have been called
    const mockUseEmblaCarousel = require('embla-carousel-react').default;
    const mockApi = mockUseEmblaCarousel.mock.results[0].value[1];
    expect(mockApi.scrollPrev).toHaveBeenCalled();
  });

  it('handles next button click', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
        <CarouselNext />
      </Carousel>
    );

    // Click the next button
    const nextButton = screen.getByText('Next slide').closest('button');
    if (nextButton) {
      fireEvent.click(nextButton);
    }

    // The mock scrollNext function should have been called
    const mockUseEmblaCarousel = require('embla-carousel-react').default;
    const mockApi = mockUseEmblaCarousel.mock.results[0].value[1];
    expect(mockApi.scrollNext).toHaveBeenCalled();
  });

  it('handles keyboard navigation', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    // Get the carousel element
    const carousel = screen.getByRole('region');

    // Simulate arrow key presses
    fireEvent.keyDown(carousel, { key: 'ArrowLeft' });
    fireEvent.keyDown(carousel, { key: 'ArrowRight' });

    // The mock scroll functions should have been called
    const mockUseEmblaCarousel = require('embla-carousel-react').default;
    const mockApi = mockUseEmblaCarousel.mock.results[0].value[1];
    expect(mockApi.scrollPrev).toHaveBeenCalled();
    expect(mockApi.scrollNext).toHaveBeenCalled();
  });

  it('sets up event listeners on mount', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    // Check if event listeners were set up
    const mockUseEmblaCarousel = require('embla-carousel-react').default;
    const mockApi = mockUseEmblaCarousel.mock.results[0].value[1];
    expect(mockApi.on).toHaveBeenCalledWith('reInit', expect.any(Function));
    expect(mockApi.on).toHaveBeenCalledWith('select', expect.any(Function));
  });

  it('applies correct orientation classes for horizontal layout', () => {
    render(
      <Carousel orientation="horizontal">
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    // Check if the item has the horizontal class
    const item = screen.getByText('Slide 1').closest('div');
    expect(item).toHaveClass('pl-4');
  });

  it('applies correct orientation classes for vertical layout', () => {
    render(
      <Carousel orientation="vertical">
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    // Check if the item has the vertical class
    const item = screen.getByText('Slide 1').closest('div');
    expect(item).toHaveClass('pt-4');
  });

  it('has proper accessibility attributes', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    // Check carousel accessibility attributes
    const carousel = screen.getByRole('region');
    expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');

    // Check slide accessibility attributes
    const slides = screen.getAllByRole('group');
    slides.forEach(slide => {
      expect(slide).toHaveAttribute('aria-roledescription', 'slide');
    });
  });
}); 