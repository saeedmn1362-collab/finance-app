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

این باگ رو دارم
PS D:\Projects\finance-app\backend> npm run dev

> backend@1.0.0 dev
> nodemon src/server.js

[nodemon] 3.1.14
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node src/server.js`
D:\Projects\finance-app\backend\src\server.js:85
  console.log(`🚀 Server running on port ${PORT}`);
               ^

SyntaxError: Invalid or unexpected token
    at wrapSafe (node:internal/modules/cjs/loader:1763:18)
    at Module._compile (node:internal/modules/cjs/loader:1804:20)
    at Object..js (node:internal/modules/cjs/loader:1961:10)
    at Module.load (node:internal/modules/cjs/loader:1553:32)
    at Module._load (node:internal/modules/cjs/loader:1355:12)
    at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
    at node:internal/main/run_main_module:33:47

Node.js v24.15.0
[nodemon] app crashed - waiting for file changes before starting...

مشکل رو حل کردم و داشبوردها و هم ساختیم و تست های زیر هم گرفتیم
PS D:\Projects\finance-app\backend> $token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbXAzcjM0eWkwMDAwNzUzOGZpMmExZGFpIiwiaWF0IjoxNzc4NjU4MDgxLCJleHAiOjE3NzkyNjI4ODF9.ae-gcFGFGlodloHvM4uoBy-NE6TliCSNufAiSzSDQ6g"
PS D:\Projects\finance-app\backend> $headers = @{ Authorization = "Bearer $token" }
PS D:\Projects\finance-app\backend> Invoke-RestMethod `
>> -Uri "http://localhost:5000/api/dashboard" `
>> -Method GET `
>> -Headers $headers

success message               data
------- -------               ----
   True Dashboard data loaded @{totalBalance=1000; incomeThisMonth=1000; expenseThisMonth=0; accounts=System.Object[...


PS D:\Projects\finance-app\backend> Invoke-RestMethod `
>> -Uri "http://localhost:5000/api/accounts" `
>> -Method GET `
>> -Headers $headers

success message                       count data
------- -------                       ----- ----
   True Accounts fetched successfully     1 {@{id=cmp3rk8qs0002xzbwlxmywk8i; name=Main Wallet; type=BANK; currency=U...


PS D:\Projects\finance-app\backend> $body = @{
>>     name = "Cash Wallet"
>>     type = "CASH"
>>     currency = "USD"
>>     initialBalance = 500
>> } | ConvertTo-Json
PS D:\Projects\finance-app\backend>
PS D:\Projects\finance-app\backend> Invoke-RestMethod `
>> -Uri "http://localhost:5000/api/accounts" `
>> -Method POST `
>> -Body $body `
>> -ContentType "application/json" `
>> -Headers $headers

success message                      data
------- -------                      ----
   True Account created successfully @{id=cmp3ruht70009xzbw8r58b739; name=Cash Wallet; type=CASH; currency=USD; init...


PS D:\Projects\finance-app\backend> Invoke-RestMethod `
>> -Uri "http://localhost:5000/api/categories" `
>> -Method GET `
>> -Headers $headers

message           data
-------           ----
Categories loaded {@{id=cmp3rkqtv0006xzbw4571li47; name=Food; type=EXPENSE; color=; icon=; isArchived=False; deleted...


PS D:\Projects\finance-app\backend> $body = @{
>>     name = "Food"
>>     type = "EXPENSE"
>> } | ConvertTo-Json
PS D:\Projects\finance-app\backend>
PS D:\Projects\finance-app\backend> Invoke-RestMethod `
>> -Uri "http://localhost:5000/api/categories" `
>> -Method POST `
>> -Body $body `
>> -ContentType "application/json" `
>> -Headers $headers
Invoke-RestMethod : {"message":"Category already exists"}
At line:1 char:1
+ Invoke-RestMethod `
+ ~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation: (System.Net.HttpWebRequest:HttpWebRequest) [Invoke-RestMethod], WebExc
   eption
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Microsoft.PowerShell.Commands.InvokeRestMethodCommand
PS D:\Projects\finance-app\backend> Invoke-RestMethod `
>> -Uri "http://localhost:5000/api/categories/tree" `
>> -Method GET `
>> -Headers $headers

message              data
-------              ----
Category tree loaded {@{id=cmp3rkqtv0006xzbw4571li47; name=Food; type=EXPENSE; color=; icon=; parentId=; isArchived=...


PS D:\Projects\finance-app\backend> Invoke-RestMethod `
>> -Uri "http://localhost:5000/api/transactions" `
>> -Method GET `
>> -Headers $headers

message        count transactions
-------        ----- ------------
لیست تراکنش‌ها     2 {@{id=cmp3ruhtc000bxzbwzua07r20; type=INCOME; amount=500; description=Initial balance; date=202...


PS D:\Projects\finance-app\backend>

