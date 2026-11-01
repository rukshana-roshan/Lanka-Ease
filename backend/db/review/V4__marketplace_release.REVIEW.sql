-- REVIEW ONLY. Not executed against Supabase.
-- The complete transaction includes additive DDL and access restrictions.
BEGIN;
SET LOCAL search_path = pg_catalog, public;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';
DO $$
BEGIN
 IF to_regclass('public.provider_profiles') IS NULL OR to_regclass('public.service_requests') IS NULL THEN
  RAISE EXCEPTION 'Expected LankaEase parent tables are missing';
 END IF;
 IF to_regclass('public.provider_details') IS NOT NULL OR to_regclass('public.provider_services') IS NOT NULL
  OR to_regclass('public.marketplace_media') IS NOT NULL OR to_regclass('public.provider_reports') IS NOT NULL THEN
  RAISE EXCEPTION 'Marketplace objects already exist. Inspect migration history; do not blindly rerun';
 END IF;
END $$;
-- Additive marketplace migration. Review with V4__provider_marketplace_permissions.sql.
-- Production Flyway remains disabled. No historical seed migration is required.
CREATE TABLE public.provider_details (
 id BIGSERIAL PRIMARY KEY, provider_id BIGINT NOT NULL UNIQUE REFERENCES public.provider_profiles(id),
 province VARCHAR(100), district VARCHAR(100), city VARCHAR(100), subcategory VARCHAR(150),
 availability_status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (availability_status IN ('AVAILABLE','BUSY','OFFLINE')),
 configuration_json TEXT NOT NULL DEFAULT '{}'
);
CREATE TABLE public.provider_services (
 id BIGSERIAL PRIMARY KEY, provider_id BIGINT NOT NULL REFERENCES public.provider_profiles(id),
 category_id BIGINT NOT NULL REFERENCES public.service_categories(id), title VARCHAR(150) NOT NULL,
 description TEXT NOT NULL, price_min NUMERIC(10,2) NOT NULL CHECK(price_min>=0),
 price_max NUMERIC(10,2) NOT NULL CHECK(price_max>=price_min),
 duration_minutes INTEGER NOT NULL CHECK(duration_minutes>0), active BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE public.marketplace_media (
 id VARCHAR(255) PRIMARY KEY, owner_id BIGINT NOT NULL REFERENCES public.users(id),
 purpose VARCHAR(20) NOT NULL CHECK(purpose IN ('PROFILE','PORTFOLIO','VERIFICATION')),
 content_type VARCHAR(50) NOT NULL, content BYTEA NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE public.provider_reports (
 id BIGSERIAL PRIMARY KEY, provider_id BIGINT NOT NULL REFERENCES public.provider_profiles(id),
 reporter_id BIGINT NOT NULL REFERENCES public.users(id), review_id BIGINT REFERENCES public.reviews(id),
 reason TEXT NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK(status IN ('OPEN','RESOLVED','DISMISSED')),
 admin_notes TEXT, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.reviews ADD COLUMN is_hidden BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.service_requests ADD COLUMN service_id BIGINT REFERENCES public.provider_services(id);
ALTER TABLE public.service_requests ADD COLUMN service_title VARCHAR(150);
ALTER TABLE public.service_requests ADD COLUMN proposed_date DATE;
ALTER TABLE public.service_requests ADD COLUMN proposed_time VARCHAR(50);
CREATE INDEX idx_provider_details_location ON public.provider_details(province,district,city);
CREATE INDEX idx_provider_services_active ON public.provider_services(provider_id,active);
CREATE INDEX idx_marketplace_media_owner ON public.marketplace_media(owner_id);
CREATE INDEX idx_provider_reports_status ON public.provider_reports(status,created_at);
CREATE INDEX idx_reviews_visible_provider ON public.reviews(provider_id,is_hidden);
CREATE INDEX idx_service_requests_service ON public.service_requests(service_id);

-- PostgreSQL-only security section. Apply in the SAME transaction as the V4 DDL.
ALTER TABLE public.provider_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_reports ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.provider_details, public.provider_services, public.marketplace_media, public.provider_reports FROM PUBLIC, anon, authenticated;
REVOKE ALL ON SEQUENCE public.provider_details_id_seq, public.provider_services_id_seq, public.provider_reports_id_seq FROM PUBLIC, anon, authenticated;

COMMIT;
