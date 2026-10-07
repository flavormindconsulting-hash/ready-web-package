// Server-only data access for the HENRO store (service role, bypasses RLS).
const NUMERIC = new Set(["price", "compare_at_price", "shipping_cost", "subtotal", "discount", "tax", "total"]);

export const toCamel = (row: Record<string, unknown>) => {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    const ck = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    out[ck] = NUMERIC.has(k) && v !== null && v !== undefined ? Number(v).toFixed(2) : v;
  }
  return out as any;
};
export const toSnake = (obj: Record<string, unknown>) => {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    out[k.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase())] = v instanceof Date ? v.toISOString() : v;
  }
  return out;
};
export const rows = (d: unknown) => ((d as Record<string, unknown>[] | null) ?? []).map(toCamel);

export async function db() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as any;
}

export const json = (data: unknown, init?: { status?: number }) =>
  new Response(JSON.stringify(data), { status: init?.status ?? 200, headers: { "Content-Type": "application/json" } });

/** Returns a 401/403 Response if the caller is not a signed-in store admin, otherwise null. */
export async function requireAdmin(request: Request): Promise<Response | null> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "Unauthorized" }, { status: 401 });
  const { createClient } = await import("@supabase/supabase-js");
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const client = createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: u, error } = await client.auth.getUser(token);
  if (error || !u.user) return json({ error: "Unauthorized" }, { status: 401 });
  const { data: ok } = await client.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
  if (!ok) return json({ error: "Forbidden" }, { status: 403 });
  return null;
}
