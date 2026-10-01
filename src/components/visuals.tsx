import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Reveal } from './ui';
import { motion, useReducedMotion } from 'framer-motion';
import { BadgeCheck, Info, Cpu, Cloud, Database, ShieldCheck, Code2, Network, Wifi, Link2, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { PENDING_NOTICE } from '../lib';

/* ---------- Official-data mode (§38) ---------- */
export function VerifiedBadge({ source = 'dscet.ac.in', className }: { source?: string; className?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-300', className)}>
      <BadgeCheck size={12} aria-hidden /> Verified · {source}
    </span>
  );
}

export function PendingNotice({ text = PENDING_NOTICE, className }: { text?: string; className?: string }) {
  return (
    <p role="note" className={clsx('flex items-start gap-2 rounded-2xl border border-dashed hairline px-4 py-3 text-[13px] text-[var(--muted)]', className)}>
      <Info size={14} aria-hidden className="mt-0.5 shrink-0" /> {text}
    </p>
  );
}

/* ---------- HERO: cursor-reactive digital network (§5) ---------- */
const DOMAINS = ['DATA', 'CLOUD', 'AI', 'CYBER', 'SOFTWARE', 'NETWORKS', 'IOT', 'BLOCKCHAIN'];

export function NetworkHero({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = 0, h = 0, raf = 0, running = true;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
    const small = () => canvas.clientWidth < 640 || coarse;
    const mouse = { x: -9999, y: -9999 };

    interface P { x: number; y: number; vx: number; vy: number; anchor: string | null }
    let pts: P[] = [];
    const seed = () => {
      const n = small() ? 26 : 52;
      pts = Array.from({ length: n }, () => ({
        x: Math.random(), y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0007, vy: (Math.random() - 0.5) * 0.0007,
        anchor: null,
      }));
      DOMAINS.forEach((d, i) => {
        const a = (i / DOMAINS.length) * Math.PI * 2 + 0.4;
        pts.push({ x: 0.5 + Math.cos(a) * 0.36, y: 0.5 + Math.sin(a) * 0.34, vx: (Math.random() - 0.5) * 0.0003, vy: (Math.random() - 0.5) * 0.0003, anchor: d });
      });
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = canvas.width = Math.max(1, r.width * dpr);
      h = canvas.height = Math.max(1, r.height * dpr);
      seed();
    };
    resize();
    window.addEventListener('resize', resize);
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = (e.clientY - r.top) / r.height;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    if (!small()) { window.addEventListener('pointermove', onMove, { passive: true }); window.addEventListener('pointerleave', onLeave); }

    const draw = (staticFrame: boolean) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        if (!staticFrame) {
          // gentle cursor repulsion (desktop only)
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < 0.16 && d > 0.0001) { p.x += (dx / d) * 0.0016; p.y += (dy / d) * 0.0016; }
          p.x = (p.x + p.vx + 1) % 1; p.y = (p.y + p.vy + 1) % 1;
        }
        const px = p.x * w, py = p.y * h;
        if (p.anchor) {
          ctx.beginPath(); ctx.arc(px, py, 3 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56,189,248,0.95)'; ctx.fill();
          ctx.beginPath(); ctx.arc(px, py, 7 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56,189,248,0.14)'; ctx.fill();
          ctx.font = `${10 * dpr}px "JetBrains Mono", monospace`;
          ctx.fillStyle = 'rgba(180,215,245,0.85)';
          ctx.fillText(p.anchor, px + 10 * dpr, py + 3 * dpr);
        } else {
          ctx.beginPath(); ctx.arc(px, py, 1.3 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(125,180,230,0.5)'; ctx.fill();
        }
      }
      const linkDist = 0.13 * w;
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        const dx = (a.x - b.x) * w, dy = (a.y - b.y) * h;
        const d = Math.hypot(dx, dy);
        if (d < linkDist) {
          const strong = a.anchor || b.anchor;
          ctx.strokeStyle = `rgba(56,189,248,${((1 - d / linkDist) * (strong ? 0.4 : 0.13)).toFixed(3)})`;
          ctx.lineWidth = (strong ? 1.2 : 1) * dpr;
          ctx.beginPath(); ctx.moveTo(a.x * w, a.y * h); ctx.lineTo(b.x * w, b.y * h); ctx.stroke();
        }
      }
    };

    if (reduce) { draw(true); }
    else {
      const io = new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running) loop(); });
      io.observe(canvas);
      const loop = () => { if (!running) return; draw(false); raf = requestAnimationFrame(loop); };
      loop();
      return () => { running = false; cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerleave', onLeave); };
    }
    return () => { window.removeEventListener('resize', resize); window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerleave', onLeave); };
  }, [reduce]);

  return <canvas ref={ref} aria-hidden className={className} />;
}

