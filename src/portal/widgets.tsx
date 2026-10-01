// Shared portal primitives — status badges, SVG charts, countdowns, form styles.
// Same visual identity as the public site; no chart dependencies (pure SVG).
import React from 'react';
import { clsx } from 'clsx';
import { useNow, countdownParts } from './store';

export const inp = 'w-full rounded-xl border hairline bg-transparent px-3.5 py-2.5 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--gold)]';
export const btnPrimary = 'inline-flex items-center justify-center gap-1.5 rounded-full bg-[#070d1d] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-[#38bdf8] dark:text-[#04070e] disabled:opacity-50';
export const btnGhost = 'inline-flex items-center justify-center gap-1.5 rounded-full border hairline px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--gold)] disabled:opacity-50';

export function SectionHead({ eyebrow, title, lede, action }: { eyebrow: string; title: string; lede?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="max-w-2xl">
        <p className="eyebrow text-[var(--gold)]">{eyebrow}</p>
        <h2 className="font-display mt-1.5 text-2xl sm:text-3xl">{title}</h2>
        {lede && <p className="mt-1.5 text-sm text-[var(--muted)]">{lede}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon?: React.ReactNode }) {
  return (
    <div className="glass card-lift card-sheen rounded-2xl p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] text-[var(--muted)]">{label}</p>
        {icon}
      </div>
      <p className="font-display mt-1 text-3xl">{value}</p>
      {sub && <p className="mt-1 text-[12px] text-[var(--muted)]">{sub}</p>}
    </div>
  );
}

const BADGE: Record<string, string> = {
  PENDING: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
  APPROVED: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
  REJECTED: 'bg-red-500/15 text-red-500 dark:text-red-300',
  VERIFIED: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
  LIVE: 'bg-red-500/15 text-red-500 dark:text-red-300',
  UPCOMING: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
  COMPLETED: 'bg-black/5 text-[var(--muted)] dark:bg-white/10',
  PASS: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
  FAIL: 'bg-red-500/15 text-red-500 dark:text-red-300',
  SUBMITTED: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
  EVALUATED: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
  'NOT STARTED': 'bg-black/5 text-[var(--muted)] dark:bg-white/10',
  LATE: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
  ONGOING: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
  APPLIED: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
};
export function StatusBadge({ value, pulse }: { value: string; pulse?: boolean }) {
  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide', BADGE[value] ?? 'bg-black/5 text-[var(--muted)] dark:bg-white/10')}>
      {pulse && <span aria-hidden className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-current" />}
      {value}
    </span>
  );
}

export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-gradient-to-r from-[#0284c7] to-[#38bdf8]" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Donut({ value, label, size = 120 }: { value: number; label: string; size?: number }) {
  const r = 44, c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox="0 0 110 110" role="img" aria-label={`${label}: ${pct.toFixed(1)} percent`}>
        <title>{label}: {pct.toFixed(1)}%</title>
        <circle cx="55" cy="55" r={r} fill="none" strokeWidth="11" className="stroke-black/10 dark:stroke-white/10" />
        <circle cx="55" cy="55" r={r} fill="none" stroke="url(#donutg)" strokeWidth="11" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100} transform="rotate(-90 55 55)" />
        <defs><linearGradient id="donutg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0284c7" /><stop offset="100%" stopColor="#38bdf8" />
        </linearGradient></defs>
        <text x="55" y="52" textAnchor="middle" className="fill-[var(--ink)] font-display" fontSize="19" fontWeight="700">{pct.toFixed(1)}%</text>
        <text x="55" y="68" textAnchor="middle" fontSize="9" className="fill-[var(--muted)]">overall</text>
      </svg>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

export function Bars({ data, height = 120 }: { data: { label: string; value: number | null }[]; height?: number }) {
  const max = Math.max(10, ...data.map(d => d.value ?? 0));
  return (
    <div className="flex items-end gap-3" style={{ height }} role="img" aria-label={`Bar chart: ${data.map(d => `${d.label} ${d.value ?? 'pending'}`).join(', ')}`}>
      {data.map(d => (
        <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
          <span className="font-mono text-[11px] text-[var(--muted)]">{d.value === null ? '—' : d.value.toFixed(2)}</span>
          <div className={clsx('w-full rounded-t-lg', d.value === null ? 'bg-black/10 dark:bg-white/10' : 'bg-gradient-to-t from-[#0284c7] to-[#38bdf8]')}
            style={{ height: `${d.value === null ? 8 : Math.max(8, (d.value / max) * (height - 34))}px` }} />
          <span className="font-mono text-[10px] text-[var(--muted)]">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function CountdownText({ targetISO, prefix = 'Starts in' }: { targetISO: string; prefix?: string }) {
  const now = useNow(1000);
  const t = new Date(targetISO).getTime();
  if (Number.isNaN(t)) return <span className="text-[13px] text-[var(--muted)]">Date to be announced</span>;
  if (t <= now) return <span className="text-[13px] font-semibold text-red-500">● LIVE now</span>;
  const { days, hours, mins, secs } = countdownParts(t, now);
  const p = (n: number) => String(n).padStart(2, '0');
  return (
    <span className="font-mono text-[13px] font-semibold text-[var(--gold)]" aria-live="off">
      {prefix} {days > 0 ? `${days}d ` : ''}{p(hours)}:{p(mins)}:{p(secs)}
    </span>
  );
}

export function CountdownBoxes({ targetISO }: { targetISO: string }) {
  const now = useNow(1000);
  const t = new Date(targetISO).getTime();
  const { days, hours, mins, secs } = countdownParts(Number.isNaN(t) ? now : t, now);
  const cells: [string, number][] = [['DAYS', days], ['HOURS', hours], ['MINUTES', mins], ['SECONDS', secs]];
  return (
    <div className="grid grid-cols-4 gap-2" role="timer" aria-label="Event countdown">
      {cells.map(([l, v]) => (
        <div key={l} className="rounded-2xl border hairline bg-black/[0.03] px-2 py-3 text-center dark:bg-white/[0.04]">
          <p className="font-display text-2xl tabular-nums sm:text-3xl">{String(v).padStart(2, '0')}</p>
          <p className="mt-0.5 font-mono text-[10px] tracking-widest text-[var(--muted)]">{l}</p>
        </div>
      ))}
    </div>
  );
}

export function EmptyMini({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-dashed hairline px-5 py-8 text-center">
      <p className="font-medium">{title}</p>
      {hint && <p className="mt-1 text-[13px] text-[var(--muted)]">{hint}</p>}
    </div>
  );
}
