import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Loader from "../components/Loader";

interface Coin {
  id: string;
  image: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number | null;
}

const Coins: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchCoins = useCallback(async (targetPage: number) => {
    try {
      setLoading(true);
      setError(null);

      const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;
      const headers: Record<string, string> = apiKey
        ? { "x-cg-demo-api-key": apiKey }
        : {};

      const response = await axios.get<Coin[]>(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          headers,
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 50,
            page: targetPage,
            sparkline: false,
            price_change_percentage: "24h",
          },
        }
      );

      setCoins(response.data);
      setPage(targetPage);
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.error || err.message
          : "Failed to fetch market data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoins(page);
  }, [fetchCoins, page]);

  const filteredCoins = useMemo(() => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [coins, searchTerm]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Cryptocurrency Prices by Market Cap
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Live market quotes, 24-hour price momentum, and traded volume rankings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative min-w-[260px]">
              <input
                type="text"
                placeholder="Filter page results..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <Loader message="Loading market prices..." fullScreen={false} />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-6 text-center text-rose-400">
            {error}
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 shadow-2xl backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-neutral-300">
                  <thead className="border-b border-neutral-800 bg-neutral-900 text-xs uppercase tracking-wider text-neutral-400">
                    <tr>
                      <th scope="col" className="px-6 py-4"># Rank</th>
                      <th scope="col" className="px-6 py-4">Asset</th>
                      <th scope="col" className="px-6 py-4 text-right">Price</th>
                      <th scope="col" className="px-6 py-4 text-right">24h Change</th>
                      <th scope="col" className="px-6 py-4 text-right">24h Volume</th>
                      <th scope="col" className="px-6 py-4 text-right">Market Cap</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {filteredCoins.map((coin) => {
                      const isPositive =
                        (coin.price_change_percentage_24h ?? 0) >= 0;

                      return (
                        <tr
                          key={coin.id}
                          className="transition duration-150 hover:bg-neutral-800/40"
                        >
                          <td className="px-6 py-4 font-mono font-medium text-neutral-500">
                            {coin.market_cap_rank ?? "—"}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={coin.image}
                                alt={coin.name}
                                className="h-7 w-7 rounded-full border border-neutral-700 bg-neutral-800"
                              />
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">
                                  {coin.name}
                                </span>
                                <span className="text-xs uppercase text-neutral-500 font-mono">
                                  {coin.symbol}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-right font-mono font-medium text-white">
                            $
                            {coin.current_price < 1
                              ? coin.current_price.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 6,
                                })
                              : coin.current_price.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                          </td>

                          <td className="px-6 py-4 text-right font-mono text-xs font-semibold">
                            {coin.price_change_percentage_24h !== null ? (
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded ${
                                  isPositive
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-rose-500/10 text-rose-400"
                                }`}
                              >
                                {isPositive ? "+" : ""}
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </span>
                            ) : (
                              <span className="text-neutral-500">—</span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-right font-mono text-neutral-400">
                            ${coin.total_volume.toLocaleString()}
                          </td>

                          <td className="px-6 py-4 text-right font-mono text-neutral-200">
                            ${coin.market_cap.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredCoins.length === 0 && (
                  <div className="py-12 text-center text-sm text-neutral-500">
                    No cryptocurrency matches &ldquo;{searchTerm}&rdquo; on this page.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs text-neutral-500">
                Page <strong className="text-neutral-300">{page}</strong>
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchCoins(page - 1)}
                  disabled={page <= 1 || loading}
                  className="border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white disabled:opacity-40"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchCoins(page + 1)}
                  disabled={loading}
                  className="border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white disabled:opacity-40"
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Coins;