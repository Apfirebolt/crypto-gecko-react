import React, { useState, useEffect, useRef, ChangeEvent, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import Loader from "../components/Loader";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  large?: string;
  market_cap_rank: number | null;
}

interface CoinData {
  coins: Coin[];
}

interface PriceState {
  coinName: string;
  symbol: string;
  thumb: string;
  currency: "usd" | "inr";
  amount: number;
}

const Home: React.FC = () => {
  const [coinData, setCoinData] = useState<CoinData>({ coins: [] });
  const [searchText, setSearchText] = useState<string>("Bitcoin");
  const [loading, setLoading] = useState<boolean>(false);
  const [priceLoadingId, setPriceLoadingId] = useState<string | null>(null);
  const [priceDetails, setPriceDetails] = useState<PriceState | null>(null);
  const [showPriceModal, setShowPriceModal] = useState<boolean>(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCoins = async (query: string) => {
    if (!query.trim()) {
      setCoinData({ coins: [] });
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get<CoinData>(
        `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`
      );
      setCoinData(data);
    } catch (error) {
      console.error("Error searching coins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins("Bitcoin");
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (value.trim().length >= 2) {
        fetchCoins(value);
      }
    }, 400);
  };

  const fetchPrice = async (coin: Coin, currency: "usd" | "inr") => {
    try {
      setPriceLoadingId(`${coin.id}-${currency}`);
      const { data } = await axios.get<{ [key: string]: { [curr: string]: number } }>(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coin.id}&vs_currencies=${currency}`
      );

      const price = data[coin.id]?.[currency];
      if (typeof price === "number") {
        setPriceDetails({
          coinName: coin.name,
          symbol: coin.symbol.toUpperCase(),
          thumb: coin.thumb,
          currency,
          amount: price,
        });
        setShowPriceModal(true);
      }
    } catch (error) {
      console.error("Error fetching price:", error);
    } finally {
      setPriceLoadingId(null);
    }
  };

  const closeModal = () => {
    setShowPriceModal(false);
    setPriceDetails(null);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Explore Cryptocurrencies
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Search tokens across the market and inspect real-time spot prices in USD or INR.
          </p>

          <div className="relative mt-6 max-w-xl">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by coin or symbol (e.g. Solana, ETH)..."
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 pl-11 pr-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 backdrop-blur-sm"
              value={searchText}
              onChange={handleSearch}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex h-72 items-center justify-center">
            <Loader message="Searching market assets..." fullScreen={false} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coinData.coins && coinData.coins.length > 0 ? (
              coinData.coins.map((coin) => (
                <div
                  key={coin.id}
                  className="flex flex-col justify-between rounded-xl border border-neutral-800/80 bg-neutral-900/50 p-5 shadow-sm transition hover:border-neutral-700 hover:bg-neutral-900/80"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={coin.thumb}
                      alt={coin.name}
                      className="h-11 w-11 rounded-full bg-neutral-800 p-0.5 border border-neutral-700"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white truncate text-sm">
                          {coin.name}
                        </span>
                        <span className="text-[11px] font-mono uppercase bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded">
                          {coin.symbol}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-500 font-mono">
                        Rank #{coin.market_cap_rank ?? "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2 border-t border-neutral-800/60 pt-4">
                    <button
                      type="button"
                      disabled={priceLoadingId === `${coin.id}-usd`}
                      onClick={() => fetchPrice(coin, "usd")}
                      className="inline-flex items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800/60 px-3 py-2 text-xs font-medium text-emerald-400 transition hover:bg-neutral-800 hover:border-emerald-500/50 disabled:opacity-50"
                    >
                      {priceLoadingId === `${coin.id}-usd` ? "Fetching..." : "Spot (USD)"}
                    </button>
                    <button
                      type="button"
                      disabled={priceLoadingId === `${coin.id}-inr`}
                      onClick={() => fetchPrice(coin, "inr")}
                      className="inline-flex items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800/60 px-3 py-2 text-xs font-medium text-blue-400 transition hover:bg-neutral-800 hover:border-blue-500/50 disabled:opacity-50"
                    >
                      {priceLoadingId === `${coin.id}-inr` ? "Fetching..." : "Spot (INR)"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-sm text-neutral-500">
                No cryptocurrencies found matching &ldquo;{searchText}&rdquo;.
              </div>
            )}
          </div>
        )}

        <Transition appear show={showPriceModal} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-left align-middle shadow-2xl transition-all">
                    {priceDetails && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={priceDetails.thumb}
                            alt={priceDetails.coinName}
                            className="h-10 w-10 rounded-full border border-neutral-700"
                          />
                          <div>
                            <Dialog.Title
                              as="h3"
                              className="text-base font-semibold text-white"
                            >
                              {priceDetails.coinName}
                            </Dialog.Title>
                            <p className="text-xs text-neutral-400 uppercase font-mono">
                              {priceDetails.symbol} / {priceDetails.currency.toUpperCase()}
                            </p>
                          </div>
                        </div>

                        <div className="rounded-xl bg-neutral-950 p-4 border border-neutral-800/80">
                          <span className="text-xs text-neutral-500 uppercase tracking-wider">
                            Live Spot Price
                          </span>
                          <div className="mt-1 font-mono text-2xl font-bold text-emerald-400">
                            {priceDetails.currency === "usd" ? "$" : "₹"}
                            {priceDetails.amount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 6,
                            })}
                          </div>
                        </div>

                        <div className="mt-5 flex justify-end">
                          <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-lg bg-neutral-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-700 focus:outline-none"
                            onClick={closeModal}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default Home;