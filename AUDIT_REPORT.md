# LankaEase audit — 31 October 2026

The audit covered the current frontend routes, key browser workflows, API account isolation, and deployment configuration. It is not a guarantee that every possible defect or security issue has been eliminated.

## Fixed

- Failed login/registration no longer creates a demo session. Google sign-in and password reset no longer pretend to have completed real operations.
- Demo access is explicit: `build:preview` enables it; the ordinary production build disables it by default. Stored demo tokens cannot unlock production workspaces.
- Authentication is persisted before navigating, preventing a request from leaving without its new bearer token. The remember-me choice now uses local versus session storage, and stale query data is cleared on account changes.
- Redirects are decoded once and restricted to local paths. Malformed redirect parameters no longer crash sign-in.
- Customer accounts cannot enter provider/admin frontend routes. Backend authorization remains the authority; client-side routing alone is not access control.
- Request details/codes, invoice data/PDFs, payment data, status changes, and conversation writes now check ownership/participation. Customers cannot complete work or set charges. Another person's family record cannot be attached to a request.
- Disabled accounts are rejected. Access and refresh JWTs have distinct types; refresh tokens cannot be used as API access tokens. Production requires an environment-supplied JWT secret.
- Production mock payments are disabled. Amounts are checked against server-side invoice/final amounts; duplicate paid requests are rejected. An unconfigured webhook no longer acknowledges payment success.
- Contact messages are validated and persisted by the backend using the new V3 migration. A network error no longer produces a frontend success notice.
- Demo family members, requests/drafts, and message threads persist on the browser. Conversations are isolated per professional, direct-chat links choose the intended professional, and delayed replies are cancelled on unmount.
- Provider booking links preserve their selected professional/category. Family booking links preserve the family address. Date defaults are current and past dates are rejected. Drafts remain drafts.
- Unknown request IDs display an error rather than someone else's request. Unassigned requests do not show an unrelated professional's phone number or fabricated live tracking.
- Attachments have a real authenticated upload endpoint and constrained file types/sizes. Demo attachments use durable data URLs rather than temporary blob URLs. Uploaded files use generated filenames, and input streams are closed.
- Authenticated PDF downloads send the bearer token. Demo invoices no longer pretend to have official server PDFs.
- Keyword classification no longer mistakes `cracked laptop` for AC repair or `carpenter` for car repair.
- PWA installation no longer references nonexistent icons; a real manifest link/icon and corrected service-worker registration were added. The worker does not cache authenticated API responses and removes old LankaEase caches.
- Docker frontend refresh routing, Netlify/Cloudflare redirects, and Vercel SPA rewrites are included. Production database credential aliases now honour the Docker Compose variable names. Upload directories are configurable and Windows resource paths use file URIs.
- Frontend build/lint checks were added to CI alongside the existing Java build job.

## Verification

- Java 21 Spring Boot: **18 tests passed**, including request/invoice isolation, malicious conversation writes, disabled users, access/refresh misuse, upload rejection, durable contact submission, and classification regressions.
- Browser: **61 checks passed**, including 21 routes at 1440 px and 390 px, error handling with the external API blocked, demo persistence after refresh, booking handoffs, and conversation separation.
- Separate production frontend build: **6 checks passed** for disabled demo entry, rejected stored demo tokens, blocked simulated payments, and absence of fabricated live data/chat.
- Two additional contact-response checks passed: missing persistence acknowledgement is rejected; a saved message ID is accepted.
- Production and preview TypeScript/Vite builds passed.
- Lint reports no errors, with eight nonblocking warnings remaining (context/hook Fast Refresh exports and Date.now usage in demo admin code). Vite also reports the existing large main bundle warning.

The API tests used H2 and did not exercise a hosted PostgreSQL database. Docker image builds, third-party payment/OAuth services, delivery of email, and hosting-provider deployment were not verified. Backend compilation/tests required a local Java 21 run outside the restricted Windows filesystem sandbox because the sandbox blocked dependency JAR path resolution; the dependencies and build outputs stayed in the workspace.

## Still incomplete before a public production launch

1. Connect and verify an actual payment gateway, OAuth provider, and password-reset/email workflow. No real charge or email was sent during the audit.
2. Finish the live management dashboard and chat UI integrations. The existing demo versions remain available only in the explicit design preview; real accounts see an honest unavailable message instead of simulated success.
3. Deploy the backend fixes, apply V3, set a new production JWT secret, and configure exact CORS origins and persistent uploads. The backend changes are local source changes; the existing Railway API was not redeployed by this audit.
4. Review the legacy V2 migration's seeded sample accounts and provision production accounts/credentials. Existing production database rows were not deleted or modified.
5. Complete Sinhala/Tamil translation coverage and optimise the large photography assets/main JavaScript bundle for public traffic. Changing the language selector does not translate every hard-coded English sentence yet.

See [HOSTING.md](HOSTING.md) for the deployment settings, provider links, and free-plan limitations.
