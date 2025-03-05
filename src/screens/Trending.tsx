import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader.tsx';

interface Coin {
    item: {
        id: string;
        name: string;
        symbol: string;
        market_cap_rank: number;
        score: number;
        price_btc: number;
        thumb: string;
    };
}

interface Category {
    id: string;
    name: string;
    coins_count: number;
}

interface TrendingData {
    coins: Coin[];
    categories: Category[];
}

const Trending = () => {
    const [trending, setTrending] = useState<TrendingData>({ coins: [], categories: [] });
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = {
                    'x-cg-pro-api-key': ''
                };
                setLoading(true);
                const response = await axios.get('https://api.coingecko.com/api/v3/search/trending', { headers });
                if (response) {
                    setLoading(false);
                    setTrending(response.data);
                }
            } catch (error) {
                setLoading(false);
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 container mx-auto">
            {loading ? (
                <Loader />
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-center mb-4">Trending Coins</h1>
                    <ul>
                        {trending.coins && trending.coins.map((coin) => (
                            <li key={coin.item.id} className="mb-4">
                                <div className="flex items-center container bg-neutral-100 p-4 rounded-lg shadow-lg">
                                    <img src={coin.item.thumb} alt={coin.item.name} className="w-24 h-24 mr-4" />
                                    <div className="p-3">
                                        <p className="text-blue-500 text-xl font-bold">{coin.item.name}</p>
                                        <p className="text-gray-600">Symbol: {coin.item.symbol}</p>
                                        <p className="text-gray-600">Rank: {coin.item.market_cap_rank}</p>
                                        <p className="text-gray-600">Score: {coin.item.score}</p>
                                        <p className="text-gray-600">BTC Price: {coin.item.price_btc}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <h1 className="text-2xl font-bold text-center mb-4">Trending Categories</h1>
                    <ul>
                        {trending.categories && trending.categories.map((category) => (
                            <li key={category.id} className="mb-4">
                                <div className="flex items-center container bg-neutral-100 p-4 rounded-lg shadow-lg">
                                    <div className="p-3">
                                        <p className="text-blue-500 text-xl font-bold">{category.name}</p>
                                        <p className="text-gray-600">Coins Count: {category.coins_count}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Trending;
