# Salary DB

Self-reported salary database by role and location. Browse submissions or contribute your own (anonymous, IP-hashed for rate limiting). Informational only — not professional career advice.

## Tech stack

- **Next.js 14** (App Router), TypeScript, Tailwind CSS
- **Neon** (PostgreSQL), **Drizzle ORM**
- **shadcn/ui**-style components, React Hook Form, Zod

## Getting started

### Prerequisites

- Node.js 18+
- Neon PostgreSQL (or any Postgres) — get a connection string from [Neon](https://neon.tech)

### Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/YOUR_USERNAME/PatchLore.git salary-db
   cd salary-db
   npm install
   ```

2. **Environment**
   Create `.env.local` (or `.env`) with:
   ```env
   DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
   ```
   Use your Neon connection string; no quotes, no `psql` prefix.

3. **Database**
   ```bash
   npm run db:migrate
   npm run seed
   ```

4. **Run**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run seed` | Seed 50 sample submissions |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open Drizzle Studio (browse data) |

## Deploy (Vercel)

1. Push to GitHub and import the repo in [Vercel](https://vercel.com).
2. Add **Environment Variable**: `DATABASE_URL` = your Neon connection string.
3. Deploy. The search API uses a 30s timeout for aggregation.

## Legal

- Data is self-reported and unverified. See [Terms](/terms) and [Privacy](/privacy).
- Jurisdiction: England & Wales. IP addresses are hashed for rate limiting only.
