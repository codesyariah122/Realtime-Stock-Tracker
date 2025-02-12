## Backend

> First create environment python

#### On Windows

```
python -m venv venv
.\venv\Scripts\activate
```

> Install library / packages

```
python -m pip install --upgrade pip
pip install fastapi 'uvicorn[standard]' requests python-dotenv websocket yfinance cachetools
```

> Running main app

```
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Testing on browser in development mode :

```
http://localhost:8000/docs
```

#### Use alphavantage.com for testing

#### OR Use Yahoo Finnace library
