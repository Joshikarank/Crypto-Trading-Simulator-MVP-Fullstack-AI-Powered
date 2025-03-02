import React, { useState } from "react";
import axios from "axios";

const SellCrypto = () => {
  const [coin, setCoin] = useState("");
  const [amountInINR, setAmountInINR] = useState(0);

  const handleSell = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/portfolio/sell",
        { coin, amountInINR },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Sell response:", response.data);
    } catch (error) {
      console.error("Sell error:", error.response.data.error);
    }
  };

  return (
    <div className="buy-sell-container">
      <h2>Sell Crypto</h2>
      <form onSubmit={handleSell}>
        <input
          type="text"
          placeholder="Coin"
          value={coin}
          onChange={(e) => setCoin(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount in INR"
          value={amountInINR}
          onChange={(e) => setAmountInINR(e.target.value)}
        />
        <button type="submit">Sell</button>
      </form>
    </div>
  );
};

export default SellCrypto;