import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import openingVideo from '@/assets/henro-opening.webm.asset.json';

const sessionKey = 'henro:opening-seen';

export function StoreEntrance({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [showIntro, setShowIntro] = useState(pathname === '/');
  const [ready, setReady] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const active = showIntro && pathname === '/';

  const finish = useCallback(() => {
    try { sessionStorage.setItem(sessionKey, 'true'); } catch { /* Storage is optional. */ }
    setShowIntro(false);
  }, []);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(sessionKey) === 'true'; } catch { /* Storage is optional. */ }
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShowIntro(false);
    } else {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [active]);

  useEffect(() => {
    if (!active || !ready) return;
    // A blocked or stalled video must never prevent entry to the store.
    const timeout = window.setTimeout(finish, 25000);
    video.current?.play().catch(finish);
    return () => window.clearTimeout(timeout);
  }, [active, ready, finish]);

  return <>
    {active && <div className="store-entrance fixed inset-0 z-[100] bg-background text-foreground" role="dialog" aria-modal="true" aria-label="Welcome to HENRO">
      {ready && <video ref={video} src={openingVideo.url} className="h-full w-full object-contain" autoPlay muted playsInline preload="auto" onEnded={finish} onError={finish} aria-label="HENRO opening film" />}
      <Button variant="outline" onClick={finish} className="absolute right-6 bottom-6 rounded-none" aria-label="Skip intro and enter store">Enter store <ArrowRight /></Button>
    </div>}
    <div inert={active} aria-hidden={active ? true : undefined} className={active ? 'invisible' : undefined}>{children}</div>
  </>;
}