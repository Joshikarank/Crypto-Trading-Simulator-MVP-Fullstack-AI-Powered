// server/routes/cryptoRoutes.js

const express = require("express");
const axios = require("axios");
const Portfolio = require("../models/Portfolio");

const router = express.Router();
const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price"; // CoinGecko API for live prices

// ✅ Buy Crypto (Virtual Trade)
router.post("/buy", async (req, res) => {
  const { userId } = req; // Extract userId from authMiddleware
  const { coin, virtualMoney } = req.body;

  try {
    console.log("💰 Buy Request:", { userId, coin, virtualMoney });

    if (!userId) {
      throw new Error("User ID is missing from token.");
    }

    const { data } = await axios.get(`${COINGECKO_API}?ids=${coin}&vs_currencies=inr`);
    const priceInINR = data[coin]?.inr;
    
    if (!priceInINR) {
      throw new Error("Invalid coin or API issue.");
    }

    const cryptoAmount = virtualMoney / priceInINR;
    let portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      portfolio = new Portfolio({ userId, holdings: [], balance: 1000000 });
    }

    if (portfolio.balance < virtualMoney) {
      return res.status(400).json({ error: "Not enough virtual balance" });
    }

    portfolio.balance -= virtualMoney;

    const existingHolding = portfolio.holdings.find((h) => h.coin === coin);
    if (existingHolding) {
      existingHolding.amount += cryptoAmount;
      existingHolding.invested += virtualMoney;
    } else {
      portfolio.holdings.push({ coin, amount: cryptoAmount, invested: virtualMoney });
    }

    await portfolio.save();
    res.json({ message: "Crypto Purchased", portfolio });

  } catch (error) {
    console.error("🔥 Buy Crypto Error:", error.message); // Log actual error
    res.status(500).json({ error: error.message || "Server Error" });
  }
});

// ✅ Get Portfolio – Auto Updates Holdings Value
router.get("/:userId", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.params.userId });

    if (!portfolio) {
      return res.json({ userId: req.params.userId, holdings: [], balance: 0 });
    }

    // 🔥 Fetch live prices for all holdings
    const coins = portfolio.holdings.map((h) => h.coin).join(",");
    const { data } = await axios.get(`${COINGECKO_API}?ids=${coins}&vs_currencies=inr`);

    let totalBalance = 0;

    // Update each holding with new value & P/L
    portfolio.holdings = portfolio.holdings.map((h) => {
      const currentPrice = data[h.coin]?.inr || h.buyPrice;
      const currentValue = (h.amount * currentPrice).toFixed(2);
      const profitLoss = (currentValue - h.invested).toFixed(2);

      totalBalance += parseFloat(currentValue);

      return { ...h.toObject(), currentPrice, currentValue, profitLoss };
    });

    res.json({ userId: req.params.userId, holdings: portfolio.holdings, balance: totalBalance.toFixed(2) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Sell Crypto – Use Live Prices
router.post("/sell", async (req, res) => {
  const { userId, coin, amount } = req.body;

  try {
    const portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      return res.status(400).json({ error: "Portfolio not found" });
    }

    const holding = portfolio.holdings.find((h) => h.coin === coin);
    if (!holding || holding.amount < amount) {
      return res.status(400).json({ error: "Not enough holdings to sell" });
    }

    // 🔥 Get live price from CoinGecko
    const { data } = await axios.get(`${COINGECKO_API}?ids=${coin}&vs_currencies=inr`);
    const sellPrice = data[coin].inr;
    
    const sellValue = sellPrice * amount;
    const profitLoss = sellValue - (holding.buyPrice * amount);

    // Deduct sold amount
    holding.amount -= amount;
    holding.invested -= holding.buyPrice * amount; // Reduce invested based on buy price

    // Remove holding if all sold
    if (holding.amount <= 0) {
      portfolio.holdings = portfolio.holdings.filter((h) => h.coin !== coin);
    }

    await portfolio.save();
    res.json({ message: "Crypto Sold", sellPrice, sellValue, profitLoss, portfolio });
  } catch (err) {
    console.error("Selling crypto eror :", error); // 🔥 Logs the actual error
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Live Crypto Prices (For UI Use)
router.get("/price/:coin", async (req, res) => {
  try {
    const { data } = await axios.get(`${COINGECKO_API}?ids=${req.params.coin}&vs_currencies=inr`);
    res.json({ coin: req.params.coin, price: data[req.params.coin].inr });
  } catch (err) {
    console.error("Buying crypto eror :", error); // 🔥 Logs the actual error
    res.status(500).json({ error: "Error fetching price" });
  }
});

module.exports = router;