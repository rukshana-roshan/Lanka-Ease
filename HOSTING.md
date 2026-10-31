# Hosting LankaEase

LankaEase has three parts: a Vite/React static frontend, a Java 21 Spring Boot API, and PostgreSQL. Static frontend hosting alone does not run the Java API or database.

## Suggested combinations

| Option | Frontend | API and database | Fit |
| --- | --- | --- | --- |
| Recommended | Netlify | Railway + PostgreSQL | Fits the existing project layout and Dockerfiles. |
| Alternative | Vercel | Railway + PostgreSQL | Suitable when you prefer Vercel's Vite deployment workflow. |
| One provider | Render Static Site | Render Docker Web Service + PostgreSQL | One dashboard for all three components; use paid compute/database for production. |
| Alternative frontend | Cloudflare Pages | Railway or Render | Static React hosting; keep this Java API on a Java/container host. |

Provider information checked on 31 October 2026. Railway Hobby currently has a $5 monthly minimum with $5 usage included; additional resource usage costs extra. Render's free web service sleeps after 15 idle minutes and its free PostgreSQL database expires after 30 days. These are preview options, not a durable production setup.

Official sources: [Railway pricing](https://railway.com/pricing), [Netlify Vite guide](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/), [Vercel Vite guide](https://vercel.com/docs/frameworks/frontend/vite), [Render free limits](https://render.com/docs/free), [Cloudflare React guide](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/).

## Frontend deployment

Set the project/root directory to `frontend`.

- Node: 22 or newer supported version (the Dockerfile uses Node 22).
- Install: `npm ci`.
- Production build: `npm run build`.
- Publish/output directory: `dist`.
- Build-time variable: `VITE_API_BASE_URL=https://your-api-host.example`.
- Do not set `VITE_ENABLE_DEMO=true` for a live customer-facing deployment.

`npm run build:preview` explicitly enables sample accounts for the private design preview. It is different from the production build. Variables prefixed with `VITE_` are public browser configuration; never put JWT signing keys, payment secrets, or database passwords there.

SPA refresh routing is included for Netlify/Cloudflare (`public/_redirects`), Vercel (`vercel.json`), and Docker Nginx (`nginx.conf`). A refresh on `/services` or `/app/requests` must return the React shell rather than a host 404.

## Java API deployment

With the repository root as the build context, use the root `Dockerfile`. If the host's build root is `backend`, use `backend/Dockerfile` instead. The API listens on the provider's `PORT` variable, with 8080 as a local default.

Configure these backend variables in the host's secret/environment settings:

| Variable | Required value |
| --- | --- |
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DATABASE_URL` | Supabase session-pooler JDBC URL on port 5432, without embedded credentials. |
| `DB_USERNAME`, `DB_PASSWORD` | Exact Supabase pooler username and database password, supplied separately. |
| `DB_SSL_ROOT_CERT` | Absolute path to the Supabase CA certificate; production uses verified TLS. |
| `DB_MIGRATIONS_ENABLED` | `false` until the schema and demo-seed migration have been reviewed. |
| `JWT_SECRET` | A newly generated, private random secret of at least 32 bytes. Do not reuse the development secret. |
| `CORS_ALLOWED_ORIGINS` | Exact HTTPS frontend origin(s), comma-separated. Include the actual production domain. |
| `UPLOAD_DIR` | A persistent-volume directory, for example `/data/uploads`. |

Connect external Supabase PostgreSQL and configure backups. See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for current backend configuration and local VS Code instructions. Put uploads on persistent storage; container-local files can disappear when the instance is replaced. For multiple API replicas, migrate uploads to shared object storage rather than independent local disks. Health-check path: `/actuator/health`.

The repository's `render.yaml` uses free plans and is suitable only for a temporary preview. Select durable plans and persistent storage before accepting real users. Review the V2 SQL migration's sample users and replace/disable demo credentials before public deployment. The Java `DataInitializer` now runs only in the development profile; existing database rows were not deleted or silently modified.

The audit added a V3 migration for durable contact messages. Existing V1/V2 migrations were left unchanged to preserve Flyway checksums. Back up the database before deploying backend changes. JWT token-type validation now rejects old tokens without the access/refresh type claim, so existing users will need to sign in again.

## Features that still need production integration

The design preview is not a fully connected production marketplace. Live payment gateway verification, Google OAuth, password reset delivery, live chat UI, live management dashboards, and full Sinhala/Tamil translation coverage remain incomplete. The audit prevents these placeholders from pretending to perform real operations. Production mock payments are disabled. Do not enable them to bypass missing gateway integration.

No new paid hosting account, custom domain, or live backend deployment was created during this audit.
