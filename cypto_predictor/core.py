import os
import json
import requests
import numpy as np
import pandas as pd
import xgboost as xgb
from prophet import Prophet
from keras.models import Sequential
from keras.layers import LSTM, Dense
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from sklearn.ensemble import VotingRegressor
from datetime import datetime, timedelta
from pytz import timezone
import joblib
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk

# Ensure the VADER lexicon is downloaded
nltk.download('vader_lexicon')

# Constants
COINGECKO_API = "https://api.coingecko.com/api/v3"
CRYPTO_PANIC_API_KEY = os.getenv("CRYPTO_PANIC_API_KEY")  # Ensure this is set in your environment
MODEL_DIR = "models"
LOG_DIR = "logs"
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(LOG_DIR, exist_ok=True)

def fetch_hourly_data(coin, days=7):
    """
    Fetches historical hourly price and volume data for a given cryptocurrency from CoinGecko.

    Args:
        coin (str): The cryptocurrency ID as recognized by CoinGecko.
        days (int): Number of past days to fetch data for.

    Returns:
        pd.DataFrame: DataFrame containing timestamp, price, and volume columns.
    """
    url = f"{COINGECKO_API}/coins/{coin}/market_chart"
    params = {"vs_currency": "usd", "days": days}
    headers = {"User-Agent": "Mozilla/5.0"}
    res = requests.get(url, params=params, headers=headers)

    if res.status_code == 429:
        raise ValueError("Rate limit hit. Try again later.")
    if res.status_code != 200:
        raise ValueError(f"Failed to fetch data for {coin}. Status code: {res.status_code}")

    data = res.json()
    if "prices" not in data or "total_volumes" not in data:
        raise ValueError(f"Incomplete data returned for '{coin}'.")

    prices = pd.DataFrame(data["prices"], columns=["timestamp", "price"])
    volumes = pd.DataFrame(data["total_volumes"], columns=["timestamp", "volume"])
    df = prices.copy()
    df["volume"] = volumes["volume"]
    df["timestamp"] = pd.to_datetime(df["timestamp"], unit='ms')
    return df

def fetch_news_sentiment(coin):
    """
    Fetches recent news articles related to the cryptocurrency and calculates sentiment scores.

    Args:
        coin (str): The cryptocurrency symbol (e.g., 'BTC' for Bitcoin).

    Returns:
        float: Average sentiment score of recent news articles.
    """
    url = "https://cryptopanic.com/api/v1/posts/"
    params = {
        "auth_token": CRYPTO_PANIC_API_KEY,
        "currencies": coin,
        "kind": "news"
    }
    response = requests.get(url, params=params)
    data = response.json()

    if "results" not in data:
        return 0.0  # Neutral sentiment if no data

    analyzer = SentimentIntensityAnalyzer()
    sentiment_scores = []

    for article in data["results"]:
        content = article.get("title", "") + " " + article.get("body", "")
        sentiment_score = analyzer.polarity_scores(content)["compound"]
        sentiment_scores.append(sentiment_score)

    if sentiment_scores:
        return np.mean(sentiment_scores)
    else:
        return 0.0  # Neutral sentiment if no articles

def build_features(df, coin):
    """
    Constructs lag features, percentage changes, and sentiment scores for price and volume.

    Args:
        df (pd.DataFrame): DataFrame containing timestamp, price, and volume columns.
        coin (str): The cryptocurrency symbol.

    Returns:
        pd.DataFrame: DataFrame with additional feature columns.
    """
    df["price_change"] = df["price"].pct_change()
    df["volume_change"] = df["volume"].pct_change()
    for lag in range(1, 6):
        df[f"lag_price_{lag}"] = df["price"].shift(lag)
        df[f"lag_volume_{lag}"] = df["volume"].shift(lag)
    
    # Fetch sentiment scores
    df["sentiment"] = fetch_news_sentiment(coin)
    
    return df.dropna()

def train_xgboost_model(X_train, y_train):
    """
    Trains an XGBoost model on the provided training data.

    Args:
        X_train (pd.DataFrame): Training feature set.
        y_train (pd.Series): Training target variable.

    Returns:
        xgb.XGBRegressor: Trained XGBoost model.
    """
    model = xgb.XGBRegressor(objective="reg:squarederror", n_estimators=100)
    model.fit(X_train, y_train)
    return model

def train_prophet_model(df):
    """
    Trains a Prophet model on the provided DataFrame.

    Args:
        df (pd.DataFrame): DataFrame containing timestamp and price columns.

    Returns:
        Prophet: Trained Prophet model.
    """
    prophet_df = df.rename(columns={"timestamp": "ds", "price": "y"})[["ds", "y"]]
    model = Prophet()
    model.add_regressor('sentiment')  # Adding sentiment as an external regressor
    model.fit(prophet_df)
    return model

