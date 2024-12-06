import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';


const Coins = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // set headers
                const headers = {
                    'x-cg-pro-api-key': ''
                };
                setLoading(true)
                const response = await axios.get('https://api.coingecko.com/api/v3/coins/list', { headers });
                if (response) {
                    setLoading(false);
                    setCoins(response.data);
                }
            } catch (error) {
                setLoading(false);
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            {loading ? (
                <Loader />
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-center mb-4">Coins</h1>
                    <ul>
                        {coins.map((coin) => (
                            <li key={coin.id} className="mb-4">
                            <div className="p-3 flex justify-between bg-blue-500">
                                <p className="text-white">
                                    Name - <span className="font-bold">{coin.name}</span> <br />
                                </p>
                                <p className="text-white">   
                                    Symbol - <span className="font-bold">{coin.symbol}</span> <br />
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
