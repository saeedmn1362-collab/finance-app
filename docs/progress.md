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

\- طراحی کامل schema مالی انجام شد

\- enums برای AccountType, TransactionType, PersonType اضافه شد

\- مدل Transaction برای transfer/income/expense طراحی شد

\- Decimal برای financial precision انتخاب شد

\- migration به PostgreSQL با موفقیت انجام شد

\- تصمیمات معماری در decisions.md ثبت شد



\### ⏭ Next Step

\- ساخت profile route (GET /api/user/profile)

\- ساخت account routes (CRUD)

\- ساخت transaction routes (CRUD)

\- ساخت category routes (CRUD)



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



\### Session 5 — Database \& Financial Domain

\- تاریخ: 2026-05-12

\- طراحی کامل schema مالی انجام شد

\- enums برای AccountType, TransactionType, PersonType اضافه شد

\- مدل Transaction برای transfer/income/expense طراحی شد

\- Decimal برای financial precision انتخاب شد

\- migration به PostgreSQL با موفقیت انجام شد

\- تصمیمات معماری در decisions.md ثبت شد

\- Files changed: backend/prisma/schema.prisma, docs/decisions.md



\### Session 6 — Profile Endpoint Debugging

\- تاریخ: 2026-05-12

\- endpoint `/api/user/profile` ساخته شد

\- authMiddleware به route متصل شد

\- مشکل در authentication flow مشاهده شد:

&#x20; - "توکن نامعتبر"

&#x20; - یا "خطای سرور"

\- در حال بررسی موارد زیر:

&#x20; - JWT verification (secret / sign vs verify mismatch)

&#x20; - req.user assignment در middleware

&#x20; - ترتیب اجرای middleware در Express

\- وضعیت: debugging phase (core system هنوز functional است)
### Session 7 — 2026-05-12 (Testing & Stabilization Phase)

#### 🧪 Work Done Today
- Fixed JWT authentication issues (token validation problems)
- Debugged authMiddleware and route protection
- Created new test user for isolated testing
- Successfully tested account creation via API
- Implemented full transaction flow testing:
  - INCOME transaction tested
  - EXPENSE transaction tested
- Verified balance calculation endpoint
- Created automated PowerShell test script (


