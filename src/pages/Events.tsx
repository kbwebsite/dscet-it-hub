import { EVENT_CATEGORIES, EVENTS, EVENTS_STATUS } from '../data/events';
import { NEWS, NEWS_CATEGORIES, NEWS_STATUS } from '../data/news';
import { PageHero } from '../components/layout';
import { SectionHeader, FilterBar, EmptyState } from '../components/ui';
import { PendingNotice } from '../components/visuals';
import { EventCard, NewsCard } from '../components/cards';
import { AdminEventsBlock, AdminNewsBlock } from '../portal/public';
import { useMemo, useState } from 'react';

export default function Events() {
  const [q, setQ] = useState('');
  const [nq, setNq] = useState('');
  const evs = useMemo(() => EVENTS.filter(e => (e.title + e.desc).toLowerCase().includes(q.toLowerCase())), [q]);
  const news = useMemo(() => NEWS.filter(n => (n.title + n.desc).toLowerCase().includes(nq.toLowerCase())), [nq]);
  return (
    <>
      <PageHero eyebrow="Activities & notices" title="Events and news, truthfully."
        lede="Upcoming and past events with full cards and filters — populated only with verified records. Until then, honest pending states."
        trail={[{ label: 'Home', to: '/' }, { label: 'Activities' }]} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5" aria-label="Events">
        <SectionHeader eyebrow="Events" title="Upcoming & past" />
        <div className="mt-6"><AdminEventsBlock /></div>
        <div className="mt-6"><FilterBar query={q} setQuery={setQ} pills={EVENT_CATEGORIES} active="All" setActive={() => {}} placeholder="Search events…" /></div>
        {evs.length === 0 ? (
          <div className="mt-6"><EmptyState title="No events published yet" hint={EVENTS_STATUS} /></div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{evs.map(e => <EventCard key={e.id} e={e} />)}</div>
        )}
      </section>
      <section id="news" className="scroll-mt-24 border-t hairline bg-[var(--bg-elev)]/60" aria-label="News and notices">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-5">
          <SectionHeader eyebrow="Official channel" title="News, notices & circulars"
            lede="Featured news, latest updates, archive and search — live the moment the department publishes." />
          <div className="mt-6"><FilterBar query={nq} setQuery={setNq} pills={NEWS_CATEGORIES} active="All" setActive={() => {}} placeholder="Search notices…" /></div>
          <div className="mt-6"><AdminNewsBlock /></div>
          {news.length === 0 ? (
            <div className="mt-6"><EmptyState title="No announcements yet" hint={NEWS_STATUS} /></div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">{news.map(n => <NewsCard key={n.id} n={n} />)}</div>
          )}
          <div className="mt-4"><PendingNotice text="The 50+ student participations and NBA 2023 milestone are recorded under About and Achievements." /></div>
        </div>
      </section>
    </>
  );
}
