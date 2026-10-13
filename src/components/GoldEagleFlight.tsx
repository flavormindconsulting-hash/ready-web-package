import { useEffect, useState } from 'react';

/** Decorative brand motion, separate from the owner's unchanged logo artwork. */
export function GoldEagleFlight() {
  const [flying, setFlying] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      if (window.sessionStorage.getItem('henro:eagle-flight')) return;
      window.sessionStorage.setItem('henro:eagle-flight', 'played');
    } catch { /* Storage restrictions must not prevent rendering. */ }
    setFlying(true);
  }, []);

  return <div className={`gold-eagle-flight ${flying ? 'is-flying' : ''}`} aria-hidden="true">
    <svg viewBox="0 0 240 140" className="gold-eagle-art" focusable="false">
      <defs>
        <linearGradient id="henro-flight-gold" x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="var(--eagle-highlight)" />
          <stop offset="0.5" stopColor="var(--brand-gold)" />
          <stop offset="1" stopColor="var(--eagle-shadow)" />
        </linearGradient>
      </defs>
      <g fill="url(#henro-flight-gold)">
        <g className="eagle-wing eagle-wing-left">
          <path d="M116 72C95 57 70 37 22 16L6 8C10 25 35 47 66 60L18 29C21 44 46 64 76 74L29 49C34 63 56 80 87 86L46 68C52 82 73 95 99 96L68 86C78 101 96 105 116 93Z" />
          <path d="M110 72C86 60 60 42 28 25C44 47 75 70 109 84Z" fill="var(--eagle-highlight)" opacity=".35" />
        </g>
        <g className="eagle-wing eagle-wing-right">
          <path d="M124 72C145 57 170 37 218 16L234 8C230 25 205 47 174 60L222 29C219 44 194 64 164 74L211 49C206 63 184 80 153 86L194 68C188 82 167 95 141 96L172 86C162 101 144 105 124 93Z" />
          <path d="M130 72C154 60 180 42 212 25C196 47 165 70 131 84Z" fill="var(--eagle-highlight)" opacity=".35" />
        </g>
        <path d="M113 91L102 126L114 121L120 134L126 121L138 126L127 91Z" />
        <path d="M118 46C111 48 107 59 109 71L110 92Q120 110 130 92L131 66Q130 55 125 51L133 51L139 56L137 45L127 40Q121 37 116 42Z" />
        <path d="M117 56Q113 71 118 89L122 96L124 67L127 57Z" fill="var(--eagle-highlight)" opacity=".55" />
        <path d="M128 43L132 44L129 46Z" fill="var(--eagle-shadow)" />
      </g>
    </svg>
  </div>;
}