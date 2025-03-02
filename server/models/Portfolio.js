// server/middleware/authMiddleware.js

const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User-specific portfolio
  holdings: [
    {
      coin: String,
      amount: Number,
      invested: Number,
      buyPrice: Number
    }
  ],
  balance: { type: Number, default: 1000000 } // Default virtual money per user
});

module.exports = mongoose.model("Portfolio", PortfolioSchema);
