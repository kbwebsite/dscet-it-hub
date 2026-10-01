import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Cpu, Search, Menu, X, ChevronDown, UserRound, MapPin, Phone, Mail, ArrowUpRight, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';
import { NAV_GROUPS, NAV_LINKS, SITE } from '../lib';
import { ThemeToggle, SearchDialog, Breadcrumb } from './ui';

/* ---------- Navbar: clean grouped IA (§27) + command search (§28) ---------- */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [linksOpen, setLinksOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn(); window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => { setOpen(false); setExpanded(null); }, [loc.pathname]);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true); }
      else if (e.key === '/' && !typing) { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      {/* top utility strip */}
      <div className="hidden bg-[#070d1d] text-[12px] text-white/80 md:block dark:bg-black/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-1.5">
          <p className="truncate">{SITE.college} · Affiliated to {SITE.university} · Mamallapuram</p>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setLinksOpen(v => !v)} aria-expanded={linksOpen} aria-haspopup="true"
                className="inline-flex items-center gap-1 hover:text-white">Important Links <ChevronDown size={13} aria-hidden /></button>
              {linksOpen && (
                <div role="menu" className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-white/10 bg-[#0b1a33] shadow-xl">
                  {[['Official DSCET Website', 'https://dscet.ac.in/'], ['Official IT Dept. Page', SITE.officialDeptUrl], ['B.Tech IT Programme', SITE.officialProgramUrl], ['Academic Calendar', '/calendar'], ['Timetable', '/timetable'], ['Contact', '/contact']].map(([l, to]) => (
                    to.startsWith('http')
                      ? <a key={l} href={to} target="_blank" rel="noreferrer" role="menuitem" onClick={() => setLinksOpen(false)} className="flex items-center justify-between px-4 py-2.5 hover:bg-white/10">{l}<ExternalLink size={12} aria-hidden /></a>
                      : <Link key={l} to={to} role="menuitem" onClick={() => setLinksOpen(false)} className="flex items-center justify-between px-4 py-2.5 hover:bg-white/10">{l}<ExternalLink size={12} aria-hidden /></Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/login?role=student" className="hover:text-white">Student Login</Link>
            <Link to="/login?role=faculty" className="hover:text-white">Faculty Login</Link>
          </div>
        </div>
      </div>

      <header className={clsx('sticky top-0 z-[60] transition-all', scrolled ? 'glass shadow-[0_8px_30px_-12px_rgba(4,8,18,.5),0_1px_0_0_rgba(56,189,248,.22)]' : 'border-b hairline bg-[var(--bg)]/80 backdrop-blur')}>
        <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-3 px-4 sm:px-5">
          <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Department home">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#070d1d] text-[#38bdf8] dark:bg-[#38bdf8] dark:text-[#04070e]" aria-hidden>
              <Cpu size={22} />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[13px] font-bold tracking-tight sm:text-[15px]">{SITE.department} · {SITE.collegeShort}</span>
              <span className="block truncate text-[11px] text-[var(--muted)]">{SITE.college}</span>
            </span>
          </Link>
          {/* desktop grouped nav */}
          <nav aria-label="Primary" className="ml-auto hidden items-center gap-0.5 lg:flex">
            {NAV_GROUPS.map(g => (
              <div key={g.label} className="group relative">
                {g.children ? (
                  <>
                    <button aria-haspopup="true" className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-[13px] font-medium text-[var(--muted)] transition hover:text-[var(--ink)] hover:bg-black/5 dark:hover:bg-white/10">
                      {g.label} <ChevronDown size={12} aria-hidden className="transition group-hover:rotate-180" />
                    </button>
                    <div className="invisible absolute left-1/2 top-full w-72 -translate-x-1/2 translate-y-1 rounded-2xl border hairline bg-[var(--bg-elev)] p-2 opacity-0 shadow-2xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      <Link to={g.to} className="block rounded-xl px-3.5 py-2.5 text-[13px] font-bold hover:bg-black/5 dark:hover:bg-white/10">Overview →</Link>
                      {g.children.map(c => (
                        <Link key={c.to + c.label} to={c.to} className="block rounded-xl px-3.5 py-2.5 hover:bg-black/5 dark:hover:bg-white/10">
                          <span className="block text-[13px] font-semibold">{c.label}</span>
                          {c.desc && <span className="block text-[12px] text-[var(--muted)]">{c.desc}</span>}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <NavLink to={g.to} end={g.to === '/'}
                    className={({ isActive }) => clsx('rounded-full px-3 py-2 text-[13px] font-medium transition',
                      isActive ? 'bg-[#070d1d] text-white dark:bg-[#38bdf8] dark:text-[#04070e]' : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-black/5 dark:hover:bg-white/10')}>
                    {g.label}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 lg:ml-2">
            <button onClick={() => setSearchOpen(true)} aria-label="Search — press / or Ctrl+K"
              className="hidden h-9 items-center gap-2 rounded-full border hairline glass px-3.5 text-[13px] text-[var(--muted)] transition hover:scale-[1.02] sm:inline-flex">
              <Search size={15} aria-hidden /><span className="hidden md:inline">Search</span>
              <kbd className="hidden rounded border hairline px-1.5 font-mono text-[11px] lg:inline">/</kbd>
            </button>
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className="inline-flex h-9 w-9 items-center justify-center rounded-full border hairline glass sm:hidden">
              <Search size={16} aria-hidden />
            </button>
            <ThemeToggle />
            <Link to="/login" className="hidden items-center gap-1.5 rounded-full bg-[#070d1d] px-4 py-2 text-[13px] font-semibold text-white transition hover:opacity-90 md:inline-flex dark:bg-[#38bdf8] dark:text-[#04070e]">
              <UserRound size={14} aria-hidden /> Portal
            </Link>
            <button onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border hairline lg:hidden">
              {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
            </button>
          </div>
        </div>
        {/* mobile: grouped accordion, large touch targets */}
        {open && (
          <nav aria-label="Mobile" className="max-h-[72vh] overflow-y-auto border-t hairline bg-[var(--bg-elev)] px-4 py-3 lg:hidden">
            <div className="grid gap-1">
              {NAV_GROUPS.map(g => (
                <div key={g.label} className="overflow-hidden rounded-xl">
                  {g.children ? (
                    <>
                      <button onClick={() => setExpanded(e => e === g.label ? null : g.label)} aria-expanded={expanded === g.label}
                        className="flex w-full items-center justify-between px-3.5 py-3 text-[15px] font-semibold hover:bg-black/5 dark:hover:bg-white/10">
                        {g.label}<ChevronDown size={16} aria-hidden className={clsx('transition', expanded === g.label && 'rotate-180')} />
                      </button>
                      {expanded === g.label && (
                        <div className="pb-1 pl-2">
                          <Link to={g.to} className="block rounded-lg px-3.5 py-2.5 text-sm font-bold text-[var(--gold)]">Overview →</Link>
                          {g.children.map(c => (
                            <Link key={c.to + c.label} to={c.to} className="block rounded-lg px-3.5 py-2.5 text-sm text-[var(--muted)] hover:text-[var(--ink)]">{c.label}</Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <NavLink to={g.to} end={g.to === '/'}
                      className={({ isActive }) => clsx('flex items-center justify-between px-3.5 py-3 text-[15px] font-semibold',
                        isActive && 'text-[var(--gold)]')}>
                      {g.label}<ArrowUpRight size={15} aria-hidden className="opacity-50" />
                    </NavLink>
                  )}
                </div>
              ))}
              <div className="mt-2 flex gap-2 md:hidden">
                <Link to="/login?role=student" className="flex-1 rounded-xl border hairline px-3 py-3 text-center text-sm font-medium">Student Login</Link>
                <Link to="/login?role=faculty" className="flex-1 rounded-xl border hairline px-3 py-3 text-center text-sm font-medium">Faculty Login</Link>
              </div>
            </div>
          </nav>
        )}
      </header>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} onGo={(q) => nav(`/search?q=${encodeURIComponent(q)}`)} />
    </>
  );
}

/* ---------- Page hero (DSCET IT reskin) ---------- */
export function PageHero({ eyebrow, title, lede, trail }: { eyebrow: string; title: string; lede?: string; trail: { label: string; to?: string }[] }) {
  return (
    <div className="grain relative overflow-hidden border-b hairline bg-[#070d1d] text-white dark:bg-[#030610]">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-60" />
      <span aria-hidden className="aurora right-[8%] top-[-45%] h-[320px] w-[320px] bg-[#0284c7]/25 aurora-a" />
      <div aria-hidden className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(900px 420px at 15% 0%, rgba(56,189,248,.16), transparent 60%), radial-gradient(800px 500px at 90% 100%, rgba(30,90,180,.28), transparent 60%)' }} />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-5 sm:py-16">
        <Breadcrumb trail={trail} />
        <p className="eyebrow mt-5 text-[#38bdf8]">{eyebrow}</p>
        <h1 className="font-display mt-3 max-w-3xl text-4xl leading-[1.02] [text-shadow:0_0_40px_rgba(56,189,248,0.25)] sm:text-5xl">{title}</h1>
        {lede && <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/70">{lede}</p>}
        <div aria-hidden className="mt-6 h-1 w-28 rounded-full bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-transparent" />
      </div>
    </div>
  );
}

/* ---------- Footer (DSCET) ---------- */
export function Footer() {
  const cols: { h: string; links: [string, string][] }[] = [
    { h: 'Department', links: [['Overview', '/about'], ['HOD', '/about#hod'], ['Milestones', '/about#milestones'], ['Contact', '/contact']] },
    { h: 'Academics', links: [['B.Tech IT', '/academics'], ['Timetable', '/timetable'], ['Calendar', '/calendar'], ['Resources', '/resources']] },
    { h: 'Research', links: [['Areas', '/research'], ['Publications', '/research#publications'], ['Patents', '/research#patents'], ['Industry Connect', '/research#industry']] },
    { h: 'Campus', links: [['Laboratories', '/labs'], ['Library', '/resources#library'], ['Events', '/events'], ['Gallery', '/gallery']] },
  ];
  return (
    <footer className="relative border-t hairline bg-[#070d1d] text-white dark:bg-black/60" aria-label="Footer">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-5 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#38bdf8] text-[#04070e]" aria-hidden><Cpu size={22} /></span>
            <div className="leading-tight">
              <p className="font-bold">{SITE.department} · {SITE.collegeShort}</p>
              <p className="text-[12px] text-white/60">{SITE.college}</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">The official digital headquarters of the IT department — programme, people, research and student life. Verified facts cite dscet.ac.in; everything else is honestly marked.</p>
          <div className="mt-5 space-y-2 text-sm text-white/75">
            <p className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0 text-[#38bdf8]" aria-hidden />{SITE.address} · {SITE.district}</p>
            <p className="flex items-center gap-2"><Phone size={15} className="shrink-0 text-[#38bdf8]" aria-hidden />{SITE.phone} · Admissions: {SITE.admissionsPhone}</p>
            <p className="flex items-center gap-2"><Mail size={15} className="shrink-0 text-[#38bdf8]" aria-hidden />{SITE.email}</p>
            <p className="pt-1"><a href={SITE.officialDeptUrl} target="_blank" rel="noreferrer" className="link-underline text-[#38bdf8]">Official department page on dscet.ac.in ↗</a></p>
          </div>
        </div>
        <nav className="grid grid-cols-2 gap-8 sm:grid-cols-4" aria-label="Footer">
          {cols.map(c => (
            <div key={c.h}>
              <p className="eyebrow text-[#38bdf8]">{c.h}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {c.links.map(([l, to]) => <li key={l}><Link to={to} className="text-white/70 hover:text-white link-underline">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-[12px] text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p>© {new Date().getFullYear()} {SITE.department}, {SITE.college}. All rights reserved. · <Link to="/resources" className="underline">Privacy</Link> · <Link to="/resources" className="underline">Terms</Link> · <Link to="/resources" className="underline">Accessibility</Link></p>
          <p className="font-mono tracking-wide">CONNECT · COMPUTE · CREATE — {SITE.shortName}</p>
        </div>
      </div>
    </footer>
  );
}

// Re-export flat links for any legacy consumers
export { NAV_LINKS };
