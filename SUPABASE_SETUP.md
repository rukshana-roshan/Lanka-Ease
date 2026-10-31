# Supabase PostgreSQL setup for LankaEase

The backend is Java 21 / Spring Boot 3.3.4 with Maven, Hibernate/JPA and Flyway. The PostgreSQL JDBC driver and Flyway PostgreSQL module already exist in `backend/pom.xml`; no new dependencies are needed. The React frontend is unchanged.

## Required local variables

Use the Supabase **Session Pooler** host and its exact dashboard username, on port **5432**. These are backend-only settings:

| Variable | Value |
| --- | --- |
| `SPRING_PROFILES_ACTIVE` | `prod` (the default dev profile uses H2) |
| `DATABASE_URL` | `jdbc:postgresql://YOUR_SESSION_POOLER_HOST:5432/postgres` |
| `DB_USERNAME` | Exact pooler username, commonly `postgres.PROJECT_REFERENCE` |
| `DB_PASSWORD` | Database password, supplied separately; no URL encoding needed here |
| `DB_SSL_ROOT_CERT` | Absolute path to the downloaded Supabase CA certificate |
| `JWT_SECRET` | A private random signing key of at least 32 bytes |
| `DB_MIGRATIONS_ENABLED` | `false` while checking connectivity |
| `CORS_ALLOWED_ORIGINS` | Your exact Netlify frontend origin |

Do not put username/password in the JDBC URL, including `?user=` or `?password=` parameters. Production rejects embedded credentials and TLS overrides. Do not use a Supabase publishable/anon/service-role API key as the database password. Avoid `--debug`, JDBC trace logging, or printing environment variables.

TLS uses `sslmode=verify-full`, which validates the certificate chain and hostname. Download the appropriate database CA certificate from the Supabase dashboard and store it locally, for example under ignored `backend/secrets/`. `sslmode=require` alone does not authenticate the server. A certificate error should be fixed by supplying the correct CA and hostname, not disabling verification.

## VS Code: environment file and debugger

The ignored `backend/.env` file has been created with blank database fields and a generated local JWT signing key. Fill in the database settings and certificate path before running Supabase checks. No secret values were printed.

For PowerShell, the simplest commands from the repository root are:

```powershell
./backend/Start-Supabase.ps1 -CheckConnection
./backend/Start-Supabase.ps1
```

This helper explicitly loads `backend/.env`, reports missing variable names only, and forces the production profile with migrations disabled. The first command tests the database without starting Hibernate/Flyway. The second starts the API and validates its tables. Use Java 21 and Maven on your PATH.

