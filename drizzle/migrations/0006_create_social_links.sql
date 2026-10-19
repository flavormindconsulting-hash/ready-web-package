CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.social_links TO service_role;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
INSERT INTO public.social_links (platform, label, sort_order) VALUES
  ('instagram', 'Instagram', 1),
  ('facebook', 'Facebook', 2),
  ('x', 'X (Twitter)', 3),
  ('youtube', 'YouTube', 4),
  ('whatsapp', 'WhatsApp', 5);