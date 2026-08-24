# PulseLens ⚡

<div align="center">

**A modern, lightweight distributed telemetry & observability platform.**  
*Real-time log streaming, time-series metrics graphs, autonomous cron alert rules, and a type-safe TypeScript SDK.*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon%20DB-336791?style=flat-square&logo=postgresql)](https://neon.tech/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://prisma.io/)
[![Recharts](https://img.shields.io/badge/Recharts-Time--Series-22c55e?style=flat-square)](https://recharts.org/)
[![Auth.js](https://img.shields.io/badge/Auth.js-Google%20OAuth-6366f1?style=flat-square)](https://authjs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple?style=flat-square)](LICENSE)

[Live Demo](http://localhost:3000) • [Explore Dashboard](http://localhost:3000/dashboard) • [Quickstart](#-quickstart)

</div>

---

## ✨ Features

- **📜 Real-Time Log Stream**: Ingest structured JSON logs with 3-second live auto-polling, level filtering (`INFO`, `WARN`, `ERROR`), and an instant payload inspector.
- **📈 Time-Series Metrics & KPIs**: Interactive Recharts area graphs with P95 latency percentiles, min/max/average aggregations, and sparklines.
- **🚨 Autonomous Alerting Daemon**: Background `node-cron` worker evaluating threshold breaches every minute with an incident event audit timeline.
- **📦 Zero-Config TypeScript SDK**: Strongly-typed client library for logging and numeric metric dispatch with non-blocking async execution.
- **🔐 Google OAuth & Demo Mode**: Built-in Auth.js (NextAuth v5) supporting Google sign-in and one-click reviewer demo access.
- **🎨 Modern Dark UI**: Tailored with Instagram Sans typography, shadcn UI components, smooth on-scroll reveals, and full mobile responsiveness.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (Turbopack, App Router), Tailwind CSS, shadcn UI, Recharts, Lucide Icons
- **Backend & APIs**: Next.js Server Actions & REST API Route Handlers
- **Database & ORM**: Neon Serverless PostgreSQL & Prisma ORM
- **Background Worker**: `node-cron` Alert Daemon
- **Authentication**: Auth.js (NextAuth v5) with Google Provider

---

## ⚡ Quickstart

### 1. Clone and Install
```bash
git clone https://github.com/sumit-75/PulseLens.git
cd PulseLens
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
# Neon Serverless PostgreSQL
DATABASE_URL="postgresql://user:password@ep-your-instance.neon.tech/neondb?sslmode=require"

# Auth.js / NextAuth
AUTH_SECRET="your-random-32-character-secret"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### 3. Initialize Database & Run
```bash
# Push schema to PostgreSQL
npx prisma db push

# Start the Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Simulation & Background Daemon

```bash
# Run multi-service traffic generator (payment, auth, order services)
npm run simulate

# Start the autonomous background alert evaluation cron worker
npm run cron
```

---

## 📦 SDK Quick Usage

```typescript
import { PulseLens } from './src/sdk';

const pulse = new PulseLens({
  endpoint: 'http://localhost:3000',
  service: 'payment-service',
});

// Ingest structured log event
await pulse.log({
  level: 'info',
  message: 'Processed stripe webhook for order #9821',
});

// Emit time-series metric data point
await pulse.metric({
  name: 'response_time_ms',
  value: 42.5,
});
```

---

## 📡 REST API Summary

| Endpoint | Method | Description |
|---|---|---|
| `/api/logs` | `GET` / `POST` | Ingest and query structured microservice logs |
| `/api/metrics` | `GET` / `POST` | Ingest and query time-series numeric telemetry |
| `/api/services` | `GET` | List registered services and latest heartbeat timestamps |
| `/api/alerts/rules` | `GET` / `POST` / `DELETE` | Manage threshold alert evaluation rules |
| `/api/alerts/events` | `GET` | Retrieve triggered incident history timeline |
| `/api/alerts/check` | `POST` | Trigger an on-demand rule evaluation check |

---

## 📄 License

Open-source under the [MIT License](LICENSE).
