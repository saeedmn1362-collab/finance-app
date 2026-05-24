\# Database



\## Database Engine

PostgreSQL



\## ORM

Prisma ORM



\---



\# Main Tables



\## User

\- id

\- email

\- password

\- createdAt



\## Account

\- id

\- name

\- balance

\- userId



\## Transaction

\- id

\- amount

\- type

\- accountId

\- categoryId



\## Category

\- id

\- name

\- type



\---



\# Relationships



User -> Accounts

Account -> Transactions

Category -> Transactions



\---



\# Future Improvements

\- Soft delete

\- Audit logs

\- Multi-currency

\- Recurring transactions

