import { useEffect } from 'react';


const Home = () => {

    useEffect(() => {
        console.log('Environment Variable:', import.meta.env.REACT_APP_API_KEY);
    }, []);
    
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Home Page</h1>
                <p className="text-gray-700">This is a simple page styled with Tailwind CSS.</p>
            </div>
        </div>
    );
};

export default Home;