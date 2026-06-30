# Logan Land Historical Adventures

A premium, highly interactive living history and family folk dancing web application built with **Next.js (App Router)**, **Neon Serverless PostgreSQL**, and **Vercel Blob Storage**.

---

## 🚀 Features

* **Living History Portrayals:** Interactive details page showcasing character histories (George Washington, Alvin York, John Newton, etc.).
* **Family Folk Dancing Hub:** Videos, galleries, and information on multi-generational community dancing.
* **Dynamic Calendar & Schedule:** Chronological timeline showing public presentation listings, featuring custom "Add to Calendar" (Google, Apple iCal, Outlook) and social share features.
* **Blog System:** Managed blog with slug generation, excerpts, and rich paragraph layouts.
* **Contact Booking Forms:** Stores all customer inquiries directly in the PostgreSQL database.
* **CMS Admin Dashboard (`/admin`):** Password-protected administrative dashboard allowing secure CRUD management of all presentations, events, FAQs, videos, blogs, and contact messages.
* **Asset Optimization:** Auto-compresses uploaded images to `.webp` format and resizes them using `sharp` to minimize page loading times.
* **Fully Responsive:** Custom mobile navigation overlay drawer, mobile-first font scaling, and responsive grids.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (Turbopack, App Router)
* **Database:** PostgreSQL (hosted on Neon)
* **Storage:** Vercel Blob (for administrative uploads) & Local public folder fallback
* **Styling:** Vanilla CSS (highly customizable layout)
* **Image Processing:** Sharp (native image resizing/compression)

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# Neon PostgreSQL Connection URL
DATABASE_URL=postgresql://user:password@hostname/dbname?sslmode=require

# Administrative Dashboard Password
ADMIN_PASSWORD=your_secure_admin_password

# Vercel Blob Storage Token (Optional - falls back to local public folder if omitted)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token_here
```

---

## 📋 Database Initialization & Seeding

### 1. Create Schema
Run the SQL queries inside [`lib/schema.sql`](lib/schema.sql) in your database query editor (or Neon SQL console) to set up all required tables.

### 2. Seed Initial Content
Run the following command to seed initial presentations, FAQs, and calendar events:
```bash
npm run seed
```
*(Make sure to add `"seed": "node lib/seed.js"` to `package.json` scripts if not already present).*

---

## 💻 Development Workflow

First, install dependencies:
```bash
npm install
```

Run the local development server:
```bash
npm run dev
```

Build the production bundle:
```bash
npm run build
```
