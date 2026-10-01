import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, FlaskConical, Download, CalendarDays, Trophy, Quote, Images, BadgeCheck } from 'lucide-react';
import type { Faculty } from '../data/faculty';
import type { Program } from '../data/programs';
import type { Patent } from '../data/patents';
import type { Publication } from '../data/publications';
import type { Lab } from '../data/labs';
import type { DeptEvent } from '../data/events';
import type { NewsItem } from '../data/news';
import type { Doc } from '../data/resources';
import type { Achievement } from '../data/achievements';
import { Reveal } from './ui';
import { VerifiedBadge } from './visuals';

const card = 'glass card-lift card-sheen rounded-2xl p-5 sm:p-6';

export function FacultyCard({ f }: { f: Faculty }) {
  const initials = f.name.split(' ').map(w => w[0]).slice(0, 2).join('');
  return (
    <Reveal>
      <article className={card}>
        <div className="flex items-start gap-4">
          <span aria-hidden className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#070d1d] to-[#16305c] font-display text-lg text-[#38bdf8] dark:from-[#38bdf8] dark:to-[#0369a1] dark:text-[#04070e]">{initials}</span>
          <div className="min-w-0">
            <p className="truncate font-semibold">{f.name}</p>
            <p className="text-[13px] text-[var(--gold)]">{f.designation}</p>
            <p className="mt-0.5 truncate text-[13px] text-[var(--muted)]">{f.specialization}</p>
          </div>
        </div>
        <p className="mt-4"><VerifiedBadge /></p>
      </article>
    </Reveal>
  );
}

export function ProgramCard({ p }: { p: Program }) {
  return (
    <Reveal>
      <article className={card}>
        <p className="eyebrow text-[var(--gold)]">{p.level} · <VerifiedBadge /></p>
        <h3 className="font-display mt-2 text-xl leading-snug">{p.name}</h3>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
          <div><dt className="text-[var(--muted)]">Duration</dt><dd className="font-medium">{p.duration}</dd></div>
          <div><dt className="text-[var(--muted)]">Intake</dt><dd className="font-medium">{p.intake}</dd></div>
        </dl>
        <Link to="/academics" className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold">Full curriculum, PO/PSO & eligibility <ArrowUpRight size={14} aria-hidden /></Link>
      </article>
    </Reveal>
  );
}

export function PatentCard({ pat }: { pat: Patent }) {
  return (
    <Reveal>
      <article className={card}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--gold)]/15 px-2.5 py-1 text-[11px] font-semibold text-[var(--gold)]">{pat.area}</span>
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-300">{pat.status}</span>
        </div>
        <h3 className="font-display mt-3 text-lg leading-snug">{pat.title}</h3>
        <p className="mt-2 text-[13px]"><span className="text-[var(--muted)]">Inventors:</span> {pat.inventors.join(' · ')}</p>
        <p className="text-[13px]"><span className="text-[var(--muted)]">Faculty:</span> {pat.faculty}</p>
        <p className="mt-2"><VerifiedBadge /></p>
      </article>
    </Reveal>
  );
}

export function PublicationCard({ pub }: { pub: Publication }) {
  return (
    <Reveal>
      <article className={card}>
        <div className="flex flex-wrap items-center gap-2 text-[12px]">
          <span className="rounded-full border hairline px-2.5 py-1 text-[var(--muted)]">{pub.scope} · {pub.year}</span>
          <VerifiedBadge />
        </div>
        <h3 className="mt-2.5 font-semibold leading-snug">{pub.title}</h3>
        <p className="mt-1.5 text-[13px] text-[var(--muted)]">{pub.journal}</p>
        <p className="mt-1 font-mono text-[12px] text-[var(--muted)]">{pub.volume}</p>
        <p className="mt-1 text-[13px]"><span className="text-[var(--muted)]">Authors:</span> {pub.authors}</p>
        {pub.doi ? <a href={pub.doi} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium text-[var(--gold)]">DOI <ArrowUpRight size={13} aria-hidden /></a>
          : <p className="mt-2 text-[12px] text-[var(--muted)]">DOI/link: not officially listed — omitted, not invented.</p>}
      </article>
    </Reveal>
  );
}

