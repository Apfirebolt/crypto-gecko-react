import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button.tsx";
import Loader from "../components/Loader.tsx";

interface Coin {
  id: string;
  image: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

const Coins: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const fetchData = async () => {
    try {
      const headers = {
        "x-cg-pro-api-key": "",
      };
      setLoading(true);
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false",
        { headers }
      );
      if (response) {
        setLoading(false);
        setCoins(response.data);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const goToNextPage = async () => {
    try {
      const headers = {
        "x-cg-pro-api-key": "",
      };
      setLoading(true);
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${
          page + 1
        }&sparkline=false`,
        { headers }
      );
      if (response) {
        setLoading(false);
        setCoins(response.data);
        setPage(page + 1);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const goToPreviousPage = async () => {
    try {
      const headers = {
        "x-cg-pro-api-key": "",
      };
      setLoading(true);
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${
          page - 1
        }&sparkline=false`,
        { headers }
      );
      if (response) {
        setLoading(false);
        setCoins(response.data);
        setPage(page - 1);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-primary-300">
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-4">Coins</h1>
          <div className="flex justify-center mb-4">
            <Button
              className="bg-primary-200 text-white px-4 py-2 hover:text-white transition-all duration-300 hover:bg-blue-700"
              onClick={goToPreviousPage}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              className="bg-primary-300 mx-2 text-secondary-300 px-4 py-2 hover:text-white transition-all duration-300 hover:bg-blue-700"
              onClick={goToNextPage}
            >
              Next
            </Button>
          </div>
          <div className="mx-auto container my-2">
            <ul>
              {coins.map((coin) => (
                <li key={coin.id} className="mb-4">
                  <div className="flex items-center container bg-secondary-300 text-primary-300 p-4 rounded-lg shadow-lg">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-24 h-24 mr-4"
                    />
                    <div className="p-3">
                      <p className="my-2 text-xl">
                        {coin.name} ({coin.symbol.toUpperCase()})
                      </p>
                      <div className="my-2">
                        <p className="text-md my-2">
                          Price: ${coin.current_price}
                        </p>
                        <p className="my-1">
                          Market Cap: ${coin.market_cap}
                        </p>
                        <p className="my-1">
                          Volume: ${coin.total_volume}
                        </p>
                        <p className="my-1">
                          Price Change (24h): {coin.price_change_percentage_24h}%
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coins;
