# scheduler.py
import threading
import time
from core import predict_latest
# from app import load_watchlist  # Optional reuse

def backtest_loop(coin_id):
    while True:
        try:
            print(f"🔁 Running hourly prediction for {coin_id}")
            predict_latest(coin_id)
        except Exception as e:
            print(f"❌ Error while predicting {coin_id}: {e}")
        
        # Sleep for 1 hour before the next prediction
        time.sleep(3600)


def start_background_predictions(watchlist):
    def run_prediction(coin):
        while True:
            try:
                print(f"🔁 Running hourly prediction for {coin}")
                predict_latest(coin)
            except Exception as e:
                print(f"❌ Error while predicting {coin}: {e}")
            time.sleep(3600)  # Sleep for 1 hour

    for coin in watchlist:
        threading.Thread(target=run_prediction, args=(coin,), daemon=True).start()
