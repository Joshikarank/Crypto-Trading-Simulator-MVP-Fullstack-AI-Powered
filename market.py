import google.generativeai as genai
import requests

# Set your Gemini API key
GEN_API_KEY = "AIzaSyDabYu_d7aTeNBAKOU9P_gRCep0Ii2iEFM"
genai.configure(api_key=GEN_API_KEY)

COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price"

def get_crypto_data(crypto):
    """Fetch real-time price & market data from CoinGecko"""
    params = {
        "ids": crypto.lower(),
        "vs_currencies": "usd",
        "include_24hr_change": "true",
        "include_24hr_vol": "true",
    }
    response = requests.get(COINGECKO_API, params=params)
    if response.status_code == 200:
        data = response.json().get(crypto.lower(), {})
        return data
    return None

def analyze_investment(crypto):
    """Fetch data and let Gemini AI analyze if it's a good investment"""
    data = get_crypto_data(crypto)
    if not data:
        return f"Couldn't fetch data for {crypto}. Maybe check the spelling or try later."

    prompt = f"""
    Based on the latest CoinGecko data:
    - Price: ${data['usd']}
    - 24h Change: {data['usd_24h_change']}%
    - 24h Volume: {data['usd_24h_vol']}

    Should someone invest in {crypto} right now? Analyze the risk, potential trends, and volatility.
    """
    
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)
    return response.text.strip()

# Example Usage
crypto_name = input("Enter a cryptocurrency (e.g., bitcoin, dogecoin): ").strip()
print(analyze_investment(crypto_name))
