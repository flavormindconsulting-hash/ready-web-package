<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Store data is read/written only on the server via `src/lib/store.server.ts` (service role) from `/api/*` server routes and `store.functions.ts`; tables have RLS on with no public policies, so the browser never queries the database directly.
- Ported Next.js components import `@/compat/next-*` shims (Link, Image, navigation) so the original component code stays unchanged.
- Admin access: `/admin` sits under the `_authenticated` gate; admin `/api/*` handlers call `requireAdmin` (bearer + `has_role`), and the client sends the session via `adminFetch`. The first account to open `/admin` claims the single admin role through the `claim_store_admin` database function.
