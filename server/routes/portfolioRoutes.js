// server/routes/portfolioRoutes.js

const express = require("express");
const router = express.Router();
const Portfolio = require("../models/Portfolio");
const axios = require("axios");

const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price";
// Example route to test

router.get("/", (req, res) => {
  res.send("Portfolio API Working!");
});


const authMiddleware = require("../middleware/authMiddleware");

router.post("/buy", authMiddleware, async (req, res) => { 
  try {
    console.log("💰 Buy Request Received:", req.body);
    console.log("🔹 Extracted User ID:", req.userId); // This should log the userId

    if (!req.headers.authorization) {
      console.error("🚨 No Authorization Header Found");
      return res.status(401).json({ error: "Unauthorized - No Token" });
    }

    const { userId } = req;
    const { coin, virtualMoney } = req.body;

    console.log("🔹 Coin:", coin);
    console.log("🔹 Virtual Money:", virtualMoney);

    if (!req.userId) {
      console.error("❌ User ID is missing from token.");
      return res.status(400).json({ error: "Invalid token" });
    }

    if (!coin || !virtualMoney) {
      console.error("❌ Missing coin or virtualMoney.");
      return res.status(400).json({ error: "Missing fields" });
    }

    console.log("📡 Fetching Price from CoinGecko...");
    const { data } = await axios.get(`${process.env.COINGECKO_API}?ids=${coin}&vs_currencies=inr`);
    const priceInINR = data[coin]?.inr;

    console.log("✅ Price Fetched:", priceInINR);

    if (!priceInINR) {
      console.error("❌ CoinGecko API Error - No Price Found.");
      return res.status(500).json({ error: "Invalid coin or API issue" });
    }

    let portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      console.warn("⚠️ No Portfolio Found - Creating New Portfolio.");
      portfolio = new Portfolio({ userId, holdings: [], balance: 1000000 });
    }

    if (portfolio.balance < virtualMoney) {
      console.warn("⚠️ Insufficient Balance.");
      return res.status(400).json({ error: "Not enough virtual balance" });
    }

    console.log("✅ Deducting Balance & Processing Transaction...");
    portfolio.balance -= virtualMoney;

    const existingHolding = portfolio.holdings.find((h) => h.coin === coin);
    if (existingHolding) {
      existingHolding.amount += virtualMoney / priceInINR;
      existingHolding.invested += virtualMoney;
    } else {
      portfolio.holdings.push({
        coin,
        amount: virtualMoney / priceInINR,
        invested: virtualMoney,
      });
    }

    await portfolio.save();
    console.log("✅ Transaction Successful:", portfolio);

    res.json({ message: "Crypto Purchased", portfolio });

  } catch (error) {
    console.error("🔥 Buy Crypto ERROR:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
});


// ✅ Sell Crypto (Now Accepts INR Instead of BTC)

router.post("/sell", authMiddleware, async (req, res) => {
  const { coin, amountInINR } = req.body;

  try {
    // 🔐 Require token + input validation
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized – user ID missing" });
    }

    if (!coin || typeof amountInINR !== "number" || amountInINR <= 0) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const normalizedCoin = coin.toLowerCase().trim();

    // 📡 Fetch live price from CoinGecko
    const { data } = await axios.get(`${COINGECKO_API}?ids=${normalizedCoin}&vs_currencies=inr`);
    const sellPrice = data[normalizedCoin]?.inr;

    if (!sellPrice || sellPrice < 1) {
      return res.status(400).json({ error: "Invalid or suspicious coin price" });
    }

    // 🔍 Find portfolio by user
    const portfolio = await Portfolio.findOne({ userId: req.userId });
    if (!portfolio) {
      return res.status(400).json({ error: "Portfolio not found" });
    }

    // 🔍 Check if coin exists in holdings
    const holding = portfolio.holdings.find(
      (h) => h.coin.toLowerCase().trim() === normalizedCoin
    );

    if (!holding) {
      return res.status(400).json({ error: `You don't own any ${coin}` });
    }

    // 🧮 Calculate how much crypto to sell for the given INR
    const cryptoAmountToSell = amountInINR / sellPrice;
    const currentHoldingValue = holding.amount * sellPrice;

    if (holding.amount < cryptoAmountToSell) {
      return res.status(400).json({
        error: `Not enough ${coin} to sell ₹${amountInINR}. Your current holding is worth only ₹${currentHoldingValue.toFixed(2)}.`
      });
    }

    // ✅ Perform the sale
    holding.amount -= cryptoAmountToSell;
    holding.invested -= amountInINR;
    portfolio.balance += amountInINR;

    // 🧽 Cleanup and rounding
    if (holding.amount < 1e-8) {
      portfolio.holdings = portfolio.holdings.filter(
        (h) => h.coin.toLowerCase().trim() !== normalizedCoin
      );
    } else {
      holding.amount = parseFloat(holding.amount.toFixed(8));
      holding.invested = parseFloat(holding.invested.toFixed(2));
    }

    portfolio.balance = parseFloat(portfolio.balance.toFixed(2));

    await portfolio.save();

    res.json({
      message: "Crypto Sold",
      soldAmount: cryptoAmountToSell,
      soldFor: amountInINR,
      sellPrice,
      portfolio
    });

  } catch (err) {
    console.error("🔥 Sell Error:", err.message);
    res.status(500).json({ error: err.message || "Server Error" });
  }
});


