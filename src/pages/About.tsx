import { BadgeCheck, Landmark, Target, Compass, HeartHandshake } from 'lucide-react';
import { SITE } from '../lib';
import { DEPARTMENT, MILESTONES, DEPT_DETAILS, HIGHLIGHTS } from '../data/department';
import { PageHero } from '../components/layout';
import { Reveal, SectionHeader } from '../components/ui';
import { VerifiedBadge, PendingNotice, AuroraBlobs, CtaBand } from '../components/visuals';
import { SourceLine } from '../components/cards';

export default function About() {
  return (
    <>
      <PageHero eyebrow="Department · Est. 2001" title="The IT department of DSCET."
        lede="About, vision, mission, programme educational objectives, milestones and official highlights — drawn from the verified department record."
        trail={[{ label: 'Home', to: '/' }, { label: 'Department' }]} />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5 lg:py-16" aria-label="Overview">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <Reveal>
            <p className="eyebrow text-[var(--gold)]">About the department</p>
            <h2 className="font-display mt-2 text-3xl sm:text-4xl">Designing, developing, managing and securing the digital world.</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">{DEPARTMENT.about}</p>
            <SourceLine />
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {HIGHLIGHTS.map(h => (
                <article key={h.n} className="glass card-lift card-sheen h-full rounded-2xl p-5">
                  <p className="font-display text-3xl text-[var(--gold)]">{h.n}</p>
                  <h3 className="mt-2 font-semibold leading-snug">{h.title}</h3>
                  <p className="mt-1 text-[13px] text-[var(--muted)]">{h.desc}</p>
                </article>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <aside className="glass rounded-3xl p-6" aria-label="Official department details">
              <p className="eyebrow text-[var(--gold)]">Official details</p>
              <dl className="mt-3 space-y-3 text-sm">
                {[
                  ['HOD', SITE.hod.name + ' (name as listed officially)'],
                  ['Established', '2001'],
                  ['Programme', 'B.Tech Information Technology'],
                  ['Affiliation', 'Anna University (permanent affiliation, 2012)'],
                  ['NBA accreditation', '2023'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-b hairline pb-2.5">
                    <dt className="text-[var(--muted)]">{k}</dt><dd className="text-right font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3"><VerifiedBadge /></p>
            </aside>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden border-y hairline bg-[var(--bg-elev)]/60" aria-label="Vision mission PEO">
        <AuroraBlobs />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-5 lg:py-16">
          <div className="grid gap-4 md:grid-cols-2">
            <Reveal>
              <article className="glass card-lift card-sheen h-full rounded-2xl p-6 sm:p-8">
                <span aria-hidden className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#4f46e5] text-white shadow-lg"><Compass size={19} /></span>
                <h3 className="font-display mt-4 text-2xl">Vision</h3>
                <p className="font-display mt-3 text-lg leading-relaxed">“{DEPARTMENT.vision}”</p>
                <p className="mt-3"><VerifiedBadge /></p>
              </article>
            </Reveal>
            <Reveal delay={0.05}>
              <article className="glass card-lift card-sheen h-full rounded-2xl p-6 sm:p-8">
                <span aria-hidden className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#4f46e5] text-white shadow-lg"><Target size={19} /></span>
                <h3 className="font-display mt-4 text-2xl">Mission</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[var(--muted)]">
                  {DEPARTMENT.mission.map(m => <li key={m}>{m}</li>)}
                </ul>
                <p className="mt-3"><VerifiedBadge /></p>
              </article>
            </Reveal>
          </div>
          <Reveal className="mt-4">
            <article className="glass rounded-2xl p-6 sm:p-8">
              <h3 className="flex items-center gap-2 font-semibold"><HeartHandshake size={17} aria-hidden className="text-[var(--gold)]" /> Programme Educational Objectives (PEOs)</h3>
              <ul className="mt-3 space-y-2.5 text-[15px] leading-relaxed text-[var(--muted)]">
                {DEPARTMENT.peos.map(p => <li key={p} className="rounded-xl border hairline px-4 py-3">{p}</li>)}
              </ul>
              <p className="mt-3"><VerifiedBadge /></p>
            </article>
          </Reveal>
        </div>
      </section>

      <section id="milestones" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-5 lg:py-16" aria-label="Milestones timeline">
        <SectionHeader eyebrow="Since 2001" title="Department milestones"
          lede="Interactive timeline from the official record. No milestone is embellished — each entry quotes the verified source." />
        <ol className="relative mt-10 border-l hairline">
          {MILESTONES.map((t, i) => (
            <Reveal key={t.year} delay={i * 0.04}>
              <li className="relative grid gap-1 pb-8 pl-8 sm:grid-cols-[90px_1fr]">
                <span aria-hidden className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full border-2 border-[var(--gold)] bg-[var(--bg)] shadow-[0_0_14px_rgba(56,189,248,0.7)]" />
                <p className="font-mono text-sm text-[var(--gold)]">{t.year}</p>
                <div>
                  <h3 className="font-display text-xl">{t.title} <VerifiedBadge /></h3>
                  <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">{t.desc}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* HOD */}
      <section id="hod" className="scroll-mt-24 border-y hairline bg-[#070d1d] text-white dark:bg-[#030610]" aria-label="Head of Department">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-5 lg:grid-cols-[340px_1fr] lg:py-20">
          <Reveal>
            <aside className="glass h-fit rounded-3xl !border-white/15 p-6" aria-label="HOD profile">
              <p className="eyebrow text-[#38bdf8]">Head of Department</p>
              <p className="font-display mt-2 text-3xl">{SITE.hod.name}</p>
              <p className="mt-1 text-[13px] text-white/60">{SITE.hod.designation} · Department of Information Technology, DSCET</p>
              <div className="mt-4"><PendingNotice text="Full HOD profile (qualification, message, contact) will be updated. Only the name is officially listed at this time." /></div>
              <p className="mt-3"><VerifiedBadge source="name · dscet.ac.in" /></p>
            </aside>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="eyebrow text-[#38bdf8]">Leadership</p>
            <h2 className="font-display mt-2 text-3xl sm:text-4xl">Guided by experience, geared for emerging technology.</h2>
            <dl className="mt-6 space-y-3 text-sm">
              {DEPT_DETAILS.map(d => (
                <div key={d.label} className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <dt className="shrink-0 font-semibold text-white/85">{d.label}</dt>
                  <dd className="text-white/60">{d.value} {d.verified ? <VerifiedBadge /> : null}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5 lg:py-16" aria-label="Recognition">
        <SectionHeader eyebrow="Trust" title="Affiliation & recognition" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BadgeCheck, t: 'Anna University', d: 'Permanent affiliation for IT since 2012 (verified).' },
            { icon: Landmark, t: 'NBA', d: 'Accreditation recorded 2023 (verified).' },
            { icon: Target, t: 'Oracle certification', d: 'International certification course (verified).' },
            { icon: HeartHandshake, t: 'Industry MoUs', d: '4 verified MoU partners (see Research → Industry).' },
          ].map(c => (
            <Reveal key={c.t}><article className="glass card-lift card-sheen h-full rounded-2xl p-5"><span aria-hidden className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#0284c7] to-[#4f46e5] text-white shadow"><c.icon size={18} /></span><h3 className="mt-3 font-semibold">{c.t}</h3><p className="mt-1 text-sm text-[var(--muted)]">{c.d}</p></article></Reveal>
          ))}
        </div>
        <div className="mt-10"><CtaBand eyebrow="Next step" title="See what you'll study."
          lede="Duration, intake, TNEA eligibility, POs, PSOs and official documents — the complete B.Tech IT record."
          primary={{ label: 'Explore B.Tech IT', to: '/academics' }} secondary={{ label: 'Tour the labs', to: '/labs' }} /></div>
      </section>
    </>
  );
}
