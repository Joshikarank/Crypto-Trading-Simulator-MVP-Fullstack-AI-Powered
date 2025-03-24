import os
import requests
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from datetime import datetime, timedelta
import json
from pytz import timezone

COINGECKO_API = "https://api.coingecko.com/api/v3"
MODEL_DIR = "models"
LOG_DIR = "logs"
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(LOG_DIR, exist_ok=True)

def fetch_hourly_data(coin, days=7):
    url = f"{COINGECKO_API}/coins/{coin}/market_chart"
    params = {"vs_currency": "inr", "days": days}
    headers = {"User-Agent": "FelixBot/1.0"}
    res = requests.get(url, params=params, headers=headers)

    if res.status_code != 200:
        raise ValueError(f"Coin '{coin}' not found or unsupported by CoinGecko API.")

    data = res.json()
    if "prices" not in data or "total_volumes" not in data:
        raise ValueError(f"Incomplete data returned for '{coin}'. Try a different coin.")

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

def train_and_save_model(coin):
    df = fetch_hourly_data(coin)
    df = build_features(df)

    X = df.drop(["timestamp", "price"], axis=1).iloc[:-1]
    y = df["price"].shift(-1).dropna()

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
    model = xgb.XGBRegressor(objective="reg:squarederror", n_estimators=100)
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    error = mean_absolute_error(y_test, preds)

    model_path = f"{MODEL_DIR}/{coin}_1h.pkl"
    model.save_model(model_path)

    return model_path, round(error, 2), datetime.now()

def is_model_outdated(path, max_age_minutes=60):
    if not os.path.exists(path):
        return True
    modified = datetime.fromtimestamp(os.path.getmtime(path))
    return (datetime.now() - modified) > timedelta(minutes=max_age_minutes)

def save_prediction_log(coin, entry):
    log_path = f"{LOG_DIR}/{coin}_log.json"
    history = []

    if os.path.exists(log_path):
        try:
            with open(log_path, "r") as f:
                history = json.load(f)
        except json.JSONDecodeError:
            print(f"⚠️ Corrupted log file for {coin}, resetting.")
            os.remove(log_path)
            history = []

    history.append(entry)
    history = history[-5:]

    with open(log_path, "w") as f:
        json.dump(history, f, indent=2)

def load_prediction_log(coin):
    log_path = f"{LOG_DIR}/{coin}_log.json"
    if os.path.exists(log_path):
        try:
            with open(log_path, "r") as f:
                return json.load(f)
        except json.JSONDecodeError:
            print(f"⚠️ Corrupted log file for {coin}, resetting.")
            os.remove(log_path)
    return []

def predict_latest(coin):
    model_path = f"{MODEL_DIR}/{coin}_1h.pkl"
    if is_model_outdated(model_path):
        print(f"🔍 Model is missing or outdated for {coin}, retraining...")
        train_and_save_model(coin)

    df = fetch_hourly_data(coin)
    df = build_features(df)

    X = df.drop(["timestamp", "price"], axis=1).iloc[:-1]
    y_true = df["price"].shift(-1).dropna()
    model = xgb.XGBRegressor()
    model.load_model(model_path)

    preds = model.predict(X)
    mae = mean_absolute_error(y_true, preds)

    last_input = X.iloc[-1]
    last_pred = model.predict(pd.DataFrame([last_input]))[0]
    actual = df.iloc[-1]['price']
    ts_utc = df.iloc[-1]['timestamp']
    ist = timezone('Asia/Kolkata')
    ts_ist = ts_utc.tz_localize('UTC').astimezone(ist)

    confidence = round(100 - (mae / df['price'].mean() * 100), 2)

    log_entry = {
        "timestamp": ts_ist.strftime("%Y-%m-%d %H:%M"),
        "predicted_price": float(round(last_pred, 2)),
        "actual_price": float(round(actual, 2)),
        "accuracy": float(confidence)
    }


    save_prediction_log(coin, log_entry)

    # Print current prediction and history
    print(f"\n📊 {coin.upper()} Prediction {log_entry['timestamp']}")
    print(f"Next Hour Prediction: ₹{log_entry['predicted_price']}")
    print(f"Actual Price: ₹{log_entry['actual_price']}")
    print(f"Accuracy: {log_entry['accuracy']}%")
    print("🕘 Prediction History:")
    for h in load_prediction_log(coin)[-5:][::-1]:
        print(f"{h['timestamp']} — ₹{h['predicted_price']} — ₹{h['actual_price']} — {h['accuracy']}%")

    return {
        "coin": coin.capitalize(),
        "predicted_price": log_entry['predicted_price'],
        "actual_price": log_entry['actual_price'],
        "confidence": log_entry['accuracy'],
        "last_updated": datetime.fromtimestamp(os.path.getmtime(model_path)).strftime("%Y-%m-%d %H:%M:%S"),
        "timestamp": log_entry['timestamp'],
        "history": load_prediction_log(coin)[::-1]
    }
