import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import Loader from "../components/Loader";

const Home = () => {
  const [coinData, setCoinData] = useState([]);
  const [coinPriceMessage, setCoinPriceMessage] = useState("");
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [searchText, setSearchText] = useState("Bitcoin");
  const [loading, setLoading] = useState(false);

  // Fetch coins search from the api if user stops typing for 500ms
  const fetchCoins = async (searchText) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/search?query=${searchText}`
      );
      setCoinData(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // avoid multiple api calls when user types in the input field
  let debounceTimeout;
  const debounceFetchCoins = (text) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      fetchCoins(text);
    }, 1000);
  };

  const closeModal = () => {
    setShowPriceModal(false);
  };

  // Call the delayedFetchCoins function when user types in the input field
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    if (e.target.value.length > 3) {
      debounceFetchCoins(e.target.value);
    }
  };

  // Function to show the price of selected coin in USD
  // https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr

  const showPrice = async (coinId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
      );
      setLoading(false);
      // set the price message
      setCoinPriceMessage(`Price of ${coinId} in USD: ${data[coinId].usd}`);
      setShowPriceModal(true);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const showPriceINR = async (coinId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=inr`
      );
      setLoading(false);
      // set the price message
      setCoinPriceMessage(`Price of ${coinId} in INR: ${data[coinId].inr}`);
      setShowPriceModal(true);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 container mx-auto">
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-4">Coins</h1>
          <input
            type="text"
            placeholder="Search coin"
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            value={searchText}
            onChange={(e) => handleSearch(e)}
          />
          <ul>
            {coinData.coins && coinData.coins.length > 0 ? (
              coinData.coins.map((coin) => (
                <li key={coin.id} className="p-2 border-b border-gray-300">
                  <div className="flex justify-between items-center">
                    <div>
                      <img
                        src={coin.thumb}
                        alt={coin.name}
                        className="w-24 h-24 my-3 rounded-full"
                      />
                      <p>
                        {coin.name} ({coin.symbol.toUpperCase()})
                      </p>
                      <p>Market Cap Rank: {coin.market_cap_rank}</p>
                    </div>
                    <div>
                      <button
                        className="mt-2 px-4 py-2 bg-blue-500 mx-2 text-white rounded-lg"
                        onClick={() => showPrice(coin.id)}
                      >
                        See Price in USD
                      </button>
                      <button
                        className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-lg"
                        onClick={() => showPriceINR(coin.id)}
                      >
                        See Price in INR
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-2 text-center text-gray-500">No coins found</li>
            )}
          </ul>
          <Transition appear show={showPriceModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
              <Transition
                as={Fragment}
                show={showPriceModal}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/25" />
              </Transition>

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
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Price of Coin
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          {coinPriceMessage}
                        </p>
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={closeModal}
                        >
                          Ok
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      )}
    </div>
  );
};

export default Home;
