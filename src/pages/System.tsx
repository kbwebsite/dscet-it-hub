import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { UserRound, ShieldCheck, GraduationCap } from 'lucide-react';
import { FACULTY, PROGRAMS, RESEARCH_AREAS, PUBLICATIONS, PATENTS, LABS, EVENTS, NEWS, PROJECTS, DOCUMENTS, ALUMNI } from '../data';
import { PageHero } from '../components/layout';
import { EmptyState, Reveal } from '../components/ui';

/* ---------- Global search ---------- */
export function SearchPage() {
  const [params] = useSearchParams();
  const q = (params.get('q') ?? '').toLowerCase();
  const groups = useMemo(() => {
    if (!q) return [];
    return [
      { h: 'Faculty', items: FACULTY.filter(f => (f.name + f.specialization).toLowerCase().includes(q)).map(f => ({ t: f.name, s: `${f.role} · ${f.specialization}`, to: `/faculty/${f.id}` })) },
      { h: 'Programs', items: PROGRAMS.filter(p => (p.name + p.level).toLowerCase().includes(q)).map(p => ({ t: p.name, s: `${p.level} · ${p.duration}`, to: '/academics' })) },
      { h: 'Labs', items: LABS.filter(l => (l.name + l.desc).toLowerCase().includes(q)).map(l => ({ t: l.name, s: 'Laboratory · verified', to: '/labs' })) },
      { h: 'Research areas', items: RESEARCH_AREAS.filter(r => (r.name + r.desc).toLowerCase().includes(q)).map(r => ({ t: r.name, s: r.evidenced ? 'Evidenced area' : 'Area of interest', to: '/research' })) },
      { h: 'Publications', items: PUBLICATIONS.filter(p => (p.title + p.authors + p.journal).toLowerCase().includes(q)).map(p => ({ t: p.title, s: `${p.authors} · ${p.year}`, to: '/research#publications' })) },
      { h: 'Patents', items: PATENTS.filter(p => (p.title + p.area).toLowerCase().includes(q)).map(p => ({ t: p.title, s: `${p.area} · ${p.status}`, to: '/research#patents' })) },
      { h: 'Events & News', items: [...EVENTS, ...NEWS].filter(e => (e.title + e.desc).toLowerCase().includes(q)).map(e => ({ t: e.title, s: `${e.category} · ${e.date}`, to: '/events' })) },
      { h: 'Projects', items: PROJECTS.filter(p => (p.title + p.tech.join(' ')).toLowerCase().includes(q)).map(p => ({ t: p.title, s: `${p.category} · ${p.year}`, to: '/students#projects' })) },
      { h: 'Resources', items: DOCUMENTS.filter(d => (d.title + d.category).toLowerCase().includes(q)).map(d => ({ t: d.title, s: d.category, to: '/resources' })) },
      { h: 'Alumni', items: ALUMNI.filter(a => (a.name + a.role).toLowerCase().includes(q)).map(a => ({ t: a.name, s: a.role, to: '/alumni' })) },
    ].filter(g => g.items.length > 0);
  }, [q]);
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const hi = (t: string) => {
    if (!q) return t;
    const i = t.toLowerCase().indexOf(q);
    if (i < 0) return t;
    return <>{t.slice(0, i)}<mark className="rounded bg-[var(--gold)]/30 px-0.5">{t.slice(i, i + q.length)}</mark>{t.slice(i + q.length)}</>;
  };
  return (
    <>
      <PageHero eyebrow="Search" title={params.get('q') ? `Results for “${params.get('q')}”` : 'Search the department'}
        lede={total ? `${total} matches across faculty, programs, labs, research, publications, patents, events, projects, resources and alumni.` : 'Search across every public record on this site.'}
        trail={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-5" aria-label="Search results">
        {groups.length === 0 ? <EmptyState title={q ? `No results for “${params.get('q')}”` : 'Type a query to begin'} hint="Try 'blockchain', 'cyber security', 'TNEA', 'NBA' or 'Oracle'." /> : (
          <div className="space-y-8">
            {groups.map(g => (
              <Reveal key={g.h}>
                <h2 className="eyebrow text-[var(--gold)]">{g.h} · {g.items.length}</h2>
                <ul className="mt-3 divide-y divide-[var(--line)] overflow-hidden rounded-2xl border hairline">
                  {g.items.map((it, i) => (
                    <li key={i}><Link to={it.to} className="block px-5 py-3.5 transition hover:bg-black/[0.03] dark:hover:bg-white/5"><p className="font-medium">{hi(it.t)}</p><p className="text-[13px] text-[var(--muted)]">{it.s}</p></Link></li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

/* ---------- Auth architecture (mock) ---------- */
export function Login() {
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get('role') ?? 'student');
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || pw.length < 4) { setMsg('Enter your ID and a 4+ character password (demo).'); return; }
    setMsg(`Demo sign-in as ${role} — wire Keycloak / college SSO before launch. No credentials leave this page.`);
  };
  const panels: Record<string, string[]> = {
    student: ['Profile & timetable', 'Attendance & results', 'Notices & resources', 'Event registrations'],
    faculty: ['Profile & publications', 'Mentee roster', 'Event & document publishing', 'Research grants'],
    admin: ['Full content management', 'User roles & audit log', 'Site configuration', 'Analytics'],
  };
  return (
    <>
      <PageHero eyebrow="Portal" title="Sign in to your workspace."
        lede="Mock authentication that demonstrates the future auth boundary. Production will use the college SSO with role-based routes."
        trail={[{ label: 'Home', to: '/' }, { label: 'Login' }]} />
      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-12 sm:px-5 lg:grid-cols-[1fr_320px]">
        <Reveal>
          <form onSubmit={submit} className="glass rounded-3xl p-6 sm:p-8" aria-label="Portal sign in">
            <div className="flex gap-2" role="tablist" aria-label="Role">
              {[{ r: 'student', l: 'Student', Icon: GraduationCap }, { r: 'faculty', l: 'Faculty', Icon: UserRound }, { r: 'admin', l: 'Admin', Icon: ShieldCheck }].map(({ r, l, Icon }) => (
                <button key={r} type="button" role="tab" aria-selected={role === r} onClick={() => setRole(r)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium ${role === r ? 'bg-[#070d1d] text-white dark:bg-[#38bdf8] dark:text-[#070d1d]' : 'hairline'}`}>
                  <Icon size={14} aria-hidden />{l}
                </button>
              ))}
            </div>
            <label className="mt-5 block text-[13px] font-medium" htmlFor="login-id">Institutional ID</label>
            <input id="login-id" value={id} onChange={e => setId(e.target.value)} placeholder="e.g. CSE2024001" autoComplete="username"
              className="mt-1.5 w-full rounded-xl border hairline bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-[var(--gold)]" />
            <label className="mt-4 block text-[13px] font-medium" htmlFor="login-pw">Password</label>
            <input id="login-pw" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" autoComplete="current-password"
              className="mt-1.5 w-full rounded-xl border hairline bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-[var(--gold)]" />
            <button className="mt-5 w-full rounded-full bg-[#070d1d] py-3 text-sm font-bold text-white dark:bg-[#38bdf8] dark:text-[#070d1d]">Sign in (demo)</button>
            {msg && <p role="status" className="mt-3 text-sm text-[var(--muted)]">{msg}</p>}
            <p className="mt-3 text-[12px] text-[var(--muted)]">Architecture note: AuthContext + ProtectedRoute + role guards are stubbed in <code>src/auth.tsx</code>. Swap the mock submit for SSO/OIDC.</p>
          </form>
        </Reveal>
        <Reveal delay={0.06}>
          <aside className="glass h-fit rounded-3xl p-6" aria-label="What this role unlocks">
            <p className="eyebrow text-[var(--gold)]">{role} workspace</p>
            <ul className="mt-3 space-y-2 text-sm">{panels[role].map(p => <li key={p} className="rounded-xl border hairline px-3.5 py-2.5">{p}</li>)}</ul>
          </aside>
        </Reveal>
      </section>
    </>
  );
}

export function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-5">
      <p className="eyebrow text-[var(--gold)]">404</p>
      <h1 className="font-display mt-2 text-5xl">This corridor doesn't exist.</h1>
      <p className="mt-3 text-[var(--muted)]">The page moved or never existed. Try the sitemap below or head home.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/" className="rounded-full bg-[#070d1d] px-6 py-3 text-sm font-bold text-white dark:bg-[#38bdf8] dark:text-[#070d1d]">Go home</Link>
        <Link to="/search" className="rounded-full border hairline px-6 py-3 text-sm font-semibold">Search</Link>
      </div>
    </div>
  );
}
