from flask import Flask, jsonify, request, render_template
from mistralai import Mistral
from dotenv import load_dotenv
import os
import requests
from datetime import datetime
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Initialize Flask app
app = Flask(__name__)

# Load .env
load_dotenv()
api_key = os.getenv("MISTRAL_API_KEY")
client = Mistral(api_key=api_key)
model = "mistral-small-latest"

# VADER Sentiment Analyzer
analyzer = SentimentIntensityAnalyzer()

# Function to fetch top pumping coins from CoinGecko
def fetch_top_pumping_coins():
    url = "https://api.coingecko.com/api/v3/coins/markets"
    params = {
        "vs_currency": "inr",
        "order": "percentage_change_24h",  # Order by 24h price change
        "per_page": 10,  # Top 10 coins
        "page": 1,
    }

    response = requests.get(url, params=params)
    data = response.json()

    # Collect necessary information
    pumping_coins = [
        {
            "coin": coin["id"],
            "pump_percentage": coin["price_change_percentage_24h"],
            "timestamp": datetime.now().isoformat()
        }
        for coin in data
    ]
    
    return pumping_coins

# Function to fetch details of a specific coin from CoinGecko
def fetch_coin_details(coin_id):
    url = f"https://api.coingecko.com/api/v3/coins/{coin_id}"
    response = requests.get(url)
    coin_details = response.json()

    # Debug: Print the response for troubleshooting
    print(f"Coin details for {coin_id}: {coin_details}")

    return coin_details

# Function to fetch news sentiment for a coin
def fetch_news_sentiment(coin_id):
    url = f"https://cryptopanic.com/api/v1/posts/"
    params = {
        "auth_token": os.getenv("CRYPTO_PANIC_API_KEY"),  # Your CryptoPanic API key
        "filter": "news",
        "currencies": coin_id
    }

    response = requests.get(url, params=params)
    data = response.json()

    if "results" not in data:
        return "No sentiment data found."

    news_articles = [
        {
            "coin": coin_id,
            "title": article["title"],
            "content": article.get("content", "No content available"),  # Ensure content key exists
            "timestamp": article["published_at"]
        }
        for article in data["results"]
    ]

    # Sentiment analysis
    for article in news_articles:
        sentiment_score = analyzer.polarity_scores(article["content"])["compound"]
        sentiment = "positive" if sentiment_score >= 0.05 else "negative" if sentiment_score <= -0.05 else "neutral"
        article["sentiment"] = sentiment

    return news_articles

# Function to feed data to Mistral and generate response
def generate_mistral_response(user_input, pumping_coins, coin_details, sentiment_data):
    # Create a prompt based on the data and user input
    context = f"Here are the top pumping coins based on the 24-hour price change:\n"
    for coin in pumping_coins:
        context += f"Coin: {coin['coin'].capitalize()}, Pump: {coin['pump_percentage']}%\n"
    
    # Safely get coin details with default values if missing
    name = coin_details.get('name', 'N/A')
    symbol = coin_details.get('symbol', 'N/A')
    price = coin_details.get('market_data', {}).get('current_price', {}).get('inr', 'N/A')

    context += f"\nUser's Question: {user_input}\n\n"
    context += f"Coin details:\nName: {name}\nSymbol: {symbol}\nPrice: {price}\n"

    context += "\nNews Sentiment:\n"
    for sentiment in sentiment_data:
        context += f"Title: {sentiment['title']}, Sentiment: {sentiment['sentiment']}\n"

    # Send the system prompt to Mistral for response generation
    system_prompt = f"You are Felix, a helpful AI assistant. Use the following information to provide the best recommendation or answer or ask only if the user asksabout its details:\n\n{context}\n\n"

    messages = [{"role": "system", "content": system_prompt}]
    response = client.chat.complete(model=model, messages=messages)
    reply = response.choices[0].message.content.strip()

    return reply

@app.route('/felixai')
def index():
    return render_template("index.html")

# Flask route to get live recommendations
@app.route('/api/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')  # Get the user message
    if not user_input:
        return jsonify({"error": "No message provided"}), 400
    
    # Extract coin from the user input
    coin = user_input.split()[-1].lower()  # Simple coin extraction, can be enhanced

    # Fetch top pumping coins
    pumping_coins = fetch_top_pumping_coins()

    # Check if the user asked for a specific coin and fetch details and sentiment
    coin_details = fetch_coin_details(coin)
    sentiment_data = fetch_news_sentiment(coin)

    # Generate response from Mistral
    reply = generate_mistral_response(user_input, pumping_coins, coin_details, sentiment_data)
    
    return jsonify({"response": reply}), 200

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5002)  # Use a different port if needed to avoid conflicts
