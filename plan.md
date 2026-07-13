# Copilot Task: Complete & MERN-ify "BuiltByWho" Landing Page

## Context

I have a single static HTML/CSS/JS file for a freelance web-dev studio landing page called **BuiltByWho** (two-person team, positioning: fast, bold, cocky, black + red + neon-lime color scheme, dev-agency vibe). The file is attached/included in this repo as `builtbywho.html`.

I need you to:
1. Convert this into a proper **MERN stack project** (MongoDB, Express, React, Node.js).
2. Fill in the sections that are currently placeholders with real, working functionality.
3. Ask me clarifying questions **before** making irreversible architectural decisions (e.g. auth strategy, hosting target, database schema) — don't guess silently on anything that's expensive to undo.

Do not start writing code until you've read this whole file and asked me the questions in the "Questions Before You Start" section below.

---

## Part 1 — Convert static HTML to React (MERN frontend)

- Set up a **Vite + React** app (or Next.js if I tell you to — see questions below) in a `client/` folder.
- Break `builtbywho.html` into componentized sections:
  - `Navbar`, `Hero` (with the animated terminal component), `MarqueeStrip`, `Services`, `Work` (portfolio grid), `About` (founders), `Pricing`, `Testimonials`, `FAQ`, `FinalCTA`, `Footer`.
- Preserve all existing visual design, fonts (Anton, JetBrains Mono, Inter via Google Fonts), colors, and animations exactly as they are — this is a design that's already been approved, don't restyle it.
- Recreate the terminal typing animation and the FAQ accordion as React components using `useState`/`useEffect` (no jQuery, no unnecessary libraries).
- Keep the scroll-reveal behavior using `IntersectionObserver` inside a small reusable `useReveal` hook.
- Respect `prefers-reduced-motion` exactly as the original does.
- Make sure the whole thing is fully responsive (it already has mobile breakpoints in the CSS — carry those over faithfully).

---

## Part 2 — Backend (Express + MongoDB)

Set up a `server/` folder with Express and MongoDB (Mongoose) to power the **currently-static / placeholder sections**, so the site becomes dynamic instead of hardcoded:

### 2.1 — Contact / "Book a call" / "Get a quote" form
- Currently the CTA buttons (`Book a call`, `WhatsApp us`, `Email us`, `Get a quote`) all point to `#`.
- Build a real **Contact/Lead model** in MongoDB: `{ name, email, phone, projectType, budget, message, createdAt }`.
- Build a `POST /api/leads` endpoint that saves a submission.
- Replace the current buttons with an actual contact form (name, email, project type, budget range, message) that posts to this endpoint and shows a success/error state.
- Add basic server-side validation (required fields, valid email format) and rate-limiting to prevent spam submissions.

### 2.2 — Portfolio / "Work" section (currently 3 placeholder cards)
- Build a **Project model**: `{ title, tag/category, description, thumbnailUrl, liveUrl, order, published }`.
- Build `GET /api/projects` (public, returns only `published: true`, sorted by `order`) and basic admin CRUD endpoints (`POST /api/projects`, `PUT /api/projects/:id`, `DELETE /api/projects/:id`) protected by admin auth (see Part 3).
- The React `Work` component should fetch from `GET /api/projects` and render real cards instead of the hardcoded placeholder slots. If zero projects exist yet, show a clean empty-state message instead of fake placeholder cards.

### 2.3 — Testimonials (currently 3 fake placeholder quotes)
- Build a **Testimonial model**: `{ clientName, role, company, quote, published, order }`.
- Same pattern as projects: public `GET /api/testimonials` (published only), admin CRUD.
- React component fetches real testimonials; if none exist, hide the section entirely rather than showing fake quotes.

### 2.4 — Founders/About section (currently generic "Founder One / Founder Two" with monogram avatars)
- This can stay mostly static (it's just two people), but move the content (names, roles, bios, photo URLs, social links) into a config file or a simple `Founder` model — your call, flag which you'd recommend and why.

### 2.5 — Pricing section
- Keep this static/config-driven for now (a `pricing.config.js` or similar) rather than a DB model, since it changes rarely. Confirm this assumption with me before building a full CRUD system for it.

---

## Part 3 — Admin access (so we can update content without touching code)

- Build a minimal **admin-only route** (e.g. `/admin`) with simple authentication (JWT-based login, single admin user seeded via environment variables — no public sign-up).
- From `/admin`, we should be able to add/edit/delete: projects, testimonials, and view submitted leads.
- Keep this minimal — a plain, functional dashboard is fine. It does not need the same design polish as the public site, just clear and usable.

---

## Part 4 — Environment, config, and deployment prep

- Create a proper `.env.example` for both `client/` and `server/` (Mongo URI, JWT secret, port, admin seed credentials, any email/WhatsApp API keys once I provide them).
- Set up CORS correctly between client and server for local dev.
- Add basic `README.md` instructions: how to install, run locally, and seed the admin user.
- Do **not** hardcode any secrets, API keys, or the Mongo URI directly in code.

---

## Constraints

- Keep the existing visual design/branding untouched unless I explicitly ask for a design change.
- Prefer plain, readable code over clever abstractions — this is a 2-person freelance team's own site, not enterprise software.
- Don't introduce a UI component library (no MUI/Chakra/etc.) — keep the existing hand-rolled CSS.
- Don't add features I haven't asked for (no blog, no newsletter signup, no multi-language support) unless I request them.
- If something in `builtbywho.html` is ambiguous or missing content, don't invent business details (like real prices, real client names, real testimonials) — leave clearly marked placeholders or ask me.

---

## Questions Before You Start

Please ask me these (or answer with reasonable defaults and clearly flag the default so I can override it):

1. **Hosting target** — Where will this be deployed? (e.g. Vercel for frontend + Render/Railway for backend + MongoDB Atlas, or something else?) This affects how I structure environment configs and CORS.
2. **React framework** — Plain Vite + React, or Next.js (in case you want SSR/SEO benefits for a client-facing marketing site)?
3. **Contact form delivery** — Should form submissions *only* be stored in MongoDB, or should they also trigger an email/WhatsApp notification to us? If email, which service (e.g. Resend, Nodemailer + Gmail, SendGrid)?
4. **Admin auth** — Is a single hardcoded admin account (via env vars) enough for both of us, or do you want two separate admin logins?
5. **Image hosting for portfolio thumbnails** — Should project thumbnails be uploaded directly (e.g. via Cloudinary/S3), or just store external image URLs for now since we don't have real projects yet?
6. **Domain/branding assets** — Do you already have a domain name and a real logo file, or should placeholders stay in place for now?
7. **Founders' real info** — Can you provide real names, roles, bios, and photo URLs (or should I keep "Founder One / Founder Two" placeholders until you send them)?
8. **Pricing model** — Confirm: keep pricing static/config-driven (not DB-backed) for now?
9. **WhatsApp integration** — Should "WhatsApp us" just be a `wa.me` link with your number, or do you want an actual WhatsApp Business API integration?
10. **Timeline priority** — Given your own "1-week delivery" branding — do you want the MERN conversion done in phases (frontend first, then backend, then admin), or all at once?

---

## Deliverable

A working MERN project (`client/` + `server/`) that:
- Visually matches `builtbywho.html` exactly.
- Has a real, saving contact form.
- Has dynamic (DB-backed) portfolio and testimonials sections with clean empty states.
- Has a minimal working admin panel to manage that content.
- Comes with a `README.md` explaining setup, and `.env.example` files for both client and server.

Ask your clarifying questions first. Then propose a short build plan (folder structure + order of implementation) before writing code, so I can confirm before you start.