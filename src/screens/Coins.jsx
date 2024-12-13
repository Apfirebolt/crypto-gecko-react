import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';


const Coins = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const fetchData = async () => {
        try {
            // set headers
            const headers = {
                'x-cg-pro-api-key': ''
            };
            setLoading(true)
            const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false', { headers });
            if (response) {
                setLoading(false);
                setCoins(response.data);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error fetching data:', error);
        }
    };

    const goToNextPage = async () => {
        try {
            // set headers
            const headers = {
                'x-cg-pro-api-key': ''
            };
            setLoading(true)
            const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${page + 1}&sparkline=false`, { headers });
            if (response) {
                setLoading(false);
                setCoins(response.data);
                setPage(page + 1);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error fetching data:', error);
        }
    }

    const goToPreviousPage = async () => {
        try {
            // set headers
            const headers = {
                'x-cg-pro-api-key': ''
            };
            setLoading(true)
            const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${page - 1}&sparkline=false`, { headers });
            if (response) {
                setLoading(false);
                setCoins(response.data);
                setPage(page - 1);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            {loading ? (
                <Loader />
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-center mb-4">Coins</h1>
                    <div className="flex justify-center mb-4">
                        <button 
                            className="bg-blue-500 text-white px-4 py-2 rounded-l hover:bg-blue-700"
                            onClick={goToPreviousPage}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        <button 
                            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-700"
                            onClick={goToNextPage}
                        >
                            Next
                        </button>
                    </div>
                    <ul>
                        {coins.map((coin) => (
                            <li key={coin.id} className="mb-4">
                            <div className="p-3 flex justify-between items-center w-1/2 mx-auto bg-blue-500">
                                <div className='text-white'>
                                    <p>
                                        Name - <span className="font-bold">{coin.name}</span> <br />
                                    </p>
                                    <p>   
                                        Symbol - <span className="font-bold">{coin.symbol}</span> <br />
                                    </p>
                                    <p>
                                        Price - <span className="font-bold">{coin.current_price}</span> <br />
                                    </p>
                                    <p>
                                        Market Cap - <span className="font-bold">{coin.market_cap}</span> <br />
                                    </p>
                                    <p>
                                        Volume - <span className="font-bold">{coin.total_volume}</span> <br />
                                    </p>
                                    <p>
                                        Price Change - <span className="font-bold">{coin.price_change_percentage_24h}</span> <br />
                                    </p>
                                </div>
                                <div>
                                    <img src={coin.image} alt={coin.name} className="w-10 h-10" />
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

export default Coins;
