\# Progress Log



\## 📌 Current Phase

Backend Core (API + Infrastructure)



\---



\## PHASE 2 — Backend Core



\### 🎯 Goal

ساخت API سرور و اتصال به دیتابیس



\### ✅ Done

\- ساختار فولدرها ایجاد شد

\- فایل‌های اولیه ایجاد شدند

\- express, cors, dotenv نصب شد

\- nodemon نصب شد

\- server.js ساخته شد

\- سرور روی پورت 5000 اجرا شد

\- .env تنظیم شد

\- .gitignore اصلاح شد

\- Docker نصب شد

\- PostgreSQL روی Docker اجرا شد (پورت 5432)

\- Prisma نصب و تنظیم شد

\- Migration اولیه انجام شد (User model)

\- Prisma Client generate شد



\### ⏭ Next Step

\- ساخت Auth routes (register/login)

\- پیاده‌سازی JWT

\- نصب bcrypt برای hash کردن password



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

\- All database queries must go through Prisma layer

\- No direct SQL queries allowed

\- API must be RESTful (for now)



\---



\## 🧠 Architecture Decisions

\- Monorepo Structure

\- Backend: Node.js + Express

\- Database: PostgreSQL (Docker)

\- ORM: Prisma v7

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

\- Prisma نصب و migrate شد

\- Files changed: backend/prisma/schema.prisma, backend/prisma.config.ts, backend/.env

