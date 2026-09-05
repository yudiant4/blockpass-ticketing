# blockpass-ticketing Backend

Express.js backend with MongoDB for blockpass-ticketing platform.

## Quick Start

```bash
cd server
cp .env.example .env
# Edit .env: set MONGODB_URI and ADMIN_WALLET
npm install
npm run dev   # starts on port 3001
```

## Environment

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/blockpass-ticketing
FRONTEND_URL=http://localhost:3000
ADMIN_WALLET=0xYOUR_WALLET_ADDRESS
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/events` | Public | List all events (sorted by createdAt desc) |
| POST | `/api/events` | Admin | Create event (requires `x-admin-wallet` header) |
| DELETE | `/api/events/:id` | Admin | Delete event |
| GET | `/api/health` | Public | Health check |

## Admin Auth

Pass wallet address in request header:
```
x-admin-wallet: 0xYOUR_WALLET_ADDRESS
```

If `ADMIN_WALLET` is set in `.env`, the header must match exactly.

## Seed / Reset

```bash
# Reset database to clean slate
npm run seed
# or manually:
node -e "require('mongoose').connect('mongodb://localhost:27017/blockpass-ticketing').then(c => c.connection.dropDatabase().then(() => { console.log('done'); process.exit(); }))"
```

## Project Structure

```
server/
├── src/
│   ├── config.ts              # Environment config
│   ├── server.ts              # Express app + MongoDB bootstrap
│   ├── middleware/auth.ts     # Admin wallet auth middleware
│   ├── models/Event.ts        # Mongoose Event schema
│   ├── routes/events.ts       # /api/events endpoints
│   └── scripts/seedAdmin.ts   # DB reset script
├── dist/                      # Compiled JS output
├── .env.example
├── package.json
└── tsconfig.json
```