If Windows blocks local PowerShell scripts, invoke only this inspected helper with a process-scoped policy override (this does not change your machine's execution policy):

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File backend/Start-Supabase.ps1 -CheckConnection
```

1. Install the Java Extension Pack and configure Java 21.
2. Copy `backend/.env.example` to `backend/.env`. Fill it in locally. Git ignores `.env` and `.env.*` files except example templates; tracked files are not automatically untracked by an ignore rule.
3. Copy `backend/vscode-launch.example.json` to `.vscode/launch.json`, or merge its configuration into your existing launch file. Open the repository root in VS Code.
4. In Run and Debug, choose **LankaEase: Supabase (no migrations)** and press F5.

The Java debugger reads `envFile`. Spring Boot and a separate Maven terminal do **not** automatically load `.env`. Use the following helper to load this backend's file into the current PowerShell terminal without echoing values:

```powershell
# From the repository root; reads literal KEY=value entries, without shell expansion.
$allowedKeys = @('SPRING_PROFILES_ACTIVE','DATABASE_URL','DB_USERNAME','DB_PASSWORD',
    'DB_SSL_ROOT_CERT','JWT_SECRET','DB_MIGRATIONS_ENABLED','CORS_ALLOWED_ORIGINS')
foreach ($line in [IO.File]::ReadAllLines((Join-Path $PWD 'backend/.env'))) {
    if ($line.Trim() -eq '' -or $line.TrimStart().StartsWith('#')) { continue }
    $pair = $line.Split('=', 2)
    if ($pair.Length -ne 2 -or $pair[0].Trim() -notin $allowedKeys) {
        throw 'Unexpected entry in backend/.env; use only the documented keys.'
    }
    $value = $pair[1].Trim()
    if ($value.Length -ge 2 -and (($value.StartsWith('"') -and $value.EndsWith('"')) -or
            ($value.StartsWith("'") -and $value.EndsWith("'")))) {
        $value = $value.Substring(1, $value.Length - 2)
    }
    [Environment]::SetEnvironmentVariable($pair[0].Trim(), $value, 'Process')
}
```

Then, in that same terminal:

```powershell
Set-Location backend
# First ensure JAVA_HOME points to your installed Java 21 JDK.

# Optional live connection test: SELECT only, with no application startup or migrations.
$env:RUN_SUPABASE_CONNECTION_CHECK = 'true'
mvn '-Dtest=SupabaseConnectionTest' test
Remove-Item Env:RUN_SUPABASE_CONNECTION_CHECK

# Start the actual API with schema validation and no migrations.
mvn spring-boot:run '-Dspring-boot.run.profiles=prod'
```

Do not run this live test with Maven `-X`. It is skipped during the normal test suite unless explicitly enabled. Successful connectivity does not imply that application tables exist; starting the full API additionally validates all mapped tables.

## Development administrator

The VS Code **LankaEase: local development (H2)** configuration uses the separate in-memory development database. In that profile, `DevelopmentAdminInitializer` creates the requested development administrator using a precomputed BCrypt hash. No plaintext password is stored in the initializer or logged. Use the password supplied in your request; it is intentionally not repeated here.

The existing `/api/auth/login` endpoint accepts `username` and `password` for this development account. Normal `email` and `password` logins remain supported; send exactly one identifier. The username alias is `admin`. The account's internal email identifier is `admin@lankaease.local`.

Both initializers require `dev & !prod`; neither is registered in `prod`, `dev,prod`, or `test`. The username alias is also rejected outside development. Account creation is idempotent and does not reset or promote an existing user. No migration was added for this account, and it is not created in Supabase by the production-profile connection helper.

## Tables and migration precautions

Production now uses Hibernate `ddl-auto=validate`, Flyway disabled by default (`DB_MIGRATIONS_ENABLED=false`), automatic baselining disabled, and Flyway clean disabled. A connection test will not create tables or seed data. The existing dev profile remains for local H2 development.

Existing migrations, preserved unchanged:

- `V1__initial_schema.sql`: 21 application tables and indexes.
- `V2__seed_demo_data.sql`: categories AND demo users (including an administrator), bookings, payments and other demo records. This must be reviewed before enabling migrations on a public database.
- `V3__contact_messages.sql`: the contact-message table.

An empty application schema needs migrations before the full API can start. A Supabase database containing platform objects is not necessarily an empty schema to Flyway. Inspect existing application tables and `flyway_schema_history` before deciding whether any baseline is appropriate. Never enable automatic baselining merely to suppress an error.

Changing the connection URL does not transfer data from an older database. Do not run clean, reset, drop, or modify already-applied migration files. This setup does not run migrations or change database records. If tables already exist from Hibernate, compare their structure against migration SQL before enabling Flyway.

## Render settings (no deployment performed)

The root Dockerfile already builds Java 21 and starts `app.jar`; the API honours Render's `PORT`. Use the repository root as the Docker build context. `render.yaml` now expects externally supplied Supabase variables instead of provisioning a Render database. It was edited locally only.

Set `DATABASE_URL`, `DB_USERNAME`, and `DB_PASSWORD` in Render's environment settings. Add a secret file named `supabase-ca.crt` containing the CA certificate so that `DB_SSL_ROOT_CERT=/etc/secrets/supabase-ca.crt` resolves. Keep the generated `JWT_SECRET` private, retain the production profile, set the exact Netlify CORS origin, and leave migrations disabled pending review. Do not set these credentials in Netlify or any Vite public variables.

For production, also review access to application tables through Supabase's Data API; existing Spring JWT authorization does not automatically apply to Supabase REST endpoints. Keep backend-only tables inaccessible to anonymous API clients.

## Troubleshooting

| Error | Resolution |
| --- | --- |
| Invalid database configuration | Supply a clean PostgreSQL/JDBC URL with host/database and no inline credentials; use the separate variables |
| Missing placeholder / variable | Load `backend/.env` through the debugger, or into the same terminal running Maven; the file is not auto-loaded by Spring |
| Authentication failure / SQLSTATE `28P01` | Use the exact session-pooler username and database password; API keys are not database passwords |
| Tenant or user not found | Re-copy the session-pooler username and hostname from the same Supabase project |
| SSL root certificate / certificate validation failure | Set an existing absolute certificate path; use the project's correct CA and matching dashboard host |
| Connection timeout / SQLSTATE class `08` | Confirm pooler port 5432, network/firewall access, project availability and Supabase network restrictions |
| Schema-validation: missing table | Connectivity may work, but tables need reviewed migrations; do not switch production to `update` |
| Non-empty schema with no Flyway history | Inspect schema/history first; do not automatically baseline |
| JWT key missing / too short | Supply a separate private signing key of at least 32 bytes |
| Java release 21 not supported | Point `JAVA_HOME` and VS Code's Java runtime at a Java 21 JDK |

Official references: [Supabase connections](https://supabase.com/docs/guides/database/connecting-to-postgres), [pgJDBC TLS](https://jdbc.postgresql.org/documentation/ssl/), [VS Code Java debugging and envFile](https://code.visualstudio.com/docs/java/java-debugging).

## Verification performed

- `backend/.env` exists, is ignored by Git, and is not tracked. Database fields remain blank because no Supabase details were provided; a private local JWT key was generated without displaying it.
- Java 21 Maven packaging and tests pass. The live Supabase test is deliberately skipped in normal builds.
- The development H2 backend started successfully. Live HTTP checks returned health 200, development administrator username login 200, protected administrator access 200, existing email login 200, and missing-identifier rejection 400. No tokens or password values were printed. The temporary verification server was stopped afterward.
- Unit tests verify the BCrypt hash, idempotent creation without modifying existing accounts, and absence of both initializers in production (including mixed dev/prod profiles). An endpoint regression test verifies rejection of the username alias outside development.
- The explicit Supabase helper was attempted and reported only missing variable names: DATABASE_URL, DB_USERNAME, DB_PASSWORD, DB_SSL_ROOT_CERT. Therefore live Supabase connectivity and the actual remote table/migration state remain unverified. This is missing configuration, not a confirmed network or authentication failure.
- Production remains on Hibernate validation and opt-in migrations. No migrations, remote database changes, frontend changes, Git push, or deployment were performed.

The URL processor is registered through `META-INF/spring.factories`. H2 application tests share the isolated test profile and ignore external database URLs, preventing accidental schema operations against real databases during normal tests.
