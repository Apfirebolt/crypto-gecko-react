import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect } from 'vitest';
import HeaderComponent from '../components/Header';

// Wrapper component for Router context
const RouterWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('HeaderComponent', () => {
  // Test 1: Check if the main navigation element is rendered
  it('should render the main navigation element', () => {
    render(
      <RouterWrapper>
        <HeaderComponent />
      </RouterWrapper>
    );
    
    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();
  });

  // Test 2: Check if the brand/logo text is displayed
  it('should display the brand text "Crypto Gecko"', () => {
    render(
      <RouterWrapper>
        <HeaderComponent />
      </RouterWrapper>
    );
    
    const brandText = screen.getByText('Crypto Gecko');
    expect(brandText).toBeInTheDocument();
    expect(brandText).toHaveClass('text-xl', 'text-white', 'font-bold');
  });

  // Test 3: Check if all navigation links are present
  it('should render all navigation links', () => {
    render(
      <RouterWrapper>
        <HeaderComponent />
      </RouterWrapper>
    );
    
    const homeLink = screen.getByRole('link', { name: 'Home' });
    const exchangesLink = screen.getByRole('link', { name: 'Exchanges' });
    const coinsLink = screen.getByRole('link', { name: 'Coins' });
    const trendingLink = screen.getByRole('link', { name: 'Trending Coins' });

    expect(homeLink).toBeInTheDocument();
    expect(exchangesLink).toBeInTheDocument();
    expect(coinsLink).toBeInTheDocument();
    expect(trendingLink).toBeInTheDocument();
  });

  // Test 4: Check if navigation links have correct href attributes
  it('should have correct href attributes for all navigation links', () => {
    render(
      <RouterWrapper>
        <HeaderComponent />
      </RouterWrapper>
    );
    
    const homeLink = screen.getByRole('link', { name: 'Home' });
    const exchangesLink = screen.getByRole('link', { name: 'Exchanges' });
    const coinsLink = screen.getByRole('link', { name: 'Coins' });
    const trendingLink = screen.getByRole('link', { name: 'Trending Coins' });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(exchangesLink).toHaveAttribute('href', '/exchanges');
    expect(coinsLink).toHaveAttribute('href', '/coins');
    expect(trendingLink).toHaveAttribute('href', '/trending');
  });

  // Test 5: Check if mobile menu toggle button is present
  it('should render the mobile menu toggle button', () => {
    render(
      <RouterWrapper>
        <HeaderComponent />
      </RouterWrapper>
    );
    
    const mobileToggle = screen.getByRole('button');
    expect(mobileToggle).toBeInTheDocument();
    expect(mobileToggle).toHaveAttribute('data-collapse-toggle', 'navbar-default');
  });

  // Test 6: Check if mobile menu button has correct accessibility attributes
  it('should have proper accessibility attributes for mobile menu button', () => {
    render(
      <RouterWrapper>
        <HeaderComponent />
      </RouterWrapper>
    );
    
    const mobileToggle = screen.getByRole('button');
    expect(mobileToggle).toHaveAttribute('aria-controls', 'navbar-default');
    expect(mobileToggle).toHaveAttribute('aria-expanded', 'false');
    
    const srText = screen.getByText('Open main menu');
    expect(srText).toHaveClass('sr-only');
  });

  // Test 7: Check if the mobile menu toggle button contains the hamburger icon
  it('should render the hamburger icon in mobile menu button', () => {
    render(
      <RouterWrapper>
        <HeaderComponent />
      </RouterWrapper>
    );
    
    const svgIcon = screen.getByRole('button').querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
    expect(svgIcon).toHaveClass('w-6', 'h-6');
    expect(svgIcon).toHaveAttribute('viewBox', '0 0 20 20');
  });

  // Test 8: Check if the navigation menu is hidden by default on mobile
  it('should have navigation menu hidden by default on mobile', () => {
    render(
      <RouterWrapper>
        <HeaderComponent />
      </RouterWrapper>
    );
    
    const navMenu = screen.getByRole('list');
    const navMenuContainer = navMenu.parentElement;
    expect(navMenuContainer).toHaveClass('hidden');
    expect(navMenuContainer).toHaveAttribute('id', 'navbar-default');
  });

  // Test 9: Check if the component has proper CSS classes for styling
  it('should have correct CSS classes for styling', () => {
    render(
      <RouterWrapper>
        <HeaderComponent />
      </RouterWrapper>
    );
    
    const navElement = screen.getByRole('navigation');
    expect(navElement).toHaveClass('bg-neutral-700');
    
    const container = screen.getByText('Crypto Gecko').parentElement;
    expect(container).toHaveClass('container', 'flex', 'flex-wrap', 'justify-between', 'items-center', 'mx-auto');
  });

  // Test 10: Check mobile menu button click interaction
  it('should handle mobile menu button click', () => {
    render(
      <RouterWrapper>
        <HeaderComponent />
      </RouterWrapper>
    );
    
    const mobileToggle = screen.getByRole('button');
    
    // Click the button
    fireEvent.click(mobileToggle);
    
    // The button should still be in the document after click
    expect(mobileToggle).toBeInTheDocument();
  });
});