export function LabCard({ lab }: { lab: Lab }) {
  return (
    <Reveal>
      <article className={card}>
        <p className="inline-flex flex-wrap items-center gap-1.5 text-[13px] font-medium text-[var(--gold)]">
          <FlaskConical size={14} aria-hidden />{lab.courses.length} courses supported · <VerifiedBadge />
        </p>
        <h3 className="font-display mt-2 text-xl">{lab.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">{lab.desc}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {lab.courses.slice(0, 3).map(c => <span key={c} className="rounded-full border hairline px-2.5 py-1 text-[11px]">{c}</span>)}
        </div>
        <Link to="/labs" className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium">Objectives, equipment & software <ArrowUpRight size={14} aria-hidden /></Link>
      </article>
    </Reveal>
  );
}

export function EventCard({ e }: { e: DeptEvent }) {
  return (
    <Reveal>
      <article className={card}>
        <div className="flex flex-wrap items-center gap-2 text-[12px]">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#070d1d] px-2.5 py-1 text-white dark:bg-[#38bdf8] dark:text-[#04070e]"><CalendarDays size={11} aria-hidden />{e.date}{e.time ? ` · ${e.time}` : ''}</span>
          <span className="rounded-full border hairline px-2.5 py-1 text-[var(--muted)]">{e.category}</span>
          {e.verified && <VerifiedBadge />}
        </div>
        <h3 className="font-display mt-3 text-lg leading-snug">{e.title}</h3>
        {e.venue && <p className="mt-1 inline-flex items-center gap-1 text-[13px] text-[var(--muted)]"><MapPin size={12} aria-hidden />{e.venue}</p>}
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{e.desc}</p>
      </article>
    </Reveal>
  );
}

export function NewsCard({ n }: { n: NewsItem }) {
  return (
    <Reveal>
      <article className={`${card} border-l-4`} style={{ borderLeftColor: 'var(--gold)' }}>
        <div className="flex flex-wrap items-center gap-2 text-[12px] text-[var(--muted)]">
          <span className="font-semibold text-[var(--gold)]">{n.category}</span><span aria-hidden>·</span><time dateTime={n.date}>{n.date}</time>
          {n.verified && <VerifiedBadge />}
        </div>
        <h3 className="mt-2 font-semibold leading-snug">{n.title}</h3>
        <p className="mt-1.5 text-sm text-[var(--muted)]">{n.desc}</p>
      </article>
    </Reveal>
  );
}

export function DocCard({ d }: { d: Doc }) {
  const pending = !d.verified || d.href === '#';
  return (
    <Reveal>
      <article className={`${card} flex items-start gap-3`}>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#070d1d] font-mono text-[10px] font-bold text-[#38bdf8] dark:bg-[#38bdf8] dark:text-[#04070e]" aria-hidden>{d.kind}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">{d.category}</p>
          <h3 className="truncate font-semibold" title={d.title}>{d.title}</h3>
          <p className="text-[13px] text-[var(--muted)]">{d.meta}</p>
          {pending
            ? <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-[var(--muted)]"><Download size={13} aria-hidden />{d.meta}</p>
            : <a href={d.href} target={d.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--gold)]"><Download size={13} aria-hidden />Open official document</a>}
        </div>
      </article>
    </Reveal>
  );
}

export function AchievementTile({ a }: { a: Achievement }) {
  return (
    <Reveal>
      <article className={`${card} relative overflow-hidden`}>
        <Trophy size={64} aria-hidden className="pointer-events-none absolute -right-3 -top-3 opacity-[0.07]" />
        <p className="eyebrow text-[var(--gold)]">{a.group} · {a.year}</p>
        <h3 className="font-display mt-2 text-lg leading-snug">{a.title}</h3>
        <p className="mt-1.5 text-sm text-[var(--muted)]">{a.detail}</p>
        {a.verified && <p className="mt-2"><VerifiedBadge /></p>}
      </article>
    </Reveal>
  );
}

export function AlumniCard({ a }: { a: { name: string; batch: string; role: string; quote: string; path: string } }) {
  return (
    <Reveal>
      <figure className={card}>
        <Quote size={18} aria-hidden className="text-[var(--gold)]" />
        <blockquote className="font-display mt-3 text-lg leading-snug">“{a.quote}”</blockquote>
        <figcaption className="mt-4">
          <p className="font-semibold">{a.name}</p>
          <p className="text-[13px] text-[var(--muted)]">{a.role}</p>
          <p className="mt-1 font-mono text-[11px] text-[var(--muted)]">{a.batch} · {a.path}</p>
        </figcaption>
      </figure>
    </Reveal>
  );
}

export function GalleryTile({ g }: { g: { label: string; cat: string; seed: string } }) {
  return (
    <Reveal>
      <figure className="group relative overflow-hidden rounded-2xl border hairline">
        <img src={`https://picsum.photos/seed/${g.seed}/640/440`} alt={g.label} loading="lazy" width={640} height={440}
          className="aspect-[16/11] w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
        <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-3.5 pt-10 text-white">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium"><Images size={13} aria-hidden />{g.label}</span>
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] backdrop-blur">{g.cat}</span>
        </figcaption>
      </figure>
    </Reveal>
  );
}

export function SourceLine() {
  return (
    <p className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-[var(--muted)]">
      <BadgeCheck size={13} aria-hidden className="text-emerald-500" /> Source: dscet.ac.in/information-technology
    </p>
  );
}
