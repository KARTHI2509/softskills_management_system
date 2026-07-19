# Deployment Guide

This guide details steps for deploying the application to production environments.

## Deployment Target Overview
- **Frontend Hosting**: Vercel (Optimized React client app routing support)
- **Backend Hosting**: Render (Express Node server process manager)
- **Database Hosting**: Neon / Aiven / Supabase (Cloud PostgreSQL servers)

---

## 1. Database Setup
1.  Provision a PostgreSQL database instance on Supabase, Neon, or Neon Console.
2.  Obtain the database connection string (e.g., `postgresql://...`).
3.  Run the `/database/schema.sql` tables creation file to initialize the schemas.
4.  Run `/scripts/seed.js` using node command line utility to set up the admin account and mock aptitude questions:
    ```bash
    node Backend/scripts/seed.js
    ```

---

## 2. Backend Deployment on Render
1.  Create a new Web Service on Render and link the GitHub repository.
2.  Set environmental variables in settings:
    - `DATABASE_URL`: Cloud connection string.
    - `JWT_SECRET`: Random secure string.
    - `NODE_ENV`: `production`
    - `PORT`: `10000` (Render binds this dynamically)
3.  Set Build Command:
    ```bash
    cd Backend && npm install
    ```
4.  Set Start Command:
    ```bash
    cd Backend && node server.js
    ```

---

## 3. Frontend Deployment on Vercel
1.  Create a project on Vercel and link the GitHub repository.
2.  Select React/Vite preset config settings.
3.  Set Root Directory to: `Frontend`.
4.  Set environment variables:
    - `VITE_API_URL`: Path URL mapping to Render backend endpoint (e.g., `https://backend-service.onrender.com/api`).
5.  Set Build Command:
    ```bash
    npm install && npm run build
    ```
6.  Set Output Directory:
    ```
    dist
    ```
7.  Deploy! Vercel handles frontend page routing setups automatically via configured `/vercel.json` rules.
