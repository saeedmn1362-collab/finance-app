# Architecture Decisions

## 2026-05-11 — Database Schema Design

### Transaction Model
- از یک مدل واحد Transaction استفاده شد
- ساختار ترکیبی:
  - `accountId` → برای INCOME / EXPENSE
  - `fromAccountId` + `toAccountId` → برای TRANSFER
- enforcement در سطح application انجام می‌شود (نه DB)

### Future Considerations
- در مقیاس بزرگ:
  - Split به `Transaction` و `TransferTransaction`
  - یا استفاده از Double-Entry Accounting (Ledger system)
- Balance:
  - فعلاً computed (query-based)
  - در آینده ممکن است cached field اضافه شود

### Prisma Version Decision
- انتخاب Prisma 5 به جای 7
- دلیل:
  - Prisma 7 نیاز به Driver Adapter دارد
  - Prisma 5 stable و production-ready است
- Migration به نسخه جدید در آینده امکان‌پذیر است

### PersonType Design
- DEFAULT: `CONTACT`
- `BORROWER` → فردی که قرض گرفته
- `LENDER` → فردی که قرض داده

### Money Handling
- استفاده از `Decimal(18,2)`
- دلیل:
  - جلوگیری از خطای floating point
  - مناسب برای financial systems

---

## ⚠️ 2026-05-12 — Known Issue (Temporary)

- Profile endpoint authentication flow currently under debugging
- احتمال مشکل در JWT verification or middleware integration
- این issue موقتی است و مربوط به architecture design نیست
- تأثیر روی core system ندارد (Auth system هنوز functional است)

---

## 2026-05-16 — Frontend Architecture Decisions

### Next.js App Router
- استفاده از App Router
- دلیل:
  - layout nesting
  - route groups
  - server/client separation
  - scalable architecture

### Frontend State Strategy
- Server State:
  - React Query
- UI State:
  - local component state
- Global App Context:
  - AuthContext
  - CommandRegistry

### Command System Architecture
- سیستم مرکزی command registry طراحی شد
- قابلیت‌ها:
  - global commands
  - scoped commands
  - keyboard shortcuts
  - command palette
  - contextual visibility
  - RBAC integration
- دلیل:
  - desktop-like UX
  - scalable action system
  - centralized navigation/actions

### Route Synchronization
- RouteSync component ایجاد شد
- current route داخل CommandRegistry sync می‌شود
- هدف:
  - route-aware commands
  - contextual navigation
  - permission-aware actions

### Auth Flow Architecture
- AuthProvider مسئول global auth state است
- AuthBootstrap مسئول sync کردن auth با command context است
- GuestGuard:
  - فقط برای guest pages
- useAuthGuard:
  - فقط برای protected pages

### Redirect Strategy
- همیشه از router.replace استفاده می‌شود
- دلیل:
  - جلوگیری از redirect loop
  - جلوگیری از polluted history stack

### React Query Strategy
- retry = 1
- refetchOnWindowFocus = false
- دلیل:
  - جلوگیری از request storm
  - UX بهتر برای financial dashboard

### RBAC Direction
- RBAC به صورت frontend + backend enforcement طراحی شد
- frontend:
  - visibility control
  - navigation guard
  - command visibility
- backend:
  - real authorization enforcement

### Navigation Architecture
- Sidebar navigation
- Command palette navigation
- keyboard-first UX
- route-context aware navigation

### Future Frontend Plans
- Auto RBAC Tester
- Navigation Guard System
- Permission Visualizer
- Command Palette UI
- Global Search
- Offline-first caching

---

## 2026-05-16 — Deployment Strategy

### Backend Deployment
- Dockerized deployment
- PostgreSQL managed separately
- environment-based configuration

### Frontend Deployment
- Vercel preferred
- SSR + App Router optimized

### Mobile Deployment
- Expo / React Native
- shared API contracts

### Monitoring Direction
- structured logging
- request tracing
- error monitoring
- audit logging for financial actions

---

## 2026-05-16 — Git Strategy

### Branching
- main → stable production-ready branch
- feature/* → feature development
- fix/* → bug fixes

### Commit Convention
- feat:
- fix:
- refactor:
- docs:
- chore:

### Pull Request Policy
- no direct push to main
- all features tested before merge

### Definition of Done
Feature considered done only if:
- implementation complete
- types safe
- lint passes
- no console errors
- tested manually
- architecture respected
- no duplicated logic
- responsive UI verified