import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Search, X, Moon, Sun, ChevronRight, FileText, Inbox, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { FocusTrap } from './a11y';

/* ---------- Theme ---------- */
const ThemeCtx = createContext<{ dark: boolean; toggle: () => void }>({ dark: false, toggle: () => {} });
export const useTheme = () => useContext(ThemeCtx);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem('dscet-it-theme');
      if (saved) return saved === 'dark';
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    } catch { return false; }
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('dscet-it-theme', dark ? 'dark' : 'light'); } catch {}
  }, [dark]);
  const value = useMemo(() => ({ dark, toggle: () => setDark(d => !d) }), [dark]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function ThemeToggle({ className }: { className?: string }) {
  const { dark, toggle } = useTheme();
  return (
    <button onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={clsx('inline-flex h-9 w-9 items-center justify-center rounded-full border hairline glass transition hover:scale-105', className)}>
      {dark ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
    </button>
  );
}

/* ---------- Motion reveal ---------- */
export function Reveal({ children, delay = 0, className, y = 22 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-64px' }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.7, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}

/* ---------- Section header ---------- */
export function SectionHeader({ eyebrow, title, lede, align = 'left', action }: { eyebrow: string; title: string; lede?: string; align?: 'left' | 'center'; action?: React.ReactNode }) {
  return (
    <Reveal className={clsx('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      <p className="eyebrow text-[var(--gold)]">{eyebrow}</p>
      <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl lg:text-[2.9rem]">{title}</h2>
      {lede && <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">{lede}</p>}
      {action && <div className={clsx('mt-5', align === 'center' && 'flex justify-center')}>{action}</div>}
    </Reveal>
  );
}

/* ---------- Animated counter ---------- */
export function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) { setN(value); return; }
    let raf = 0; let start = 0;
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 1400);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.round(value * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      io.disconnect();
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); void start; };
  }, [value, reduce]);
  return <span ref={ref}>{n.toLocaleString('en-IN')}{suffix}</span>;
}

/* ---------- Breadcrumb ---------- */
export function Breadcrumb({ trail }: { trail: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13px] text-[var(--muted)]">
      {trail.map((t, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={13} aria-hidden />}
          {t.to ? <a href={t.to} className="link-underline hover:text-[var(--ink)]">{t.label}</a> : <span aria-current="page" className="text-[var(--ink)]">{t.label}</span>}
        </span>
      ))}
    </nav>
  );
}

