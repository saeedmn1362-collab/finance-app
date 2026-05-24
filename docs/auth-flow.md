\# Auth Flow



\## Authentication Strategy

JWT-based authentication



\## Login Flow

1\. User submits credentials

2\. Backend validates user

3\. JWT token returned

4\. Token stored in localStorage

5\. AuthBootstrap syncs auth state

6\. Guards update route access



\## Guards

\- GuestGuard

\- AuthGuard



\## Route Protection

Protected routes require valid auth state.



\## Future Improvements

\- Refresh Tokens

\- Cookie-based auth

\- RBAC

\- Session expiration handling

