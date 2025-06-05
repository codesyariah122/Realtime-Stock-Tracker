'''
@author PujiErmanto <pujiermanto@gmail.com>
@return websocket connection
'''

import os
import time
import yfinance as yf
from yfinance.exceptions import YFRateLimitError
from cachetools import TTLCache
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import requests
import asyncio
from dotenv import load_dotenv

alphavantage_cache = TTLCache(maxsize=50, ttl=60)

cache = TTLCache(maxsize=50, ttl=3600) 

load_dotenv()

# API_KEY = os.getenv("API_KEY")
# BASE_URL = os.getenv("BASE_URL")
API_KEY = "2WXV5KFV2GPX8NUV"
BASE_URL = "https://www.alphavantage.co/query"

app = FastAPI()

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Bisa diganti dengan frontend domain spesifik
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "FastAPI untuk pemantauan saham IPO berjalan!"}

    
"""__For use yahoo finance"""
""" __Mengambil Nilai Tukar USD ke IDR dari Yahoo Finance """
def get_usd_to_idr():
    try:
        forex = yf.Ticker("USDIDR=X")
        hist = forex.history(period="1d")
        
        if not hist.empty:
            exchange_rate = hist["Close"].iloc[-1]  # Ambil harga penutupan terbaru
            return float(exchange_rate)
        
    except Exception as e:
        print(f"Error fetching exchange rate: {e}")
    
    return 15000.0  # Default jika gagal mendapatkan data


""" __Mengambil Harga Saham dari Yahoo Finance """
async def get_stock_price(symbol: str):
    if symbol in cache:
        return cache[symbol]

    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period="1d", interval="1m")

        if not hist.empty:
            latest = hist.iloc[-1]
            price_usd = latest["Open"]

            exchange_rate = get_usd_to_idr()
            price_idr = price_usd * exchange_rate if exchange_rate else None

            stock_data = {
                "symbol": symbol,
                "time": latest.name.strftime("%Y-%m-%d %H:%M:%S"),
                "price_usd": price_usd,
                "price_idr": price_idr,
            }

            cache[symbol] = stock_data
            return stock_data

        return {"error": "Data tidak ditemukan."}

    except YFRateLimitError:
        print("Limit yfinance tercapai, fallback ke AlphaVantage...")
        return await get_stock_price_alphavantage(symbol)  # <- Fallback
    except Exception as e:
        return {"error": f"Terjadi kesalahan: {str(e)}"}
    
"""__For use alphavantage
"""
async def get_stock_price_alphavantage(symbol: str):
    if symbol in alphavantage_cache:
        return alphavantage_cache[symbol]

    url = f"{BASE_URL}?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=1min&apikey={API_KEY}"
    response = requests.get(url).json()

    print("API Response (AlphaVantage): ", response)

    if "Note" in response:
        return {"error": "Rate limit AlphaVantage tercapai. Coba lagi sebentar lagi."}

    if "Time Series (1min)" in response:
        latest_time = sorted(response["Time Series (1min)"].keys())[-1]
        price_usd = float(response["Time Series (1min)"][latest_time]["1. open"])

        exchange_rate = get_usd_to_idr()
        price_idr = price_usd * exchange_rate if exchange_rate else None

        result = {
            "symbol": symbol,
            "time": latest_time,
            "price_usd": price_usd,
            "price_idr": price_idr
        }

        alphavantage_cache[symbol] = result  # Simpan cache selama 1 menit
        return result

    return {"error": "Data tidak ditemukan atau API limit AlphaVantage tercapai."}

@app.get("/stock/{symbol}")
async def stock_endpoint(symbol: str):
    return await get_stock_price(symbol)

@app.websocket("/ws/{symbol}")
async def websocket_endpoint(websocket: WebSocket, symbol: str):
    await websocket.accept()
    while True:
        stock_data = await get_stock_price(symbol)
        await websocket.send_json(stock_data)
        await asyncio.sleep(10)
