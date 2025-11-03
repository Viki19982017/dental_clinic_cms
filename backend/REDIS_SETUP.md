# Quick Redis Setup

## Install Redis

### Windows
1. Download from: https://github.com/microsoftarchive/redis/releases
2. Extract and run `redis-server.exe`

Or use WSL:
```bash
wsl
sudo apt update
sudo apt install redis-server
sudo service redis-server start
```

### macOS
```bash
brew install redis
brew services start redis
```

### Linux
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis
```

## Verify Installation

```bash
redis-cli ping
# Should return: PONG
```

## Configure Backend

1. Update `backend/.env`:
```env
REDIS_URL=redis://localhost:6379
REDIS_ENABLED=true
```

2. Install dependencies:
```bash
cd backend
npm install
```

3. Start the server:
```bash
npm run dev
```

## Test Cache

The dashboard endpoint now uses Redis caching. Visit:
```
GET http://localhost:5000/api/dashboard/stats
```

Check the console for cache hit/miss logs.

## Disable Redis (Optional)

Set in `.env`:
```env
REDIS_ENABLED=false
```

The app will work normally without Redis, just without caching.

---

**See `backend/README_REDIS.md` for complete documentation.**

