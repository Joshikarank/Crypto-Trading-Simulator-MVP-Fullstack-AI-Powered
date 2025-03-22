const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// ✅ Middleware to Parse JSON (Fixes req.body issue)
app.use(express.json()); 
app.use(cors());
app.use((req, res, next) => {
  console.log(`📡 Incoming Request: ${req.method} ${req.url}`);
  console.log("📝 Request Body:", req.body);
  console.log("🔑 Headers:", req.headers);
  next();
});

// Import Routes
const authRoutes = require("./routes/authRoutes");
// const portfolioRoutes = require("./routes/portfolioRoutes");

const cryptoRoutes = require("./routes/cryptoRoutes");

app.use("/api/auth", authRoutes);
// app.use("/api/portfolio", portfolioRoutes);
app.use("/api/crypto", cryptoRoutes);
app.use("/api/portfolio", cryptoRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("🔥 Unhandled Promise Rejection:", reason);
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
