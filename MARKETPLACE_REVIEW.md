# Provider marketplace implementation — ready for local review

This task has not pushed code, deployed a site, modified production environment secrets, or applied a production migration. A read-only JDBC catalog inspection of the configured Supabase database was performed before designing the changes. All write tests used a separate, local H2 database. Earlier status documents describe previously approved deployments; they do not describe this marketplace release.

## Implemented behavior

| Area | Result |
| --- | --- |
| Registration / onboarding | Existing provider registration creates a pending, unverified account. The next step in the provider workspace collects business information, contact details, WhatsApp, categories, speciality, description, experience, qualifications, location, coverage, prices, hours, emergency preferences, portfolio and private verification images. Selected registration photos are persisted through the backend instead of being fabricated in browser state. |
| Profile and services | Providers edit their own profile, replace/remove its picture, add/remove portfolio references, and create/edit/deactivate individual services with category, description, price range and duration. Service categories and minimum/maximum prices stay consistent with active listings. Historical bookings keep their selected service title and estimate. |
| Availability | Available/Busy/Offline, per-day hours, blocked dates and emergency preferences are stored. Booking validation uses Sri Lanka dates and the provider's schedule; individual service duration must fit working hours. |
| Directory | Database search across name, business, description, speciality, category, service title and location; 300 ms debounce; real category counts; combined base-province/base-district/service-city, verification, availability, starting-price, rating and experience filters; rating/price/experience/newest sorting; pagination, suggestions, loading, retry and empty states. |
| Public profiles | Detailed route `/providers/:id` includes real details, services/prices, portfolio, hours, coverage and reviews. Owners see a workspace/edit link. Missing photos use initials, not a stock portrait. No reviews is displayed instead of a fabricated five-star score. |
| Bookings | Provider/service selection, description, preferred appointment, address, confirmation/tracking, ownership-protected acceptance/progress, rejection/cancellation before work starts, a provider reschedule proposal and explicit customer acceptance, actual-charge completion and a completed-booking review. Drafts stay private to the customer/admin. |
| Chat | Directory/profile buttons start an authorized customer–provider conversation. Both sides list/read/reply, with unread counts and periodic refresh. Messages persist through existing chat APIs; no simulated replies. Provider accounts cannot impersonate customers to start conversations. |
| Provider performance | Total/pending/completed bookings, visible customer ratings and reviews, and earnings from recorded PAID transactions only. Pending/refunded transactions are excluded. |
| Admin | Existing administration gains verification document review, approve/reject/more-info decisions, provider suspension/restoration, provider/review reports, review hiding/restoration, booking monitoring and actual recorded revenue. Disabled accounts cannot use an existing token. |
| Uploads | Provider images are decoded/re-encoded, restricted to JPEG/PNG/GIF, 5 MB and 12 megapixels. Random identifiers and account ownership checks prevent path traversal and cross-account reuse. Images are stored in PostgreSQL so they do not disappear on a Render restart. Verification images are private to their owner/admin and returned with no-store caching. |

Directory search remains a Spring/JPA implementation; no external search service, authentication system, frontend framework or storage credentials were introduced. Schedule/portfolio preferences use a validated configuration document in a relational provider-details row, while searchable location/speciality fields have dedicated columns. Reviews are hidden rather than deleted; services are deactivated to preserve bookings.

## Database change for approval

Review the complete transaction in [V4__marketplace_release.REVIEW.sql](backend/db/review/V4__marketplace_release.REVIEW.sql). It creates exactly four application tables:

- `public.provider_details`: unique provider settings, location, speciality and availability.
- `public.provider_services`: provider-owned service listings and prices.
- `public.marketplace_media`: image bytes, purpose and owner. Private documents never appear in the public profile DTO.
- `public.provider_reports`: submitted provider/review reports and moderation state.

It adds `reviews.is_hidden` and optional `service_id`, `service_title`, `proposed_date`, `proposed_time` columns to `service_requests`, plus the related constraints/indexes. Existing bookings remain valid with null optional fields. No table is dropped, no existing record is deleted, no demo seed is run, and existing table ownership/grants are not replaced.

The same transaction enables RLS and revokes direct PUBLIC/anon/authenticated table and sequence access on the four new tables. The existing privileged Spring database connection remains responsible for authorization; this application does not use the browser's Supabase Data API.

The wrapper fixes the schema to `public`, applies short lock/statement timeouts, and refuses to run over already-created marketplace tables. It must be executed as one complete transaction. The database-independent DDL source is [V4__provider_marketplace.sql](backend/src/main/resources/db/marketplace/V4__provider_marketplace.sql); PostgreSQL-only permissions are [V4__provider_marketplace_permissions.sql](backend/db/review/V4__provider_marketplace_permissions.sql). The wrapper contains both sections. Do not run them separately in production.

V4 is deliberately outside the automatic Flyway migration directory. Keep `DB_MIGRATIONS_ENABLED=false`; enabling historical Flyway V2 would run demo seeds and is not part of this release. Before the first approved production application, confirm there has been no schema drift since the read-only inspection and record the migration checksum/application in the release log. A nonempty partial marketplace schema needs a new reviewed delta, not a rerun or a reset.

## Verification

