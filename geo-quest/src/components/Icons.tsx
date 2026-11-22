// One small, consistent line-icon set (24×24, 2px stroke) instead of emoji.
import type { ReactNode } from 'react';

const P: Record<string, ReactNode> = {
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /></>,
  landmark: <path d="M3 21h18M5 21V10m4 11V10m6 11V10m4 11V10M2.5 10 12 4l9.5 6z" />,
  flag: <path d="M5 21V4m0 0c4-2 7 2 11 0l2-.5V13c-4 2-7-2-11 0L5 13" />,
  wave: <path d="M2 8c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 13c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 18c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />,
  layers: <path d="m12 3 9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5" />,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  flame: <path d="M12 21c-3.9 0-7-2.7-7-6.5 0-3 2-5 3.5-6.5.3 2 1.5 3 2.5 3.5C11 8 12 5 14 3c.5 3 5 5.5 5 11 0 4-3 7-7 7z" />,
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  sound: <path d="M11 5 6 9H3v6h3l5 4zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />,
  image: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 16 5-5 4 4 2-2 7 6M15.5 9.5h.01" /></>,
  theme: <><circle cx="12" cy="12" r="9" /><path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9 7 7m10 10 2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5h.01" /></>,
  check: <path d="m4 12 5 5L20 6" />,
  medal: <><circle cx="12" cy="15" r="6" /><path d="M8.5 10 6 3h4l2 4 2-4h4l-2.5 7M12 12.5l.9 1.8 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  tree: <><circle cx="12" cy="5" r="2.2" /><circle cx="5" cy="19" r="2.2" /><circle cx="12" cy="19" r="2.2" /><circle cx="19" cy="19" r="2.2" /><path d="M12 7.2v9.6M12 11H5v5.8M12 11h7v5.8" /></>,
  map: <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15m6-12v15" />,
  book: <path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z" />,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  play: <path d="M7 4v16l13-8z" />,
  pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  river: <path d="M7 3c3 3-2 5 1 8s7 3 6 7-4 3-3 3M14 3c2 2 1 4 3 6s3 3 2 6" />,
  drop: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />,
  undo: <path d="M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />,
  sliders: <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4" />,
  person: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></>,
  capitol: <path d="M3 21h18M5 21v-7h14v7M8 21v-7m4 7v-7m4 7v-7M4 14h16M7 14c0-3 2-5 5-5s5 2 5 5M12 9V4m0 0h2" />,
  coin: <><circle cx="12" cy="12" r="8.5" /><path d="M14.5 9.2c-.6-.8-1.5-1.2-2.6-1.2-1.6 0-2.7.8-2.7 2s1.1 1.7 2.7 2 2.8.9 2.8 2.1-1.2 2-2.8 2c-1.2 0-2.2-.5-2.8-1.3M12 6.5V8m0 8v1.5" /></>,
  city: <path d="M3 21h18M5 21V10l5-3v14M10 21V4l6 3v14M16 21v-9l3 2v7M13 9h0M13 12h0M13 15h0M7 13h0M7 16h0" />,
  temple: <path d="M3 21h18M4 18h16M5 18V9.5m3.5 8.5V9.5m3.5 8.5V9.5m3.5 8.5V9.5M19 18V9.5M3 9.5h18L12 3z" />,
  mountain: <path d="M2 20h20L14.5 6l-3.5 6-2-3z M11.6 10.8l1.6 1.4 1.3-1.6" />,
  tag: <><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="8.5" r="1.3" /></>,
};
export type IconName = keyof typeof P;

export function Icon({ name, size = 18, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.9"
      strokeLinecap="round" strokeLinejoin="round" className={'icon ' + (className ?? '')} aria-hidden="true">{P[name]}</svg>
  );
}
