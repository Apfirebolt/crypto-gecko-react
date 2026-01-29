import { render, screen, waitFor } from '@testing-library/react';
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import Trending from '../screens/Trending';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

// Mock Loader component
vi.mock('../components/Loader.tsx', () => {
  return {
    default: () => <div data-testid="loader">Loading...</div>
  };
});

const mockTrendingData = {
  coins: [
    {
      item: {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        market_cap_rank: 1,
        score: 1,
        price_btc: 1.0,
        thumb: 'https://example.com/bitcoin.png'
      }
    },
    {
      item: {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        market_cap_rank: 2,
        score: 0.95,
        price_btc: 0.065,
        thumb: 'https://example.com/ethereum.png'
      }
    }
  ],
  categories: [
    {
      id: 'defi',
      name: 'Decentralized Finance (DeFi)',
      coins_count: 150
    },
    {
      id: 'nft',
      name: 'Non-Fungible Tokens (NFT)',
      coins_count: 75
    }
  ]
};

describe('Trending Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Test 1: Initial render and loading state
  it('should show loader initially when fetching data', async () => {
    mockedAxios.get.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ data: mockTrendingData }), 100))
    );
    
    render(<Trending />);
    
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  // Test 2: Successful data fetch and display
  it('should render trending data after successful fetch', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockTrendingData });
    
    render(<Trending />);
    
    await waitFor(() => {
      expect(screen.getByText('Trending Coins')).toBeInTheDocument();
      expect(screen.getByText('Trending Categories')).toBeInTheDocument();
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
      expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });
  });

  // Test 3: Trending coins information display
  it('should display trending coins information correctly', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockTrendingData });
    
    render(<Trending />);
    
    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
      expect(screen.getByText('Symbol: BTC')).toBeInTheDocument();
      expect(screen.getByText('Rank: 1')).toBeInTheDocument();
      expect(screen.getByText('Score: 1')).toBeInTheDocument();
      expect(screen.getByText('BTC Price: 1')).toBeInTheDocument();
    });
  });

  // Test 4: Trending categories information display
  it('should display trending categories information correctly', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockTrendingData });
    
    render(<Trending />);
    
    await waitFor(() => {
      expect(screen.getByText('Decentralized Finance (DeFi)')).toBeInTheDocument();
      expect(screen.getByText('Coins Count: 150')).toBeInTheDocument();
      expect(screen.getByText('Non-Fungible Tokens (NFT)')).toBeInTheDocument();
      expect(screen.getByText('Coins Count: 75')).toBeInTheDocument();
    });
  });

  // Test 5: Coin images are rendered
  it('should render coin images with correct attributes', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockTrendingData });
    
    render(<Trending />);
    
    await waitFor(() => {
      const bitcoinImage = screen.getByAltText('Bitcoin');
      const ethereumImage = screen.getByAltText('Ethereum');
      
      expect(bitcoinImage).toBeInTheDocument();
      expect(bitcoinImage).toHaveAttribute('src', 'https://example.com/bitcoin.png');
      expect(ethereumImage).toBeInTheDocument();
      expect(ethereumImage).toHaveAttribute('src', 'https://example.com/ethereum.png');
    });
  });

  // Test 6: API call with correct parameters
  it('should make API call with correct parameters', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockTrendingData });
    
    render(<Trending />);
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/search/trending',
        { headers: { 'x-cg-pro-api-key': '' } }
      );
    });
  });

  // Test 7: API error handling
  it('should handle API errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
    
    render(<Trending />);
    
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
    mockedAxios.get.mockResolvedValueOnce({ data: mockTrendingData });
    
    const { container } = render(<Trending />);
    
    await waitFor(() => {
      expect(container.firstChild).toHaveClass('min-h-screen', 'bg-primary-300', 'container', 'mx-auto');
      expect(screen.getByText('Trending Coins')).toHaveClass('text-2xl', 'font-bold', 'text-center', 'mb-4');
      expect(screen.getByText('Trending Categories')).toHaveClass('text-2xl', 'font-bold', 'text-center', 'mb-4');
    });
  });

  // Test 9: Empty coins array handling
  it('should handle empty coins array', async () => {
    const emptyCoinsData = {
      coins: [],
      categories: mockTrendingData.categories
    };
    
    mockedAxios.get.mockResolvedValueOnce({ data: emptyCoinsData });
    
    render(<Trending />);
    
    await waitFor(() => {
      expect(screen.getByText('Trending Coins')).toBeInTheDocument();
      expect(screen.queryByText('Bitcoin')).not.toBeInTheDocument();
      expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
    });
  });

  // Test 10: Empty categories array handling
  it('should handle empty categories array', async () => {
    const emptyCategoriesData = {
      coins: mockTrendingData.coins,
      categories: []
    };
    
    mockedAxios.get.mockResolvedValueOnce({ data: emptyCategoriesData });
    
    render(<Trending />);
    
    await waitFor(() => {
      expect(screen.getByText('Trending Categories')).toBeInTheDocument();
      expect(screen.queryByText('Decentralized Finance (DeFi)')).not.toBeInTheDocument();
      expect(screen.queryByText('Non-Fungible Tokens (NFT)')).not.toBeInTheDocument();
    });
  });

  // Test 11: Coin styling classes
  it('should apply correct styling classes to coin items', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockTrendingData });
    
    render(<Trending />);
    
    await waitFor(() => {
      const bitcoinName = screen.getByText('Bitcoin');
      expect(bitcoinName).toHaveClass('my-2', 'text-xl', 'font-bold');
    });
  });

  // Test 12: Category styling classes
  it('should apply correct styling classes to category items', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockTrendingData });
    
    render(<Trending />);
    
    await waitFor(() => {
      const categoryName = screen.getByText('Decentralized Finance (DeFi)');
      expect(categoryName).toHaveClass('my-2', 'text-xl', 'font-bold');
    });
  });

  // Test 13: Complete trending data structure
  it('should handle complete trending data structure', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockTrendingData });
    
    render(<Trending />);
    
    await waitFor(() => {
      // Check coins section
      expect(screen.getByText('Symbol: BTC')).toBeInTheDocument();
      expect(screen.getByText('Symbol: ETH')).toBeInTheDocument();
      expect(screen.getByText('Rank: 1')).toBeInTheDocument();
      expect(screen.getByText('Rank: 2')).toBeInTheDocument();
      
      // Check categories section
      expect(screen.getByText('Coins Count: 150')).toBeInTheDocument();
      expect(screen.getByText('Coins Count: 75')).toBeInTheDocument();
    });
  });

  // Test 14: Initial state before data load
  it('should have correct initial state structure', () => {
    // Mock a never-resolving promise to test initial state
    mockedAxios.get.mockImplementation(() => new Promise(() => {}));
    
    render(<Trending />);
    
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});