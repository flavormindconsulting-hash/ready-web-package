import { useRouter as useTsRouter, useLocation, notFound as tsNotFound } from "@tanstack/react-router";
import { useMemo } from "react";

export function useRouter() {
  const router = useTsRouter();
  return {
    push: (href: string) => { router.history.push(href); if (typeof window !== "undefined") window.scrollTo(0, 0); },
    replace: (href: string) => router.history.replace(href),
    back: () => router.history.back(),
    refresh: () => router.invalidate(),
  };
}
export function usePathname() {
  return useLocation({ select: (l) => l.pathname });
}
export function useSearchParams() {
  const searchStr = useLocation({ select: (l) => l.searchStr });
  return useMemo(() => new URLSearchParams(searchStr), [searchStr]);
}
export function notFound(): never {
  throw tsNotFound();
}
