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


def start_background_predictions(watchlist=None):
    if watchlist is None:
        from app import load_watchlist
        watchlist = load_watchlist()

    for coin in watchlist:
        thread = threading.Thread(target=backtest_loop, args=(coin,), daemon=True)
        thread.start()
