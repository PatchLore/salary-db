# DevSalaries.co

Niche developer salary database. Anonymous submissions. High-intent SEO traffic.

**Stack:** Next.js 14 + TypeScript + Drizzle ORM + Neon Postgres + shadcn/ui  
**Deploy:** Vercel (Serverless Postgres)  
**Legal:** England & Wales jurisdiction. No PII stored. GDPR compliant by design.

**Live:** Add your production URL after deploy (e.g. `https://devsalaries.vercel.app`). Set `NEXT_PUBLIC_SITE_URL` in Vercel for sitemap/robots.

---

## Features

- **Anonymous submissions:** No names, emails, or employers stored. IP hashed for rate limiting only.
- **Legal safeguards:** "Not career advice" disclaimers on every page. User warrants right to share data.
- **SEO optimized:** Dynamic role/location pages. Sitemap + structured data.
- **Rate limiting:** 1 submission per hour per IP (429 + `Retry-After`).
- **Mobile first:** Dark mode, touch-friendly.

---

## Local Setup

### Prerequisites

- Node.js 18+
- Neon PostgreSQL — get a connection string from [Neon](https://neon.tech)

### Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/PatchLore/salary-db.git
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
