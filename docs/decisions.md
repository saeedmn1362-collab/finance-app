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

