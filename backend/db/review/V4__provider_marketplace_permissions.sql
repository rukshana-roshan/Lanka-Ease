-- PostgreSQL-only security section. Apply in the SAME transaction as the V4 DDL.
ALTER TABLE public.provider_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_reports ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.provider_details, public.provider_services, public.marketplace_media, public.provider_reports FROM PUBLIC, anon, authenticated;
REVOKE ALL ON SEQUENCE public.provider_details_id_seq, public.provider_services_id_seq, public.provider_reports_id_seq FROM PUBLIC, anon, authenticated;
