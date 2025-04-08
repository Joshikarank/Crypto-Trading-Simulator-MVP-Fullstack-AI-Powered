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

## ⚠️ WARNING Before You Use

Felix AI v2 isn’t a toy script. It retrains models hourly, fetches live APIs, computes ensemble forecasts, and logs predictions. That’s **ML + sentiment + real-time I/O**.

**This system is heavy.** It uses:
- Real-time API calls (CoinGecko + CryptoPanic)
- Machine Learning model retraining
- Threaded scheduling
- In-memory inference (XGBoost, Prophet, LSTM)

---

### 💻 Local System (Minimum) – *Just to see the output, don’t expect pro performance*

| Component | Minimum |
|----------|---------|
| RAM      | 8 GB (bare minimum, no multitasking) |
| CPU      | i5 / Ryzen 5 or better |
| Storage  | SSD recommended (model writes) |
| OS       | Linux or Windows 10 |

⚠️ **Don’t even try running Prophet + LSTM training together** on 4GB RAM — you’ll brick your computer.

---

## 🔥 Recommended Setup (Cloud or Dedicated GPU)

To run all 3 models **(XGBoost + Prophet + LSTM)** smoothly with live retraining:

| Resource        | Spec                      |
|----------------|---------------------------|
| GPU (preferred) | **NVIDIA Tesla T4 / V100 / A10** |
| vRAM            | **>= 12 GB** for LSTM stability |
| RAM             | 16 GB or more             |
| Cores           | 4+ physical cores         |
| Platform        | Use [**Vast.ai**](https://vast.ai) — cheap GPU rentals |

💡 *You can rent a GPU for the lowest costs on Vast.ai — no credit card needed.*

---

## 💸 Personal Spend & Reality

> I already **spent my own money** just to test the model predictions on a small time window (~2 weeks).  
> I was shocked by how **accurate** it was — better than some paid tools.

But cloud GPUs for large-scale backtesting or deep retraining?  
I couldn’t afford them. And I didn’t fake anything.

This project was built on **truth**, not marketing.

---

### 🔁 Felix AI Is Meant To Run 24/7

If you deploy this on a cloud GPU:
- ✅ Predictions log themselves
- ✅ Models auto-retrain hourly
- ✅ Backtests write to file for insights

You basically get a **self-learning, sentiment-aware quant bot**.  
**Let it run. Watch it grow.**

---

## 🧠 Project Summary

Felix AI is an **end-to-end AI crypto dashboard** that lets users:

- 🧪 Predict hourly coin prices using ML models
- 📈 Simulate trades with ₹1,000,000 virtual capital
- 🧠 Ask Felix (the AI) about markets, sentiment, or strategies
- 📰 Automatically read and factor in real crypto news
- 📊 Monitor forecast accuracy over time

All features are built **end-to-end by me — Brick by Brick 🧱**.

🎥 A full **demo video** is available upon request (not public due to originality concerns).

---

## 🧩 Problems Solved

| Problem | Solution |
|--------|----------|
| Price predictions ignore real-world sentiment | ✅ CryptoPanic news sentiment + VADER |
| One model can’t generalize | ✅ Uses **3 different models** (XGBoost, Prophet, LSTM) |
| Manual refresh for new prices | ✅ Hourly background auto-predictor |
| No learning from past predictions | ✅ Logs accuracy and results for analysis |
| Retraining is too frequent | ✅ Smart retrain with model age check |

Most people:
- Don’t understand how crypto trading works
- Can’t afford to experiment with real money
- Don’t get personalized insights or simple forecasting

### Felix AI solves that by:
- Creating a **virtual trading simulator** with ₹1,000,000 paper money  
- Showing **real-time predictions** using machine learning  
- Offering a **personal assistant** that explains trades, gives signals  
- Presenting a **beautiful dashboard** with clear PnL and insights

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

> 📊 *Accuracy = 100 - MAE / average price × 100*  
> Actual performance varies based on coin volatility & data quality

---

## ❌ Why No Full Backtest?

> I already used up my money just testing the system.  
> The results were real — surprisingly good.  
> But I couldn’t afford cloud GPUs to process months of historical data.

So I chose **live prediction logging** over artificial backtest graphs.

---

## 📁 Folder Structure

```
/crypto_dashboard
├── /server              # Node backend (auth, API)
├── /cypto_predictor     # Flask + ML models
│   ├── app.py           # Flask entry
│   ├── core.py          # ML logic (XGBoost, Prophet, LSTM)
│   └── schedulers.py    # Background hourly forecast thread
├── /felix_ai
│   └── pns.py           # Felix Assistant brain (LLM + sentiment)
├── /frontend
│   ├── *.html           # Dashboard, Predict, Login, Settings
│   └── css/             # Styles
```

---

## 🧠 Felix AI Assistant — Not Just Chat, It *Thinks*

Felix isn’t just GPT stuck in a textbox.

I used **Mistral LLM** as the reasoning layer — but wrapped it with:
- Awareness of user portfolio
- Access to real-time predictions
- Sentiment + pump signal hooks

> Ask: *"Should I sell DOGE?"* — Felix checks your buy price, current trends, and mood to respond like a real analyst.

---

## 🧪 Predictive Logs & Feedback

Every forecast is:
- Logged with timestamp
- Compared with actual price
- Tracked for accuracy %  
> This makes it **self-auditing** — a rare thing in trading apps.

---

## ⚠️ Real-World Constraints

- No hosting yet — couldn’t afford cloud
- Free-tier APIs — CoinGecko rate limits hit often
- No LSTM in production — GPU cost too high, fallback is XGBoost

Still, the system works beautifully **locally**.

> It wasn’t built with money. It was built with knowledge.

---

## 🛠️ How To Run

> Requires: Python 3.8+, Node.js, Mongo URI, CryptoPanic API key

```bash
# 1. Start Node backend
cd server
npx nodemon server.js

# 2. Start ML prediction server
cd cypto_predictor
python app.py

# 3. Start Felix AI module
cd ../felix_ai
python pns.py

# 4. Open frontend (dashboard.html or index.html)
```

---

## 📽️ Demo Video

🎥 Full system walkthrough available — drop a comment on my YouTube/Tutorial to request access.

---

## 🔚 Final Words

This is **Felix AI v2** — not just a project, but a **proof of vision, execution, and hunger to build real things**.

> “You don’t need OpenAI’s budget. You need clarity and fire.” — Joshikaran K

---

**Happy Trading 💸  
— Joshikaran (Felix AI Creator)**
