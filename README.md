# 💹 Felix AI v2 — Sentiment-Aware Crypto Forecasting Dashboard

> **Author:** Joshikaran K  
> **B.Tech CSE - SRMIST**  
> **Graduation:** May 2024  

---

## 🆕 What’s New in v2?

Felix AI has evolved from a basic XGBoost predictor into a **multi-model ensemble forecasting engine** with real-time sentiment awareness and intelligent logging.

**Felix AI v2 includes:**
- ✅ **XGBoost + Prophet + LSTM ensemble modeling**
- ✅ **News sentiment fusion** from CryptoPanic using VADER
- ✅ **Background scheduler** for automated hourly predictions
- ✅ **Live logging, backtesting-ready architecture**
- ✅ **Improved feature engineering, model retrain logic**

> 🔥 Every forecast now considers **market movement + social sentiment + temporal patterns**.  
> It’s built to be smart, not just fast.

---

## ⚠️ Before You Use

**This system is heavy.** It uses:
- Real-time API calls (CoinGecko + CryptoPanic)
- Machine Learning model retraining
- Threaded scheduling
- In-memory inference (XGBoost, Prophet, LSTM)

### 🚨 System Requirements:
- ✅ Minimum: **8 GB RAM**, **i5/Ryzen processor**
- ✅ Recommended: **Cloud GPU (e.g., Colab Pro, Lambda Labs, Paperspace)**
- ⚠️ Do **not** expect smooth performance on low-end laptops
- ⏱️ **24/7 running is recommended** for full forecasting logs

---

## 🧠 Project Summary

Felix AI is an **end-to-end AI crypto dashboard** that lets users:

- 🧪 Predict hourly coin prices using ML models
- 📈 Simulate trades with ₹1,000,000 virtual capital
- 🧠 Ask Felix (the AI) about markets, sentiment, or strategies
- 📰 Automatically read and factor in real crypto news
- 📊 Monitor forecast accuracy over time

It’s like building your own quant trading system — without touching a rupee.

---

## 🧩 Problems Solved

| Problem | Solution |
|--------|----------|
| Price predictions ignore real-world sentiment | ✅ CryptoPanic news sentiment + VADER |
| One model can’t generalize | ✅ Uses **3 different models** (XGBoost, Prophet, LSTM) |
| Manual refresh for new prices | ✅ Hourly background auto-predictor |
| No learning from past predictions | ✅ Logs accuracy and results for analysis |
| Retraining is too frequent | ✅ Now only retrains when needed (model age logic) |

---

## 🚀 Tech Stack

### 📦 Backend
- Node.js (Express) — Auth, portfolio APIs
- Flask — Forecasting server
- MongoDB Atlas — Portfolio + log storage
- Python threading — Hourly background prediction

### 🧠 AI & Forecasting
- **XGBoost** — Fast + interpretable
- **Prophet** — Trend + seasonality modeling
- **LSTM (Keras)** — Sequence learning for price series
- **VADER (NLTK)** — News sentiment analyzer
- **CryptoPanic API** — News aggregation per coin

### 💻 Frontend
- HTML, CSS, JS — No frameworks, all handcrafted
- Theme — Cyberpunk-inspired AI dashboard

---

## ✨ Key Features

- 📈 Real-time predictions + accuracy tracking
- 📰 Crypto news sentiment integration
- 🔄 Automated hourly forecasting
- 📊 Visual portfolio, PnL, model results
- 🔒 Secure login and user separation
- 🧠 Ask Felix — an AI assistant with forecasting + memory

---

## 🧪 Accuracy Snapshot

After testing across top coins like **Bitcoin**, **Doge**, **Ethereum**, and **SOL**, we observed:

| Model        | Avg Accuracy (1-hour horizon) |
|--------------|-------------------------------|
| XGBoost      | ~85-90%                       |
| Prophet      | ~80-88%                       |
| LSTM         | ~82-89%                       |
| **Ensemble** | **~87-91%**                   |

> **Note:** Accuracy is measured using mean absolute error relative to average price range. Actual values fluctuate based on market volatility and coin liquidity.

---

## ❌ Why No Full Backtest?

Truthfully?

> I already used up my savings just to test the predictions over a 2-week window manually.

The output was surprisingly good — better than many SaaS tools I’ve tried.  
But I couldn't afford cloud GPUs to backtest massive historical data.

So I prioritized **smart forecasting + live accuracy logging** over fancy retrospective graphs.

> I'm a builder — not a funded lab.

---

## 📁 Folder Structure

```
/crypto_dashboard
├── /server                   # Node backend (auth, API)
├── /cypto_predictor         # Flask + ML ensemble models
│   ├── app.py               # Entry point for ML server
│   ├── core.py              # Main logic (XGBoost, Prophet, LSTM)
│   └── schedulers.py        # Background prediction loop
├── /felix_ai
│   └── pns.py               # Pump/news assistant + sentiment
├── /frontend
│   ├── dashboard.html       # UI: Predictions, portfolio
│   ├── settings.html, login.html, etc.
│   └── css/                 # Styles
```

---

## 🛠️ How To Run

> You’ll need Python 3.8+, Mongo URI, CryptoPanic API key, and Node.js

```bash
# 1. Start backend
cd server
npx nodemon server.js

# 2. Start ML prediction server
cd cypto_predictor
python app.py

# 3. Optional: Run Felix AI module
cd ../felix_ai
python pns.py

# 4. Open dashboard in browser (index.html or dashboard.html)
```

---

## 📽️ Demo Video

🎥 Recorded end-to-end demo available upon request.  
Comment on the tutorial video if you want access to the project walk-through.

---

## 🔚 Final Words

This is **Felix AI v2**.

It’s not just another crypto bot. It’s **an intelligent forecasting system**  
built by one person, on one laptop, with one obsession: **to learn and build.**

---

> “You don’t need OpenAI’s budget. You need clarity and fire.” — Joshikaran K

---

**Happy Trading 💸  
— Joshikaran (Felix AI Creator)**

---