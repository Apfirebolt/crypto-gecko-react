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

});