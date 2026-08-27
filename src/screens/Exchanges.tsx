import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";

interface Exchange {
  id: string;
  name: string;
  year_established: number | null;
  country: string | null;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"rank" | "volume" | "trust">("rank");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<Exchange[]>(
          "https://api.coingecko.com/api/v3/exchanges"
        );
        setExchanges(response.data);
      } catch (err) {
        setError("Failed to load exchange data. Please try again later.");
        console.error("Error fetching exchanges:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAndSortedExchanges = useMemo(() => {
    return exchanges
      .filter((ex) =>
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ex.country && ex.country.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortBy === "volume") return b.trade_volume_24h_btc - a.trade_volume_24h_btc;
        if (sortBy === "trust") return b.trust_score - a.trust_score;
        return a.trust_score_rank - b.trust_score_rank;
      });
  }, [exchanges, searchTerm, sortBy]);

  const getTrustBadge = (score: number) => {
    if (score >= 8) {
      return "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20";
    }
    if (score >= 6) {
      return "bg-amber-500/10 text-amber-400 ring-amber-500/20";
    }
    return "bg-rose-500/10 text-rose-400 ring-rose-500/20";
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Top Crypto Exchanges
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Ranked by trust score, verified 24h trading volume, and reported liquidity.
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px]">
              <input
                type="text"
                placeholder="Search exchange or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "rank" | "volume" | "trust")}
              className="rounded-lg border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-sm text-neutral-300 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="rank">Sort by Rank</option>
              <option value="volume">Sort by 24h Volume</option>
              <option value="trust">Sort by Trust Score</option>
            </select>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <Loader message="Loading exchange listings..." />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-6 text-center text-rose-400">
            {error}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 shadow-2xl backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-300">
                <thead className="border-b border-neutral-800 bg-neutral-900 text-xs uppercase tracking-wider text-neutral-400">
                  <tr>
                    <th scope="col" className="px-6 py-4"># Rank</th>
                    <th scope="col" className="px-6 py-4">Exchange</th>
                    <th scope="col" className="px-6 py-4 text-center">Trust Score</th>
                    <th scope="col" className="px-6 py-4 text-right">24h Volume (BTC)</th>
                    <th scope="col" className="px-6 py-4">Origin & Established</th>
                    <th scope="col" className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredAndSortedExchanges.map((exchange) => (
                    <tr
                      key={exchange.id}
                      className="transition duration-150 hover:bg-neutral-800/40"
                    >
                      {/* Rank */}
                      <td className="px-6 py-4 font-mono font-medium text-neutral-500">
                        {exchange.trust_score_rank || "-"}
                      </td>

                      {/* Name & Logo */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={exchange.image}
                            alt={exchange.name}
                            className="h-8 w-8 rounded-full border border-neutral-700 bg-neutral-800 p-0.5"
                          />
                          <div>
                            <span className="font-semibold text-white">
                              {exchange.name}
                            </span>
                            {exchange.has_trading_incentive && (
                              <span className="ml-2 inline-flex items-center rounded-md bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-medium text-purple-400 ring-1 ring-inset ring-purple-500/20">
                                Rewards
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Trust Score */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getTrustBadge(
                            exchange.trust_score
                          )}`}
                        >
                          {exchange.trust_score} / 10
                        </span>
                      </td>

                      {/* 24h Volume */}
                      <td className="px-6 py-4 text-right font-mono font-medium text-white">
                        ₿{" "}
                        {exchange.trade_volume_24h_btc.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      {/* Origin & Year */}
                      <td className="px-6 py-4 text-neutral-400">
                        <div>{exchange.country || "Worldwide"}</div>
                        <div className="text-xs text-neutral-500">
                          Est. {exchange.year_established || "N/A"}
                        </div>
                      </td>

                      {/* Link Out */}
                      <td className="px-6 py-4 text-right">
                        <a
                          href={exchange.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 transition hover:text-emerald-300 hover:underline"
                        >
                          Visit
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredAndSortedExchanges.length === 0 && (
                <div className="py-12 text-center text-sm text-neutral-500">
                  No exchanges found matching your search.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exchanges;