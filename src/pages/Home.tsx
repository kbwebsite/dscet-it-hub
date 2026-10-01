import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ArrowRight, ArrowUpRight, BadgeCheck, FlaskConical, GraduationCap, ChevronDown, FileBadge, BookOpen, Handshake, TrendingUp, Users, Bell, CalendarDays, Quote } from 'lucide-react';
import { SITE, VERIFIED_SNAPSHOT } from '../lib';
import { LABS } from '../data/labs';
import { PATENTS } from '../data/patents';
import { PUBLICATIONS } from '../data/publications';
import { HIGHLIGHTS, DEPARTMENT } from '../data/department';
import { INDUSTRY_MOUS } from '../data/research';
import { EVENTS_STATUS } from '../data/events';
import { NEWS_STATUS } from '../data/news';
import { Reveal, SectionHeader, AnimatedNumber } from '../components/ui';
import { NetworkHero, ITCore, VerifiedBadge, PendingNotice, WhyIT, Marquee, SpotlightCard, AuroraBlobs } from '../components/visuals';
import { HomeLiveSections } from '../portal/public';

const H_ICONS = [TrendingUp, Users, Handshake];

function FloatChips() {
  const reduce = useReducedMotion();
  const chips = [
    { t: 'NBA · 2023', c: 'left-0 top-4' },
    { t: 'INTAKE · 240', c: 'right-0 top-20' },
    { t: '8 PAPERS', c: 'left-0 bottom-20' },
    { t: '4 MOUS', c: 'right-0 bottom-8' },
  ];
  return (
    <>
      {chips.map((c, i) => (
        <motion.span key={c.t}
          animate={reduce ? undefined : { y: [0, -9, 0] }}
          transition={{ duration: 3.4 + i * 0.6, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute ${c.c} hidden rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 font-mono text-[11px] tracking-[0.18em] text-white/85 shadow-xl backdrop-blur sm:inline-flex`}>
          <span aria-hidden className="mr-1.5 inline-block h-1.5 w-1.5 self-center rounded-full bg-[#38bdf8]" />{c.t}
        </motion.span>
      ))}
    </>
  );
}

export default function Home() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  // GSAP hero entrance — subtle, professional, reduced-motion aware
  useEffect(() => {
    if (reduce || !heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-line', { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.1 });
      gsap.fromTo('.hero-fade', { opacity: 0 }, { opacity: 1, duration: 1.1, stagger: 0.1, ease: 'power2.out', delay: 0.5 });
    }, heroRef);
    return () => ctx.revert();
  }, [reduce]);

  const featuredPatent = PATENTS[0];

  return (
    <>
      {/* ============ HERO — full viewport (§4/§5) ============ */}
      <section ref={heroRef} aria-label="Department of Information Technology, DSCET"
        className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-[#04070e] text-white">
        <NetworkHero className="absolute inset-0 h-full w-full opacity-80" />
        <div aria-hidden className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(1000px 520px at 50% 0%, rgba(56,189,248,.14), transparent 62%), radial-gradient(900px 620px at 85% 100%, rgba(30,90,180,.22), transparent 60%), linear-gradient(180deg, rgba(4,7,14,.2), rgba(4,7,14,.78) 94%)' }} />
        <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
        <span aria-hidden className="aurora left-[8%] top-[16%] h-[300px] w-[300px] bg-[#0284c7]/25 aurora-a" />
        <span aria-hidden className="aurora bottom-[8%] right-[30%] h-[260px] w-[260px] bg-[#4f46e5]/25 aurora-b" />

        <div className="relative mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-4 pb-10 pt-16 sm:px-5 lg:grid-cols-[1.02fr_.98fr] lg:pt-20">
          <div>
            <p className="hero-line inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[12px] tracking-wide text-white/80 backdrop-blur">
              <span aria-hidden className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-[#38bdf8] text-[#38bdf8]" />
              Official · {SITE.collegeShort} · Mamallapuram · Est. 2001
            </p>
            <h1 className="hero-line display-xl mt-6 text-[2.9rem] leading-[0.95] sm:text-7xl lg:text-[5rem]">
              <span className="block text-[0.4em] font-semibold tracking-[0.3em] text-white/65">DEPARTMENT OF</span>
              <span className="mt-2 block">Information</span>
              <span className="text-gradient block">Technology</span>
            </h1>
            <p className="hero-line mt-4 max-w-2xl text-[15px] font-medium text-white/75 sm:text-lg">
              {SITE.college} — {SITE.district}
            </p>
            <p className="hero-line font-display mt-3 max-w-2xl text-xl text-[#7fd4fb] sm:text-2xl">
              {SITE.tagline}
            </p>
            <div className="hero-fade mt-8 flex flex-wrap gap-3">
              <Link to="/about" className="btn-glow inline-flex items-center gap-2 rounded-full bg-[#38bdf8] px-7 py-3.5 text-sm font-bold text-[#04070e]">
                Explore Department <ArrowRight size={16} aria-hidden />
              </Link>
              <Link to="/academics" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10">
                <GraduationCap size={16} aria-hidden /> B.Tech IT Programme
              </Link>
            </div>
            <dl className="hero-fade mt-10 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4" aria-label="Verified snapshot">
              {[
                ['2001', 'Established'], ['B.Tech IT', 'Programme'], ['240', 'Intake (2024)'], ['NBA 2023', 'Accredited'],
              ].map(([v, l]) => (
                <div key={l} className="bg-[#04070e]/80 px-4 py-4">
                  <dd className="font-display text-xl text-white [text-shadow:0_0_24px_rgba(56,189,248,0.45)] sm:text-2xl">{v}</dd>
                  <dt className="mt-0.5 text-[11px] text-white/55">{l}</dt>
                </div>
              ))}
            </dl>
          </div>
          <div className="hero-fade relative mx-auto w-full max-w-[440px]">
            <div aria-hidden className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#38bdf8]/10 blur-[80px]" />
            <ITCore className="relative" />
            <FloatChips />
          </div>
        </div>
        <div className="hero-fade relative border-t border-white/10 bg-black/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-5">
            <Marquee items={['ARTIFICIAL INTELLIGENCE', 'CLOUD COMPUTING', 'CYBERSECURITY', 'DATA ANALYTICS', 'NETWORKING', 'INTERNET OF THINGS', 'BLOCKCHAIN', 'EST. 2001', 'NBA · 2023', 'B.TECH IT · DSCET']} />
          </div>
        </div>
        <div className="hero-fade relative mx-auto flex w-full max-w-7xl items-center justify-between px-4 pb-6 sm:px-5" aria-hidden>
          <p className="font-mono text-[11px] tracking-[0.2em] text-white/40">SCROLL · DATA — CLOUD — AI — CYBER — IOT</p>
          <ChevronDown size={18} className="animate-bounce text-[#38bdf8]" />
        </div>
      </section>

      {/* ============ LIVE DEPARTMENT (admin-driven) ============ */}
      <HomeLiveSections />

      {/* ============ SNAPSHOT — verified counters only (§6) ============ */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-5 lg:py-20" aria-label="Verified department snapshot">
        <SectionHeader eyebrow="Department snapshot" title="Facts, not folklore"
          lede="Every figure below is verified against the official department record. Counters animate on entry; anything unverified is marked as such — never invented." align="center" />
        <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {VERIFIED_SNAPSHOT.map(s => (
            <Reveal key={s.label}>
              <div className="glass card-lift card-sheen rounded-2xl p-5 text-center sm:p-6">
                <p className="font-display text-3xl sm:text-4xl">
                  {s.plain ? s.value : <AnimatedNumber value={s.value} suffix={s.suffix ?? ''} />}
                </p>
                <p className="mt-1.5 text-[13px] font-medium">{s.label}</p>
                <p className="mt-2 flex justify-center"><VerifiedBadge source={s.source} /></p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ WHY IT (§7) ============ */}
      <section className="relative overflow-hidden border-y hairline bg-[var(--bg-elev)]/60" aria-label="Why Information Technology">
        <AuroraBlobs />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-5 lg:py-20">
          <SectionHeader eyebrow="Why Information Technology" title="One degree, ten frontiers"
            lede="Select any technology to see what it means and where it leads. IT at DSCET spans software, cloud, security, intelligence and connectivity." />
          <div className="mt-8"><WhyIT /></div>
        </div>
      </section>

      {/* ============ IT CORE signature (§30) ============ */}
      <section className="grain relative overflow-hidden border-b hairline bg-[#070d1d] text-white dark:bg-[#030610]" aria-label="IT CORE signature visual">
        <div aria-hidden className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(760px 420px at 50% 45%, rgba(56,189,248,.12), transparent 65%)' }} />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-5 lg:grid-cols-2 lg:py-20">
          <Reveal><ITCore /></Reveal>
          <Reveal delay={0.08}>
            <p className="eyebrow text-[#38bdf8]">The signature</p>
            <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">One core.<br />Eight directions.</h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/65">
              The IT CORE is this department's visual identity — a central node for the department,
              ringed by AI, cloud, data, cyber, IoT, software, networks and research, joined by living data lines.
              It appears across the site wherever the department speaks officially.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/research" className="btn-glow inline-flex items-center gap-2 rounded-full bg-[#38bdf8] px-6 py-3 text-sm font-bold text-[#04070e]">Enter Research <ArrowUpRight size={15} aria-hidden /></Link>
              <Link to="/labs" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold hover:bg-white/10"><FlaskConical size={15} aria-hidden /> Tour the Labs</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ VISION band ============ */}
      <section className="relative overflow-hidden" aria-label="Department vision">
        <AuroraBlobs />
        <div className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-5 lg:py-20">
          <Reveal>
            <span aria-hidden className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#4f46e5] text-white shadow-lg"><Quote size={22} /></span>
            <blockquote className="font-display mt-6 text-2xl leading-snug sm:text-[2rem]">
              “{DEPARTMENT.vision}”
            </blockquote>
            <p className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-[var(--muted)]">
              — Department Vision <VerifiedBadge /> <Link to="/about" className="font-semibold text-[var(--gold)]">Vision, mission & PEOs <ArrowRight size={13} className="inline" aria-hidden /></Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ HIGHLIGHTS (verified) ============ */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-5 lg:py-20" aria-label="Verified highlights">
        <SectionHeader eyebrow="Highlights" title="What the official record confirms"
          action={<Link to="/about" className="inline-flex items-center gap-1.5 rounded-full border hairline px-5 py-2.5 text-sm font-semibold hover:border-[var(--gold)]">Full department profile <ArrowRight size={15} aria-hidden /></Link>} />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {HIGHLIGHTS.map((h, i) => {
            const Icon = H_ICONS[i % H_ICONS.length];
            return (
              <Reveal key={h.n} delay={i * 0.05}>
                <SpotlightCard className="h-full rounded-2xl">
                  <article className="glass card-lift card-sheen h-full rounded-2xl p-6">
                    <span aria-hidden className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#4f46e5] text-white shadow-lg"><Icon size={19} /></span>
                    <p className="font-display mt-4 text-4xl text-[var(--gold)]">{h.n}</p>
                    <h3 className="font-display mt-2 text-xl">{h.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{h.desc}</p>
                    <p className="mt-3"><VerifiedBadge /></p>
                  </article>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ============ LABS preview ============ */}
      <section className="relative overflow-hidden border-y hairline bg-[#070d1d] text-white dark:bg-[#030610]" aria-label="Laboratories preview">
        <span aria-hidden className="aurora left-[-10%] top-[-20%] h-[380px] w-[380px] bg-[#0284c7]/20 aurora-a" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-5 lg:py-20">
          <SectionHeader eyebrow="IT Labs" title="Three verified laboratories"
            lede="System Software, Networks and Cyber Security — described exactly as the official record states." />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {LABS.map(l => (
              <Reveal key={l.id}>
                <article className="group card-lift h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <div className="relative overflow-hidden">
                    <img src={`https://picsum.photos/seed/dscet-${l.id}/640/360`} alt={`${l.name} — illustrative photo`} loading="lazy" width={640} height={360}
                      className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.05]" />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#04070e]/85 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 font-mono text-[11px] tracking-widest text-white backdrop-blur">{l.courses.length} COURSES · LAB</span>
                  </div>
                  <div className="p-6">
                    <p className="eyebrow text-[#38bdf8]"><VerifiedBadge /></p>
                    <h3 className="font-display mt-2 text-xl">{l.name}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-white/60">{l.desc}</p>
                    <p className="mt-3 font-mono text-[11px] text-white/45">{l.equipment.slice(0, 2).join(' · ')}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-6">
            <Link to="/labs" className="btn-glow inline-flex items-center gap-2 rounded-full bg-[#38bdf8] px-6 py-3 text-sm font-bold text-[#04070e]"><FlaskConical size={15} aria-hidden /> Open the lab directory</Link>
          </Reveal>
        </div>
      </section>

      {/* ============ RESEARCH preview ============ */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-5 lg:py-20" aria-label="Research preview">
        <SectionHeader eyebrow="Research & innovation" title="Published work, on the record"
          lede="Two published blockchain patents and eight verified journal papers — each card carries its full citation." align="center" />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: FileBadge, v: String(PATENTS.length), l: 'Published patents', to: '/research#patents' },
            { icon: BookOpen, v: String(PUBLICATIONS.length), l: 'Verified journal papers', to: '/research#publications' },
            { icon: Handshake, v: String(INDUSTRY_MOUS.length), l: 'Industry MoUs', to: '/research#industry' },
          ].map(c => (
            <Reveal key={c.l}>
              <SpotlightCard className="rounded-2xl">
                <Link to={c.to} className="glass card-lift card-sheen block rounded-2xl p-6 text-center">
                  <c.icon aria-hidden className="mx-auto text-[var(--gold)]" size={22} />
                  <p className="font-display mt-2 text-5xl">{c.v}</p>
                  <p className="mt-1 text-sm font-medium">{c.l}</p>
                  <p className="mt-2 flex justify-center"><VerifiedBadge /></p>
                </Link>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-6">
          <Link to="/research#patents" className="group glass card-sheen flex flex-col gap-2 rounded-2xl border-l-4 p-5 sm:flex-row sm:items-center sm:gap-5" style={{ borderLeftColor: 'var(--gold)' }}>
            <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#4f46e5] text-white"><FileBadge size={19} /></span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold">{featuredPatent.title}</span>
              <span className="mt-0.5 block text-[13px] text-[var(--muted)]">{featuredPatent.inventors.join(' · ')} · {featuredPatent.status}</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[var(--gold)]">Patent record <ArrowUpRight size={14} aria-hidden className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
          </Link>
        </Reveal>
      </section>

      {/* ============ EVENTS + NEWS (honest pending) ============ */}
      <section className="border-y hairline bg-[var(--bg-elev)]/60" aria-label="Events and news">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-5 lg:grid-cols-2">
          <Reveal>
            <article className="glass card-sheen h-full rounded-3xl p-6 sm:p-8">
              <span aria-hidden className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#4f46e5] text-white"><CalendarDays size={19} /></span>
              <p className="eyebrow mt-4 text-[var(--gold)]">Activities</p>
              <h2 className="font-display mt-2 text-3xl">Events</h2>
              <div className="mt-4"><PendingNotice text={EVENTS_STATUS} /></div>
              <Link to="/events" className="mt-5 inline-flex items-center gap-1.5 rounded-full border hairline px-5 py-2.5 text-sm font-semibold hover:border-[var(--gold)]">Open events desk <ArrowRight size={14} aria-hidden /></Link>
            </article>
          </Reveal>
          <Reveal delay={0.06}>
            <article className="glass card-sheen h-full rounded-3xl p-6 sm:p-8">
              <span aria-hidden className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#4f46e5] text-white"><Bell size={19} /></span>
              <p className="eyebrow mt-4 text-[var(--gold)]">Official channel</p>
              <h2 className="font-display mt-2 text-3xl">News & notices</h2>
              <div className="mt-4"><PendingNotice text={NEWS_STATUS} /></div>
              <Link to="/events#news" className="mt-5 inline-flex items-center gap-1.5 rounded-full border hairline px-5 py-2.5 text-sm font-semibold hover:border-[var(--gold)]">Open news archive <ArrowRight size={14} aria-hidden /></Link>
            </article>
          </Reveal>
        </div>
      </section>

      {/* ============ PLACEMENTS (honest) + CTA ============ */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-5 lg:py-20" aria-label="Placements and admissions">
        <div className="glass card-sheen grid gap-8 rounded-3xl p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow text-[var(--gold)]">Careers</p>
            <h2 className="font-display mt-2 text-3xl sm:text-4xl">Placements, stated honestly.</h2>
            <p className="mt-3 max-w-xl text-[15px] text-[var(--muted)]">The official record notes good placement records since the program's inception and active industry collaboration. Verified statistics will be published here once the placement cell releases them — no percentages or packages are claimed until then.</p>
            <div className="mt-4"><PendingNotice text="Placement statistics will be updated." /></div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/placements" className="inline-flex items-center gap-1.5 rounded-full bg-[#070d1d] px-5 py-2.5 text-sm font-semibold text-white dark:bg-[#38bdf8] dark:text-[#04070e]">Placement cell <ArrowRight size={15} aria-hidden /></Link>
              <Link to="/research#industry" className="inline-flex items-center gap-1.5 rounded-full border hairline px-5 py-2.5 text-sm font-semibold hover:border-[var(--gold)]">Industry Connect</Link>
            </div>
          </div>
          <div className="panel-gradient glow-accent rounded-3xl border border-white/10 p-6 text-white sm:p-8">
            <p className="eyebrow text-[#38bdf8]">Admissions · TNEA</p>
            <h3 className="font-display mt-2 text-2xl sm:text-3xl">Join B.Tech IT at DSCET.</h3>
            <ol className="mt-5 space-y-3">
              {[
                ['01', 'Check MPC / vocational eligibility'],
                ['02', 'Apply through TNEA counselling'],
                ['03', 'Merit-based seat allotment'],
              ].map(([n, t]) => (
                <li key={n} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                  <span aria-hidden className="font-mono text-[12px] font-bold text-[#38bdf8]">{n}</span> {t}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-white/65">Helpline: {SITE.admissionsPhone}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={SITE.officialProgramUrl} target="_blank" rel="noreferrer" className="btn-glow inline-flex items-center gap-1.5 rounded-full bg-[#38bdf8] px-5 py-2.5 text-sm font-bold text-[#04070e]">Official programme page <ArrowUpRight size={14} aria-hidden /></a>
              <Link to="/contact" className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold hover:bg-white/10">Enquire</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
