// Portal entry — role selection with one-click demo workspaces.
// Production swaps these cards for SSO (college identity provider).
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, Crown, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { usePortal } from './store';
import { DEMO_USERS, Role } from './mockdb';
import { Reveal } from '../components/ui';
import { PageHero } from '../components/layout';

const ROLES: { role: Role; icon: typeof GraduationCap; blurb: string; items: string[] }[] = [
  { role: 'student', icon: GraduationCap, blurb: 'Dashboard, marks, attendance, leave, timetable, exams & more.', items: ['Personal dashboard', 'CGPA · attendance · marks', 'Leave, OD & requests'] },
  { role: 'faculty', icon: Briefcase, blurb: 'Classes, attendance marking, marks entry, approvals.', items: ['Mark attendance', 'Enter internal marks', 'Approve leave & OD'] },
  { role: 'hod', icon: Crown, blurb: 'Department control center with analytics and alerts.', items: ['Dept. analytics & charts', 'Pending approvals', 'Low-attendance alerts'] },
  { role: 'admin', icon: ShieldCheck, blurb: 'Publish news, events, live TV; manage users & audit.', items: ['News & event publishing', 'Live TV control', 'Audit log'] },
];

export default function PortalLogin() {
  const { loginAs, session } = usePortal();
  const nav = useNavigate();
  const enter = (role: Role) => { loginAs(role); nav('/portal'); };

  return (
    <>
      <PageHero eyebrow="Department portal" title="Sign in to your workspace."
        lede="Role-based access for students, faculty, HOD and administrators. Demo workspaces use sample data — production will use college SSO."
        trail={[{ label: 'Home', to: '/' }, { label: 'Portal' }]} />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-5" aria-label="Choose a workspace">
        {session && (
          <div className="glass mb-6 flex flex-wrap items-center gap-3 rounded-2xl p-4">
            <p className="text-sm">Signed in as <strong>{session.name}</strong> ({session.role}).</p>
            <Link to="/portal" className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-[var(--gold)]">Open workspace <ArrowRight size={14} aria-hidden /></Link>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((r, i) => (
            <Reveal key={r.role} delay={i * 0.05}>
              <article className="glass card-lift card-sheen flex h-full flex-col rounded-3xl p-6">
                <span aria-hidden className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#4f46e5] text-white shadow-lg"><r.icon size={22} /></span>
                <h2 className="font-display mt-4 text-xl capitalize">{r.role === 'hod' ? 'HOD' : r.role} workspace</h2>
                <p className="mt-1 text-[13px] text-[var(--muted)]">{DEMO_USERS[r.role].name} · {DEMO_USERS[r.role].tagline}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{r.blurb}</p>
                <ul className="mt-3 space-y-1.5 text-[13px]">
                  {r.items.map(t => <li key={t} className="flex items-center gap-2"><span aria-hidden className="h-1 w-1 rounded-full bg-[var(--gold)]" />{t}</li>)}
                </ul>
                <button onClick={() => enter(r.role)} className="mt-5 w-full rounded-full bg-[#070d1d] py-2.5 text-sm font-bold text-white transition hover:opacity-90 dark:bg-[#38bdf8] dark:text-[#04070e]">
                  Enter demo {r.role === 'hod' ? 'HOD' : r.role} portal
                </button>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 flex items-start gap-2 text-[13px] text-[var(--muted)]">
          <Lock size={14} aria-hidden className="mt-0.5 shrink-0" />
          Privacy: demo accounts contain fictional sample records. Real deployment enforces SSO authentication,
          role-based authorization, session handling and audit logging before any student record is visible.
        </p>
      </section>
    </>
  );
}
