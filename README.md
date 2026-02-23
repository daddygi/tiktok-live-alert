# TikTok Live Alert

A webhook receiver that listens for TikTok live stream notifications via the [Euler Stream API](https://eulerstream.com). Get notified when a TikTok creator goes live.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express 5
- **API:** [@eulerstream/euler-api-sdk](https://www.npmjs.com/package/@eulerstream/euler-api-sdk)

## Getting Started

### Prerequisites

- Node.js 18+
- An [Euler Stream](https://eulerstream.com) account (API key + account ID)

### Installation

```bash
git clone git@github.com:daddygi/tiktok-live-alert.git
cd tiktok-live-alert
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
EULER_ACCOUNT_API_KEY=your_api_key
EULER_ACCOUNT_ID=your_account_id
EULER_WEBHOOK_SECRET=your_webhook_secret
PORT=3000
```

### Run

```bash
# development
npm run dev

# production
npm run build && npm start
```

## Managing Alerts

Use the built-in CLI to manage TikTok live alerts and webhooks:

```bash
# list all alerts
npm run manage-alerts list

# create an alert for a TikTok user
npm run manage-alerts create <tiktok_username>

# delete an alert
npm run manage-alerts delete <alert_id>

# attach a webhook to an alert
npm run manage-alerts create-webhook <alert_id> <webhook_url>

# list webhooks for an alert
npm run manage-alerts list-webhooks <alert_id>

# delete a webhook
npm run manage-alerts delete-webhook <alert_id> <webhook_id>

# send a test payload to verify your webhook
npm run manage-alerts test [webhook_url]
```

## How It Works

1. Create an alert for a TikTok username via the CLI
2. Attach a webhook URL pointing to your server (`/webhooks/tiktok-live-alert`)
3. When the creator goes live, Euler Stream sends a signed webhook to your server
4. The server validates the HMAC-SHA256 signature and processes the payload

## Project Structure

```
src/
├── index.ts                  # Express server entry point
├── routes/
│   └── webhook.routes.ts     # Webhook endpoint with signature validation
├── services/
│   └── alert.service.ts      # Euler API SDK wrapper
├── utils/
│   └── webhook-validator.ts  # HMAC-SHA256 signature verification
└── scripts/
    └── manage-alerts.ts      # CLI tool for alert management
```

## API Endpoints

| Method | Path                          | Description                        |
| ------ | ----------------------------- | ---------------------------------- |
| POST   | `/webhooks/tiktok-live-alert` | Receive TikTok live alert webhooks |
| GET    | `/health`                     | Health check                       |