// const authMiddleware = require("../middleware/authMiddleware");
// // Apply authMiddleware to the /buy route
// router.post("/buy", authMiddleware, async (req, res) => {
//   try {
//     console.log("💰 Buy Request Received:", req.body);
//     console.log("🔹 Extracted User ID:", req.userId);

//     const { coin, virtualMoney } = req.body;
    
//     if (!req.userId) {
//       console.log(requserId)
//       console.error("❌ User ID is missing from token.");
//       return res.status(400).json({ error: "Invalid token" });
//     }

//     if (!coin || !virtualMoney) {
//       console.error("❌ Missing coin or virtualMoney.");
//       return res.status(400).json({ error: "Missing fields" });
//     }

//     // Fetch price from CoinGecko
//     console.log("📡 Fetching Price from CoinGecko...");
//     const apiUrl = `${process.env.COINGECKO_API}?ids=${coin}&vs_currencies=inr`;
//     console.log("🔹 API URL:", apiUrl);

//     const { data } = await axios.get(apiUrl);
//     console.log("🔹 CoinGecko Response:", data);

//     const priceInINR = data[coin]?.inr;
//     console.log("✅ Price Fetched:", priceInINR);

//     if (!priceInINR) {
//       return res.status(500).json({ error: "Invalid coin or API issue" });
//     }

//     // Find or create the user's portfolio
//     let portfolio = await Portfolio.findOne({ userId: req.userId });
//     console.log("🔹 Portfolio Found:", portfolio);

//     if (!portfolio) {
//       console.warn("⚠️ No Portfolio Found - Creating New Portfolio.");
//       portfolio = new Portfolio({ userId: req.userId, holdings: [], balance: 1000000 });
//     }

//     // Check if the user has enough balance
//     if (portfolio.balance < virtualMoney) {
//       return res.status(400).json({ error: "Not enough virtual balance" });
//     }

//     console.log("✅ Deducting Balance & Processing Transaction...");
//     portfolio.balance -= virtualMoney;

//     // Update holdings
//     const existingHolding = portfolio.holdings.find((h) => h.coin === coin);
//     if (existingHolding) {
//       existingHolding.amount += virtualMoney / priceInINR;
//       existingHolding.invested += virtualMoney;
//     } else {
//       portfolio.holdings.push({ coin, amount: virtualMoney / priceInINR, invested: virtualMoney });
//     }

//     // Save the updated portfolio
//     await portfolio.save();
//     console.log("✅ Transaction Successful:", portfolio);

//     res.json({ message: "Crypto Purchased", portfolio });
//   } catch (error) {
//     console.error("🔥 Buy Crypto ERROR:", error);
//     res.status(500).json({ error: error.message || "Server Error" });
//   }
// });

module.exports = router; // ✅ Make sure only `router` is exported
