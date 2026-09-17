import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../components/Loader";

interface CoinItem {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  score: number;
  price_btc: number;
  thumb: string;
  large?: string;
}

interface Coin {
  item: CoinItem;
}

interface Category {
  id: string | number;
  name: string;
  coins_count: number;
}

interface TrendingData {
  coins: Coin[];
  categories: Category[];
}

const Trending: React.FC = () => {
  const {
    data: trending = { coins: [], categories: [] },
    isLoading,
    isError,
    error,
  } = useQuery<TrendingData>({
    queryKey: ["trending-coins"],
    queryFn: async ({ signal }) => {
      const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;
      const headers: Record<string, string> = apiKey
        ? { "x-cg-demo-api-key": apiKey }
        : {};

      const response = await axios.get<TrendingData>(
        "https://api.coingecko.com/api/v3/search/trending",
        {
          headers,
          signal,
        }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache trending data
  });

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-950 text-neutral-100">
        <div className="bg-rose-950/20 text-rose-400 p-4 rounded-xl border border-rose-900/55">
          <p className="font-semibold">Error</p>
          <p className="text-sm">
            {error instanceof Error ? error.message : "Failed to fetch trending data."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 py-10 px-4 sm:px-6 lg:px-8 text-neutral-100">
      <div className="max-w-7xl mx-auto space-y-12">
        <section>
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              🔥 Trending Coins
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Most searched cryptocurrencies in the last 24 hours.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trending.coins.map(({ item }) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 bg-neutral-900/60 p-4 rounded-xl border border-neutral-800 shadow-sm hover:border-neutral-700 transition"
              >
                <img
                  src={item.thumb}
                  alt={item.name}
                  className="w-10 h-10 rounded-full flex-shrink-0 bg-neutral-800 border border-neutral-700"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-white truncate text-sm">
                      {item.name}
                    </p>
                    <span className="text-[11px] font-mono bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded">
                      #{item.market_cap_rank ?? "—"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 uppercase mt-0.5">
                    {item.symbol}
                  </p>
                  <p className="text-xs font-mono text-emerald-400 mt-1">
                    ₿ {item.price_btc ? item.price_btc.toFixed(8) : "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {trending.categories && trending.categories.length > 0 && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                📊 Trending Categories
              </h2>
              <p className="mt-1 text-sm text-neutral-400">
                Top crypto sectors gaining traction.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {trending.categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-neutral-900/60 p-5 rounded-xl border border-neutral-800 shadow-sm"
                >
                  <p className="font-semibold text-white text-base">
                    {category.name}
                  </p>
                  <p className="text-xs text-neutral-400 mt-2">
                    Coins tracked:{" "}
                    <span className="font-mono text-neutral-200 font-medium">
                      {category.coins_count}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Trending;