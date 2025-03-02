import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Portfolio from "./components/Portfolio";
import BuyCrypto from "./components/BuyCrypto";
import SellCrypto from "./components/SellCrypto";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/buy" element={<BuyCrypto />} />
        <Route path="/sell" element={<SellCrypto />} />
      </Routes>
    </div>
  );
}

export default App;