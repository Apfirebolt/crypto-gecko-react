import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';


const Exchanges = () => {
    const [exchanges, setExchanges] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // set headers
                const headers = {
                    'x-cg-pro-api-key': ''
                };
                setLoading(true)
                const response = await axios.get('https://api.coingecko.com/api/v3/exchanges', { headers });
                if (response) {
                    setLoading(false);
                    setExchanges(response.data);
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
                    <h1 className="text-2xl font-bold text-center mb-4">Exchanges</h1>
                    <ul>
                        {exchanges.map((exchange) => (
                            <li key={exchange.id} className="mb-4">
                            <div className="flex items-center container bg-neutral-100 p-4 rounded-lg shadow-lg">
                                <img src={exchange.image} alt={exchange.name} className="w-24 h-24 mr-4" />
                                <div className="p-3">
                                    <a href={exchange.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xl hover:underline">
                                        {exchange.name}
                                    </a>
                                    <div className="my-2">
                                        <p className="text-gray-600 text-md my-2">{exchange.description}</p>
                                        <p className="text-gray-600 my-1">Country: {exchange.country}</p>
                                        <p className="text-gray-600 my-1">Year Established: {exchange.year_established}</p>
                                        <p className="text-gray-600 my-1">Trust Score: {exchange.trust_score}</p>
                                    </div>
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

export default Exchanges;
