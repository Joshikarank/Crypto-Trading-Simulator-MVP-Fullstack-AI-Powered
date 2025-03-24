import requests
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import os

# Hardcoded coin list (only BTC for now)
WATCHLIST = ["bitcoin"]
COINGECKO_API = "https://api.coingecko.com/api/v3"

# Ensure model directory exists
os.makedirs("models", exist_ok=True)

def fetch_hourly_data(coin, days=7):
    url = f"{COINGECKO_API}/coins/{coin}/market_chart"
    params = {
        "vs_currency": "inr",
        "days": days,
    }
    res = requests.get(url, params=params)

    # Debug print
    print(f"🧪 Status Code: {res.status_code}")
    print("🧪 Response JSON:")
    print(res.json())

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

    # Add lag features
    for lag in range(1, 6):
        df[f"lag_price_{lag}"] = df["price"].shift(lag)
        df[f"lag_volume_{lag}"] = df["volume"].shift(lag)
    
    df = df.dropna()
    return df

def train_model(df, coin):
    X = df.drop(["timestamp", "price"], axis=1)
    y = df["price"].shift(-1).dropna()
    X = X.iloc[:-1]  # Align with y

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

    model = xgb.XGBRegressor(objective="reg:squarederror", n_estimators=100)
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    error = mean_absolute_error(y_test, preds)
    print(f"📉 MAE for {coin.upper()}: ₹{error:.4f}")

    # Save model
    model.save_model(f"models/{coin}_1h.pkl")
    print(f"✅ Model saved as models/{coin}_1h.pkl")

if __name__ == "__main__":
    for coin in WATCHLIST:
        print(f"\n🔁 Training XGBoost for {coin.upper()}...")
        df = fetch_hourly_data(coin)
        df = build_features(df)
        train_model(df, coin)
