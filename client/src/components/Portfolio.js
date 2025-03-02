import React, { useEffect, useState } from "react";
import axios from "axios";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/crypto/${userId}`
        );
        setPortfolio(response.data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      }
    };
    fetchPortfolio();
  }, [userId]);

  if (!portfolio) return <div>Loading...</div>;

  return (
    <div className="portfolio">
      <h2>Portfolio</h2>
      <p>Balance: ₹{portfolio.balance}</p>
      <h3>Holdings:</h3>
      <ul>
        {portfolio.holdings.map((holding, index) => (
          <li key={index}>
            {holding.coin}: {holding.amount} (Invested: ₹{holding.invested})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Portfolio;