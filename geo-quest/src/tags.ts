// The shared tag vocabulary: turns Wikidata's labels into the shelf names the Library uses. One list for every subject,
// so books today (and films, music, ideas later) shelve the same way. To re-shelve something, add its label here (all
// lower case); to fix one item, give it 'topics' or 'language' in data/collection-fixes.json.

/** Languages: Wikidata's many variants → one language (its literature shelf, and the "which language?" answer). */
const LANGUAGE: Record<string, string> = {
  'homeric greek': 'Ancient Greek', 'koine greek': 'Ancient Greek', greek: 'Ancient Greek', 'ancient greek': 'Ancient Greek',
  'american english': 'English', 'british english': 'English', 'middle english': 'English', 'early modern english': 'English',
  'early modern spanish': 'Spanish', 'old spanish': 'Spanish', 'medieval italian': 'Italian', 'middle french': 'French', 'old french': 'French',
  'early middle japanese': 'Japanese', 'classical japanese': 'Japanese',
  'classical chinese': 'Chinese', 'written vernacular chinese': 'Chinese', 'mandarin chinese': 'Chinese', 'literary chinese': 'Chinese',
  'early new high german': 'German', 'middle high german': 'German', 'classical persian': 'Persian', 'old persian': 'Persian',
};
export const languageOf = (raw: string | null | undefined) => (raw ? LANGUAGE[raw.toLowerCase()] ?? raw.charAt(0).toUpperCase() + raw.slice(1) : null);
/** "Italian literature"; English and Spanish span many countries, so "-language". */
export const literatureOf = (lang: string) => (/^(English|Spanish|Portuguese|French|Arabic)$/.test(lang) ? `${lang}-language literature` : `${lang} literature`);

/** Topics for nonfiction, in the order shelves are listed. A book goes on every shelf its subjects match. */
export const TOPICS: Record<string, string[]> = {
  Philosophy: ['philosophy', 'ethics', 'epistemology', 'metaphysics', 'stoicism', 'kantianism', 'hegelianism', 'being', 'morality', 'aesthetics',
    'master–slave dialectic', 'lao–zhuang school', 'chinese philosophy', 'confucius', 'confucianism', 'taoism', 'social philosophy', 'political philosophy',
    'existentialism', 'logic', 'philosophy of science', 'justice', 'happiness', 'consciousness'],
  Politics: ['politics', 'political science', 'democracy', 'communism', 'socialism', 'totalitarianism', 'social contract', 'feminism', 'orientalism',
    'postcolonialism', 'power', 'government', 'military art', 'war', 'military strategy', 'liberalism'],
  Economics: ['economics', 'political economics', 'capitalism', 'macroeconomics', 'income inequality', 'economic history', 'division of labour',
    'invisible hand', 'market', 'money', 'finance'],
  History: ['history', 'world history', 'human history', 'civilization', 'prehistory', 'geography'],
  Science: ['natural selection', 'evolution', 'evolutionary biology', 'gene', 'meme', 'cosmology', 'physics', 'biology', 'natural environment', 'ddt',
    'history of science', "gödel's incompleteness theorems", 'mathematics', 'popularisation of science'],
  Psychology: ['psychology', 'the unconscious', 'dream interpretation', 'decision-making', 'cognitive bias', 'psychoanalysis'],
  'Technology & AI': ['artificial intelligence', 'superintelligence', 'ai alignment', 'existential risk from artificial intelligence', 'technology', 'machine learning'],
};
/** The shelves a nonfiction item belongs on: from its subjects; from its genres only if its subjects match nothing. */
export function topicsOf(subjects: string[] = [], genres: string[] = []): string[] {
  const hit = (labels: string[]) => Object.keys(TOPICS).filter(t => labels.some(l => TOPICS[t].includes(l.toLowerCase())));
  const s = hit(subjects);
  return s.length ? s : hit(genres);
}
