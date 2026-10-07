DROP TRIGGER IF EXISTS on_auth_user_created_assign_admin ON auth.users;
DROP FUNCTION IF EXISTS public.assign_first_admin();

-- Lets the signed-in caller become admin only if the store has no admin yet.
CREATE OR REPLACE FUNCTION public.claim_store_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  PERFORM pg_advisory_xact_lock(424242);
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RETURN public.has_role(auth.uid(), 'admin');
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin');
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_store_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_store_admin() TO authenticated;