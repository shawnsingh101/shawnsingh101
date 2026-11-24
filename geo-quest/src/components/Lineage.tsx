// A chain of colored blocks, top to bottom, each a step inside the one above: an animal's place in the tree of life
// (Eukaryotes › Animals › Chordates › Mammals › … › Orcinus orca), or a dinosaur's place in time (Phanerozoic › Mesozoic ›
// Cretaceous › Late Cretaceous › Maastrichtian). Shown on the back of the card: it's the picture of the answer, not a quiz.
import type { Step } from '../tree';

const rgb = (hex: string) => { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const ink = (hex: string) => { const [r, g, b] = rgb(hex); return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? '#1b1b1b' : '#fff'; };
/** Mix toward white: blocks of one color down a chain (Mammals › even-toed › …) each get a little lighter. */
const lighten = (hex: string, t: number) => '#' + rgb(hex).map(v => Math.round(v + (255 - v) * t).toString(16).padStart(2, '0')).join('');

export function Lineage({ steps, label }: { steps: Step[]; label: string }) {
  let run = 0;
  return (
    <ol className="lineage" aria-label={label}>
      {steps.map((s, i) => {
        run = i && steps[i - 1].color === s.color ? run + 1 : 0;
        const bg = lighten(s.color, Math.min(run * 0.14, 0.56)), bg2 = s.color2 && lighten(s.color2, Math.min(run * 0.14, 0.56));
        return (
          <li key={s.rank + s.name} style={{ marginLeft: `min(${i * 0.55}rem, ${i * 2.2}%)` }} title={s.note}>
            <span className="ln-rank">{s.rank}</span>
            <span className="ln-block" style={{ background: bg2 ? `linear-gradient(90deg, ${bg} 50%, ${bg2} 50%)` : bg, color: ink(bg) }}>
              {s.common ? <><b>{s.common}</b> <i>{s.name}</i></> : s.rank === 'genus' || s.rank === 'species' ? <i><b>{s.name}</b></i> : <b>{s.name}</b>}
              {s.sub && <small>{s.sub}</small>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
