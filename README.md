<p align="center">
  <img src="https://img.shields.io/badge/build-passing-brightgreen" alt="Build">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6" alt="TypeScript">
  <img src="https://img.shields.io/badge/Next.js-16-000000" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Prisma-5-2D3748" alt="Prisma">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
</p>

<h1 align="center">Prism</h1>
<p align="center"><strong>X-ray vision for the internet</strong></p>

<p align="center">Instantly understand how any website is built. Framework, hosting, performance, design, and more — all in one beautiful report.</p>

## Quick Start

```bash
git clone <repo-url>
cd prism
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to start analyzing websites.

## Architecture

- **Next.js 16** — App Router with React Server Components
- **Prisma 5** — Type-safe database access with PostgreSQL
- **PostgreSQL** — Primary data store (via Docker or external)
- **Lighthouse** — Automated performance auditing
- **OpenAI** — AI-powered analysis summaries

## Features

- **Technology Stack Detection** — Identify frameworks, libraries, CDNs, and hosting providers
- **Performance Metrics** — Lighthouse scores, Core Web Vitals, and performance insights
- **Design Analysis** — Color palettes, fonts, design systems, and typography
- **AI Summary** — Intelligent natural-language explanation of the site's architecture
- **Architecture Insights** — Hosting, CDN, backend detection, and infrastructure overview
- **Accessibility & SEO** — Deep analysis of a11y compliance and search optimization

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `OPENAI_API_KEY` | Yes | OpenAI API key for AI summaries |

## Docker

```bash
# Start all services (Postgres, Redis, app)
docker compose up

# Or run only the database
docker compose up postgres redis
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
prism/
├── src/
│   ├── app/          # Next.js App Router pages and layouts
│   ├── components/   # Shared UI components
│   ├── lib/
│   │   ├── analyzer/ # Analysis engine (technologies, Lighthouse, AI, etc.)
│   │   ├── __tests__ # Vitest unit tests
│   │   ├── db.ts     # Prisma client singleton
│   │   ├── rate-limit.ts
│   │   └── utils.ts
│   └── styles/       # Global styles
├── prisma/           # Prisma schema and migrations
├── public/           # Static assets
├── .github/          # CI workflows
├── Dockerfile
└── docker-compose.yml
```

## License

MIT
