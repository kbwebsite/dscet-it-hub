import { useState } from 'react';
import { ArrowUpRight, Download } from 'lucide-react';
import { PROGRAMS } from '../data/programs';
import { DEPARTMENT } from '../data/department';
import { PageHero } from '../components/layout';
import { SectionHeader, Reveal } from '../components/ui';
import { VerifiedBadge, CtaBand } from '../components/visuals';
import { SourceLine } from '../components/cards';
import { clsx } from 'clsx';

const TABS = ['Overview', 'Outcomes (PO)', 'Specific Outcomes (PSO)', 'PEOs', 'Eligibility & Admission', 'Downloads'] as const;

export default function Academics() {
  const p = PROGRAMS[0];
  const [tab, setTab] = useState<(typeof TABS)[number]>('Overview');
  return (
    <>
      <PageHero eyebrow="Academics · B.Tech IT" title="One programme, engineered end-to-end."
        lede="Overview, duration, intake, eligibility, TNEA admission, programme outcomes and official documents — from the verified programme record."
        trail={[{ label: 'Home', to: '/' }, { label: 'Academics' }]} />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5" aria-label="Programme header">
        <div className="glass card-sheen grid gap-6 rounded-3xl p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="eyebrow text-[var(--gold)]">{p.level} · <VerifiedBadge /></p>
            <h2 className="font-display mt-2 text-3xl sm:text-4xl">{p.name}</h2>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              {[['Duration', p.duration], ['Intake', p.intake], ['Affiliation', 'Anna University']].map(([k, v]) => (
                <div key={k} className="rounded-2xl border hairline px-4 py-3"><dt className="text-[var(--muted)]">{k}</dt><dd className="mt-0.5 font-semibold">{v}</dd></div>
              ))}
            </dl>
          </div>
          <a href="https://dscet.ac.in/btech-information-technology/" target="_blank" rel="noreferrer"
            className="btn-glow inline-flex items-center gap-1.5 rounded-full bg-[#070d1d] px-6 py-3 text-sm font-bold text-white dark:bg-[#38bdf8] dark:text-[#04070e]">
            Official programme page <ArrowUpRight size={15} aria-hidden />
          </a>
        </div>
      </section>

      <section id="curriculum" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-14 sm:px-5" aria-label="Curriculum navigation">
        <div className="flex gap-2 overflow-x-auto no-scrollbar" role="tablist" aria-label="Curriculum sections">
          {TABS.map(t => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
              className={clsx('shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition',
                tab === t ? 'border-transparent bg-[#070d1d] text-white dark:bg-[#38bdf8] dark:text-[#04070e]' : 'hairline glass hover:border-[var(--gold)]')}>
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6" role="tabpanel" aria-live="polite">
          {tab === 'Overview' && (
            <Reveal>
              <article className="glass rounded-3xl p-6 sm:p-8">
                <SectionHeader eyebrow="Programme overview" title="Technology professionals for a digital future" />
                <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[var(--muted)]">{p.intake} The programme blends theoretical foundations with practical exposure across software engineering, cloud, cybersecurity, data analytics, networking and AI — supported by three dedicated laboratories and industry MoUs.</p>
                <SourceLine />
              </article>
            </Reveal>
          )}
          {tab === 'Outcomes (PO)' && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {p.outcomes.map(o => (
                <Reveal key={o.code}><article className="glass card-lift h-full rounded-2xl p-5"><p className="font-mono text-[12px] font-bold text-[var(--gold)]">{o.code}</p><h3 className="mt-1 font-semibold">{o.title}</h3><p className="mt-1 text-sm text-[var(--muted)]">{o.desc}</p></article></Reveal>
              ))}
            </div>
          )}
          {tab === 'Specific Outcomes (PSO)' && (
            <div className="grid gap-3 md:grid-cols-3">
              {p.specificOutcomes.map(o => (
                <Reveal key={o.code}><article className="glass card-lift h-full rounded-2xl p-5"><p className="font-mono text-[12px] font-bold text-[var(--gold)]">{o.code}</p><p className="mt-1 text-sm leading-relaxed">{o.desc}</p></article></Reveal>
              ))}
            </div>
          )}
          {tab === 'PEOs' && (
            <Reveal>
              <ul className="space-y-3">
                {DEPARTMENT.peos.map(peo => <li key={peo} className="glass rounded-2xl px-5 py-4 text-[15px] leading-relaxed">{peo}</li>)}
              </ul>
              <p className="mt-3"><VerifiedBadge /></p>
            </Reveal>
          )}
          {tab === 'Eligibility & Admission' && (
            <div className="grid gap-4 lg:grid-cols-2">
              <Reveal>
                <article className="glass h-full rounded-2xl p-6">
                  <h3 className="font-display text-xl">Eligibility</h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--muted)]">{p.eligibility.map(e => <li key={e}>{e}</li>)}</ul>
                  <p className="mt-3"><VerifiedBadge /></p>
                </article>
              </Reveal>
              <Reveal delay={0.05}>
                <article className="glass h-full rounded-2xl p-6">
                  <h3 className="font-display text-xl">Admission (TNEA)</h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--muted)]">{p.admission.map(e => <li key={e}>{e}</li>)}</ul>
                  <p className="mt-3"><VerifiedBadge /></p>
                </article>
              </Reveal>
            </div>
          )}
          {tab === 'Downloads' && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {p.downloads.map(d => (
                <Reveal key={d.label}>
                  <article className="glass card-lift rounded-2xl p-5">
                    <h3 className="font-semibold leading-snug">{d.label}</h3>
                    <p className="mt-1 text-[13px] text-[var(--muted)]">{d.meta}</p>
                    {d.href === '#' ? <p className="mt-3 text-[13px] text-[var(--muted)]">Information will be updated.</p>
                      : <a href={d.href} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--gold)]"><Download size={14} aria-hidden />Open official document</a>}
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-5" aria-label="Next steps">
        <CtaBand eyebrow="Keep exploring" title="Step inside the laboratories."
          lede="System Software, Networks and Cyber Security — equipment, software and courses, quoted from the official record."
          primary={{ label: 'Tour the labs', to: '/labs' }} secondary={{ label: 'Meet the research', to: '/research' }} />
      </section>
    </>
  );
}
