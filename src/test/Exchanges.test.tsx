import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import Exchanges from '../screens/Exchanges';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

// Mock Loader component
vi.mock('../components/Loader', () => {
  return {
    default: () => <div data-testid="loader">Loading...</div>
  };
});

const mockExchangesData = [
  {
    id: 'binance',
    name: 'Binance',
    year_established: 2017,
    country: 'Malta',
    description: 'Binance is a global cryptocurrency exchange platform.',
    url: 'https://www.binance.com',
    image: 'https://example.com/binance.png',
    has_trading_incentive: false,
    trust_score: 10,
    trust_score_rank: 1,
    trade_volume_24h_btc: 125000,
    trade_volume_24h_btc_normalized: 120000
  },
  {
    id: 'coinbase-pro',
    name: 'Coinbase Pro',
    year_established: 2012,
    country: 'United States',
    description: 'Coinbase Pro is a trading platform for individual traders and crypto enthusiasts.',
    url: 'https://pro.coinbase.com',
    image: 'https://example.com/coinbase.png',
    has_trading_incentive: false,
    trust_score: 9,
    trust_score_rank: 2,
    trade_volume_24h_btc: 80000,
    trade_volume_24h_btc_normalized: 78000
  }
];

describe('Exchanges Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Test 1: Initial render and loading state
  it('should show loader initially when fetching data', async () => {
    mockedAxios.get.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ data: mockExchangesData }), 100))
    );
    
    render(<Exchanges />);
    
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  // Test 2: Successful data fetch and display
  it('should render exchanges list after successful data fetch', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockExchangesData });
    
    render(<Exchanges />);
    
    await waitFor(() => {
      expect(screen.getByText('Exchanges')).toBeInTheDocument();
      expect(screen.getByText('Binance')).toBeInTheDocument();
      expect(screen.getByText('Coinbase Pro')).toBeInTheDocument();
    });
  });

  // Test 3: Exchange information display
  it('should display exchange information correctly', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockExchangesData });
    
    render(<Exchanges />);
    
    await waitFor(() => {
      expect(screen.getByText('Binance is a global cryptocurrency exchange platform.')).toBeInTheDocument();
      expect(screen.getByText('Country: Malta')).toBeInTheDocument();
      expect(screen.getByText('Year Established: 2017')).toBeInTheDocument();
      expect(screen.getByText('Trust Score: 10')).toBeInTheDocument();
    });
  });

  // Test 4: Exchange images are rendered
  it('should render exchange images with correct attributes', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockExchangesData });
    
    render(<Exchanges />);
    
    await waitFor(() => {
      const binanceImage = screen.getByAltText('Binance');
      const coinbaseImage = screen.getByAltText('Coinbase Pro');
      
      expect(binanceImage).toBeInTheDocument();
      expect(binanceImage).toHaveAttribute('src', 'https://example.com/binance.png');
      expect(coinbaseImage).toBeInTheDocument();
      expect(coinbaseImage).toHaveAttribute('src', 'https://example.com/coinbase.png');
    });
  });

  // Test 5: Exchange links functionality
  it('should render exchange links with correct attributes', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockExchangesData });
    
    render(<Exchanges />);
    
    await waitFor(() => {
      const binanceLink = screen.getByRole('link', { name: 'Binance' });
      const coinbaseLink = screen.getByRole('link', { name: 'Coinbase Pro' });
      
      expect(binanceLink).toHaveAttribute('href', 'https://www.binance.com');
      expect(binanceLink).toHaveAttribute('target', '_blank');
      expect(binanceLink).toHaveAttribute('rel', 'noopener noreferrer');
      
      expect(coinbaseLink).toHaveAttribute('href', 'https://pro.coinbase.com');
      expect(coinbaseLink).toHaveAttribute('target', '_blank');
      expect(coinbaseLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  // Test 6: API call with correct parameters
  it('should make API call with correct parameters', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockExchangesData });
    
    render(<Exchanges />);
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/exchanges',
        { headers: { 'x-cg-pro-api-key': '' } }
      );
    });
  });

  // Test 7: API error handling
  it('should handle API errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
    
    render(<Exchanges />);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching data:', new Error('API Error'));
    });
    
    // Should stop loading even on error
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
    
    consoleErrorSpy.mockRestore();
  });

  // Test 8: Component structure and styling
  it('should have correct component structure and CSS classes', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockExchangesData });
    
    const { container } = render(<Exchanges />);
    
    await waitFor(() => {
      expect(container.firstChild).toHaveClass('min-h-screen', 'bg-primary-300', 'flex', 'items-center', 'justify-center');
      expect(screen.getByText('Exchanges')).toHaveClass('text-2xl', 'font-bold', 'text-center', 'mb-4');
    });
  });

  // Test 9: Exchange link styling
  it('should apply correct styling classes to exchange links', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockExchangesData });
    
    render(<Exchanges />);
    
    await waitFor(() => {
      const binanceLink = screen.getByRole('link', { name: 'Binance' });
      expect(binanceLink).toHaveClass('text-xl', 'my-2', 'hover:underline');
    });
  });

  // Test 10: Empty exchanges array handling
  it('should handle empty exchanges array', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    
    render(<Exchanges />);
    
    await waitFor(() => {
      expect(screen.getByText('Exchanges')).toBeInTheDocument();
      expect(screen.queryByText('Binance')).not.toBeInTheDocument();
      expect(screen.queryByText('Coinbase Pro')).not.toBeInTheDocument();
    });
  });

  // Test 11: Exchange description display
  it('should display exchange descriptions correctly', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockExchangesData });
    
    render(<Exchanges />);
    
    await waitFor(() => {
      expect(screen.getByText('Binance is a global cryptocurrency exchange platform.')).toBeInTheDocument();
      expect(screen.getByText('Coinbase Pro is a trading platform for individual traders and crypto enthusiasts.')).toBeInTheDocument();
    });
  });

  // Test 12: Exchange details styling
  it('should apply correct styling to exchange details', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockExchangesData });
    
    render(<Exchanges />);
    
    await waitFor(() => {
      const description = screen.getByText('Binance is a global cryptocurrency exchange platform.');
      expect(description).toHaveClass('text-md', 'my-2');
      
      const country = screen.getByText('Country: Malta');
      expect(country).toHaveClass('my-1');
    });
  });

  // Test 13: Multiple exchanges rendering
  it('should render multiple exchanges correctly', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockExchangesData });
    
    render(<Exchanges />);
    
    await waitFor(() => {
      // Check for both exchanges
      expect(screen.getByText('Binance')).toBeInTheDocument();
      expect(screen.getByText('Coinbase Pro')).toBeInTheDocument();
      
      // Check for both countries
      expect(screen.getByText('Country: Malta')).toBeInTheDocument();
      expect(screen.getByText('Country: United States')).toBeInTheDocument();
      
      // Check for both years
      expect(screen.getByText('Year Established: 2017')).toBeInTheDocument();
      expect(screen.getByText('Year Established: 2012')).toBeInTheDocument();
      
      // Check for both trust scores
      expect(screen.getByText('Trust Score: 10')).toBeInTheDocument();
      expect(screen.getByText('Trust Score: 9')).toBeInTheDocument();
    });
  });

  // Test 14: Component container styling
  it('should apply correct styling to exchange containers', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockExchangesData });
    
    const { container } = render(<Exchanges />);
    
    await waitFor(() => {
      const exchangeContainers = container.querySelectorAll('.bg-secondary-300');
      expect(exchangeContainers).toHaveLength(2);
      
      exchangeContainers.forEach(container => {
        expect(container).toHaveClass('flex', 'items-center', 'container', 'bg-secondary-300', 'text-primary-300', 'p-4', 'rounded-lg', 'shadow-lg');
      });
    });
  });

  // Test 15: Initial state before data load
  it('should have correct initial state structure', () => {
    // Mock a never-resolving promise to test initial state
    mockedAxios.get.mockImplementation(() => new Promise(() => {}));
    
    render(<Exchanges />);
    
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});