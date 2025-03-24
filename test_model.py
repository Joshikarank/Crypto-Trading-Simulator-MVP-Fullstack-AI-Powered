import pandas as pd
import requests
import xgboost as xgb
from sklearn.metrics import mean_absolute_error
import datetime

MODEL_PATH = "models/bitcoin_1h.pkl"
COIN = "bitcoin"
DAYS = 7

def fetch_data():
    url = f"https://api.coingecko.com/api/v3/coins/{COIN}/market_chart"
    params = {
        "vs_currency": "inr",
        "days": DAYS
    }
    headers = {"User-Agent": "FelixBot/1.0"}
    res = requests.get(url, params=params, headers=headers)
    data = res.json()

    prices = pd.DataFrame(data["prices"], columns=["timestamp", "price"])
    volume = pd.DataFrame(data["total_volumes"], columns=["timestamp", "volume"])

    df = prices.copy()
    df["volume"] = volume["volume"]
    df["timestamp"] = pd.to_datetime(df["timestamp"], unit='ms')
    return df

def build_features(df):
    df["price_change"] = df["price"].pct_change()
    df["volume_change"] = df["volume"].pct_change()

    for lag in range(1, 6):
        df[f"lag_price_{lag}"] = df["price"].shift(lag)
        df[f"lag_volume_{lag}"] = df["volume"].shift(lag)

    df = df.dropna()
    return df

def test_model():
    df = fetch_data()
    df = build_features(df)

    X = df.drop(["timestamp", "price"], axis=1)
    y_true = df["price"].shift(-1).dropna()
    X = X.iloc[:-1]  # match y length

    model = xgb.XGBRegressor()
    model.load_model(MODEL_PATH)

    preds = model.predict(X)

    mae = mean_absolute_error(y_true, preds)
    last_input = X.iloc[-1]
    last_pred = model.predict(pd.DataFrame([last_input]))[0]

    print(f"\n📊 MAE over test set: ₹{mae:.2f}")
    print(f"🧠 Last predicted next-hour price: ₹{last_pred:,.2f}")
    print(f"📈 Actual current price: ₹{df.iloc[-1]['price']:,.2f}")
    print(f"⏱️ Timestamp: {df.iloc[-1]['timestamp']}")
    print(f"🧪 Confidence estimation (lower MAE = higher confidence): {round(100 - (mae / df['price'].mean() * 100), 2)}%")

if __name__ == "__main__":
    test_model()
