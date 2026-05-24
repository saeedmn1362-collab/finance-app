\# API Documentation



\## Base URL



Development:

http://localhost:5000/api



Production:

TBD



\---



\# Authentication



\## POST /auth/register



Create new user.



Body:

{

&#x20; "name": "string",

&#x20; "email": "string",

&#x20; "password": "string"

}



Response:

{

&#x20; "token": "jwt"

}



\---



\## POST /auth/login



Login existing user.



Body:

{

&#x20; "email": "string",

&#x20; "password": "string"

}



Response:

{

&#x20; "token": "jwt"

}



\---



\## GET /auth/me



Get current authenticated user.



Headers:

Authorization: Bearer TOKEN



\---



\# Accounts



\## GET /accounts



Get user accounts.



\## POST /accounts



Create account.



\---



\# Transactions



\## GET /transactions



Get transactions.



\## POST /transactions



Create transaction.



\---



\# Categories



\## GET /categories



Get categories.

