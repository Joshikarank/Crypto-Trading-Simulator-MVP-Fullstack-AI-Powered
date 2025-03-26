from flask import Flask, render_template, request, redirect
from core import predict_latest
import json
from datetime import datetime
import os
from core import train_and_save_model  # import this

app = Flask(__name__)

WATCHLIST_PATH = "watchlist.json"

def load_watchlist():
    if not os.path.exists(WATCHLIST_PATH):
        with open(WATCHLIST_PATH, "w") as f:
            json.dump(["bitcoin", "dogecoin"], f)
    with open(WATCHLIST_PATH, "r") as f:
        return json.load(f)

def save_watchlist(watchlist):
    with open(WATCHLIST_PATH, "w") as f:
        json.dump(watchlist, f)

@app.route("/predict")
def index():
    print("Inside /predict route!")  # Debugging line to check route hit
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
    coin_id = request.form.get("coin_id", "").lower().strip()
    if not coin_id:
        return redirect("/predict")
    watchlist = load_watchlist()
    if coin_id not in watchlist:
        watchlist.append(coin_id)
        save_watchlist(watchlist)
        try:
            train_and_save_model(coin_id)  # 🔥 train it here
        except Exception as e:
            print(f"⚠️ Failed to train {coin_id}: {e}")
    return redirect("/predict")
import os

@app.route("/delete-coin/<coin_id>", methods=["POST"])
def delete_coin(coin_id):
    watchlist = load_watchlist()
    coin_id = coin_id.lower()
    if coin_id in watchlist:
        watchlist.remove(coin_id)
        save_watchlist(watchlist)

        # Delete model file
        model_path = f"models/{coin_id}_1h.pkl"
        if os.path.exists(model_path):
            os.remove(model_path)

        # Delete prediction log (optional)
        log_path = f"logs/{coin_id}_log.json"
        if os.path.exists(log_path):
            os.remove(log_path)

    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True, port=5001)
