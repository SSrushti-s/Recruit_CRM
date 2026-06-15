# Recruiting CRM — Job Application Pipeline Tracker

A highly optimized, full-stack Candidate Relationship Management (CRM) platform designed for tech professionals to manage high-volume job search pipelines in real-time. Built with the Next.js 15 App Router, Prisma ORM v5, and a live cloud PostgreSQL instance on Supabase.

## 🚀 Core Features

- **Authentication Gateway:** A streamlined, secure login interface that isolates user tracking domains dynamically.
- **Real-Time Status Pipeline:** Seamlessly transition opportunities across core hiring loops (`Wishlist`, `Applied`, `OA Stage`, `Interviewing`) utilizing a custom, responsive dropdown component.
- **Server Action Engine:** Form submissions and state changes utilize modern secure Next.js Server Actions, minimizing frontend-to-backend API fetch overhead.
- **Enterprise Storage System:** Backed by an AWS-hosted Supabase cloud PostgreSQL cluster utilizing smart connection pools.

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 15 (App Router, Server Components, and Asynchronous Server Actions)
- **Database ORM:** Prisma Client v5.22.0 (Native PostgreSQL Engine mappings)
- **Cloud Database:** Supabase PostgreSQL (Distributed Cloud Hosting on AWS)
- **Styling primitives:** Tailwind CSS (Modern dark mode utility layout)

### Architectural Data Flow

1. **Client Tier:** Interactive events (like pipeline status changes) run inside dedicated `'use client'` component leaves.
2. **Compute Tier:** Mutations leverage secure RPC-style Server Actions, running exclusively on the server layer.
3. **Storage Tier:** Query commands target the Supabase Transaction Pooler (Port `6543`), while structural migrations route directly to the core instance (Port `5432`).

## 📦 Installation & Local Development

### 1. Clone the repository
```bash
git clone [https://github.com/SSrushti-s/Recruit_CRM.git]
cd tech_job_crm
