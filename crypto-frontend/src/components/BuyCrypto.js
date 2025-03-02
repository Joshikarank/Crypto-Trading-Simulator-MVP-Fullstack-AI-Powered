import React, { useState } from "react";
import axios from "axios";

const BuyCrypto = () => {
  const [coin, setCoin] = useState("");
  const [virtualMoney, setVirtualMoney] = useState(0);

  const handleBuy = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/portfolio/buy",
        { coin, virtualMoney },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Buy response:", response.data);
    } catch (error) {
      console.error("Buy error:", error.response.data.error);
    }
  };

  return (
    <div className="buy-sell-container">
      <h2>Buy Crypto</h2>
      <form onSubmit={handleBuy}>
        <input
          type="text"
          placeholder="Coin"
          value={coin}
          onChange={(e) => setCoin(e.target.value)}
        />
        <input
          type="number"
          placeholder="Virtual Money"
          value={virtualMoney}
          onChange={(e) => setVirtualMoney(e.target.value)}
        />
        <button type="submit">Buy</button>
      </form>
    </div>
  );
};

export default BuyCrypto;