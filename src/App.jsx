import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./screens/Home";
import ExchangeList from "./screens/Exchanges";
import CoinList from "./screens/Coins";
import TrendingList from "./screens/Trending";

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