def train_lstm_model(X_train, y_train, num_features):
    """
    Trains an LSTM model on the provided training data.

    Args:
        X_train (np.array): Training feature set.
        y_train (np.array): Training target variable.
        num_features (int): Number of features in the input data.

    Returns:
        Sequential: Trained LSTM model.
    """
    model = Sequential()
    model.add(LSTM(50, activation='relu', input_shape=(X_train.shape[1], num_features)))
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mse')
    model.fit(X_train, y_train, epochs=50, verbose=0)
    return model

def train_and_save_models(coin):
    """
    Trains XGBoost, Prophet, and LSTM models for a given cryptocurrency and saves them.

    Args:
        coin (str): The cryptocurrency ID.

    Returns:
        dict: Paths to the saved models.
    """
    df = fetch_hourly_data(coin)
    df = build_features(df, coin)

    # Prepare data for XGBoost
    X = df.drop(["timestamp", "price"], axis=1)
    y = df["price"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

    # Train XGBoost
# ::contentReference[oaicite:0]{index=0}
 
def is_model_outdated(path, max_age_minutes=60):
    """
    Checks if a saved model file is older than a given threshold (in minutes).

    Args:
        path (str): Path to the model file.
        max_age_minutes (int): Time limit in minutes.

    Returns:
        bool: True if outdated or missing, else False.
    """
    if not os.path.exists(path):
        return True
    modified = datetime.fromtimestamp(os.path.getmtime(path))
    return (datetime.now() - modified) > timedelta(minutes=max_age_minutes)


def save_prediction_log(coin, entry):
    """
    Saves prediction results to log file.

    Args:
        coin (str): Coin ID
        entry (dict): Contains timestamp, predicted_price, actual_price, accuracy
    """
    log_path = f"{LOG_DIR}/{coin}_log.json"
    history = []
    if os.path.exists(log_path):
        try:
            with open(log_path, "r") as f:
                history = json.load(f)
        except json.JSONDecodeError:
            os.remove(log_path)  # reset corrupted log
            history = []
    history.append(entry)
    history = history[-5:]
    with open(log_path, "w") as f:
        json.dump(history, f, indent=2)


def load_prediction_log(coin, hours=5):
    """
    Loads recent prediction history for a coin.

    Args:
        coin (str): Coin ID
        hours (int): How many hours of history to load

    Returns:
        list: Filtered prediction log entries
    """
    log_path = f"{LOG_DIR}/{coin}_log.json"
    if not os.path.exists(log_path):
        return []

    try:
        with open(log_path, "r") as f:
            logs = json.load(f)
    except json.JSONDecodeError:
        os.remove(log_path)
        return []

    ist = timezone("Asia/Kolkata")
    now = datetime.now(ist)
    recent_logs = [
        entry for entry in logs
        if ist.localize(datetime.strptime(entry["timestamp"], "%Y-%m-%d %H:%M")) >= (now - timedelta(hours=hours))
    ]
    return recent_logs


def predict_latest(coin):
    """
    Predicts next hour price using the latest trained XGBoost model.
    Automatically retrains if model is outdated.

    Returns:
        dict: Forecast results with logging
    """
    model_path = f"{MODEL_DIR}/{coin}_xgb_model.json"

    # 🔄 Check for retrain need
    if is_model_outdated(model_path, max_age_minutes=60):
        print(f"🔄 Retraining model for {coin}...")
        train_and_save_models(coin)

    df = fetch_hourly_data(coin)
    df = build_features(df, coin)

    X = df.drop(["timestamp", "price"], axis=1)
    y_true = df["price"].shift(-1).dropna()

    model = xgb.XGBRegressor()
    model.load_model(model_path)

    preds = model.predict(X)
    mae = mean_absolute_error(y_true, preds)

    last_input = X.iloc[-1]
    last_pred = model.predict(pd.DataFrame([last_input]))[0]
    actual = df.iloc[-1]["price"]
    ts_utc = df.iloc[-1]["timestamp"]
    ist = timezone("Asia/Kolkata")
    ts_ist = ts_utc.tz_localize("UTC").astimezone(ist)
    predicted_ts = ts_ist + timedelta(hours=1)

    confidence = round(100 - (mae / df["price"].mean() * 100), 2)

    log_entry = {
        "timestamp": predicted_ts.strftime("%Y-%m-%d %H:%M"),
        "predicted_price": float(round(last_pred, 2)),
        "actual_price": float(round(actual, 2)),
        "accuracy": float(confidence)
    }

    save_prediction_log(coin, log_entry)

    return {
        "coin": coin.capitalize(),
        "predicted_price": log_entry["predicted_price"],
        "actual_price": log_entry["actual_price"],
        "confidence": log_entry["accuracy"],
        "last_updated": datetime.fromtimestamp(os.path.getmtime(model_path)).strftime("%Y-%m-%d %H:%M:%S"),
        "timestamp": log_entry["timestamp"],
        "history": load_prediction_log(coin)[::-1]
    }
