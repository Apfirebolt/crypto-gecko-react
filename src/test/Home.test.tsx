import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import Home from '../screens/Home';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

// Mock Loader component
vi.mock('../components/Loader.tsx', () => {
  return {
    default: () => <div data-testid="loader">Loading...</div>
  };
});

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Don't use fake timers for async tests
  });

  afterEach(() => {
    // Clean up any pending timers
    vi.clearAllTimers();
  });

  // Test 1: Initial render
  it('should render the home component with initial elements', () => {
    render(<Home />);
    
    expect(screen.getByText('Coins')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search coin')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bitcoin')).toBeInTheDocument();
  });

  // Test 2: Search input functionality
  it('should handle search input changes', () => {
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText('Search coin');
    fireEvent.change(searchInput, { target: { value: 'Ethereum' } });
    
    expect(searchInput).toHaveValue('Ethereum');
  });

  // Test 3: Debounced API call
  it('should trigger API call after debounce when input length > 3', async () => {
    const mockResponse = {
      data: {
        coins: [
          {
            id: 'ethereum',
            name: 'Ethereum',
            symbol: 'eth',
            thumb: 'https://example.com/eth.png',
            market_cap_rank: 2
          }
        ]
      }
    };
    
    mockedAxios.get.mockResolvedValueOnce(mockResponse);
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText('Search coin');
    fireEvent.change(searchInput, { target: { value: 'Ethereum' } });
    
    // Wait for debounced function to be called
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/search?query=Ethereum'
      );
    }, { timeout: 10000 });
  });

  // Test 4: Show loader during API call
  it('should show loader while fetching data', async () => {
    // Mock a delayed response
    mockedAxios.get.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ data: { coins: [] } }), 100))
    );
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText('Search coin');
    fireEvent.change(searchInput, { target: { value: 'Bitcoin' } });
    
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    await waitFor(() => {
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  // Test 5: Display coins list
  it('should display coins list when data is available', async () => {
    const mockResponse = {
      data: {
        coins: [
          {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'btc',
            thumb: 'https://example.com/btc.png',
            market_cap_rank: 1
          }
        ]
      }
    };
    
    mockedAxios.get.mockResolvedValueOnce(mockResponse);
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText('Search coin');
    fireEvent.change(searchInput, { target: { value: 'Bitcoin' } });
    
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    await waitFor(() => {
      expect(screen.getByText('Bitcoin (BTC)')).toBeInTheDocument();
      expect(screen.getByText('Market Cap Rank: 1')).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  // Test 6: Show "No coins found" when no data
  it('should display "No coins found" message when no coins are returned', async () => {
    const mockResponse = {
      data: {
        coins: []
      }
    };
    
    mockedAxios.get.mockResolvedValueOnce(mockResponse);
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText('Search coin');
    fireEvent.change(searchInput, { target: { value: 'NonExistentCoin' } });
    
    vi.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(screen.getByText('No coins found')).toBeInTheDocument();
    });
  });

  // Test 7: Price buttons functionality
  it('should render price buttons for each coin', async () => {
    const mockResponse = {
      data: {
        coins: [
          {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'btc',
            thumb: 'https://example.com/btc.png',
            market_cap_rank: 1
          }
        ]
      }
    };
    
    mockedAxios.get.mockResolvedValueOnce(mockResponse);
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText('Search coin');
    fireEvent.change(searchInput, { target: { value: 'Bitcoin' } });
    
    vi.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(screen.getByText('See Price in USD')).toBeInTheDocument();
      expect(screen.getByText('See Price in INR')).toBeInTheDocument();
    });
  });

  // Test 8: USD price modal
  it('should open price modal when USD price button is clicked', async () => {
    const searchMockResponse = {
      data: {
        coins: [
          {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'btc',
            thumb: 'https://example.com/btc.png',
            market_cap_rank: 1
          }
        ]
      }
    };
    
    const priceMockResponse = {
      data: {
        bitcoin: { usd: 50000 }
      }
    };
    
    mockedAxios.get
      .mockResolvedValueOnce(searchMockResponse)
      .mockResolvedValueOnce(priceMockResponse);
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText('Search coin');
    fireEvent.change(searchInput, { target: { value: 'Bitcoin' } });
    
    vi.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(screen.getByText('See Price in USD')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('See Price in USD'));
    
    await waitFor(() => {
      expect(screen.getByText('Price of Coin')).toBeInTheDocument();
      expect(screen.getByText('Price of bitcoin in USD: 50000')).toBeInTheDocument();
    });
  });

  // Test 9: INR price modal
  it('should open price modal when INR price button is clicked', async () => {
    const searchMockResponse = {
      data: {
        coins: [
          {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'btc',
            thumb: 'https://example.com/btc.png',
            market_cap_rank: 1
          }
        ]
      }
    };
    
    const priceMockResponse = {
      data: {
        bitcoin: { inr: 4000000 }
      }
    };
    
    mockedAxios.get
      .mockResolvedValueOnce(searchMockResponse)
      .mockResolvedValueOnce(priceMockResponse);
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText('Search coin');
    fireEvent.change(searchInput, { target: { value: 'Bitcoin' } });
    
    vi.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(screen.getByText('See Price in INR')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('See Price in INR'));
    
    await waitFor(() => {
      expect(screen.getByText('Price of Coin')).toBeInTheDocument();
      expect(screen.getByText('Price of bitcoin in INR: 4000000')).toBeInTheDocument();
    });
  });

  // Test 10: Close modal functionality
  it('should close modal when Ok button is clicked', async () => {
    const searchMockResponse = {
      data: {
        coins: [
          {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'btc',
            thumb: 'https://example.com/btc.png',
            market_cap_rank: 1
          }
        ]
      }
    };
    
    const priceMockResponse = {
      data: {
        bitcoin: { usd: 50000 }
      }
    };
    
    mockedAxios.get
      .mockResolvedValueOnce(searchMockResponse)
      .mockResolvedValueOnce(priceMockResponse);
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText('Search coin');
    fireEvent.change(searchInput, { target: { value: 'Bitcoin' } });
    
    vi.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(screen.getByText('See Price in USD')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('See Price in USD'));
    
    await waitFor(() => {
      expect(screen.getByText('Price of Coin')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Ok'));
    
    await waitFor(() => {
      expect(screen.queryByText('Price of Coin')).not.toBeInTheDocument();
    });
  });

  // Test 11: Error handling
  it('should handle API errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText('Search coin');
    fireEvent.change(searchInput, { target: { value: 'Bitcoin' } });
    
    vi.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(new Error('API Error'));
    });
    
    consoleErrorSpy.mockRestore();
  });

  // Test 12: Don't trigger API call for short input
  it('should not trigger API call for input length <= 3', () => {
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText('Search coin');
    fireEvent.change(searchInput, { target: { value: 'BTC' } });
    
    vi.advanceTimersByTime(1000);
    
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });
});