import { useMemo, useState } from 'react';
import { RESEARCH_AREAS, INDUSTRY_MOUS, CONSULTANCY_STATUS, RD_ACTIVITIES_STATUS, SCHOLARS_STATUS } from '../data/research';
import { PUBLICATIONS } from '../data/publications';
import { PATENTS } from '../data/patents';
import { PageHero } from '../components/layout';
import { SectionHeader, FilterBar, EmptyState, Reveal } from '../components/ui';
import { VerifiedBadge, PendingNotice, IndustryFlow, AuroraBlobs, CtaBand } from '../components/visuals';
import { PatentCard, PublicationCard } from '../components/cards';

export default function Research() {
  const [q, setQ] = useState('');
  const years = ['All', ...Array.from(new Set(PUBLICATIONS.map(p => p.year)))];
  const [year, setYear] = useState('All');
  const pubs = useMemo(() => PUBLICATIONS.filter(p =>
    (year === 'All' || p.year === year) &&
    (p.title + p.authors + p.journal).toLowerCase().includes(q.toLowerCase())), [q, year]);

  return (
    <>
      <PageHero eyebrow="Research & innovation" title="Evidence first, always."
        lede="Verified patents, a full journal-paper library with filters, industry MoUs and honest pending states for consultancy and scholars."
        trail={[{ label: 'Home', to: '/' }, { label: 'Research' }]} />

      <section className="relative mx-auto max-w-7xl overflow-hidden px-4 py-12 sm:px-5" aria-label="Research areas">
        <AuroraBlobs />
        <div className="relative">
        <SectionHeader eyebrow="Focus" title="Research areas & interests"
          lede="Areas marked Evidenced appear in the department's verified patents or papers; the rest are presented as areas of interest — not formal claims." />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {RESEARCH_AREAS.map(a => (
            <Reveal key={a.name}>
              <article className="glass card-lift card-sheen h-full rounded-2xl border-t-2 !border-t-[var(--gold)] p-5">
                <h3 className="font-semibold leading-snug">{a.name}</h3>
                <p className="mt-1.5 text-[13px] text-[var(--muted)]">{a.desc}</p>
                <p className="mt-2">{a.evidenced ? <VerifiedBadge source="evidenced" /> : <span className="rounded-full border hairline px-2.5 py-1 text-[11px] text-[var(--muted)]">Area of interest</span>}</p>
              </article>
            </Reveal>
          ))}
        </div>
        </div>
      </section>

      <section id="patents" className="scroll-mt-24 border-t hairline bg-[var(--bg-elev)]/60" aria-label="Patents">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-5">
          <SectionHeader eyebrow="Intellectual property" title="Published patents" lede="Title, inventors, faculty, status and technology area — exactly as officially recorded." />
          <div className="mt-6 grid gap-4 md:grid-cols-2">{PATENTS.map(p => <PatentCard key={p.id} pat={p} />)}</div>
        </div>
      </section>

      <section id="publications" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-5" aria-label="Publications library">
        <SectionHeader eyebrow="Library" title="Journal publications"
          lede="Filter by year or search title, author, journal. DOIs are shown only where officially available — never fabricated." />
        <div className="mt-6"><FilterBar query={q} setQuery={setQ} pills={years} active={year} setActive={setYear} placeholder="Search title, author, journal…" /></div>
        {pubs.length === 0 ? <div className="mt-6"><EmptyState title="No publications match" hint="Try another year or keyword." /></div> : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">{pubs.map(p => <PublicationCard key={p.id} pub={p} />)}</div>
        )}
      </section>

      <section id="industry" className="scroll-mt-24 border-t hairline bg-[#070d1d] text-white dark:bg-[#030610]" aria-label="Industry Connect">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-5 lg:grid-cols-[1fr_380px]">
          <div>
            <p className="eyebrow text-[#38bdf8]">Industry Connect</p>
            <h2 className="font-display mt-2 text-3xl sm:text-4xl">Department → Industry → Career.</h2>
            <p className="mt-3 max-w-xl text-[15px] text-white/65">Only verified MoU partners are named. No company is invented; scope details arrive with the official update.</p>
            <div className="mt-8"><IndustryFlow partners={INDUSTRY_MOUS} /></div>
          </div>
          <Reveal delay={0.08}>
            <aside className="glass h-fit rounded-3xl !border-white/15 p-6" aria-label="Collaboration status">
              <p className="eyebrow text-[#38bdf8]">Consultancy & scholars</p>
              <div className="mt-3 space-y-3">
                <PendingNotice text={CONSULTANCY_STATUS} />
                <PendingNotice text={RD_ACTIVITIES_STATUS} />
                <PendingNotice text={SCHOLARS_STATUS} />
              </div>
            </aside>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-5" aria-label="Next steps">
        <CtaBand eyebrow="Keep exploring" title="From papers to benches."
          lede="See where the research happens — three verified laboratories with equipment, software and courses."
          primary={{ label: 'Tour the laboratories', to: '/labs' }} secondary={{ label: 'B.Tech IT programme', to: '/academics' }} />
      </section>
    </>
  );
}
