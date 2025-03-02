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
router.post("/sell", async (req, res) => {
  const { coin, amountInINR } = req.body; // Accept INR instead of BTC amount

  try {
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(400).json({ error: "Portfolio not found" });
    }

    const holding = portfolio.holdings.find((h) => h.coin === coin);
    if (!holding || holding.invested < amountInINR) {
      return res.status(400).json({ error: "Not enough holdings to sell" });
    }

    // 🔥 Get live price from CoinGecko
    const { data } = await axios.get(`${COINGECKO_API}?ids=${coin}&vs_currencies=inr`);
    const sellPrice = data[coin].inr; // Current price in INR

    // Convert INR to BTC equivalent
    const cryptoAmountToSell = amountInINR / sellPrice;

    // Deduct sold amount
    holding.amount -= cryptoAmountToSell;
    holding.invested -= amountInINR;

    // Add INR back to balance
    portfolio.balance += amountInINR;

    // Remove holding if all sold
    if (holding.amount <= 0) {
      portfolio.holdings = portfolio.holdings.filter((h) => h.coin !== coin);
    }

    await portfolio.save();
    res.json({ 
      message: "Crypto Sold", 
      soldAmount: cryptoAmountToSell, 
      soldFor: amountInINR, 
      portfolio 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
