\# Architecture Decisions



\## 2026-05-11 — Database Schema Design



\### Transaction Model

\- از یک مدل واحد Transaction استفاده شد

\- ساختار ترکیبی:

&#x20; - `accountId` → برای INCOME / EXPENSE

&#x20; - `fromAccountId` + `toAccountId` → برای TRANSFER

\- enforcement در سطح application انجام می‌شود (نه DB)



\### Future Considerations

\- در مقیاس بزرگ:

&#x20; - Split به `Transaction` و `TransferTransaction`

&#x20; - یا استفاده از Double-Entry Accounting (Ledger system)

\- Balance:

&#x20; - فعلاً computed (query-based)

&#x20; - در آینده ممکن است cached field اضافه شود



\### Prisma Version Decision

\- انتخاب Prisma 5 به جای 7

\- دلیل:

&#x20; - Prisma 7 نیاز به Driver Adapter دارد

&#x20; - Prisma 5 stable و production-ready است

\- Migration به نسخه جدید در آینده امکان‌پذیر است



\### PersonType Design

\- DEFAULT: `CONTACT`

\- `BORROWER` → فردی که قرض گرفته

\- `LENDER` → فردی که قرض داده



\### Money Handling

\- استفاده از `Decimal(18,2)`

\- دلیل:

&#x20; - جلوگیری از خطای floating point

&#x20; - مناسب برای financial systems