- Backend: `mvn.cmd -B -f backend/pom.xml verify` passed: **64 tests, zero failures/errors, one skipped optional live-connectivity test**. Twenty-one marketplace integration tests cover registration, profile/service database round trips, cross-account authorization, combined search/location/category filtering, availability, invalid prices/hours, selected services, booking acceptance/rejection, rescheduling consent, media validation/privacy, approval, suspension, chat authorization, actual fees/earnings, reviews/moderation and draft privacy.
- Schema: `SchemaValidationTest` applies the existing reviewed schema fixture plus V4 to isolated H2 and validates all JPA mappings. This is not proof of PostgreSQL-specific RLS/permissions behavior.
- Frontend: TypeScript and production Vite build pass with `VITE_API_BASE_URL=https://lanka-ease.onrender.com` and `VITE_ENABLE_DEMO=false`. Vite reports its existing bundle-size warning.
- API contract checks: `node --experimental-vm-modules frontend/scripts/check-admin-api.mjs` passes authentication, methods, parameter encoding, directory filters, service updates, chat routes, availability, completion payloads, HTTP 204 handling and refusal to send document authorization to a foreign URL.
- Headless Edge: `frontend/scripts/check-marketplace-browser.mjs` passes nine local checks: real directory filtering, saved profile/service display, mobile viewport fit, customer booking submission, provider profile editing, availability persistence, job completion with actual charges, persisted customer chat, and no runtime errors. It refuses non-local service hosts and uses disposable accounts. Results/screenshots are in ignored `.design-qa/marketplace-browser-results.json` and `.design-qa/marketplace-*.png`.
- `git diff --check` passes. Existing unrelated local edits were preserved.

**Not yet performed:** applying V4 or writing marketplace data to production Supabase, PostgreSQL staging verification, Render rollout, Netlify rollout, or any push for this task. Production PostgreSQL persistence and permissions must be confirmed on a separate staging database before approving the production migration. Tests do not claim that H2 proves PostgreSQL RLS behavior.

## Main modified files

- Backend: `backend/src/main/java/com/lankaease/marketplace/` contains the new entities, validated DTOs, service and controllers. Existing provider/auth/request/chat/review/admin services and security authorization were extended; service-request/review mappings and DTOs were updated for the additive schema.
- Frontend: new `MarketplaceDirectory`, `MarketplaceProfilePage`, `LiveMessagesPage`, `ProviderManagement`, `MarketplaceBookingForm`, `BookingActions`, `MarketplaceAdmin`, `MarketplaceUI`, and `types/marketplace.ts`. Existing provider/admin dashboards, routes, login/onboarding, request tracking, API client and image handling reuse these components.
- Tests: `MarketplaceIntegrationTest.java`, the extended `SchemaValidationTest.java`, API contract checks and local browser checks.
- Migration: the V4 DDL, permissions and single-transaction review wrapper linked above.

## Deployment instructions — approval required first

1. Review the source and SQL. Establish a backup/recovery point and a separate PostgreSQL staging database. Preserve current Render/Netlify environment values; no new privileged frontend variable is needed.
2. Apply the complete V4 transaction to staging, with the backend role and grants that production uses. Verify the four tables' RLS/permissions, original row counts, and all mapped columns. Run marketplace integration tests against staging with `ddl-auto=validate`; never `create`, `create-drop` or `update` against Supabase production.
3. Re-run the frontend flows on staging: onboard two providers and a customer; prove another provider cannot edit/read private resources; choose a service, book, accept, reschedule with consent, complete, review, chat, inspect unread counts and moderate as admin. Verify the saved records directly in PostgreSQL. This requires authorization and staging connection details and has not been done here.
4. After explicit production approval, apply the same reviewed transaction once to the existing Supabase project. Keep Flyway disabled. Deploy the backend only after schema validation can succeed with the new columns/tables.
5. Prepare a reviewed commit on top of the latest GitHub main, including these changes without sweeping unrelated local edits into the commit. The primary workspace still contains earlier uncommitted work; do not blindly pull/rebase or `git add .`. Push only after approval and deploy the backend on Render. Verify health, `/api/marketplace/providers` and role-protected endpoints.
6. Build/deploy Netlify from the same revision with the existing Render API origin and demo mode disabled. Verify desktop/mobile directory, onboarding, booking, chat and admin flows on the hosted site.
7. If application rollout fails, roll back the application revision while retaining the additive schema. Do not drop tables, delete user data or reset the database as a rollback shortcut. A SQL error before COMMIT rolls back the migration transaction.

Local backend tests use the existing ignored Maven cache and Java 21. For a local-only browser run, use an explicitly named H2 database and loopback ports 18081/5177, start Edge with an isolated profile on debug port 9225, then run the browser script. Its fixtures are never intended for production.

The previous `LankaEase-Netlify.zip` belongs to an earlier release and does not contain this marketplace implementation. Do not use it to publish this feature.

## Approved release progress (2026-11-01)

The owner approved the migration, push and deployment. A private production backup was created. The reviewed V4 SQL passed PostgreSQL staging checks; all 21 marketplace integration tests and nine browser checks passed against the restored PostgreSQL copy. The identical transaction was then committed to production, preserving the original 22 tables and their row counts, and verifying RLS and restricted grants on all four new tables. A production-profile backend started successfully against Supabase and returned a healthy marketplace directory response. The isolated release checkout passed all 64 backend tests (one optional connection test skipped). Application rollout follows this record; the preapproval notes above describe the earlier review state.
