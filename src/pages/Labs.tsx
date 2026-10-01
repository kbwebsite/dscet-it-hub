import { ShieldCheck, Clock, BookOpen } from 'lucide-react';
import { LABS } from '../data/labs';
import { PageHero } from '../components/layout';
import { SectionHeader, Reveal } from '../components/ui';
import { VerifiedBadge, PendingNotice, CtaBand } from '../components/visuals';
import { SourceLine } from '../components/cards';

export function Labs() {
  return (
    <>
      <PageHero eyebrow="IT Labs" title="Where theory becomes hands-on skill."
        lede="System Software, Network and Cyber Security laboratories — objectives, equipment and courses, quoted from the official record."
        trail={[{ label: 'Home', to: '/' }, { label: 'Campus' }, { label: 'Laboratories' }]} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5" aria-label="Lab directory">
        <div className="grid gap-5">
          {LABS.map((l, i) => (
            <Reveal key={l.id}>
              <article className="glass card-sheen overflow-hidden rounded-3xl">
                <div className="relative h-44 overflow-hidden sm:h-52">
                  <img src={`https://picsum.photos/seed/dscet-${l.id}/960/360`} alt={`${l.name} — illustrative photo`} loading="lazy" width={960} height={360} className="h-full w-full object-cover" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-6 rounded-full bg-black/55 px-3 py-1 font-mono text-[11px] tracking-widest text-white backdrop-blur">LAB {String(i + 1).padStart(2, '0')} · VERIFIED</span>
                </div>
                <div className="grid lg:grid-cols-[1fr_360px]">
                  <div className="p-6 sm:p-8">
                    <p className="eyebrow text-[var(--gold)]">Lab {String(i + 1).padStart(2, '0')} · <VerifiedBadge /></p>
                    <h2 className="font-display mt-2 text-2xl sm:text-3xl">{l.name}</h2>
                    <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[var(--muted)]">{l.desc}</p>
                    <h3 className="mt-5 font-semibold">Objectives</h3>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">{l.objectives.map(o => <li key={o}>{o}</li>)}</ul>
                    <h3 className="mt-5 font-semibold">Courses supported</h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">{l.courses.map(c => <span key={c} className="rounded-full border hairline px-3 py-1.5 text-[13px]">{c}</span>)}</div>
                    <div className="mt-5 grid gap-2 text-[13px] text-[var(--muted)] sm:grid-cols-3">
                      <p className="flex items-center gap-1.5"><Clock size={13} aria-hidden /> Timetable: {l.timetable}</p>
                      <p className="flex items-center gap-1.5"><BookOpen size={13} aria-hidden /> Manual: {l.manual}</p>
                      <p>Faculty in-charge: {l.incharge}</p>
                    </div>
                  </div>
                  <div className="border-t hairline bg-black/[0.03] p-6 sm:p-8 dark:bg-white/[0.03]">
                    <h3 className="flex items-center gap-1.5 font-semibold"><ShieldCheck size={15} aria-hidden className="text-[var(--gold)]" /> Equipment & software</h3>
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-[var(--muted)]">{l.equipment.map(e => <li key={e}>{e}</li>)}</ul>
                    <div className="mt-4"><SourceLine /></div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-6"><PendingNotice text="Laboratory photo gallery, manuals and timetables: coming soon. Safety guidelines will be published with the official update." /></Reveal>
      </section>
      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-5">
        <CtaBand eyebrow="Next step" title="See the research behind the labs."
          lede="Verified patents, eight journal papers and four industry MoUs — the output of these benches."
          primary={{ label: 'Enter Research', to: '/research' }} secondary={{ label: 'Department profile', to: '/about' }} />
      </div>
    </>
  );
}

export function Facilities() {
  return (
    <>
      <PageHero eyebrow="Campus" title="Facilities at DSCET."
        lede="Classrooms, computing, library, seminar spaces and student amenities across the Mamallapuram campus."
        trail={[{ label: 'Home', to: '/' }, { label: 'Campus' }, { label: 'Facilities' }]} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5" aria-label="Facilities">
        <SectionHeader eyebrow="Spaces" title="Campus facilities" lede="Central facilities are described on the official DSCET website; department-specific facility details will be updated." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['Smart Classrooms', 'Information will be updated.'],
            ['Central Computing Centre', 'Information will be updated.'],
            ['Central Library + Dept. Library (500 books)', 'Department library verified (dscet.ac.in).'],
            ['Seminar Halls', 'Information will be updated.'],
            ['Hostel & Transport', 'See official DSCET student-life pages.'],
            ['Sports & Innovation Cells', 'See official DSCET clubs, IIC and Idea Lab pages.'],
          ].map(([t, d]) => (
            <Reveal key={t}><article className="glass card-lift card-sheen h-full rounded-2xl p-5"><h3 className="font-display text-xl">{t}</h3><p className="mt-1.5 text-sm text-[var(--muted)]">{d}</p></article></Reveal>
          ))}
        </div>
        <Reveal className="mt-6">
          <a href="https://dscet.ac.in/facilities" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border hairline px-5 py-2.5 text-sm font-semibold hover:border-[var(--gold)]">Official DSCET facilities page ↗</a>
        </Reveal>
        <div className="mt-8"><CtaBand eyebrow="Visit" title="See it in person."
          lede="Department office, library hours and enquiry form — plan your visit to Mamallapuram."
          primary={{ label: 'Contact the department', to: '/contact' }} secondary={{ label: 'View gallery', to: '/gallery' }} /></div>
      </section>
    </>
  );
}
