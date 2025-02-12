'''
@author PujiErmanto <pujiermanto@gmail.com>
@return websocket connection
'''

import os
import yfinance as yf
from cachetools import TTLCache
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import requests
import asyncio
from dotenv import load_dotenv

cache = TTLCache(maxsize=50, ttl=3600) 

load_dotenv()

API_KEY = os.getenv("API_KEY")
BASE_URL = os.getenv("BASE_URL")

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
    
"""__For use alphavantage
"""
# def get_usd_to_idr():
#     url = f"{BASE_URL}?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=IDR&apikey={API_KEY}"
#     response = requests.get(url).json()
    
#     try:
#         exchange_rate = float(response["Realtime Currency Exchange Rate"]["5. Exchange Rate"])
#         return exchange_rate
#     except KeyError:
#         return None
# async def get_stock_price(symbol: str):
#     url = f"{BASE_URL}?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=1min&apikey={API_KEY}"
#     response = requests.get(url).json()
    
#     print("API Response : ", response)
    
#     if "Time Series (1min)" in response:
#         latest_time = sorted(response["Time Series (1min)"].keys())[-1]
#         price_usd = float(response["Time Series (1min)"][latest_time]["1. open"])
        
#         # Konversi ke IDR
#         exchange_rate = get_usd_to_idr()
#         price_idr = price_usd * exchange_rate if exchange_rate else None
        
#         return {
#             "symbol": symbol,
#             "time": latest_time,
#             "price_usd": price_usd,
#             "price_idr": price_idr
#         }
    
#     return {"error": "Data tidak ditemukan atau API limit tercapai."}

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
