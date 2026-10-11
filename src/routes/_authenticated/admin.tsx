import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminClient } from "@/views/AdminClient";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Atelier Command & Control | HENRO" },
      { name: "description", content: "Owner console to manage the HENRO catalog, orders and reviews." },
      { property: "og:title", content: "Atelier Command & Control | HENRO" },
      { property: "og:description", content: "HENRO store administration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<"checking" | "admin" | "denied">("checking");

  useEffect(() => {
    supabase.rpc("claim_store_admin").then(({ data }) => setStatus(data ? "admin" : "denied"));
  }, []);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const bar = (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex items-center justify-end gap-3 text-xs font-mono text-neutral-400">
      <span>Signed in as {user.email}</span>
      <button onClick={signOut} className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-800 rounded hover:text-white hover:border-neutral-600 transition-colors">
        <LogOut className="w-3.5 h-3.5" /> Sign out
      </button>
    </div>
  );

  if (status === "checking")
    return <div className="py-32 text-center font-mono text-xs uppercase tracking-widest text-neutral-500">Verifying atelier access...</div>;
  if (status === "denied")
    return (
      <div>
        {bar}
        <div className="max-w-md mx-auto py-32 text-center space-y-3">
          <h1 className="text-3xl font-editorial text-white">Access restricted</h1>
          <p className="text-sm text-neutral-400">This account isn't the store owner. Only the owner can manage products and orders.</p>
        </div>
      </div>
    );
  return (
    <div>
      {bar}
      <AdminClient />
    </div>
  );
}
