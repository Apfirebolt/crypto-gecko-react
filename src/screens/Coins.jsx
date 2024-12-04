import { useEffect, useState } from 'react';
import axiosInstance from '../plugins/interceptor';
import Loader from '../components/Loader';

const Coins = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                // set loader
                setLoading(true);
                const response = await axiosInstance.get('/coins/list');
                setCoins(response.data);
                setLoading(false);
            } catch (error) {
                setLoading(false)
                console.error('Error fetching coins:', error);
            }
        };

        fetchCoins();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            {loading ? (
                <Loader />
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold mb-4">Coins Page</h1>
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

export default Coins;