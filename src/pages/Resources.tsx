import { useMemo, useState } from 'react';
import { BookOpen, Clock } from 'lucide-react';
import { DOCUMENTS, LIBRARY, TIMETABLE_STATUS, CALENDAR_STATUS } from '../data/resources';
import { PageHero } from '../components/layout';
import { SectionHeader, FilterBar, EmptyState, Reveal } from '../components/ui';
import { VerifiedBadge, PendingNotice } from '../components/visuals';
import { DocCard } from '../components/cards';

const CATS = ['All', ...Array.from(new Set(DOCUMENTS.map(d => d.category)))];

/* Timetable/calendar grids go live with the registrar's release. Structure ready. */
export default function Resources() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const list = useMemo(() => DOCUMENTS.filter(d =>
    (cat === 'All' || d.category === cat) && (d.title + d.category).toLowerCase().includes(q.toLowerCase())), [q, cat]);
  return (
    <>
      <PageHero eyebrow="Library" title="Documents, library, time & calendar."
        lede="Official documents link out to dscet.ac.in; everything else is honestly marked pending. Backend-ready filters included."
        trail={[{ label: 'Home', to: '/' }, { label: 'Resources' }]} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5" aria-label="Resource library">
        <FilterBar query={q} setQuery={setQ} pills={CATS} active={cat} setActive={setCat} placeholder="Search syllabus, papers, forms…" />
        {list.length === 0 ? <div className="mt-6"><EmptyState title="No documents found" hint="Try another keyword or category." /></div> : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map(d => <DocCard key={d.id} d={d} />)}</div>
        )}
      </section>

      <section id="library" className="scroll-mt-24 border-t hairline bg-[#070d1d] text-white dark:bg-[#030610]" aria-label="Department library">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-5">
          <p className="eyebrow text-[#38bdf8]">Department library</p>
          <h2 className="font-display mt-2 text-3xl sm:text-4xl">A library of its own, for IT students.</h2>
          <p className="mt-3 max-w-2xl text-[15px] text-white/65">{LIBRARY.note}</p>
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              [String(LIBRARY.books), 'Books', true],
              [LIBRARY.intlJournals, 'International Journals', false],
              [LIBRARY.nationalJournals, 'National Journals', false],
              [LIBRARY.newspapers, 'Newspapers', false],
            ].map(([v, l, verified]) => (
              <Reveal key={l as string}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
                  <p className="font-display text-3xl">{v}</p>
                  <p className="mt-1 text-[13px] text-white/60">{l}</p>
                  {verified ? <p className="mt-2 flex justify-center"><VerifiedBadge /></p> : null}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/80"><Clock size={14} aria-hidden className="text-[#38bdf8]" /> Working hours: {LIBRARY.hours} <VerifiedBadge /></p>
          </Reveal>
          <Reveal className="mt-4">
            <p className="flex items-center gap-2 text-sm text-white/60"><BookOpen size={14} aria-hidden className="text-[#38bdf8]" /> Video cassettes, CD-ROMs, charts and subscriptions: <span className="text-white/45">information will be updated.</span></p>
          </Reveal>
        </div>
      </section>

      <section id="timetable" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-5" aria-label="Timetables">
        <SectionHeader eyebrow="Timetables" title="Class, lab & exam slots" />
        <div className="mt-4"><PendingNotice text={TIMETABLE_STATUS} /></div>
      </section>

      <section id="calendar" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-14 sm:px-5" aria-label="Academic calendar">
        <SectionHeader eyebrow="Calendar" title="Academic calendar" />
        <div className="mt-4"><PendingNotice text={CALENDAR_STATUS} /></div>
      </section>
    </>
  );
}
