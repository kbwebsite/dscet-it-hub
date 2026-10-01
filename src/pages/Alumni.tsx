import { useEffect, useMemo, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { ALUMNI, ALUMNI_STATUS, GALLERY, GALLERY_CATS } from '../data/alumni';
import { PageHero } from '../components/layout';
import { SectionHeader, FilterBar, EmptyState, Reveal } from '../components/ui';
import { PendingNotice } from '../components/visuals';
import { AlumniCard } from '../components/cards';
import { FocusTrap } from '../components/a11y';

export function Alumni() {
  return (
    <>
      <PageHero eyebrow="Alumni" title="The network comes next."
        lede="Stories, career journeys, achievements and networking — published with real alumni, never invented."
        trail={[{ label: 'Home', to: '/' }, { label: 'Alumni' }]} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5" aria-label="Alumni stories">
        {ALUMNI.length === 0 ? (
          <div><EmptyState title="Alumni stories will be published here" hint={ALUMNI_STATUS} /></div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">{ALUMNI.map(a => <AlumniCard key={a.id} a={a} />)}</div>
        )}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[['Reunions', 'Homecoming and decade meets. Schedule will be updated.'], ['Mentorship', 'Alumni reviews, mocks and capstone guidance. Rota will be updated.'], ['Giving', 'Lab endowments, travel grants, merit awards. Details will be updated.']].map(([t, d]) => (
            <Reveal key={t}><article className="glass rounded-2xl p-5"><h3 className="font-semibold">{t}</h3><p className="mt-1 text-sm text-[var(--muted)]">{d}</p></article></Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

export function Gallery() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const list = useMemo(() => GALLERY.filter(g =>
    (cat === 'All' || g.cat === cat) && g.label.toLowerCase().includes(q.toLowerCase())), [q, cat]);
  const [light, setLight] = useState<number | null>(null);
  return (
    <>
      <PageHero eyebrow="Media" title="The department, in pictures."
        lede="Campus, labs, students, events and visits — real photographs replace placeholders as the media desk publishes."
        trail={[{ label: 'Home', to: '/' }, { label: 'Gallery' }]} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5" aria-label="Gallery">
        <FilterBar query={q} setQuery={setQ} pills={GALLERY_CATS} active={cat} setActive={setCat} placeholder="Search albums…" />
        {list.length === 0 ? <div className="mt-6"><EmptyState title="No albums in this view" /></div> : (
          <div className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {list.map((g, i) => (
              <button key={g.id} onClick={() => setLight(i)}
                className="group relative block w-full overflow-hidden rounded-2xl border hairline text-left transition hover:border-[var(--gold)]"
                aria-label={`Open fullscreen viewer: ${g.label}`}>
                <img src={`https://picsum.photos/seed/${g.seed}/640/440`} alt={g.label} loading="lazy" width={640} height={440}
                  className="aspect-[16/11] w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-3.5 pt-10 text-white">
                  <span className="text-[13px] font-medium">{g.label}</span>
                  <span className="flex items-center gap-2">
                    <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] backdrop-blur">{g.cat}</span>
                    <Expand size={14} aria-hidden className="opacity-70" />
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
        {light !== null && list.length > 0 && (
          <Lightbox items={list} index={Math.min(light, list.length - 1)} onClose={() => setLight(null)}
            onNav={d => setLight(i => (i === null ? 0 : (i + d + list.length) % list.length))} />
        )}
        <div className="mt-4"><PendingNotice text="Gallery photographs will be updated with official department and campus imagery." /></div>
      </section>
    </>
  );
}

function Lightbox({ items, index, onClose, onNav }: {
  items: { id: string; label: string; cat: string; seed: string }[];
  index: number; onClose: () => void; onNav: (d: 1 | -1) => void;
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onNav(1);
      else if (e.key === 'ArrowLeft') onNav(-1);
    };
    window.addEventListener('keydown', fn);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = prev; };
  }, [onClose, onNav]);
  const g = items[index] ?? items[0];
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4"
      role="dialog" aria-modal="true" aria-label={`Photo viewer: ${g.label}`} onClick={onClose}>
      <FocusTrap onEscape={onClose} className="contents">
      <button onClick={onClose} aria-label="Close viewer"
        className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white transition hover:bg-white/10">
        <X size={18} aria-hidden />
      </button>
      <button onClick={e => { e.stopPropagation(); onNav(-1); }} aria-label="Previous photo"
        className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 text-white transition hover:bg-white/10 sm:left-6">
        <ChevronLeft size={20} aria-hidden />
      </button>
      <figure className="max-h-full max-w-4xl" onClick={e => e.stopPropagation()}>
        <img src={`https://picsum.photos/seed/${g.seed}/1280/860`} alt={g.label} width={1280} height={860}
          className="max-h-[76vh] w-auto rounded-2xl object-contain shadow-2xl" />
        <figcaption className="mt-3 flex items-center justify-between gap-3 text-sm text-white/80">
          <span>{g.label}</span>
          <span className="shrink-0 font-mono text-[12px] text-white/50">{index + 1} / {items.length} · {g.cat}</span>
        </figcaption>
      </figure>
      <button onClick={e => { e.stopPropagation(); onNav(1); }} aria-label="Next photo"
        className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 text-white transition hover:bg-white/10 sm:right-6">
        <ChevronRight size={20} aria-hidden />
      </button>
      </FocusTrap>
    </div>
  );
}
