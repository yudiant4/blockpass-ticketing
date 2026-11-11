# Blockpass Ticketing

Web3 NFT ticketing platform — mint, manage, and verify event tickets as ERC-1155 tokens on Base Sepolia.

## Stack

- **Frontend:** Next.js 14, RainbowKit, Wagmi, Viem, Panda CSS
- **Contract:** `BlockpassTicket.sol` (ERC-1155, AccessControl, Pausable)
- **API:** Next.js route handlers with file-backed event store (`data/events.json`)
- **Optional backend:** Express + MongoDB under `server/`

## Quick start

```bash
npm install
cp .env.example .env.local   # optional WalletConnect project ID
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Features

| Route | Description |
|-------|-------------|
| `/` | Landing — marketplace preview, How It Works, Docs |
| `/marketplace` | Search / filter / sort live events from API |
| `/event/[id]` | Event detail + on-chain mint via wallet |
| `/create-event` | Organizer form (requires connected wallet) |
| `/profile` | On-chain ticket balances for connected wallet |
| `/login` | Wallet connect gate |

### API (Next.js)

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/events` | List events |
| POST | `/api/events` | Create (header `x-admin-wallet`) |
| GET | `/api/events/:id` | Detail |
| DELETE | `/api/events/:id` | Delete (organizer/admin) |
| POST | `/api/events/:id/buy-intent` | Soft reserve (no sold bump) |
| POST | `/api/events/:id/confirm-mint` | Confirm sold after tx |
| GET/POST | `/api/ticket` | Verify / quote (never send private keys) |

To use the Express/Mongo backend instead, set `BACKEND_URL` / `NEXT_PUBLIC_API_URL` and run `server/`.

## Smart contract

```bash
# Foundry
forge build
forge test
forge script script/DeployBlockpassTicket.s.sol --rpc-url $RPC --broadcast
```

Default address (Base Sepolia): see `NEXT_PUBLIC_BLOCKPASS_ADDRESS`.

Tiers: `1` Regular (0.001 ETH), `2` VIP (0.003 ETH), `3` VVIP (0.01 ETH).

## Security notes

- Minting is **client-side via wagmi** — never POST a private key to the API.
- `cancelTicket(holder, id, amount)` refunds the ticket holder (admin/organizer only).
- Excess ETH on mint is refunded automatically.
