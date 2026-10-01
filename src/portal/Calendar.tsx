// Department calendar — month grid, category filters, click-for-details.
// Public mode shows admin events only; portal mode adds exam schedules.
import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { usePortal, fmtDT } from './store';
import { SectionHead, StatusBadge, EmptyMini } from './widgets';
import { PageHero } from '../components/layout';
import { Reveal } from '../components/ui';
import { FocusTrap } from '../components/a11y';

type Cat = 'ALL' | 'ACADEMIC' | 'EVENT' | 'EXAM' | 'STUDENT' | 'FACULTY';
const CATS: Cat[] = ['ALL', 'ACADEMIC', 'EVENT', 'EXAM', 'STUDENT', 'FACULTY'];

interface CalItem { id: string; title: string; cat: Exclude<Cat, 'ALL'>; startISO: string; endISO: string; venue: string; desc: string }

function catForEventType(t: string): Exclude<Cat, 'ALL'> {
  if (['Hackathon', 'Competition', 'Club Event', 'Student Activity', 'Technical Symposium', 'Paper Presentation'].includes(t)) return 'STUDENT';
  if (['FDP'].includes(t)) return 'FACULTY';
  if (['Guest Lecture', 'Conference'].includes(t)) return 'ACADEMIC';
  return 'EVENT';
}

export function DeptCalendar({ portal }: { portal?: boolean }) {
  const { db } = usePortal();
  const [cat, setCat] = useState<Cat>('ALL');
  const [cursor, setCursor] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [sel, setSel] = useState<CalItem | null>(null);

  const items: CalItem[] = useMemo(() => {
    const evs: CalItem[] = db.events.map(e => ({
      id: e.id, title: e.title, cat: catForEventType(e.type),
      startISO: e.startISO, endISO: e.endISO,
      venue: e.venue, desc: `${e.type} · ${e.organizer}${e.speaker ? ` · Speaker: ${e.speaker}` : ''} — ${e.desc}`,
    }));
    const exams: CalItem[] = portal ? db.exams.map(x => ({
      id: x.id, title: x.title, cat: 'EXAM' as const, startISO: x.date, endISO: x.date,
      venue: x.room, desc: `${x.kind} · ${x.time} — ${x.notes}`,
    })) : [];
    return [...evs, ...exams].filter(i => cat === 'ALL' || i.cat === cat);
  }, [db.events, db.exams, cat, portal]);

  const first = new Date(cursor.y, cursor.m, 1);
  const startPad = (first.getDay() + 6) % 7; // Monday-first
  const days = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(startPad).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const itemsOn = (d: number) => items.filter(i => {
    const dt = new Date(i.startISO);
    return !Number.isNaN(dt.getTime()) && dt.getFullYear() === cursor.y && dt.getMonth() === cursor.m && dt.getDate() === d;
  });
  const monthName = first.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <button onClick={() => setCursor(c => ({ y: c.m === 0 ? c.y - 1 : c.y, m: (c.m + 11) % 12 }))} aria-label="Previous month" className="grid h-9 w-9 place-items-center rounded-full border hairline"><ChevronLeft size={16} aria-hidden /></button>
          <p className="font-display min-w-40 text-center text-lg" aria-live="polite">{monthName}</p>
          <button onClick={() => setCursor(c => ({ y: c.m === 11 ? c.y + 1 : c.y, m: (c.m + 1) % 12 }))} aria-label="Next month" className="grid h-9 w-9 place-items-center rounded-full border hairline"><ChevronRight size={16} aria-hidden /></button>
        </div>
        <div className="ml-auto flex flex-wrap gap-1.5" role="tablist" aria-label="Calendar filter">
          {CATS.map(c => (
            <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
              className={`rounded-full border px-3 py-1 text-[12px] font-bold ${cat === c ? 'border-transparent bg-[#070d1d] text-white dark:bg-[#38bdf8] dark:text-[#04070e]' : 'hairline glass'}`}>{c}</button>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center font-mono text-[11px] text-[var(--muted)]" aria-hidden>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i}>{d}</span>)}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1" role="grid" aria-label={monthName}>
        {cells.map((d, i) => {
          if (d === null) return <span key={i} className="min-h-16 rounded-xl sm:min-h-20" />;
          const dayItems = itemsOn(d);
          const today = new Date().getFullYear() === cursor.y && new Date().getMonth() === cursor.m && new Date().getDate() === d;
          return (
            <div key={i} role="gridcell" aria-label={`${d} ${monthName}${dayItems.length ? `, ${dayItems.length} items` : ''}`}
              className={`min-h-16 rounded-xl border p-1 sm:min-h-20 sm:p-1.5 ${today ? 'border-[var(--gold)] bg-[var(--gold)]/10' : 'hairline'}`}>
              <span className={`font-mono text-[12px] ${today ? 'font-bold text-[var(--gold)]' : 'text-[var(--muted)]'}`}>{d}</span>
              <div className="mt-0.5 space-y-0.5">
                {dayItems.slice(0, 2).map(it => (
                  <button key={it.id} onClick={() => setSel(it)} className="block w-full truncate rounded-md bg-[#070d1d]/80 px-1 py-0.5 text-left text-[10px] text-white hover:bg-[#070d1d] dark:bg-[#38bdf8]/20 dark:text-white sm:text-[11px]">
                    {it.title}
                  </button>
                ))}
                {dayItems.length > 2 && <span className="block text-[10px] text-[var(--muted)]">+{dayItems.length - 2} more</span>}
              </div>
            </div>
          );
        })}
      </div>
      {items.length === 0 && <div className="mt-4"><EmptyMini title="Nothing scheduled in this view" hint="The department calendar fills up as events and exams are published." /></div>}

      {sel && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label={sel.title} onClick={() => setSel(null)}>
          <FocusTrap onEscape={() => setSel(null)} className="contents">
          <div className="glass w-full max-w-md rounded-3xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-2">
              <StatusBadge value={sel.cat} />
              <button onClick={() => setSel(null)} aria-label="Close details" className="ml-auto grid h-9 w-9 place-items-center rounded-full border hairline"><X size={16} aria-hidden /></button>
            </div>
            <h3 className="font-display mt-2 text-xl">{sel.title}</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">{fmtDT(sel.startISO)}{sel.endISO !== sel.startISO ? ` → ${fmtDT(sel.endISO)}` : ''}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{sel.venue}</p>
            <p className="mt-3 text-sm leading-relaxed">{sel.desc}</p>
          </div>
          </FocusTrap>
        </div>
      )}
    </div>
  );
}

export function CalendarPage() {
  return (
    <>
      <PageHero eyebrow="Department calendar" title="Classes, exams, events & deadlines."
        lede="Filter by category and open any item for details. Entries appear the moment the department publishes them."
        trail={[{ label: 'Home', to: '/' }, { label: 'Calendar' }]} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5" aria-label="Calendar">
        <Reveal><DeptCalendar /></Reveal>
      </section>
    </>
  );
}

export function PortalCalendar() {
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="Calendar" title="Department schedule" lede="Your exams overlaid on department events." />
      <div className="glass rounded-3xl p-4 sm:p-6"><DeptCalendar portal /></div>
    </div>
  );
}
