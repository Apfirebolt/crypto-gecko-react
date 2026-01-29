import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect } from 'vitest';
import LoaderComponent from '../components/Loader';

describe('LoaderComponent', () => {
  // Test 1: Check if the loader container is rendered
  it('should render the loader container', () => {
    const { container } = render(<LoaderComponent />);
    
    const loaderContainer = container.querySelector('.flex.justify-center.items-center.h-screen');
    expect(loaderContainer).toBeInTheDocument();
  });

  // Test 2: Check if the loader has correct styling classes for centering
  it('should have correct CSS classes for centering', () => {
    const { container } = render(<LoaderComponent />);
    
    const loaderContainer = container.querySelector('.flex.justify-center.items-center.h-screen') as HTMLElement;
    expect(loaderContainer).toHaveClass('flex', 'justify-center', 'items-center', 'h-screen');
  });

  // Test 3: Check if the spinner element is present
  it('should render the spinning element', () => {
    const { container } = render(<LoaderComponent />);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  // Test 4: Check if the spinner has correct styling classes
  it('should have correct CSS classes for spinner styling', () => {
    const { container } = render(<LoaderComponent />);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass(
      'animate-spin',
      'rounded-full',
      'h-32',
      'w-32',
      'border-t-4',
      'border-neutral-700'
    );
  });

  // Test 5: Check if the spinner is a div element
  it('should render spinner as a div element', () => {
    const { container } = render(<LoaderComponent />);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner?.tagName).toBe('DIV');
  });

  // Test 6: Check component structure - Fragment wrapper
  it('should be wrapped in a Fragment', () => {
    const { container } = render(<LoaderComponent />);
    
    // Fragment doesn't create a DOM node, so we check for direct children
    expect(container.children).toHaveLength(1);
  });

  // Test 7: Check if the loader takes full screen height
  it('should take full screen height', () => {
    const { container } = render(<LoaderComponent />);
    
    const loaderContainer = container.querySelector('.flex.justify-center.items-center.h-screen') as HTMLElement;
    expect(loaderContainer).toHaveClass('h-screen');
  });

  // Test 8: Check if the loader is properly centered both horizontally and vertically
  it('should center content both horizontally and vertically', () => {
    const { container } = render(<LoaderComponent />);
    
    const loaderContainer = container.querySelector('.flex.justify-center.items-center.h-screen') as HTMLElement;
    expect(loaderContainer).toHaveClass('justify-center', 'items-center');
  });

  // Test 9: Check spinner dimensions
  it('should have correct spinner dimensions (32x32)', () => {
    const { container } = render(<LoaderComponent />);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-32', 'w-32');
  });

  // Test 10: Check if the spinner has border styling for the loading effect
  it('should have border styling for loading animation', () => {
    const { container } = render(<LoaderComponent />);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('border-t-4', 'border-neutral-700', 'rounded-full');
  });
});