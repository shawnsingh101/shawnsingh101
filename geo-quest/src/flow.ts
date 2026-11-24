// Parsing a flow diagram (components/Flow.tsx draws it): an optional "# Title" line, then a line naming the actors, "A | B | C"; then one step per
// line, "A -> B: what A sends" or "A: what A does". Plain TypeScript, so the deck audit can check every flow.
export interface Step { from: number; to: number; label: string }

export function parseFlow(text: string): { title: string | null; actors: string[]; steps: Step[] } {
  // An optional first line "# The TLS handshake" is the diagram's title.
  let lines = text.split('\n').filter(l => l.trim());
  const title = /^#\s+(.*)$/.exec(lines[0]?.trim() ?? '')?.[1] ?? null;
  if (title) lines = lines.slice(1);
  const [head, ...rest] = lines;
  const actors = head.split('|').map(s => s.trim());
  const at = (name: string) => actors.findIndex(a => a.toLowerCase() === name.trim().toLowerCase());
  const steps = rest.map(l => {
    const arrow = /^(.+?)\s*->\s*(.+?)\s*:\s*(.*)$/.exec(l.trim());
    if (arrow) return { from: at(arrow[1]), to: at(arrow[2]), label: arrow[3] };
    const note = /^(.+?)\s*:\s*(.*)$/.exec(l.trim());
    return note ? { from: at(note[1]), to: at(note[1]), label: note[2] } : { from: -1, to: -1, label: l.trim() };
  });
  return { title, actors, steps };
}
