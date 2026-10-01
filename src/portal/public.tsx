// Public live widgets — homepage LIVE NOW band, latest news and upcoming
// events with countdowns. All driven by admin-published data; honest empty
// states when nothing is scheduled. Nothing here is ever fabricated.
import { Link } from 'react-router-dom';
import { Radio, ArrowRight, CalendarDays, Megaphone } from 'lucide-react';
import { usePortal, eventStatus, useNow, fmtDT } from './store';
import { StatusBadge, CountdownText, CountdownBoxes, EmptyMini } from './widgets';
import { Reveal, SectionHeader } from '../components/ui';

export function HomeLiveSections() {
  const { db } = usePortal();
  const now = useNow(1000);
  const liveEvent = db.events.find(e => e.live) ?? db.events.find(e => eventStatus(e, now) === 'LIVE');
  const upcoming = db.events.filter(e => eventStatus(e, now) === 'UPCOMING').slice(0, 3);
  const news = [...db.news].sort((a, b) => +new Date(b.timeISO) - +new Date(a.timeISO)).slice(0, 3);

  return (
    <>
      {/* LIVE NOW band */}
      <section className="border-b hairline bg-[#070d1d] text-white dark:bg-[#030610]" aria-label="Live now">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-5 lg:flex-row lg:items-center">
          <p className="flex items-center gap-2 font-mono text-[12px] tracking-[0.22em] text-white/60">
            <span aria-hidden className={`inline-block h-2 w-2 rounded-full ${liveEvent || db.live.active ? 'bg-red-500 pulse-dot text-red-500' : 'bg-emerald-400'}`} />
            {liveEvent || db.live.active ? 'LIVE NOW' : 'DEPARTMENT STATUS · ACTIVE'}
          </p>
          {liveEvent || db.live.active ? (
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <StatusBadge value="LIVE" pulse />
              <p className="font-display text-lg sm:text-xl">{liveEvent ? liveEvent.title : db.live.title} <span className="text-sm font-normal text-white/55">· {liveEvent ? liveEvent.venue : 'Live TV'}</span></p>
              <span className="ml-auto flex gap-2">
                {liveEvent && <Link to="/events" className="rounded-full border border-white/25 px-4 py-2 text-[13px] font-semibold hover:bg-white/10">Event details</Link>}
                <Link to="/live" className="rounded-full bg-red-500 px-4 py-2 text-[13px] font-bold text-white hover:brightness-110">Watch live</Link>
              </span>
            </div>
          ) : (
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <p className="text-sm text-white/70">
                <span className="font-semibold text-white">No live sessions right now.</span>
                {upcoming[0] ? <> Next: <strong>{upcoming[0].title}</strong> · {fmtDT(upcoming[0].startISO)} · <CountdownText targetISO={upcoming[0].startISO} prefix="in" /></> : ' Schedules appear here once published.'}
              </p>
              <span className="ml-auto flex gap-2">
                <Link to="/live" className="rounded-full border border-white/25 px-4 py-2 text-[13px] font-semibold hover:bg-white/10">Live TV</Link>
                <Link to="/portal/login" className="rounded-full bg-[#38bdf8] px-4 py-2 text-[13px] font-bold text-[#04070e]">Open portal</Link>
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Latest news + upcoming events */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-5" aria-label="Live news and upcoming events">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Department live news" title="Latest updates"
              action={<Link to="/events#news" className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--gold)]">View all news <ArrowRight size={14} aria-hidden /></Link>} />
            {news.length === 0 ? (
              <div className="mt-6"><EmptyMini title="Newsroom is warming up" hint="Breaking department news, academic alerts and achievements will stream in here." /></div>
            ) : (
              <div className="mt-6 space-y-3">
                {news.map(n => (
                  <Reveal key={n.id}>
                    <article className="glass card-sheen rounded-2xl border-l-4 p-4" style={{ borderLeftColor: 'var(--gold)' }}>
                      <p className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-[var(--gold)]">
                        <Megaphone size={12} aria-hidden /> {n.category.toUpperCase()} · {fmtDT(n.timeISO)}
                        {n.featured && <span className="rounded-full bg-[var(--gold)]/15 px-2 py-0.5">FEATURED</span>}
                      </p>
                      <h3 className="mt-1.5 font-semibold leading-snug">{n.title}</h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">{n.desc}</p>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
          <div>
            <SectionHeader eyebrow="Don't miss it" title="Upcoming events"
              action={<Link to="/events" className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--gold)]">All events <ArrowRight size={14} aria-hidden /></Link>} />
            {upcoming.length === 0 ? (
              <div className="mt-6"><EmptyMini title="No events on the board yet" hint="Workshops, seminars, hackathons and drives with live countdowns appear here." /></div>
            ) : (
              <div className="mt-6 space-y-4">
                {upcoming.slice(0, 1).map(e => (
                  <Reveal key={e.id}>
                    <article className="panel-gradient glow-accent rounded-3xl border border-white/10 p-5 text-white sm:p-6">
                      <p className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-[#38bdf8]"><CalendarDays size={13} aria-hidden /> {e.type.toUpperCase()} · {e.venue}</p>
                      <h3 className="font-display mt-1.5 text-2xl">{e.title}</h3>
                      <p className="mt-1 text-sm text-white/60">{fmtDT(e.startISO)}{e.speaker ? ` · ${e.speaker}` : ''}</p>
                      <div className="mt-4"><CountdownBoxes targetISO={e.startISO} /></div>
                    </article>
                  </Reveal>
                ))}
                {upcoming.slice(1).map(e => (
                  <Reveal key={e.id}>
                    <article className="glass flex flex-wrap items-center gap-2 rounded-2xl p-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{e.title}</p>
                        <p className="text-[12px] text-[var(--muted)]">{fmtDT(e.startISO)} · {e.venue}</p>
                      </div>
                      <CountdownText targetISO={e.startISO} />
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

/** Live admin-driven events block for the public Events page. */
export function AdminEventsBlock() {
  const { db } = usePortal();
  const now = useNow(1000);
  if (db.events.length === 0) return null;
  const live = db.events.filter(e => eventStatus(e, now) === 'LIVE');
  const up = db.events.filter(e => eventStatus(e, now) === 'UPCOMING');
  const done = db.events.filter(e => eventStatus(e, now) === 'COMPLETED');
  return (
    <div className="space-y-6">
      {live.length > 0 && (
        <div>
          <h3 className="font-display flex items-center gap-2 text-xl"><span className="pulse-dot inline-block h-2 w-2 rounded-full bg-red-500 text-red-500" /> Happening now</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {live.map(e => (
              <article key={e.id} className="glass rounded-2xl border-red-500/40 p-5">
                <StatusBadge value="LIVE" pulse />
                <h4 className="font-display mt-2 text-lg">{e.title}</h4>
                <p className="text-[13px] text-[var(--muted)]">{e.venue}{e.speaker ? ` · ${e.speaker}` : ''}</p>
                <p className="mt-1.5 text-sm">{e.desc}</p>
                <Link to="/live" className="mt-3 inline-block rounded-full bg-red-500 px-4 py-2 text-[13px] font-bold text-white">Watch / details →</Link>
              </article>
            ))}
          </div>
        </div>
      )}
      {up.length > 0 && (
        <div>
          <h3 className="font-display text-xl">Scheduled by the department</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {up.map(e => (
              <article key={e.id} className="glass card-lift rounded-2xl p-5">
                <p className="font-mono text-[12px] text-[var(--gold)]">{e.type} · {e.venue}</p>
                <h4 className="mt-1 font-semibold leading-snug">{e.title}</h4>
                <p className="mt-1 text-[13px] text-[var(--muted)]">{fmtDT(e.startISO)}{e.speaker ? ` · ${e.speaker}` : ''}</p>
                <p className="mt-1.5 text-sm text-[var(--muted)]">{e.desc}</p>
                <p className="mt-2"><CountdownText targetISO={e.startISO} /></p>
              </article>
            ))}
          </div>
        </div>
      )}
      {done.length > 0 && (
        <details className="glass rounded-2xl p-4">
          <summary className="cursor-pointer font-semibold">Completed ({done.length})</summary>
          <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            {done.map(e => <li key={e.id}>{e.title} — {fmtDT(e.startISO)}</li>)}
          </ul>
        </details>
      )}
    </div>
  );
}

/** Latest admin news for the public news section. */
export function AdminNewsBlock() {
  const { db } = usePortal();
  if (db.news.length === 0) return null;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {db.news.map(n => (
        <article key={n.id} className="glass rounded-2xl border-l-4 p-4" style={{ borderLeftColor: 'var(--gold)' }}>
          <p className="font-mono text-[11px] tracking-widest text-[var(--gold)]">{n.category.toUpperCase()} · {fmtDT(n.timeISO)}</p>
          <h4 className="mt-1 font-semibold">{n.title}</h4>
          <p className="mt-0.5 text-sm text-[var(--muted)]">{n.desc}</p>
        </article>
      ))}
    </div>
  );
}
