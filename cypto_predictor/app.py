from flask import Flask, render_template
from core import predict_latest

app = Flask(__name__)

# Modify this anytime — app will auto-train new coins
WATCHLIST = ["bitcoin", "dogecoin"]

@app.route("/")
def index():
    predictions = []
    for coin in WATCHLIST:
        try:
            result = predict_latest(coin)
            predictions.append(result)
        except Exception as e:
            predictions.append({
                "coin": coin.capitalize(),
                "error": str(e)
            })
    return render_template("index.html", predictions=predictions)

if __name__ == "__main__":
    app.run(debug=True)
