from flask import Flask, render_template, request, redirect
from core import predict_latest, train_and_save_models
from schedulers import start_background_predictions
import json
import os
from datetime import datetime

app = Flask(__name__)

WATCHLIST_PATH = "watchlist.json"

def load_watchlist():
    """Loads the watchlist from local JSON file."""
    if not os.path.exists(WATCHLIST_PATH):
        with open(WATCHLIST_PATH, "w") as f:
            json.dump(["bitcoin", "dogecoin"], f)
    with open(WATCHLIST_PATH, "r") as f:
        return json.load(f)

def save_watchlist(watchlist):
    """Saves the updated watchlist back to disk."""
    with open(WATCHLIST_PATH, "w") as f:
        json.dump(watchlist, f)

@app.route("/predict")
def index():
    """Main route for showing predictions for all coins in the watchlist."""
    watchlist = load_watchlist()
    predictions = []
    for coin in watchlist:
        try:
            result = predict_latest(coin)
            predictions.append(result)
        except Exception as e:
            predictions.append({
                "coin": coin.capitalize(),
                "error": str(e),
                "history": []
            })
    return render_template("index.html", predictions=predictions, now=datetime.now())

@app.route("/add-coin", methods=["POST"])
def add_coin():
    """
    Adds a new coin to the watchlist and trains models for it.
    """
    coin_id = request.form.get("coin_id", "").lower().strip()
    if not coin_id:
        return redirect("/predict")

    watchlist = load_watchlist()
    if coin_id not in watchlist:
        watchlist.append(coin_id)
        save_watchlist(watchlist)
        try:
            print(f"🚀 Training models for {coin_id}...")
            train_and_save_models(coin_id)
            print(f"✅ Model training complete for {coin_id}")
        except Exception as e:
            print(f"❌ Failed to train {coin_id}: {e}")
    return redirect("/predict")

@app.route("/delete-coin/<coin_id>", methods=["POST"])
def delete_coin(coin_id):
    """
    Deletes a coin from the watchlist and removes its models and logs.
    """
    coin_id = coin_id.lower()
    watchlist = load_watchlist()
    if coin_id in watchlist:
        watchlist.remove(coin_id)
        save_watchlist(watchlist)

        # Delete XGBoost model
        xgb_path = f"models/{coin_id}_xgb_model.json"
        if os.path.exists(xgb_path):
            os.remove(xgb_path)

        # Delete Prophet model
        prophet_path = f"models/{coin_id}_prophet_model.pkl"
        if os.path.exists(prophet_path):
            os.remove(prophet_path)

        # Delete LSTM model (optional if you save it later)
        lstm_path = f"models/{coin_id}_lstm_model.h5"
        if os.path.exists(lstm_path):
            os.remove(lstm_path)

        # Delete logs
        log_path = f"logs/{coin_id}_log.json"
        if os.path.exists(log_path):
            os.remove(log_path)

    return redirect("/predict")

if __name__ == "__main__":
    watchlist = load_watchlist()
    start_background_predictions(watchlist)
    app.run(debug=True, port=5001)
