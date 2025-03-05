import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import HomePage from "./screens/Home.jsx";
import ExchangeList from "./screens/Exchanges.js";
import CoinList from "./screens/Coins.jsx";
import TrendingList from "./screens/Trending.jsx";

const App = () => {
  return (
    <Router>
      <Header />
        <Routes>
          <Route path="/" element={<HomePage/>} exact />
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