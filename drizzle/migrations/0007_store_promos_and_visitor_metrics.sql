CREATE TABLE public.promo_codes (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code text NOT NULL UNIQUE,
 discount_type text NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage','fixed')),
 value numeric NOT NULL CHECK (value > 0 AND (discount_type <> 'percentage' OR value <= 100)),
 minimum_order numeric NOT NULL DEFAULT 0 CHECK (minimum_order >= 0),
 is_enabled boolean NOT NULL DEFAULT true, expires_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK (code ~ '^[A-Z0-9_-]{3,32}$')
);
GRANT ALL ON public.promo_codes TO service_role;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.store_visits (
 id uuid PRIMARY KEY, started_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.store_visits TO service_role;
ALTER TABLE public.store_visits ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.store_page_views (
 id uuid PRIMARY KEY, visit_id uuid NOT NULL REFERENCES public.store_visits(id),
 path text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.store_page_views TO service_role;
ALTER TABLE public.store_page_views ENABLE ROW LEVEL SECURITY;
CREATE INDEX store_page_views_date_idx ON public.store_page_views(created_at);
CREATE OR REPLACE FUNCTION public.record_store_view(p_visit uuid, p_event uuid, p_path text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 INSERT INTO public.store_visits(id) VALUES(p_visit) ON CONFLICT DO NOTHING;
 INSERT INTO public.store_page_views(id, visit_id, path) VALUES(p_event, p_visit, p_path) ON CONFLICT DO NOTHING;
END; $$;
REVOKE ALL ON FUNCTION public.record_store_view(uuid,uuid,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_store_view(uuid,uuid,text) TO service_role;
CREATE OR REPLACE FUNCTION public.store_traffic_stats()
RETURNS jsonb LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
 SELECT jsonb_build_object(
 'visits', (SELECT count(*) FROM public.store_visits),
 'pageViews', (SELECT count(*) FROM public.store_page_views),
 'visitsToday', (SELECT count(*) FROM public.store_visits WHERE started_at >= date_trunc('day',now())),
 'visitsWeek', (SELECT count(*) FROM public.store_visits WHERE started_at >= now()-interval '7 days'),
 'trackingSince', (SELECT min(started_at) FROM public.store_visits),
 'daily', (SELECT coalesce(jsonb_agg(d ORDER BY d.day), '[]'::jsonb) FROM (SELECT to_char(started_at AT TIME ZONE 'UTC','YYYY-MM-DD') AS day, count(*) AS visits FROM public.store_visits WHERE started_at >= now()-interval '7 days' GROUP BY 1) d),
 'topPages', (SELECT coalesce(jsonb_agg(p), '[]'::jsonb) FROM (SELECT path,count(*) AS views FROM public.store_page_views GROUP BY path ORDER BY count(*) DESC LIMIT 5) p)
 ); $$;
REVOKE ALL ON FUNCTION public.store_traffic_stats() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.store_traffic_stats() TO service_role;
CREATE OR REPLACE FUNCTION public.reset_store() RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ BEGIN RAISE EXCEPTION 'Whole-store reset is disabled to protect the catalog and orders.'; END; $$;
COMMENT ON FUNCTION public.reset_store() IS 'DEPRECATED: whole-store reset permanently disabled at owner request';