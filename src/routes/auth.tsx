import { Button } from "@/components/ui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Owner Sign In | HENRO" },
      { name: "description", content: "Sign in to manage the HENRO atelier." },
      { property: "og:title", content: "Owner Sign In | HENRO" },
      { property: "og:description", content: "Sign in to manage the HENRO atelier." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: "/admin", replace: true }); });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg({ ok: false, text: error.message });
      navigate({ to: "/admin", replace: true });
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      setBusy(false);
      if (error) return setMsg({ ok: false, text: error.message });
      if (data.session) return navigate({ to: "/admin", replace: true });
      setMsg({ ok: true, text: "Check your inbox and confirm your email, then sign in." });
      setMode("signin");
    }
  }

  const input = "w-full bg-muted border border-border rounded px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60";
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <p className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase">Atelier Command</p>
          <h1 className="text-4xl font-editorial text-foreground">{mode === "signin" ? "Owner Sign In" : "Create Owner Account"}</h1>
          <p className="text-sm text-muted-foreground">Manage the HENRO catalog, orders and reviews.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input className={input} type="email" required autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={input} type="password" required minLength={8} autoComplete={mode === "signin" ? "current-password" : "new-password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {msg && <p className={`text-xs ${msg.ok ? "text-success" : "text-destructive"}`}>{msg.text}</p>}
          <Button variant="atelier" disabled={busy} className="w-full bg-primary text-primary-foreground py-3 text-xs font-bold tracking-[0.25em] uppercase hover:bg-secondary transition-colors disabled:opacity-50">
            {busy ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
          </Button>
        </form>
        <p className="text-center text-xs text-muted-foreground">
          {mode === "signin" ? "First time here? " : "Already have an account? "}
          <Button variant="atelier" type="button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMsg(null); }} className="text-primary hover:text-primary">
            {mode === "signin" ? "Create the owner account" : "Sign in"}
          </Button>
        </p>
      </div>
    </div>
  );
}
