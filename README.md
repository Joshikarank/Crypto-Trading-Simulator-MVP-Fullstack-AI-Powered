# 💹 Felix AI: Crypto Trading & Forecasting Dashboard

> **Author:** Joshikaran K  
> **B.Tech CSE - SRMIST**  
> **Graduation:** May 2024  

---

## 🧠 Project Summary

Felix AI is a **full-stack AI-powered cryptocurrency dashboard and simulator** that allows users to:

- Simulate real-time crypto trading using virtual money.
- Predict coin prices using custom-trained ML models (XGBoost).
- Visualize portfolio growth, profits/losses, and forecasts.
- Interact with a personalized assistant (Felix AI) for insights and actions.

All features are built **end-to-end by me — Brick by Brick 🧱**.

To provide further proof of ownership, I recorded a complete **demo video** showcasing the working features and system integration. This video was created solely by me, and is available for verifiable access upon request.

---

## 🚀 Why I Made This

I wanted to build a real-world application that blends:

- **Machine Learning + Finance**
- **Frontend + Backend**
- **Forecasting + Simulation**
- **Real-world APIs + Databases**

But beyond that, I wanted to prove something to myself — that with deep understanding and relentless focus, I could build an intelligent system, even with minimal resources. Every feature here wasn't just an add-on. It was **intentional**.

> "If you can't afford rockets, build gliders. But make them fly." — Me

I've shared my resume and portfolio with people ranging from seasoned developers to unemployed peers. Unfortunately, I’ve had a few painful experiences of project theft during these outreach attempts. For this reason, I decided **not to make this project open-source on GitHub**, despite how much I love the open dev culture. Protecting original work matters too.

---

## 🧩 What Problem Does It Solve?

Most people:
- Don’t understand how crypto trading works.
- Can’t afford to experiment with real money.
- Don’t get personalized insights or simple forecasting.

### Felix AI solves that by:
- Creating a **virtual trading simulator** with ₹1,000,000 paper money.
- Showing **real-time predictions** using machine learning.
- Offering a **personal assistant** (Felix AI) that can explain trades, give signals, and forecast market direction.
- Presenting a **clear, beautiful dashboard** with profit/loss visualizations.

It makes machine learning and finance feel intuitive and accessible — not intimidating.

---

## 🛠️ Tech Stack & Why I Chose Each

### 📦 Backend
- **Node.js + Express**: Perfect for lightweight APIs and handling authentication and user data securely. Chosen for its async nature and modularity.
- **MongoDB Atlas**: Fast and flexible NoSQL database — perfect for dynamic crypto portfolios and historical prediction logs.
- **Flask (Python)**: Seamlessly runs XGBoost and ML pipelines. Lightweight yet powerful — ideal for inference tasks.
- **JWT Auth**: Ensures that each user session is secure. Essential for individual portfolio isolation.

### 💻 Frontend
- **HTML, CSS, JS (Vanilla)**: No frameworks. Pure control. I built every interaction and animation manually — the UI is fully responsive and performance-optimized.
- **Cyberpunk + Neon Design**: Because a futuristic AI tool should *look* the part too. It reflects ambition.

### 📈 Data & AI
- **CoinGecko API**: Reliable free source for crypto data.
- **XGBoost**: After testing Prophet and LSTM, I leaned into XGBoost. It was computationally cheaper but performed surprisingly well with proper feature engineering. This shows my practical knowledge of trade-offs in ML.
- **Custom Confidence Score**: Derived from past prediction accuracy and volume/price shifts — shows a clear understanding of error analysis.

---

## ✨ Special Features & Philosophy Behind Them

### ✅ Real-time Paper Trading
I didn't just want a dashboard — I wanted simulation. A user can test investment strategies with zero risk. That teaches more than theory ever can.

### 🧠 XGBoost Forecast Engine
Rather than randomly guessing prices, I trained and validated models per coin, per timeframe. The system adjusts predictions based on new data. It proves my comfort with time series processing and lifecycle-aware retraining.

### 🤖 Felix AI Assistant — Not Just Chat, It *Thinks*
Felix isn’t a typical chatbot.

I used **Mistral LLM** as the core reasoning engine. But I layered on top of it:
- Memory of user portfolio
- Awareness of latest predictions
- Access to pump/news sentiment

