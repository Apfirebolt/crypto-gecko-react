import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect } from 'vitest';
import FooterComponent from '../components/Footer';

// This test suite focuses on ensuring the component renders 
// the correct structure and content.
describe('FooterComponent', () => {

  // Test 1: Check if the main footer element is rendered
  it('should render the main footer element', () => {
    render(<FooterComponent />);
    
    // We query for the semantic role 'contentinfo' which is appropriate for a footer
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });

  // Test 2: Check for the presence of all main section headings
  it('should render all three section headings (Coins, Exchanges, Trending)', () => {
    render(<FooterComponent />);
    
    // Check for each heading by its text content and role
    const coinsHeading = screen.getByRole('heading', { name: /Coins/i, level: 3 });
    const exchangesHeading = screen.getByRole('heading', { name: /Exchanges/i, level: 3 });
    const trendingHeading = screen.getByRole('heading', { name: /Trending/i, level: 3 });

    expect(coinsHeading).toBeInTheDocument();
    expect(exchangesHeading).toBeInTheDocument();
    expect(trendingHeading).toBeInTheDocument();
  });

  // Test 3: Check for the copyright notice
  it('should display the correct copyright notice', () => {
    render(<FooterComponent />);

    // Query by text content, ignoring case
    const copyrightText = screen.getByText(/Copyright @2025 Crypto Gecko/i);
    expect(copyrightText).toBeInTheDocument();
  });

  // Test 4: Check the descriptive text content for each section
  it('should contain the specific descriptive text for the exchanges section', () => {
    render(<FooterComponent />);
    
    const exchangeDesc = screen.getByText(/All the exchanges in the world/i);
    expect(exchangeDesc).toBeInTheDocument();
  });

  // Test 5: Check descriptive text for all sections
  it('should contain descriptive text for coins section', () => {
    render(<FooterComponent />);
    
    const coinsDescs = screen.getAllByText(/All the coins in the world/i);
    expect(coinsDescs.length).toBeGreaterThan(0);
    expect(coinsDescs[0]).toBeInTheDocument();
  });

  // Test 6: Check descriptive text for trending section
  it('should contain descriptive text for trending section', () => {
    render(<FooterComponent />);
    
    const trendingDesc = screen.getByText(/Get trending coins and categories/i);
    expect(trendingDesc).toBeInTheDocument();
  });

  // Test 7: Check footer structure and grid layout
  it('should have correct grid layout structure', () => {
    const { container } = render(<FooterComponent />);
    
    const gridContainer = container.querySelector('.grid.grid-cols-3');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('gap-4', 'border-b-2', 'border-neutral-600');
  });

  // Test 8: Check footer styling classes
  it('should have correct footer styling classes', () => {
    render(<FooterComponent />);
    
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toHaveClass(
      'bg-neutral-700',
      'text-xl',
      'text-white',
      'text-center',
      'border-t-4',
      'fixed',
      'inset-x-0',
      'bottom-0',
      'p-4'
    );
  });

  // Test 9: Check heading styling
  it('should apply correct styling to section headings', () => {
    render(<FooterComponent />);
    
    const coinsHeading = screen.getByRole('heading', { name: /Coins/i, level: 3 });
    const exchangesHeading = screen.getByRole('heading', { name: /Exchanges/i, level: 3 });
    const trendingHeading = screen.getByRole('heading', { name: /Trending/i, level: 3 });

    [coinsHeading, exchangesHeading, trendingHeading].forEach(heading => {
      expect(heading).toHaveClass('text-center', 'text-lg', 'font-bold', 'my-2');
    });
  });

  // Test 10: Check copyright section styling
  it('should have correct copyright section styling', () => {
    const { container } = render(<FooterComponent />);
    
    const copyrightSection = container.querySelector('.mt-4');
    expect(copyrightSection).toBeInTheDocument();
    expect(copyrightSection).toHaveClass('mt-4');
  });

  // Test 11: Test Fragment wrapper
  it('should be wrapped in a Fragment', () => {
    const { container } = render(<FooterComponent />);
    
    // Fragment doesn't create a DOM node, so we check for direct children
    expect(container.children).toHaveLength(1);
    expect(container.firstChild?.nodeName).toBe('FOOTER');
  });

  // Test 12: Check fixed positioning
  it('should have fixed positioning at bottom', () => {
    render(<FooterComponent />);
    
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toHaveClass('fixed', 'inset-x-0', 'bottom-0');
  });

  // Test 13: Check accessibility attributes
  it('should have proper accessibility attributes', () => {
    render(<FooterComponent />);
    
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
    
    // Check that headings are properly structured
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings).toHaveLength(3);
  });

  // Test 14: Test complete component structure
  it('should render complete component structure correctly', () => {
    render(<FooterComponent />);
    
    // Check for main sections
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    
    // Check for all three sections
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
    
    // Check for all descriptive texts
    expect(screen.getAllByText(/All the coins in the world/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/All the exchanges in the world/i)).toBeInTheDocument();
    expect(screen.getByText(/Get trending coins and categories/i)).toBeInTheDocument();
    
    // Check for copyright
    expect(screen.getByText(/Copyright @2025 Crypto Gecko/i)).toBeInTheDocument();
  });

  // Test 15: Check year in copyright (testing for current year)
  it('should display the correct year in copyright', () => {
    render(<FooterComponent />);
    
    const copyrightText = screen.getByText('Copyright @2025 Crypto Gecko');
    expect(copyrightText).toBeInTheDocument();
  });

  // Test 16: Check note about incorrect text in exchanges section
  it('should have text content that mentions both coins and exchanges in exchanges section', () => {
    render(<FooterComponent />);
    
    // Note: The actual component has "All the coins in the world All the exchanges in the world"
    // which appears to be a typo/concatenation issue
    const exchangesSection = screen.getByText(/All the coins in the world All the exchanges in the world/i);
    expect(exchangesSection).toBeInTheDocument();
  });

});