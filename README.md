# DevSalaries.co

Niche developer salary database. Anonymous submissions. High-intent SEO traffic.

**Stack:** Next.js 14 + TypeScript + Drizzle ORM + Neon Postgres + shadcn/ui  
**Deploy:** Vercel (Serverless Postgres)  
**Legal:** England & Wales jurisdiction. No PII stored. GDPR compliant by design.

---

## Features

- **Anonymous submissions:** No names, emails, or employers stored. IP hashed for rate limiting only.
- **Legal safeguards:** "Not career advice" disclaimers on every page. User warrants right to share data.
- **SEO optimized:** Dynamic role/location pages (`/software-engineer-london`). Sitemap + structured data.
- **Rate limiting:** 1 submission per IP per hour (spam protection).
- **Mobile first:** Dark mode, touch-friendly, 60fps interactions.

---

## Local Setup

```bash
# 1. Clone & install
git clone [repo-url]
cd salary-db
npm install

# 2. Environment
cp .env.example .env.local
# Add your Neon DATABASE_URL to .env.local

# 3. Database
npx drizzle-kit generate
npx drizzle-kit migrate

# 4. Seed data (50 entries)
npm run seed

# 5. Run
npm run dev
# Visit http://localhost:3000