Felix was trained (prompt-tuned) to be a *cyber-financial analyst*, blending precision and character. It reflects my grasp of LLM pipelines and Retrieval-Augmented Generation (RAG). 

> Example: You can ask Felix *"Is now a good time to sell SOL?"* — and it will analyze your entry price, current forecast, pump risk, and even sentiment shifts to respond.

### 🧠 Sentiment + Pump Sniffer
Crypto is chaotic. Price doesn’t just follow charts — it follows tweets. That’s why I added modules to:
- Detect abnormal price/volume spikes
- Pull news sentiment per coin

These tools are not gimmicks. They're fundamentals of modern quant strategies. I added them because I’ve studied how momentum traders operate.

### 🧪 Predictive Logs & Accuracy
Every forecast isn’t just shown — it’s stored and compared with actual values. The system learns from its own mistakes.

This wasn't just about prediction. It was about **feedback loops** — and that's the core of **Reinforcement Learning**. While I haven’t added RL yet due to resource constraints, the architecture is modular and ready for it.

I thought seriously about implementing RL for portfolio management decisions. While it's not in v1, I’ve set up enough hooks to introduce policy learning in future iterations.

### 🔐 Secure Account System
Every user has:
- Private portfolio
- Private model logs
- Personalized AI experience

Authentication wasn’t an afterthought. It was a necessity for multi-user simulation.

---

## ⚠️ Real-World Constraints

- **No Deployment Yet** — Couldn't afford domain/GPU cloud hosting.
- **Some Missing Data** — Due to CoinGecko free-tier API limits. I added caching, limiters, and retry logic, but rate limits still hit occasionally.
- **XGBoost over LSTM/Transformers** — LSTMs were too heavy on CPU. I benchmarked, tuned, and picked XGBoost intentionally.

Still, everything works **locally** — smooth and effective.

> This wasn’t built with money. It was built with knowledge.

---

## 🧪 Running Locally (Step-by-Step)

> You’ll need: Node.js, MongoDB URI, Python 3.8+, and virtualenv

### 1. Start Node.js Express Backend
```bash
cd server
npx nodemon server.js
```

### 2. Start Prediction Engine (Flask + ML)
```bash
python cypto_predictor/app.py
```

### 3. Start Pump Sniffer & News Sentiment Module
```bash
python felix_ai/pns.py
```

### 4. Open HTML files in Browser (e.g. dashboard.html)
Use `Live Server` extension or any static file server.

---

## 📁 Folder Structure (Simplified)
```
/crypto_dashboard
├── /server
│   ├── routes (auth, portfolio, crypto)
│   ├── models (User.js, Portfolio.js)
│   ├── middleware (authMiddleware.js)
│   └── server.js
├── /cypto_predictor (Flask + ML)
│   └── app.py
├── /felix_ai
│   └── pns.py
├── /frontend
│   ├── dashboard.html, login.html, predict.html, settings.html
│   └── css/
```

---

## 🧔 About Me

**Joshikaran.K**  
Graduate, B.Tech CSE @ SRMIST (2024)

I specialize in building complete products from scratch. From low-latency backends to AI forecasting pipelines, I enjoy solving real-world problems — not just doing tutorials.

I understand:
- LLM pipelines and personality tuning (Felix AI)
- Time series modeling and retraining logic (XGBoost)
- Trade-off between performance and computation
- Real-world constraints and what to optimize first
- Prompt engineering, RAG, and building assistants that act with reasoning

Everything in this project is mine — no codegen, no copied UI kits, no teams. I even scripted and recorded the **demo video** to walk through every part of the system. if you want the link of the project post a comment in the tutorial video 

> If you're reading this: I know what I'm doing. And I’m just getting started.

---

## 🙏 Final Note

If I had more resources, I would've:
- Hosted this fully online with GPU-backed prediction
- Used LSTM + deep learning forecasting
- Integrated actual trading APIs like Binance
- Added real-time sentiment scraping and whale tracking
- Introduced Reinforcement Learning for AI trade suggestions

But even without that — this is **proof of vision, execution, and resilience**.

**Made with 💻 + 🧠 + ❤️ — Brick by Brick.**

