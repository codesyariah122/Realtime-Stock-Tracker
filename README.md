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

### Setup Server

**vhost**

```
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5999;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

}
```

**Daemon**

```
[Unit]
Description=Your App on port 5999
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/root-web-folder/backend
ExecStart=/usr/bin/python3 -m uvicorn main:app --host 0.0.0.0 --port 5999
Restart=always
RestartSec=5
KillMode=process
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

**_Command_**

#### Use certbot :

```
certbot --nginx -d your-domain.com
```
