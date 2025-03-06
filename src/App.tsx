import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import HomePage from "./screens/Home.tsx";
import ExchangeList from "./screens/Exchanges.tsx";
import CoinList from "./screens/Coins.tsx";
import TrendingList from "./screens/Trending.tsx";

const App = () => {
  return (
    <Router>
      <Header />
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/coins" element={<CoinList/>} />
          <Route path="/exchanges" element={<ExchangeList/>} />
          <Route path="/trending" element={<TrendingList/>} />
        </Routes>
      <Footer />
      <ToastContainer />
    </Router>
  );
};

export default App;