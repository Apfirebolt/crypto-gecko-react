import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';


const Coins = () => {
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // set headers
                const headers = {
                    'x-cg-pro-api-key': ''
                };
                setLoading(true)
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
                            <div className="p-3 bg-blue-500">
                                <p className="text-white">
                                    Name - <span className="font-bold">{coin.item.name}</span> <br />
                                </p>
                                <p className="text-white">   
                                    Symbol - <span className="font-bold">{coin.item.symbol}</span> <br />
                                </p>
                                <img src={coin.item.thumb} alt={coin.item.name} className="w-24 h-24 mr-4 my-3" />
                                <p className="text-white">   
                                    Rank - <span className="font-bold">{coin.item.market_cap_rank}</span> <br />
                                </p>
                                <p className="text-white">
                                    Score - <span className="font-bold">{coin.item.score}</span> <br />
                                </p>
                                <p className="text-white">
                                    BTC Price - <span className="font-bold">{coin.item.price_btc}</span> <br />
                                </p>
                            </div>
                        </li>
                        ))}
                    </ul>

                    <h1 className="text-2xl font-bold text-center mb-4">Trending Categories</h1>
                    <ul>
                        {trending.categories && trending.categories.map((coin) => (
                            <li key={coin.id}>
                            <div className="p-3 bg-blue-500">
                                <p className="text-white">
                                    Name - <span className="font-bold">{coin.name}</span> <br />
                                </p>
                                <p className="text-white">
                                    Coins Count - <span className="font-bold">{coin.coins_count}</span> <br />
                                </p>
                            </div>
                        </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Coins;
