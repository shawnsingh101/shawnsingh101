// A tree-of-life card, the twin of the time-scale card: the group's ancestors as colored blocks (Animals › Chordates ›
// Mammals), then its branches, blank until the card is flipped (rodents, bats, carnivorans…).
import { branchesOf, lineage } from '../tree';

const ink = (hex: string) => { const n = parseInt(hex.slice(1), 16); const l = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; return l > 0.6 ? '#1b1b1b' : '#fff'; };

export function TreeCard({ group, revealed }: { group: string; revealed: boolean }) {
  const chain = lineage(group), kids = branchesOf(group);
  if (!chain.length) return null;
  return (
    <div className="strata-card tree-card">
      {chain.map(n => (
        <div key={n.name} className="sc-col">
          <span className="sc-head">{n.rank === 'clade' ? 'group' : n.rank}</span>
          <div className="sc-block" style={{ background: n.color, color: ink(n.color) }}><b>{n.name}</b><small>{n.common}</small></div>
        </div>
      ))}
      <div className={"sc-col kids" + (kids.length > 6 ? " many" : "")}>
        <span className="sc-head">branches</span>
        {kids.map(k => (
          <div key={k.name} className={'sc-block' + (revealed ? ' shown' : ' blank')} style={revealed ? { background: k.color, color: ink(k.color) } : undefined}>
            {revealed ? <><b>{k.common}</b><small>{k.name}</small></> : '?'}
          </div>
        ))}
      </div>
    </div>
  );
}
