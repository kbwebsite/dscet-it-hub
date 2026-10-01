// DSCET IT LIVE — department live TV. YouTube embeds only, official streams
// only. Offline state is honest; on-demand holds prior recordings.
import { Link } from 'react-router-dom';
import { Radio, Play, CalendarDays } from 'lucide-react';
import { usePortal, fmtDT, eventStatus, useNow } from './store';
import { SectionHead, StatusBadge, EmptyMini, CountdownText } from './widgets';
import { PageHero } from '../components/layout';
import { Reveal } from '../components/ui';

export function ytEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.endsWith('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
      if (u.pathname.startsWith('/live/') || u.pathname.startsWith('/embed/')) {
        const id = u.pathname.split('/')[2];
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
    }
    return null;
  } catch { return null; }
}

export default function LiveTvPage() {
  const { db } = usePortal();
  const now = useNow(1000);
  const liveEvent = db.events.find(e => e.live) ?? db.events.find(e => eventStatus(e, now) === 'LIVE');
  const upcoming = db.events.filter(e => eventStatus(e, now) === 'UPCOMING').slice(0, 3);
  const embed = db.live.active ? ytEmbed(db.live.streamUrl) : null;

  return (
    <>
      <PageHero eyebrow="DSCET IT Live" title={db.live.active ? '🔴 On air now.' : 'Department Live TV.'}
        lede={db.live.active ? db.live.title : 'Live streams of seminars, guest lectures and workshops appear here when the department goes live.'}
        trail={[{ label: 'Home', to: '/' }, { label: 'Live TV' }]} />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-5" aria-label="Live player">
        {db.live.active ? (
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-red-500/40">
              <div className="flex items-center gap-2 bg-red-500/10 px-5 py-3">
                <StatusBadge value="LIVE" pulse />
                <p className="font-semibold">{db.live.title || 'Department live stream'}</p>
              </div>
              {embed ? (
                <div className="aspect-video bg-black">
                  <iframe src={embed} title={db.live.title || 'Department live stream'} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="h-full w-full" />
                </div>
              ) : (
                <div className="bg-[#070d1d] p-8 text-white">
                  <p>A stream is marked live, but no valid YouTube embed URL is configured.</p>
                  {db.live.streamUrl && <a href={db.live.streamUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[#38bdf8] underline">Open stream link →</a>}
                </div>
              )}
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <div className="glass rounded-3xl p-8 text-center sm:p-12">
              <span aria-hidden className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-black/5 dark:bg-white/10"><Radio size={26} className="text-[var(--muted)]" /></span>
              <h2 className="font-display mt-4 text-2xl sm:text-3xl">Department Live TV is currently offline.</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">Streams go live for seminars, guest lectures, workshops and conferences. Upcoming broadcasts are listed below.</p>
              {liveEvent && <p className="mt-4"><CountdownText targetISO={liveEvent.startISO} prefix="Next broadcast in" /></p>}
            </div>
          </Reveal>
        )}

        {upcoming.length > 0 && (
          <div className="mt-8">
            <SectionHead eyebrow="Schedule" title="Upcoming broadcasts & events" />
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {upcoming.map(e => (
                <Reveal key={e.id}>
                  <article className="glass card-lift h-full rounded-2xl p-5">
                    <p className="font-mono text-[12px] text-[var(--gold)]">{e.type} · {e.venue}</p>
                    <h3 className="mt-1 font-semibold">{e.title}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[var(--muted)]"><CalendarDays size={13} aria-hidden />{fmtDT(e.startISO)}</p>
                    <p className="mt-2"><CountdownText targetISO={e.startISO} /></p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <SectionHead eyebrow="On-demand" title="Previous recordings"
            lede="Lectures, events, workshops and seminars — replay anytime." />
          {db.onDemand.length === 0 ? (
            <div className="mt-4"><EmptyMini title="No recordings yet" hint="The department library of past sessions will grow here." /></div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {db.onDemand.map(o => (
                <Reveal key={o.id}>
                  <article className="glass card-lift group flex items-center gap-3 rounded-2xl p-4">
                    <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#4f46e5] text-white"><Play size={17} /></span>
                    <div className="min-w-0"><h3 className="truncate font-semibold">{o.title}</h3>
                      <p className="text-[12px] text-[var(--muted)]">{o.kind} · {o.duration}</p></div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
        <p className="mt-6 text-center text-[13px] text-[var(--muted)]">
          Looking for the event calendar? <Link to="/calendar" className="font-semibold text-[var(--gold)]">Open it →</Link>
        </p>
      </section>
    </>
  );
}