/* ---------- Filter bar ---------- */
export function FilterBar({ query, setQuery, pills, active, setActive, placeholder = 'Search…' }: {
  query: string; setQuery: (v: string) => void; pills: string[]; active: string; setActive: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <label className="relative block w-full max-w-md">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" aria-hidden />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder={placeholder}
          className="w-full rounded-full border hairline bg-[var(--bg-elev)] py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--gold)]" />
      </label>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Category filter">
        {pills.map(p => (
          <button key={p} role="tab" aria-selected={active === p} onClick={() => setActive(p)}
            className={clsx('rounded-full border px-3.5 py-1.5 text-[13px] transition',
              active === p ? 'border-transparent bg-[#070d1d] text-white dark:bg-[#38bdf8] dark:text-[#070d1d]' : 'hairline glass hover:border-[var(--gold)]')}>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- States ---------- */
export function EmptyState({ title, hint, icon }: { title: string; hint?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed hairline px-6 py-14 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full glass">{icon ?? <Inbox size={18} aria-hidden />}</div>
      <p className="font-display text-lg">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-sm text-[var(--muted)]">{hint}</p>}
    </div>
  );
}
export function ErrorState({ title = 'Something went wrong', hint = 'Please retry. If this persists, write to the department office.' }: { title?: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border hairline px-6 py-12 text-center" role="alert">
      <AlertTriangle size={20} aria-hidden className="mb-2 text-[var(--gold)]" />
      <p className="font-display text-lg">{title}</p>
      <p className="mt-1 text-sm text-[var(--muted)]">{hint}</p>
    </div>
  );
}

/* ---------- Global search dialog ---------- */
export function SearchDialog({ open, onClose, onGo }: { open: boolean; onClose: () => void; onGo: (q: string) => void }) {
  const [q, setQ] = useState('');
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/50 p-4 pt-[12vh]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="presentation">
          <motion.div role="dialog" aria-modal="true" aria-label="Site search"
            initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl border hairline bg-[var(--bg-elev)] shadow-2xl">
            <FocusTrap onEscape={onClose} className="contents">
            <form className="flex items-center gap-2 border-b hairline px-4 py-3"
              onSubmit={e => { e.preventDefault(); onGo(q); onClose(); }}>
              <Search size={17} aria-hidden className="text-[var(--muted)]" />
              <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search faculty, programs, research, events…"
                aria-label="Search the department website" className="w-full bg-transparent text-[15px] outline-none placeholder:text-[var(--muted)]" />
              <button type="button" onClick={onClose} aria-label="Close search" className="rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/10"><X size={16} /></button>
            </form>
            <div className="flex flex-wrap gap-2 px-4 py-3 text-[13px] text-[var(--muted)]">
              <span>Try:</span>
              {['Blockchain', 'Cyber Security Lab', 'B.Tech IT', 'NBA', 'Oracle'].map(s => (
                <button key={s} onClick={() => { onGo(s); onClose(); }} className="rounded-full border hairline px-2.5 py-1 hover:border-[var(--gold)] hover:text-[var(--ink)]">{s}</button>
              ))}
            </div>
            </FocusTrap>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Subtle particle / constellation canvas ---------- */
export function ParticleField({ className, density = 60 }: { className?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let w = 0, h = 0, raf = 0;
    const pts = Array.from({ length: density }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * .0006, vy: (Math.random() - .5) * .0006 }));
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = canvas.width = r.width * devicePixelRatio;
      h = canvas.height = r.height * devicePixelRatio;
    };
    resize();
    window.addEventListener('resize', resize);
    const dark = () => document.documentElement.classList.contains('dark');
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      const col = dark() ? '56,189,248' : '2,132,199';
      pts.forEach(p => {
        p.x = (p.x + p.vx + 1) % 1; p.y = (p.y + p.vy + 1) % 1;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, 1.4 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},0.5)`;
        ctx.fill();
      });
      // faint links
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = (pts[i].x - pts[j].x) * w, dy = (pts[i].y - pts[j].y) * h;
        const d = Math.hypot(dx, dy);
        if (d < 120 * devicePixelRatio) {
          ctx.strokeStyle = `rgba(${col},${(1 - d / (120 * devicePixelRatio)) * 0.14})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(pts[i].x * w, pts[i].y * h); ctx.lineTo(pts[j].x * w, pts[j].y * h); ctx.stroke();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [density, reduce]);
  if (reduce) return null;
  return <canvas ref={ref} aria-hidden className={className} />;
}

/* ---------- Contact form ---------- */
export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', topic: 'Admissions', message: '' });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.message.trim().length < 10) next.message = 'Message should be at least 10 characters.';
    setErrs(next);
    if (Object.keys(next).length) { setStatus('error'); return; }
    setStatus('ok'); // mock submit — wire to backend / ticketing later
  };
  return (
    <form onSubmit={submit} noValidate className="glass rounded-3xl p-6 sm:p-8" aria-label="Contact the department">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-[13px] font-medium">Full name</label>
          <input id="cf-name" value={form.name} onChange={set('name')} autoComplete="name" placeholder="Your name"
            aria-invalid={!!errs.name} aria-describedby={errs.name ? 'cf-name-err' : undefined}
            className="w-full rounded-xl border hairline bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-[var(--gold)]" />
          {errs.name && <p id="cf-name-err" className="mt-1 text-xs text-red-500">{errs.name}</p>}
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1.5 block text-[13px] font-medium">Email</label>
          <input id="cf-email" type="email" value={form.email} onChange={set('email')} autoComplete="email" placeholder="you@example.com"
            aria-invalid={!!errs.email} aria-describedby={errs.email ? 'cf-email-err' : undefined}
            className="w-full rounded-xl border hairline bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-[var(--gold)]" />
          {errs.email && <p id="cf-email-err" className="mt-1 text-xs text-red-500">{errs.email}</p>}
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="cf-topic" className="mb-1.5 block text-[13px] font-medium">Topic</label>
        <select id="cf-topic" value={form.topic} onChange={set('topic')} className="w-full rounded-xl border hairline bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-[var(--gold)]">
          {['Admissions', 'Academics', 'Research collaboration', 'Placements', 'Alumni', 'Other'].map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="mt-4">
        <label htmlFor="cf-msg" className="mb-1.5 block text-[13px] font-medium">Message</label>
        <textarea id="cf-msg" rows={5} value={form.message} onChange={set('message')} placeholder="How can the department help?"
          aria-invalid={!!errs.message} aria-describedby={errs.message ? 'cf-msg-err' : undefined}
          className="w-full resize-y rounded-xl border hairline bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-[var(--gold)]" />
        {errs.message && <p id="cf-msg-err" className="mt-1 text-xs text-red-500">{errs.message}</p>}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="submit" className="rounded-full bg-[#070d1d] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-[#38bdf8] dark:text-[#070d1d]">Send message</button>
        {status === 'ok' && <p role="status" className="text-sm text-emerald-600">Thank you — your message has been recorded (demo). The office will respond by email.</p>}
        {status === 'error' && Object.keys(errs).length > 0 && <p role="alert" className="text-sm text-red-500">Please fix the highlighted fields.</p>}
      </div>
      <p className="mt-4 flex items-start gap-2 text-xs text-[var(--muted)]"><FileText size={13} className="mt-0.5 shrink-0" aria-hidden /> Demo form — no data leaves your browser. Connect to the college ticketing API before launch.</p>
    </form>
  );
}
