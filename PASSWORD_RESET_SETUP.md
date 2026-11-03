# Password reset setup

The sign-in page links to `/forgot-password`. Users receive a link to
`/reset-password` and choose a new password. Tokens expire after 15 minutes,
are signed separately from login tokens, and become invalid after a password
change. Resetting locks the user row to prevent concurrent reuse. No database
migration is required. Existing login sessions retain their normal expiry.

Configure these variables on the backend hosting service (Render):

| Variable | Value |
| --- | --- |
| `PASSWORD_RESET_RESEND_API_KEY` | Private Resend API key with email sending permission |
| `PASSWORD_RESET_FROM` | A sender address on your verified Resend domain, e.g. `LankaEase <accounts@your-domain.com>` |
| `PASSWORD_RESET_FRONTEND_URL` | `https://lanka-ease.netlify.app` |

Redeploy the backend and frontend. Never put the email API key in frontend
variables. For local testing set the frontend URL to `http://localhost:5173`.
The local `Start-Supabase.ps1` reads these optional variables from `backend/.env`.

Without sender configuration the request endpoint reports that password reset
email is unavailable. Successful requests use the same response for unknown,
disabled and active accounts. Delivery failures are logged without email addresses
or reset tokens. The in-process cooldown allows one email per account per minute;
use a shared gateway rate limit if running multiple backend instances.

Test with an account you control: request the email, open its link, choose a
new password, verify login, and confirm the same link cannot be reused. Tokens
are carried in the URL fragment so they are not sent to frontend server logs.