/* ---------- Signature visual: IT CORE (§30) ---------- */
const CORE_NODES = [
  { icon: Cpu, label: 'AI' }, { icon: Cloud, label: 'CLOUD' },
  { icon: Database, label: 'DATA' }, { icon: ShieldCheck, label: 'CYBER' },
  { icon: Wifi, label: 'IOT' }, { icon: Code2, label: 'SOFTWARE' },
  { icon: Network, label: 'NETWORK' }, { icon: Link2, label: 'RESEARCH' },
];

export function ITCore({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const R = 132;
  const pos = CORE_NODES.map((_, i) => {
    const a = (i / CORE_NODES.length) * Math.PI * 2 - Math.PI / 2;
    return { x: 170 + Math.cos(a) * R, y: 170 + Math.sin(a) * R };
  });
  const orbit = reduce ? undefined : { rotate: 360, transition: { duration: 90, repeat: Infinity, ease: 'linear' as const } };
  return (
    <div role="img" aria-label="IT CORE — the department at the center of AI, cloud, data, cyber, IoT, software, network and research"
      className={clsx('relative mx-auto aspect-square w-full max-w-[420px]', className)}>
      <svg viewBox="0 0 340 340" className="absolute inset-0 h-full w-full" aria-hidden>
        <circle cx="170" cy="170" r="96" fill="none" stroke="rgba(56,189,248,0.18)" strokeDasharray="3 7" />
        <circle cx="170" cy="170" r="132" fill="none" stroke="rgba(56,189,248,0.12)" />
        {pos.map((p, i) => (
          <line key={i} x1="170" y1="170" x2={p.x} y2={p.y} stroke="rgba(56,189,248,0.4)" strokeWidth="1.2" strokeDasharray="4 5" className="dash-flow" />
        ))}
      </svg>
      <div aria-hidden className="ring-conic absolute left-1/2 top-1/2 h-[78%] w-[78%] rounded-full" />
      {/* center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <motion.div animate={reduce ? undefined : { boxShadow: ['0 0 24px rgba(56,189,248,.25)', '0 0 64px rgba(56,189,248,.45)', '0 0 24px rgba(56,189,248,.25)'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="glass glow-accent grid h-24 w-24 place-items-center rounded-3xl">
          <Cpu size={30} aria-hidden className="text-[var(--gold)]" />
        </motion.div>
        <p className="font-display mt-2 text-sm font-bold tracking-[0.2em]">IT CORE</p>
        <p className="font-mono text-[10px] text-[var(--muted)]">DSCET · EST. 2001</p>
      </div>
      {/* orbit nodes */}
      <motion.div animate={orbit} className="absolute inset-0" style={{ transformOrigin: '50% 50%' }}>
        {CORE_NODES.map((n, i) => (
          <div key={n.label} className="absolute" style={{ left: pos[i].x - 26, top: pos[i].y - 26 }}>
            <motion.div animate={orbit ? { rotate: -360, transition: { duration: 90, repeat: Infinity, ease: 'linear' } } : undefined}
              className="glass grid h-[52px] w-[52px] place-items-center rounded-2xl" title={n.label}>
              <n.icon size={18} aria-hidden className="text-[var(--gold)]" />
            </motion.div>
            <p className="mt-1 text-center font-mono text-[9px] tracking-widest text-[var(--muted)]">{n.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ---------- Why IT: interactive topics (§7) ---------- */
const WHY_IT = [
  { t: 'Software Engineering', d: 'Design, build and maintain the software systems that run businesses, governments and daily life — from apps to operating platforms.' },
  { t: 'Cloud Computing', d: 'Deploy scalable systems on modern cloud infrastructure; the backbone of startups and global enterprises alike.' },
  { t: 'Cybersecurity', d: 'Defend networks, applications and data. Ethical hacking and security analysis are among the fastest-growing IT careers.' },
  { t: 'Artificial Intelligence', d: 'Machine learning models that predict, recommend and automate — from healthcare to energy systems.' },
  { t: 'Data Analytics', d: 'Turn raw data into decisions with statistics, visualization and data engineering pipelines.' },
  { t: 'Networking', d: 'The protocols, routers and architectures that keep the world connected — wired, wireless and beyond.' },
  { t: 'Internet of Things', d: 'Sensors, embedded devices and automation connecting the physical and digital worlds.' },
  { t: 'Blockchain', d: 'Decentralized trust for storage, identity and computation — an active patent area in this department.' },
  { t: 'Automation', d: 'Streamline operations with scripting, DevOps and intelligent process automation.' },
  { t: 'Emerging Technologies', d: 'Edge computing, AR/VR, quantum-safe security — the department tracks what comes next.' },
];

export function WhyIT() {
  const [active, setActive] = useState(WHY_IT[0].t);
  const current = WHY_IT.find(w => w.t === active)!;
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Technology areas — select to learn more">
        {WHY_IT.map(w => (
          <button key={w.t} onClick={() => setActive(w.t)} aria-pressed={active === w.t}
            className={clsx('rounded-full border px-4 py-2.5 text-sm font-medium transition',
              active === w.t ? 'border-transparent bg-[#070d1d] text-white dark:bg-[#38bdf8] dark:text-[#04070e]' : 'hairline glass hover:border-[var(--gold)]')}>
            {w.t}
          </button>
        ))}
      </div>
      <div className="glass glow-accent h-fit rounded-3xl p-6 lg:sticky lg:top-24" aria-live="polite">
        <p className="eyebrow text-[var(--gold)]">Focus area</p>
        <h3 className="font-display mt-2 text-2xl">{current.t}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--muted)]">{current.d}</p>
      </div>
    </div>
  );
}

/* ---------- Industry Connect flow (§15) ---------- */
const FLOW = ['DEPARTMENT', 'INDUSTRY', 'STUDENT', 'PROJECT', 'INTERNSHIP', 'CAREER'];

export function IndustryFlow({ partners }: { partners: { name: string; desc: string }[] }) {
  return (
    <div>
      <ol className="flex flex-col gap-0" aria-label="Department to career pathway">
        {FLOW.map((s, i) => (
          <li key={s} className="relative flex gap-4 pb-5 last:pb-0">
            {i < FLOW.length - 1 && <span aria-hidden className="absolute left-[19px] top-10 h-[calc(100%-2.2rem)] w-px bg-gradient-to-b from-[var(--gold)] to-transparent" />}
            <span aria-hidden className={clsx('grid h-10 w-10 shrink-0 place-items-center rounded-full border font-mono text-[11px] font-bold',
              i === 0 ? 'border-transparent bg-[#070d1d] text-white dark:bg-[#38bdf8] dark:text-[#04070e]' : 'hairline glass text-[var(--gold)]')}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="pt-1.5">
              <p className="font-display text-lg font-semibold tracking-wide">{s}</p>
              {i === 1 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {partners.map(p => (
                    <span key={p.name} className="glass rounded-full px-3.5 py-1.5 text-[13px] font-medium">
                      {p.name} <VerifiedBadge source="MoU" className="ml-1" />
                    </span>
                  ))}
                </div>
              )}
              {i === 0 && <p className="mt-1 text-sm text-[var(--muted)]">Curriculum, laboratories and mentoring produce industry-ready engineers.</p>}
              {i === 4 && <p className="mt-1 text-sm text-[var(--muted)]">Internship records will be updated.</p>}
              {i === 5 && <p className="mt-1 text-sm text-[var(--muted)]">Placement statistics will be updated — no figures are claimed until the official report.</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- Seamless marquee ticker ---------- */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = [...items, ...items];
  return (
    <div className={clsx('marquee', className)} role="marquee" aria-label="Highlights ticker">
      <div className="marquee-track">
        {row.map((t, i) => (
          <span key={i} aria-hidden={i >= items.length}
            className="whitespace-nowrap py-2.5 pr-10 font-mono text-[12px] tracking-[0.22em] text-white/55">
            {t} <span aria-hidden className="pl-10 text-[#38bdf8]">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Mouse-tracked spotlight wrapper (fine-pointer only) ---------- */
export function SpotlightCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia?.('(pointer: coarse)').matches) return;
    const fn = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    el.addEventListener('pointermove', fn);
    return () => el.removeEventListener('pointermove', fn);
  }, []);
  return <div ref={ref} className={clsx('spotlight', className)}>{children}</div>;
}

/* ---------- Aurora background blobs ---------- */
export function AuroraBlobs({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className={clsx('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <span className={clsx('aurora left-[-8%] top-[-12%] h-[420px] w-[420px] bg-[#0284c7]/25 dark:bg-[#38bdf8]/15', !reduce && 'aurora-a')} />
      <span className={clsx('aurora bottom-[-18%] right-[-6%] h-[480px] w-[480px] bg-[#4f46e5]/20 dark:bg-[#4f46e5]/15', !reduce && 'aurora-b')} />
    </div>
  );
}

/* ---------- Shared gradient CTA band (page closers) ---------- */
export function CtaBand({ eyebrow, title, lede, primary, secondary }: {
  eyebrow: string;
  title: string;
  lede?: string;
  primary: { label: string; to: string };
  secondary?: { label: string; to: string };
}) {
  return (
    <Reveal>
      <div className="panel-gradient glow-accent relative overflow-hidden rounded-3xl border border-white/10 p-6 text-white sm:p-10">
        <span aria-hidden className="aurora aurora-a right-[-8%] top-[-50%] h-[300px] w-[300px] bg-[#38bdf8]/20" />
        <div className="relative">
          <p className="eyebrow text-[#38bdf8]">{eyebrow}</p>
          <h2 className="font-display mt-2 max-w-2xl text-3xl leading-tight sm:text-4xl">{title}</h2>
          {lede && <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/65">{lede}</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={primary.to} className="btn-glow inline-flex items-center gap-2 rounded-full bg-[#38bdf8] px-6 py-3 text-sm font-bold text-[#04070e]">
              {primary.label} <ArrowRight size={15} aria-hidden />
            </Link>
            {secondary && (
              <Link to={secondary.to} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                {secondary.label} <ArrowUpRight size={14} aria-hidden />
              </Link>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
