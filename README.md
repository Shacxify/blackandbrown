# Black and Brown

### Vintage Consignment Operations Platform · React + Supabase + Gemini Vision

> A storefront and a back office in one build. Customers browse and submit items, staff price, tag, and track inventory, and owners control who can do what.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Postgres_+_Auth_+_Edge_Functions-3ECF8E?style=flat-square&logo=supabase)
![Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-Vision-orange?style=flat-square&logo=google)

---

## The Problem

Vintage resale runs on tribal knowledge. One person knows what a piece is worth, one spreadsheet tracks what is in the back room, and the answer to "did we already sell that" lives in a group chat. That works until a second employee joins, and then it stops working entirely.

Black and Brown replaces that with a single system: public storefront, authenticated staff dashboard, permissioned admin console, and an AI pricing assistant that turns photos and brand details into a defensible price range.

---

## What It Does

| Surface | Route | Function |
|---|---|---|
| **Storefront** | `/` | Hero, product grid, recently sold, "looking for" banner, seller intake, location, and contact |
| **Auth** | `/auth` | Supabase email auth, role assignment on first sign in |
| **Staff Dashboard** | `/dashboard` | Day-to-day operating view for employees |
| **Inventory** | `/inventory` | Create, edit, categorize, and status-track every product |
| **Price Check** | `/price-check` | Photo plus brand, size, and condition returns an AI-generated price estimate |
| **Market Trends** | `/market-trends` | Aggregated pricing and submission data visualized with Recharts |
| **Admin Console** | `/admin` | Create employees, grant and revoke granular permissions, edit site settings |

---

## Architecture

    React 18 + TypeScript + Vite  (client)
                  │
        TanStack Query + React Router
                  │
        Supabase JS client (auth session)
                  │
    ┌─────────────┴──────────────┐
    │                            │
    Postgres (RLS on every table)   Edge Functions (Deno)
      products                        estimate-price
      profiles                        admin-create-employee
      price_submissions               summarize-looking-for
      user_roles                              │
      user_permissions                Gemini 2.5 Flash (vision)
      site_settings

**Security model.** Every table ships with Row Level Security enabled. Authorization is resolved through two `SECURITY DEFINER` functions, `has_role(user_id, role)` and `has_permission(user_id, permission)`, so policy checks never recurse through the tables they are protecting.

- **Roles:** `admin`, `employee`
- **Permissions:** `post_to_feed`, `use_estimation`, `manage_payroll`, `manage_schedule`
- **Typed domains:** `product_condition`, `product_status`, `submission_status`

Roles gate the surface. Permissions gate the action. An employee can hold inventory access without ever touching payroll.

---

## AI Pricing

`supabase/functions/estimate-price` accepts brand, size, intended use, optional category and notes, and an array of photo URLs, then calls Gemini 2.5 Flash with vision enabled through the Lovable AI Gateway. It validates required fields before spending a token, returns structured JSON, and fails loudly with proper status codes when the API key is missing or the upstream call breaks.

`summarize-looking-for` condenses inbound customer requests into a single staff-readable line so nobody reads forty submissions to find the one that matters.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18, TypeScript 5.8, Vite 5.4 |
| Routing and data | React Router 6, TanStack Query 5 |
| UI | Tailwind CSS 3.4, shadcn/ui, Radix primitives, Lucide, Sonner |
| Forms and validation | React Hook Form, Zod |
| Charts | Recharts |
| Backend | Supabase: Postgres, Auth, Storage, Edge Functions |
| AI | Gemini 2.5 Flash via Lovable AI Gateway |
| Testing | Vitest, Testing Library, jsdom |

---

## Getting Started

```sh
git clone https://github.com/Shacxify/blackandbrown.git
cd blackandbrown
bun install          # or: npm install
cp .env.example .env # add your Supabase project values
bun run dev
```

| Script | Purpose |
|---|---|
| `dev` | Vite dev server with HMR |
| `build` | Production bundle |
| `build:dev` | Development-mode bundle |
| `preview` | Serve the production build locally |
| `lint` | ESLint 9 flat config |
| `test` | Vitest single run |
| `test:watch` | Vitest watch mode |

**Environment variables**

```
VITE_SUPABASE_PROJECT_ID=
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Edge Functions additionally require `LOVABLE_API_KEY`, set as a Supabase function secret, never in client env.

**Database**

```sh
supabase link --project-ref <project-id>
supabase db push        # applies migrations in supabase/migrations
supabase functions deploy estimate-price
```

---

## Project Context

| Field | Detail |
|---|---|
| **Course** | BUS4-110B: Business Process Design and Systems Development |
| **Institution** | SJSU Lucas College of Business |
| **Developer** | [Cash Johnson](https://cashjohnson.net) |
| **Scope** | Full stack: schema design, RLS policy model, edge functions, UI, and admin tooling |
