\# Progress Log



\## 📌 Current Phase

Backend Core (API + Infrastructure)



\---



\## PHASE 2 — Backend Core



\### 🎯 Goal

ساخت API سرور و اتصال به دیتابیس



\### ✅ Done

\- ساختار فولدرها ایجاد شد

\- express, cors, dotenv, nodemon نصب شد

\- server.js ساخته شد

\- .env تنظیم شد

\- Docker + PostgreSQL راه‌اندازی شد

\- Prisma 5 نصب و migrate شد

\- Auth system کامل شد (register/login/JWT)

\- authMiddleware ساخته شد

\- errorHandler و AppError ساخته شد



\### ⏭ Next Step

\- ساخت profile route (GET /api/user/profile)

\- تست authMiddleware روی یک route محافظت شده

\- شروع طراحی مدل‌های دیتابیس (accounts, transactions)



\---



\## 🔐 Environment Strategy

\- .env فقط برای local development

\- production env در server/cloud

\- هیچ secret ای داخل Git نمی‌رود



\---



\## 🧱 Tech Rules

\- No business logic in routes

\- Use service layer (future step)

\- Env variables required for all secrets

\- Database access only via Prisma

\- No direct SQL queries allowed

\- API must be RESTful (for now)



\---



\## 🧠 Architecture Decisions

\- Monorepo Structure

\- Backend: Node.js + Express

\- Database: PostgreSQL (Docker)

\- ORM: Prisma 5

\- Web: Next.js

\- Mobile: React Native + Expo



\---



\## 🚀 Project Goals

\- Web App

\- Android App

\- iOS App

\- Secure Backend

\- Cloud Ready

\- Scalable architecture for future microservices migration



\---



\## 📋 Session Log



\### Session 1 — Foundation Setup

\- تاریخ: 2026-05-11

\- ساختار پروژه ایجاد شد

\- Files changed: README.md, .gitignore, docs/progress.md



\### Session 2 — Backend Core

\- تاریخ: 2026-05-11

\- express + nodemon نصب شد

\- server.js ساخته و تست شد

\- Files changed: backend/src/server.js, backend/.env, backend/package.json



\### Session 3 — Database Setup

\- تاریخ: 2026-05-11

\- Docker + PostgreSQL راه‌اندازی شد

\- Prisma 5 نصب و migrate شد

\- Files changed: backend/prisma/schema.prisma, backend/.env



\### Session 4 — Auth System

\- تاریخ: 2026-05-12

\- Register و Login با JWT پیاده‌سازی شد

\- authMiddleware و errorHandler ساخته شد

\- تست موفق register و login

\- Files changed: backend/src/controllers/authController.js, backend/src/routes/authRoutes.js, backend/src/middleware/\*

