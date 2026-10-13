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
- Admin photo uploads use a private product-only Storage bucket through role-verified server endpoints; the public photo endpoint exposes only immutable catalog image filenames, because workspace policy prohibits public buckets.
- Standard product sizes and duplicate/stock validation live in a shared browser-safe module so admin controls and product writes use the same size rules.
- Ported Next.js components import `@/compat/next-*` shims (Link, Image, navigation) so the original component code stays unchanged.
- Admin access: `/admin` sits under the `_authenticated` gate; admin `/api/*` handlers call `requireAdmin` (bearer + `has_role`), and the client sends the session via `adminFetch`. The first account to open `/admin` claims the single admin role through the `claim_store_admin` database function.
- Brand media is centralized in a browser-safe presentation module; replace only original demo image paths so owner-edited photography remains authoritative.
- Storefront styling uses semantic global tokens and the shared Button, keeping shopping and owner surfaces consistent without changing store pricing or permissions.
- Storefront motion uses CSS transforms and a home-scoped IntersectionObserver with visible server-rendered fallbacks and reduced-motion support, keeping animations lightweight and accessible.
- The decorative homepage eagle uses a separate token-colored SVG with CSS wing and flight motion, plays once per browser session, and remains static for reduced motion; supplied logos remain unchanged.
- The homepage hero background is an owner-supplied looping video (separate desktop/mobile CDN assets, muted autoplay loop) shown above a static image fallback that remains visible under reduced motion; campaign text stays in markup, never baked into the video.
