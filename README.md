# 💹 Felix AI: Crypto Trading & Forecasting Dashboard

> **Author:** Joshikaran K  
> **B.Tech CSE - SRMIST** | Class of 2024  
> [📽 Demo Video](https://youtu.be/Myz-V5QSbmA) | [🧭 Full Walkthrough](https://youtu.be/F4mY5Iw434c)

---

## 🧠 Project Summary

Felix AI is a **full-stack, AI-powered crypto dashboard** that lets users:
- Trade cryptocurrencies with ₹1,000,000 virtual cash 💰  
- Get ML-powered **price predictions** (XGBoost)  
- Interact with a futuristic **AI assistant** named Felix 🤖  
- View personalized portfolio growth, risk analysis & news signals 📊  
- Experience a **super interactive UI/UX**, hand-built with HTML/CSS/JS  

> Every feature was designed to simulate **how a real crypto trader thinks, acts, and evolves** — but safely and intelligently.

---

## 🎯 MVP Vision

This project is built as a **potential product MVP** for:
- Retail investors exploring trading with zero risk
- Crypto beginners learning with guidance from Felix
- Product testing of forecasting models + assistant-based UX
- AI integration into personal finance dashboards

It validates the concept of a **personal crypto analyst & trader** assistant — fully local, dynamic, and extensible.

---

## 🧩 Real-World Problems Solved

| Problem | Felix AI's Answer |
|--------|------------------|
| "I'm scared to trade real crypto" | ₹1,000,000 paper money simulator |
| "How do I know when to buy/sell?" | AI forecasts + Felix's advice |
| "I don’t understand technicals" | Felix explains trades in simple terms |
| "Markets are too volatile" | Pump/volume alerts, sentiment warnings |
| "I need a clean dashboard" | Super interactive UI, clear charts, instant P&L |

---

## 🚀 Standout Features

### 💬 Felix AI — Your Crypto Companion

> *"Think of Felix as your private analyst, strategist, and teacher."*

Built using a prompt-engineered LLM (Mistral-based), Felix can:
- Analyze **your portfolio context** and give reasoning  
- Understand **past prices, predictions, sentiment**  
- Generate **actionable trading suggestions**

#### 🧠 Example Prompts You Can Ask Felix

> These work live in `index.html` chat UI (`/felixai` route):

| Prompt | What Felix Does |
|--------|----------------|
| `"Should I sell my ETH now?"` | Compares your buy price, forecast, current price, pump risk |
| `"What’s the risk on DOGE today?"` | Checks pump sniff data + volume spikes |
| `"How accurate are your last 3 predictions?"` | Shows past predictions and accuracy scores |
| `"Suggest a safe coin to invest now"` | Cross-checks sentiment, volume, forecast confidence |
| `"Why did BTC spike yesterday?"` | Analyzes volume delta + sentiment delta |
| `"Explain how your predictions work"` | Breaks down XGBoost model features |

#### 🧠 Code Behind Felix's Brain

```python
# pns.py
if sudden_spike_detected(coin):
    pump_risk[coin] = "HIGH"
    
# Flask app.py
response = mistral_api(
  prompt=f"""
  User owns {coin} bought at ₹{buy_price}.
  Predicted price = ₹{pred}, pump risk = {risk}%.
  Respond with explanation and next move.
  """
)
```

---

## 🧠 Prediction Engine

- Built using **XGBoost** — fast, scalable, and accurate with tabular time series
- Trains coin-wise models on-the-fly and updates them over time
- Forecasts up to 5 days ahead
- Includes **custom confidence %**, based on volatility & historical accuracy

```python
def train_model(df):
    features = extract_features(df)
    model = xgb.XGBRegressor(...)
    model.fit(X_train, y_train)
    return model
```

🧪 Accuracy is stored and compared in Mongo:
```json
{
  "timestamp": "2025-04-01 14:00",
  "coin": "solana",
  "predicted_price": 932,
  "actual_price": 927,
  "accuracy": 99.46
}
```

---

## 📊 Portfolio Dashboard

**Route:** `/dashboard.html`

Displays:
- **Total balance** (₹1M base + market-adjusted holdings)
- **Invested amount**
- **Profit/Loss in ₹ + %**
- **Individual coin cards** showing:
  - Buy price
  - Current price
  - P/L badge (color coded)
  - Sell sliders + action buttons

### 🧪 UI Example
```js
<h3 id="profitText">📈 Profit/Loss: ₹+3,521 (1.3%)</h3>
<div class="holding">
  <strong>Bitcoin</strong>
  <p>Invested: ₹25,000 | Current: ₹28,521</p>
</div>
```

---

## ⚙️ Secure User Auth

```js
Authorization: Bearer <jwt_token>
```

- JWT token for every session
- Routes are protected using middleware
- Separate portfolios, predictions, and settings per user

> **Bonus:** User can update profile or delete account directly from `/settings.html`

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | HTML, CSS, JS (Vanilla) |
| Backend | Node.js + Express |
| ML API | Flask + XGBoost |
| Database | MongoDB Atlas |
| Auth | JWT |
| Assistant | Mistral LLM (cloud) |
| Data | CoinGecko API (real-time) |

---

## 🧬 Architecture Diagram

```
Browser <-> Node.js API <-> MongoDB
            |
            +---> Flask (XGBoost models)
            |
            +---> pns.py (Pump + Sentiment)
                          |
                          +---> Felix AI LLM API
```

---

## 📺 Videos

- ▶️ [Live Demo Video](https://youtu.be/Myz-V5QSbmA) — Walkthrough of paper trading + predictions + Felix
- 🎞 [Full Walkthrough](https://youtu.be/F4mY5Iw434c) — Code + logic explained section by section

---

## 📁 Folder Structure (Simplified)
```
Felix-AI/
├── server/
│   ├── routes/ (auth, crypto, portfolio)
│   ├── models/ (User, Portfolio)
│   └── server.js
├── cypto_predictor/
│   └── app.py  (Flask + ML)
├── felix_ai/
│   └── pns.py  (Pump/News logic)
├── frontend/
│   ├── index.html (Felix chat UI)
│   ├── dashboard.html
│   ├── settings.html
│   └── buycoins.html
```

---

## 🧪 Try It Locally

> Requires: Python 3.8+, Node.js, MongoDB URI

```bash
# Start backend
cd server && npx nodemon server.js

# Start Flask model API
cd ../cypto_predictor && python app.py

# Start pump/news module
cd ../felix_ai && python pns.py

# Open frontend HTML (Live Server)
```

---

## 🧔 About Me

I'm **Joshikaran K**, a final-year B.Tech CSE student who builds **real systems** that simulate the real world — not just toy projects.

What I understand:
- Model lifecycle management
- Prompt + LLM tuning
- Forecasting vs nowcasting
- UX that feels alive
- MVP delivery under real-world constraints

---

## ⚠️ Known Limitations

- Free CoinGecko tier hits rate limits
- Not deployed (no funds for hosting/GPU)
- XGBoost over DL due to compute trade-off
- Assistant uses API, not local LLM yet

---

## 🧭 Final Word

> *"If you're reading this, and you're wondering if one broke student can build intelligent apps that feel like the future... this is your proof."*

- No templates  
- No boilerplates  
- No clones  

**Built Brick by Brick 🧱 — With 💻 + 🧠 + ❤️.**
