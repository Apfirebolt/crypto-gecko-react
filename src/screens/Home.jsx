import { useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';


const Home = () => {
    const [coinData, setCoinData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch coins search from the api if user stops typing for 500ms
    const fetchCoins = async (searchText) => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `https://api.coingecko.com/api/v3/search?query=${searchText}`
            );
            setCoinData(data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    // avoid multiple api calls when user types in the input field
    let debounceTimeout;
    const debounceFetchCoins = (text) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            fetchCoins(text);
        }, 1000);
    };


    // Call the delayedFetchCoins function when user types in the input field
    const handleSearch = (e) => {
        setSearchText(e.target.value);
        if (e.target.value.length > 3) {
            debounceFetchCoins(e.target.value);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 container mx-auto">
            {loading ? (
                <Loader />
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-center mb-4">Coins</h1>
                    <input
                        type="text"
                        placeholder="Search coin"
                        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                        value={searchText}
                        onChange={(e) => handleSearch(e)}
                    />
                    <ul>
                        {coinData.coins && coinData.coins.length > 0 ? (
                            coinData.coins.map((coin) => (
                                <li key={coin.id} className="p-2 border-b border-gray-300">
                                    <div>
                                        <img src={coin.thumb} alt={coin.name} className="w-24 h-24 my-3 rounded-full" />
                                        <p>
                                            {coin.name} ({coin.symbol.toUpperCase()})
                                        </p>
                                        <p>
                                            Market Cap Rank: {coin.market_cap_rank}
                                        </p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="p-2 text-center text-gray-500">No coins found</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Home;
