# 💹 Felix AI v2 — Sentiment-Aware Crypto Forecasting Dashboard

> **Author:** Joshikaran K  
> **B.Tech CSE - SRMIST**  
> **Graduation:** May 2024  

---

## 🆕 What’s New in v2?

Felix AI has evolved from a single-model crypto predictor into a **multi-model ensemble forecasting engine** with **real-time sentiment analysis** and improved logging.

**Felix AI v2 includes:**
- ✅ **XGBoost + Prophet + LSTM ensemble model**
- ✅ **CryptoPanic news sentiment** fused into feature engineering
- ✅ **Background prediction scheduler**
- ✅ **Improved logging and accuracy feedback**
- ✅ **Bug fixes, better error handling, modular training pipeline**

> 🔥 Every coin forecast now considers price + volume + past patterns + social signals.  
> No fluff — just signal.

---

## 🧠 Project Summary

Felix AI is a **complete AI-powered cryptocurrency dashboard and simulator** that allows users to:

- 🧪 Predict hourly price movement of any crypto coin using ensemble ML
- 📈 Simulate trading on a virtual ₹1,000,000 portfolio
- 🧠 Interact with Felix — a reasoning financial assistant
- 📰 Incorporate **real-world news sentiment** into predictions
- 📊 Log prediction accuracy in real-time

No fake data. No black box models. You see what Felix sees.

---

## 🧩 Problems Solved (Updated in v2)

| Problem | Solution |
|--------|----------|
| Predictions are blind to market mood | ✅ Integrated CryptoPanic sentiment analysis (via VADER) |
| ML model overfits to recent spikes | ✅ Blended XGBoost + Prophet + LSTM |
| Manual refresh for predictions | ✅ Background hourly scheduler (automated predictions) |
| Single prediction = no benchmark | ✅ Logging & backtesting built-in |
| Model retrains too often | ✅ Added age check for retraining + persistent models |

---

## 🚀 Tech Stack

### 📦 Backend
- **Node.js + Express**: User auth, portfolio API
- **Flask**: ML model hosting and inference
- **MongoDB Atlas**: Real-time user data and logs
- **JWT**: Secure session auth
- **Scheduler Thread**: For hourly forecasting per coin

### 🧠 AI & Forecasting
- **XGBoost**: Fast gradient boosting on lag features
- **Prophet**: Trend + seasonality detection
- **LSTM**: Short memory deep learning
- **VADER (NLTK)**: Sentiment scoring from headlines
- **Voting Ensemble** (planned): Combine outputs from all 3 models

### 💻 Frontend
- **HTML + CSS + Vanilla JS**: Fully responsive custom-built UI
- **Cyberpunk Dashboard Aesthetic**: Visual clarity + future vibes

---

## ✨ Key Features

### 🧠 Ensemble Prediction Engine
- Each coin uses **3 ML models** to generate its prediction.
- Feature set includes lagged price/volume, percent change, and **average sentiment score** from news.
- **Prophet** also uses sentiment as a regressor.

### 📰 Sentiment Fusion
- Pulls top headlines using [CryptoPanic](https://cryptopanic.com)
- Uses **VADER** to calculate compound sentiment score
- Injected into every ML pipeline for signal-based forecasting

### 🔄 Background Prediction Scheduler
- Hourly predictions run in parallel threads
- Automatically logs to JSON files
- No UI refresh needed — always up-to-date

### 🧪 Prediction Logging & Accuracy Monitoring
- Every prediction saved with:
  - Timestamp
  - Actual price
  - Predicted price
  - Confidence score (based on recent MAE)
- Stored in `/logs/<coin>_log.json`

### 🔒 User & Portfolio Isolation
- Secure JWT-based login
- Private portfolios, settings, and AI responses

---

## 📁 Folder Structure
```
/crypto_dashboard
├── /server                   # Node backend (auth, API)
├── /cypto_predictor         # ML models (Flask + XGBoost/Prophet/LSTM)
│   ├── app.py               # Flask entry point
│   ├── core.py              # All prediction & training logic
│   └── schedulers.py        # Background job scheduler
├── /felix_ai
│   └── pns.py               # Pump/sniff & LLM assistant brain
├── /frontend
│   ├── *.html               # Dashboard, predict, settings
│   └── *.css                # Styling
```

---

## ⚙️ How To Run (Local Setup)

> Requires: Python 3.8+, Node.js, MongoDB URI, virtualenv, and CryptoPanic API key

### Step 1: Start Node Auth Server
```bash
cd server
npx nodemon server.js
```

### Step 2: Start ML Forecast Engine
```bash
cd cypto_predictor
python app.py
```

### Step 3: Optional — Start Assistant Module
```bash
cd felix_ai
python pns.py
```

### Step 4: Launch UI
Open `frontend/dashboard.html` or use a live server.

---

## 📽️ Demo Video
A full walkthrough of:
- Adding coins
- Model predictions
- Sentiment integration
- Dashboard features

👉 Available on request (comment on tutorial video)

---

## 🙏 Final Thoughts

This is Felix AI v2 — smarter, more honest, and deeply tuned for reality.

While others use black-box LLMs and fake data, I show every:
- Feature
- Forecast
- Failure

I’ve proven that even with just a laptop, if you understand your tools and your problem — you can build something intelligent.

> "You don’t need OpenAI’s budget. You need clarity and fire." — Joshikaran K

---

## 🧔 About Me

**Joshikaran.K**  
B.Tech CSE @ SRMIST (2024)

I build **end-to-end AI systems** that work in the real world. From time series forecasting to prompt-tuned assistants, I engineer with purpose.

**This entire project — models, UI, backend, AI — is my solo work.**  
I built it, tested it, debugged it, and improved it — brick by brick.

---

Let me know if you'd like a version with badges, hosted preview, or markdown download format!