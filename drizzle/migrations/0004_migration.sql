-- Lock down privileged SECURITY DEFINER functions.
-- reset_store wipes all store data: only the service role (server) may call it.
REVOKE EXECUTE ON FUNCTION public.reset_store() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reset_store() TO service_role;

-- claim_store_admin is needed by signed-in users (first-admin claim) and is
-- internally guarded, but must never be callable by anonymous visitors.
REVOKE EXECUTE ON FUNCTION public.claim_store_admin() FROM anon;

-- has_role is read-only and used by admin checks; keep it for authenticated
-- and service_role, but not for anonymous visitors.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;