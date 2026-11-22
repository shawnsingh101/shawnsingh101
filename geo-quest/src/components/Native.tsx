import type { Capital, Chinese, NativeName, Place } from '../types';
import { useProgress } from '../srs';

/** 山西 Shānxī */
export function Zh({ zh, className }: { zh?: Chinese | null; className?: string }) {
  if (!zh) return null;
  return <span className={'zh ' + (className ?? '')} lang="zh-Hans"><span className="han">{zh.han}</span><span className="py">{zh.pinyin}</span></span>;
}

/** Deutschland · ישראל … each in its own script, with the language on hover. */
export function Natives({ list, max = 3, showLang = false }: { list?: NativeName[]; max?: number; showLang?: boolean }) {
  if (!list?.length) return null;
  return (
    <span className="natives">
      {list.slice(0, max).map(n => (
        <span key={n.name} className="native" title={n.lang}><bdi>{n.name}</bdi>{showLang && <small>{n.lang}</small>}</span>
      ))}
    </span>
  );
}

/** The local-language line for a place (or one of its capitals). Chinese always shows; other languages follow the setting. */
export function LocalName({ place, capital, showLang }: { place: Place; capital?: Capital; showLang?: boolean }) {
  const on = useProgress().settings.nativeNames;
  const zh = capital ? capital.zh : place.zh;
  if (zh) return <Zh zh={zh} />;
  if (!on) return null;
  return <Natives list={capital ? capital.native : place.native} showLang={showLang} />;
}
