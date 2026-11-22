// Shown on the home screen. Add a line at the top with each update (and bump package.json "version").
export const CHANGELOG: { version: string; notes: string }[] = [
  { version: '0.8.3', notes: 'Places near the map’s edge (like the Yukon) no longer get split in two when revealed' },
  { version: '0.8.2', notes: 'Fly-to zoom a little slower (0.8s)' },
  { version: '0.8.1', notes: 'Quick, smooth fly-to zoom when you reveal where something is' },
  { version: '0.8.0', notes: 'Home screen with a spinning globe · lock-on target brackets with ✓ / ✗' },
  { version: '0.7.0', notes: 'Flip or skip map questions · “I don’t know” · compact skill tree' },
  { version: '0.6.0', notes: 'Forgiving taps · centred rivers · undo · local names for rivers & lakes' },
  { version: '0.5.0', notes: 'Rivers and lakes' },
  { version: '0.4.0', notes: 'Re-centring map · photo galleries · pronunciation' },
  { version: '0.3.0', notes: 'Chinese characters + pinyin · local-language names' },
  { version: '0.2.0', notes: 'Oceans & seas · China’s provinces · quizzes · map labels' },
  { version: '0.1.0', notes: 'Countries, capitals and flags' },
];
