import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";

interface Exchange {
  id: string;
  name: string;
  year_established: number;
  country: string;
  description: string;
  url: string;
  image: string;
  has_trading_incentive: boolean;
  trust_score: number;
  trust_score_rank: number;
  trade_volume_24h_btc: number;
  trade_volume_24h_btc_normalized: number;
}

const Exchanges: React.FC = () => {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // set headers
        const headers = {
          "x-cg-pro-api-key": "",
        };
        setLoading(true);
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/exchanges",
          { headers }
        );
        if (response) {
          setLoading(false);
          setExchanges(response.data);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-primary-300 flex items-center justify-center">
      {loading ? (
        <Loader />
      ) : (
        <div className="p-6 rounded-lg shadow-lg text-primary-300">
          <h1 className="text-2xl font-bold text-center mb-4">Exchanges</h1>
          <ul>
            {exchanges.map((exchange) => (
              <li key={exchange.id} className="mb-4">
                <div className="flex items-center container bg-secondary-300 text-primary-300 p-4 rounded-lg shadow-lg">
                  <img
                    src={exchange.image}
                    alt={exchange.name}
                    className="w-24 h-24 mr-4"
                  />
                  <div className="p-3">
                    <a
                      href={exchange.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl my-2 hover:underline"
                    >
                      {exchange.name}
                    </a>
                    <div className="my-2">
                      <p className="text-md my-2">{exchange.description}</p>
                      <p className="my-1">Country: {exchange.country}</p>
                      <p className="my-1">
                        Year Established: {exchange.year_established}
                      </p>
                      <p className="my-1">
                        Trust Score: {exchange.trust_score}
                      </p>
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
