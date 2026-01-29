import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import Coins from '../screens/Coins';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

// Mock Loader component
vi.mock('../components/Loader.tsx', () => {
  return {
    default: () => <div data-testid="loader">Loading...</div>
  };
});

// Mock Button component
vi.mock('@/components/ui/button', () => {
  return {
    Button: ({ children, onClick, disabled, className }: any) => (
      <button 
        onClick={onClick} 
        disabled={disabled} 
        className={className}
        data-testid="button"
      >
        {children}
      </button>
    )
  };
});

const mockCoinsData = [
  {
    id: 'bitcoin',
    image: 'https://example.com/bitcoin.png',
    name: 'Bitcoin',
    symbol: 'btc',
    current_price: 50000,
    market_cap: 1000000000,
    total_volume: 50000000,
    price_change_percentage_24h: 2.5
  },
  {
    id: 'ethereum',
    image: 'https://example.com/ethereum.png',
    name: 'Ethereum',
    symbol: 'eth',
    current_price: 3000,
    market_cap: 500000000,
    total_volume: 25000000,
    price_change_percentage_24h: -1.2
  }
];

describe('Coins Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Test 1: Initial render and loading state
  it('should show loader initially when fetching data', async () => {
    mockedAxios.get.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ data: mockCoinsData }), 100))
    );
    
    render(<Coins />);
    
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  // Test 2: Successful data fetch and display
  it('should render coins list after successful data fetch', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockCoinsData });
    
    render(<Coins />);
    
    await waitFor(() => {
      expect(screen.getByText('Coins')).toBeInTheDocument();
      expect(screen.getByText('Bitcoin (BTC)')).toBeInTheDocument();
      expect(screen.getByText('Ethereum (ETH)')).toBeInTheDocument();
    });
  });

  // Test 3: Coin information display
  it('should display coin information correctly', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockCoinsData });
    
    render(<Coins />);
    
    await waitFor(() => {
      expect(screen.getByText('Price: $50000')).toBeInTheDocument();
      expect(screen.getByText('Market Cap: $1000000000')).toBeInTheDocument();
      expect(screen.getByText('Volume: $50000000')).toBeInTheDocument();
      expect(screen.getByText('Price Change (24h): 2.5%')).toBeInTheDocument();
    });
  });

  // Test 4: Coin images are rendered
  it('should render coin images with correct attributes', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockCoinsData });
    
    render(<Coins />);
    
    await waitFor(() => {
      const bitcoinImage = screen.getByAltText('Bitcoin');
      const ethereumImage = screen.getByAltText('Ethereum');
      
      expect(bitcoinImage).toBeInTheDocument();
      expect(bitcoinImage).toHaveAttribute('src', 'https://example.com/bitcoin.png');
      expect(ethereumImage).toBeInTheDocument();
      expect(ethereumImage).toHaveAttribute('src', 'https://example.com/ethereum.png');
    });
  });

  // Test 5: Pagination buttons are rendered
  it('should render pagination buttons', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockCoinsData });
    
    render(<Coins />);
    
    await waitFor(() => {
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
  });

  // Test 6: Previous button is disabled on first page
  it('should disable Previous button on first page', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockCoinsData });
    
    render(<Coins />);
    
    await waitFor(() => {
      const previousButton = screen.getByText('Previous');
      expect(previousButton).toBeDisabled();
    });
  });

  // Test 7: Next page functionality
  it('should handle next page click', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockCoinsData })
      .mockResolvedValueOnce({ data: [mockCoinsData[0]] });
    
    render(<Coins />);
    
    await waitFor(() => {
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Next'));
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      expect(mockedAxios.get).toHaveBeenLastCalledWith(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=2&sparkline=false',
        { headers: { 'x-cg-pro-api-key': '' } }
      );
    });
  });

  // Test 8: Previous page functionality
  it('should handle previous page click when not on first page', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockCoinsData })
      .mockResolvedValueOnce({ data: [mockCoinsData[1]] })
      .mockResolvedValueOnce({ data: mockCoinsData });
    
    render(<Coins />);
    
    // First wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
    
    // Go to next page first
    fireEvent.click(screen.getByText('Next'));
    
    await waitFor(() => {
      const previousButton = screen.getByText('Previous');
      expect(previousButton).not.toBeDisabled();
    });
    
    // Now go back to previous page
    fireEvent.click(screen.getByText('Previous'));
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(3);
      expect(mockedAxios.get).toHaveBeenLastCalledWith(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false',
        { headers: { 'x-cg-pro-api-key': '' } }
      );
    });
  });

  // Test 9: API error handling
  it('should handle API errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
    
    render(<Coins />);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching data:', new Error('API Error'));
    });
    
    // Should stop loading even on error
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
    
    consoleErrorSpy.mockRestore();
  });

  // Test 10: Initial API call with correct parameters
  it('should make initial API call with correct parameters', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockCoinsData });
    
    render(<Coins />);
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false',
        { headers: { 'x-cg-pro-api-key': '' } }
      );
    });
  });

  // Test 11: Component structure and styling
  it('should have correct component structure and CSS classes', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockCoinsData });
    
    const { container } = render(<Coins />);
    
    await waitFor(() => {
      expect(container.firstChild).toHaveClass('min-h-screen', 'bg-gray-100');
      expect(screen.getByText('Coins')).toHaveClass('text-2xl', 'font-bold', 'text-center', 'mb-4');
    });
  });

  // Test 12: Loading state management for pagination
  it('should show loader during pagination', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockCoinsData })
      .mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ data: [mockCoinsData[0]] }), 100))
      );
    
    render(<Coins />);
    
    await waitFor(() => {
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Next'));
    
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  // Test 13: Empty state handling
  it('should handle empty coins array', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    
    render(<Coins />);
    
    await waitFor(() => {
      expect(screen.getByText('Coins')).toBeInTheDocument();
      // Should not find any coin names
      expect(screen.queryByText('Bitcoin (BTC)')).not.toBeInTheDocument();
    });
  });
});