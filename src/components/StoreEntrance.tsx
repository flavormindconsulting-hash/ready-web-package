import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from '@tanstack/react-router';
import { ArrowRight, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import openingVideo from '@/assets/henro-opening.webm.asset.json';

const sessionKey = 'henro:opening-seen';
// Volume boost above the normal maximum, applied through a Web Audio gain node.
const VOLUME_BOOST = 2;

export function StoreEntrance({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [showIntro, setShowIntro] = useState(pathname === '/');
  const [ready, setReady] = useState(false);
  const [soundBlocked, setSoundBlocked] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const audio = useRef<{ ctx: AudioContext; gain: GainNode } | null>(null);
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

  const enableSound = useCallback(() => {
    const el = video.current;
    if (!el) return;
    try {
      if (!audio.current) {
        const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (Ctx) {
          const ctx = new Ctx();
          const source = ctx.createMediaElementSource(el);
          const gain = ctx.createGain();
          gain.gain.value = VOLUME_BOOST;
          source.connect(gain).connect(ctx.destination);
          audio.current = { ctx, gain };
        }
      }
      audio.current?.ctx.resume().catch(() => { /* Ignore resume failures. */ });
      el.muted = false;
      el.volume = 1;
      setSoundBlocked(false);
    } catch { /* Sound stays at normal volume if Web Audio is unavailable. */ }
  }, []);

  useEffect(() => {
    if (!active || !ready) return;
    // A blocked or stalled video must never prevent entry to the store.
    const timeout = window.setTimeout(finish, 25000);
    const el = video.current;
    if (!el) return () => window.clearTimeout(timeout);

    // Try to start with boosted sound; browsers may block unmuted autoplay.
    enableSound();
    el.play().catch(() => {
      // Autoplay with sound was blocked: play muted and offer a sound button.
      el.muted = true;
      setSoundBlocked(true);
      el.play().catch(finish);
    });
    return () => window.clearTimeout(timeout);
  }, [active, ready, finish, enableSound]);

  return <>
    {active && <div className="store-entrance fixed inset-0 z-[100] bg-background text-foreground" role="dialog" aria-modal="true" aria-label="Welcome to HENRO">
      {ready && <video ref={video} src={openingVideo.url} className="h-full w-full object-contain" autoPlay muted playsInline preload="auto" onEnded={finish} onError={finish} aria-label="HENRO opening film" />}
      {soundBlocked && <Button variant="outline" onClick={enableSound} className="absolute left-6 bottom-6 rounded-none" aria-label="Turn sound on"><Volume2 /> Sound on</Button>}
      <Button variant="outline" onClick={finish} className="absolute right-6 bottom-6 rounded-none" aria-label="Skip intro and enter store">Enter store <ArrowRight /></Button>
    </div>}
    <div inert={active} aria-hidden={active ? true : undefined} className={active ? 'invisible' : undefined}>{children}</div>
  </>;
}
