# Progress Log

## 📌 Current Phase
Backend Core (API + Infrastructure)

---

## PHASE 2 — Backend Core

### 🎯 Goal
ساخت API سرور و اتصال به دیتابیس

### ✅ Done
- ساختار فولدرها ایجاد شد
- express, cors, dotenv, nodemon نصب شد
- server.js ساخته شد
- .env تنظیم شد
- Docker + PostgreSQL راه‌اندازی شد
- Prisma 5 نصب و migrate شد
- Auth system کامل شد (register/login/JWT)
- authMiddleware ساخته شد
- errorHandler و AppError ساخته شد
- طراحی کامل schema مالی انجام شد
- enums برای AccountType, TransactionType, PersonType اضافه شد
- مدل Transaction برای transfer/income/expense طراحی شد
- Decimal برای financial precision انتخاب شد
- migration به PostgreSQL با موفقیت انجام شد
- تصمیمات معماری در decisions.md ثبت شد
- profile route ساخته شد
- account routes (CRUD) کامل شد
- transaction routes (CRUD) کامل شد
- category routes (CRUD) کامل شد
- dashboard endpoint کامل شد
- service layer پیاده‌سازی شد
- تست کامل API با PowerShell انجام شد

### ⏭ Next Step
- reports endpoint تکمیل
- pagination برای transactions
- فیلتر و جستجو
- شروع Web App (Next.js)

---

## 🔐 Environment Strategy
- .env فقط برای local development
- production env در server/cloud
- هیچ secret ای داخل Git نمی‌رود

---

## 🧱 Tech Rules
- No business logic in routes
- Use service layer ✅ (implemented)
- Env variables required for all secrets
- Database access only via Prisma
- No direct SQL queries allowed
- API must be RESTful (for now)

---

## 🧠 Architecture Decisions
- Monorepo Structure
- Backend: Node.js + Express
- Database: PostgreSQL (Docker)
- ORM: Prisma 5
- Web: Next.js
- Mobile: React Native + Expo

---

## 🚀 Project Goals
- Web App
- Android App
- iOS App
- Secure Backend
- Cloud Ready
- Scalable architecture for future microservices migration

---

## 📋 Session Log

### Session 1 — Foundation Setup
- تاریخ: 2026-05-11
- ساختار پروژه ایجاد شد
- Files changed: README.md, .gitignore, docs/progress.md

### Session 2 — Backend Core
- تاریخ: 2026-05-11
- express + nodemon نصب شد
- server.js ساخته و تست شد
- Files changed: backend/src/server.js, backend/.env, backend/package.json

### Session 3 — Database Setup
- تاریخ: 2026-05-11
- Docker + PostgreSQL راه‌اندازی شد
- Prisma 5 نصب و migrate شد
- Files changed: backend/prisma/schema.prisma, backend/.env

### Session 4 — Auth System
- تاریخ: 2026-05-12
- Register و Login با JWT پیاده‌سازی شد
- authMiddleware و errorHandler ساخته شد
- تست موفق register و login
- Files changed: backend/src/controllers/authController.js, backend/src/routes/authRoutes.js, backend/src/middleware/*

### Session 5 — Database & Financial Domain
- تاریخ: 2026-05-12
- طراحی کامل schema مالی انجام شد
- enums برای AccountType, TransactionType, PersonType اضافه شد
- migration به PostgreSQL با موفقیت انجام شد
- Files changed: backend/prisma/schema.prisma, docs/decisions.md

### Session 6 — API Routes & Service Layer
- تاریخ: 2026-05-12
- profile, account, transaction, category, dashboard routes ساخته شد
- service layer پیاده‌سازی شد
- باگ SyntaxError در server.js حل شد
- تست کامل API با PowerShell انجام شد
- Files changed: backend/src/controllers/*, backend/src/routes/*, backend/src/services/*

### Session 7 — Cleanup & Stabilization
- تاریخ: 2026-05-13
- فایل‌های تکراری حذف شدند (AppError, prisma/client)
- prisma/client.js به عنوان bridge ساخته شد
- پروژه به GitHub push شد
- Files changed: backend/src/prisma/client.js

---

### Session 8 — Frontend Infrastructure & Command System
- تاریخ: 2026-05-16

### Completed
- Next.js App Router architecture stabilized
- AuthProvider integrated globally
- RouteSync system implemented
- CommandRegistry system implemented
- Global command architecture added
- Keyboard shortcut engine added
- Sidebar navigation integrated
- Route-aware command context implemented
- GuestGuard architecture stabilized
- useAuthGuard improved
- redirect loop debugging completed
- React Query provider stabilized

### New Systems
- Command System
- Route Sync System
- Shortcut Engine
- Navigation-aware Commands
- Context-aware Command Visibility

### Debug Infrastructure
- AuthTester
- RouteTester
- CommandTester

### Architecture Improvements
- centralized auth state
- centralized route context
- scalable command infrastructure
- RBAC-ready navigation system

### Current Frontend Status
- authentication flow functional
- route synchronization functional
- global commands functional
- command visibility system functional
- sidebar navigation functional

### Remaining Frontend Tasks
- command palette UI
- Auto RBAC Tester
- Navigation Guard System
- Permission Visualizer
- dashboard data integration
- transaction pages
- account pages
- category management UI

### Known Issues
- occasional browser redirect instability observed during development
- requires final middleware-based auth stabilization later

### Files Added/Updated
- web/src/context/CommandRegistry.tsx
- web/src/components/route/RouteSync.tsx
- web/src/components/debug/CommandTester.tsx
- web/src/components/debug/RouteTester.tsx
- web/src/components/auth/AuthBootstrap.tsx
- web/src/hooks/useAuthGuard.ts
- web/src/components/guard/GuestGuard.tsx
- web/src/components/layout/Sidebar.tsx
- web/src/components/command/*