# PulseLens — Mini Observability Platform

<div align="center">

![PulseLens](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80)

**A lightweight, high-performance distributed observability platform built with Next.js, PostgreSQL, Prisma, Recharts, node-cron, and Auth.js.**

[![Next.js](https://img.shields.io/badge/Next.js-15%2F16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon%20DB-336791?style=flat-square&logo=postgresql)](https://neon.tech/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://prisma.io/)
[![Recharts](https://img.shields.io/badge/Recharts-Time--Series-22c55e?style=flat-square)](https://recharts.org/)
[![Auth.js](https://img.shields.io/badge/Auth.js-Google%20OAuth-6366f1?style=flat-square)](https://authjs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)](LICENSE)

</div>

---

## 📖 Overview

**PulseLens** is a modern, simplified alternative to Datadog and Grafana tailored for microservice telemetry. It provides seamless log collection, time-series metrics graphing, real-time KPI aggregations, automated threshold alerts evaluated every minute via background cron jobs, and a sleek dark-mode dashboard styled with **shadcn UI components** and **Instagram Sans typography**.

---

## 🚀 Key Features

- **⚡ Fast Log Ingestion (`POST /api/logs`)**: Ingest structured logs (`info`, `warn`, `error`) with timestamps and service tags.
- **📈 Time-Series Metrics Ingestion (`POST /api/metrics`)**: Ingest numeric performance telemetry (`response_time_ms`, `cpu_usage_pct`, `memory_usage_mb`, `queue_depth`, etc.).
- **📦 Reusable Client SDK (`src/sdk`)**: Type-safe SDK with non-blocking dispatches and helpers (`logger.info/warn/error`, `metrics.record/increment/gauge/timing`).
- **📊 Real-time Log Viewer**: Instant keyword search, service filter, log-level pills, live 3-second auto-refresh polling, and an expandable JSON inspector drawer.
- **📉 Interactive Metrics Graphs (Recharts)**: Smooth gradient area charts, custom glassmorphic tooltips, multi-metric sparklines breakdown, and statistical KPIs (Avg, Min, Max, P95).
- **🚨 Automated Alert Rules & Background Cron Worker (`node-cron`)**: Configure log error count or metric latency threshold rules evaluated automatically every minute (`* * * * *`).
- **🔐 Google OAuth & Demo Auth (Auth.js v5)**: Secure dashboard login with Google accounts and instant one-click demo access for reviewers.
- **🌐 Cloud-Ready**: Built for deployment on **Vercel** with **Neon Serverless PostgreSQL**.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js (App Router, Server Actions, API Routes) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4, shadcn UI components, Instagram Sans Font |
| **Database** | PostgreSQL (hosted on [Neon](https://neon.tech)) |
| **ORM** | Prisma ORM with connection pooling |
| **Visualizations**| Recharts (Area, Line, ResponsiveContainer) |
| **Scheduler** | `node-cron` for automated alert rule evaluation |
| **Authentication**| Auth.js (NextAuth v5) with Google OAuth + Demo credentials |
| **Deployment** | Vercel (Frontend & APIs) + Neon (Serverless Postgres) |

---

## 📦 Data Model

```mermaid
erDiagram
    Log {
        string id PK
        string service
        string level
        string message
        datetime timestamp
    }
    Metric {
        string id PK
        string service
        string name
        float value
        datetime timestamp
    }
    AlertRule {
        string id PK
        string service
        string metric
        string logLevel
        string condition
        float threshold
        int windowMinutes
        boolean enabled
        datetime createdAt
    }
    AlertEvent {
        string id PK
        string ruleId FK
        datetime triggeredAt
        string details
    }
    AlertRule ||--o{ AlertEvent : "triggers"
```

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/sumit-75/PulseLens.git
cd PulseLens
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set your values in `.env`:
```env
# Neon PostgreSQL Connection String
DATABASE_URL="postgresql://user:password@ep-your-instance.neon.tech/neondb?sslmode=require"

# Auth.js / NextAuth Secret
AUTH_SECRET="your_random_32_character_secret"

# Google OAuth (Optional: Get from Google Cloud Console)
AUTH_GOOGLE_ID="your-google-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### 3. Push Database Schema to Neon
```bash
npx prisma db push
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Simulation & Background Services

### Generate Simulated Traffic (SDK Demo)
To simulate live traffic from `auth-service`, `payment-service`, `order-service`, and `notification-service`:
```bash
# Single batch
npm run simulate

# Continuous live streaming (every 3 seconds)
npm run simulate -- --loop
```

### Run the Background Alert Cron Daemon
```bash
npm run cron
```

---

## 💻 PulseLens SDK Integration

Other applications can import and use the PulseLens SDK directly:

```typescript
import { createPulseLens } from './src/sdk';

const obs = createPulseLens({
  endpoint: 'https://your-pulselens-instance.vercel.app',
  service: 'payment-service',
});

// Emitting structured logs
await obs.logger.info('Stripe payment webhook processed ($89.00)');
await obs.logger.warn('High API latency observed from payment gateway (2350ms)');
await obs.logger.error('Credit card transaction declined: Insufficient funds');

// Recording performance metrics
await obs.metrics.record('charge_amount_usd', 89.0);
await obs.metrics.increment('orders_processed_total', 1);
await obs.metrics.timing('response_time_ms', 142.5);
await obs.metrics.gauge('active_db_connections', 18);
```

---

## 📡 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/logs` | `POST` | Ingest structured log payload (`service`, `level`, `message`, `timestamp?`) |
| `/api/logs` | `GET` | Query logs with filtering (`service`, `level`, `limit`) |
| `/api/metrics` | `POST` | Ingest numeric metric (`service`, `name`, `value`, `timestamp?`) |
| `/api/metrics` | `GET` | Query time-series metrics (`service`, `name`, `order`, `limit`) |
| `/api/services` | `GET` | List all active telemetry-emitting microservices and system stats |
| `/api/alerts/rules` | `GET` / `POST` / `PATCH` / `DELETE` | Full CRUD for automated threshold alert rules |
| `/api/alerts/events` | `GET` | Retrieve incident history timeline |
| `/api/alerts/check` | `POST` | Trigger on-demand alert rule evaluation cycle |

---

## 🚢 Deploying to Vercel + Neon

1. **Database**: Create a free PostgreSQL database on [Neon](https://neon.tech) and copy your connection string.
2. **Deploy on Vercel**:
   - Push your code to GitHub.
   - Import the repo in [Vercel](https://vercel.com/new).
   - Add Environment Variables in the Vercel project settings:
     - `DATABASE_URL` = Your Neon connection string
     - `AUTH_SECRET` = Random 32+ character string
     - `AUTH_GOOGLE_ID` = Google OAuth Client ID
     - `AUTH_GOOGLE_SECRET` = Google OAuth Secret
   - Click **Deploy**!

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
