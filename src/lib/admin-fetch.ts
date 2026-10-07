import { supabase } from "@/integrations/supabase/client";

/** fetch() that attaches the signed-in owner's session so admin endpoints accept it. */
export async function adminFetch(input: string, init: RequestInit = {}) {
  const { data } = await supabase.auth.getSession();
  const headers = new Headers(init.headers);
  if (data.session) headers.set("Authorization", `Bearer ${data.session.access_token}`);
  return fetch(input, { ...init, headers });
}
