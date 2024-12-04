import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';


const Exchanges = () => {
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
                    <h1 className="text-2xl font-bold mb-4">Exchanges Page</h1>
                    <p className="text-gray-700">This is a simple page styled with Tailwind CSS.</p>
                    <ul>
                        {coins.map((coin) => (
                            <li key={coin.id}>{coin.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Exchanges;
