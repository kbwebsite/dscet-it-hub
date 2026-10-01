// Portal command-center shell — sidebar per role, notification bell, demo badge.
// Same visual identity as the public site; mobile-first with slide-over nav.
import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, UserRound, GraduationCap, ClipboardList, CalendarCheck, Clock4, FileText,
  PenLine, BookOpen, Send, Inbox, Award, Bell, CalendarDays, Radio, LogOut, Menu, X,
  Users, BarChart3, Megaphone, Video, ShieldCheck, Globe, FlaskConical, Briefcase,
} from 'lucide-react';
import { clsx } from 'clsx';
import { usePortal, Role } from './store';
import { DEMO_USERS } from './mockdb';
import { FocusTrap } from '../components/a11y';

interface NavItem { to: string; label: string; icon: React.ComponentType<{ size?: number | string; className?: string }> }

const NAVS: Record<Role, NavItem[]> = {
  student: [
    { to: '/portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/portal/profile', label: 'Profile', icon: UserRound },
    { to: '/portal/academics', label: 'My Academics', icon: GraduationCap },
    { to: '/portal/marks', label: 'My Marks', icon: ClipboardList },
    { to: '/portal/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/portal/timetable', label: 'Timetable', icon: Clock4 },
    { to: '/portal/exams', label: 'Examinations', icon: FileText },
    { to: '/portal/assignments', label: 'Assignments', icon: PenLine },
    { to: '/portal/resources', label: 'Resources', icon: BookOpen },
    { to: '/portal/leave', label: 'Leave', icon: Send },
    { to: '/portal/requests', label: 'Requests & OD', icon: Inbox },
    { to: '/portal/records', label: 'Records', icon: Award },
    { to: '/portal/careers', label: 'Careers', icon: Briefcase },
    { to: '/portal/notifications', label: 'Notifications', icon: Bell },
  ],
  faculty: [
    { to: '/portal/faculty', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/portal/faculty/students', label: 'Students', icon: Users },
    { to: '/portal/faculty/attendance', label: 'Mark Attendance', icon: CalendarCheck },
    { to: '/portal/faculty/marks', label: 'Enter Marks', icon: ClipboardList },
    { to: '/portal/faculty/assignments', label: 'Assignments', icon: PenLine },
    { to: '/portal/faculty/approvals', label: 'Approvals', icon: ShieldCheck },
    { to: '/portal/notifications', label: 'Notifications', icon: Bell },
  ],
  hod: [
    { to: '/portal/hod', label: 'Control Center', icon: BarChart3 },
    { to: '/portal/faculty/students', label: 'Directory', icon: Users },
    { to: '/portal/faculty/approvals', label: 'Approvals', icon: ShieldCheck },
    { to: '/portal/notifications', label: 'Notifications', icon: Bell },
  ],
  admin: [
    { to: '/portal/admin', label: 'Admin Console', icon: BarChart3 },
    { to: '/portal/notifications', label: 'Notifications', icon: Bell },
  ],
};

export function PortalShell() {
  const { session, logout, db } = usePortal();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  if (!session) return null;
  const items = NAVS[session.role];
  const unread = db.notifications.filter(n => !n.read && (n.audience === session.role || n.audience === 'all')).length;
  const me = DEMO_USERS[session.role];

  const links = (
    <nav aria-label="Portal" className="grid gap-1 p-3">
      {items.map(it => (
        <NavLink key={it.to} to={it.to} end={it.to.endsWith('dashboard') || it.to.endsWith('faculty') || it.to.endsWith('hod') || it.to.endsWith('admin')}
          onClick={() => setOpen(false)}
          className={({ isActive }) => clsx('flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition',
            isActive ? 'bg-[#070d1d] text-white dark:bg-[#38bdf8] dark:text-[#04070e]' : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-black/5 dark:hover:bg-white/10')}>
          <it.icon size={17} aria-hidden />
          {it.label}
          {it.label === 'Notifications' && unread > 0 && (
            <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">{unread}</span>
          )}
          {it.label === 'Approvals' && <PendingDot />}
        </NavLink>
      ))}
      <div className="mt-2 border-t hairline pt-2">
        <Link to="/calendar" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)] hover:bg-black/5 dark:hover:bg-white/10">
          <CalendarDays size={17} aria-hidden /> Calendar
        </Link>
        <Link to="/live" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)] hover:bg-black/5 dark:hover:bg-white/10">
          <Radio size={17} aria-hidden /> Live TV {db.live.active && <span className="ml-auto font-mono text-[10px] font-bold text-red-500">● LIVE</span>}
        </Link>
        <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)] hover:bg-black/5 dark:hover:bg-white/10">
          <Globe size={17} aria-hidden /> View website
        </Link>
      </div>
    </nav>
  );

  return (
    <div className="mx-auto flex min-h-[78vh] max-w-7xl gap-0 px-0 sm:px-5 sm:py-6">
      {/* desktop sidebar */}
      <aside className="sticky top-24 hidden h-fit w-64 shrink-0 overflow-hidden rounded-3xl border hairline bg-[var(--bg-elev)] lg:block" aria-label="Portal navigation">
        <div className="border-b hairline p-4">
          <p className="font-display font-bold">{me.name}</p>
          <p className="text-[12px] text-[var(--muted)]">{me.tagline}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest text-amber-600 dark:text-amber-300">
            <FlaskConical size={11} aria-hidden /> DEMO WORKSPACE · SAMPLE DATA
          </p>
        </div>
        {links}
        <div className="p-3 pt-0">
          <button onClick={() => { logout(); nav('/'); }} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10">
            <LogOut size={17} aria-hidden /> Sign out
          </button>
        </div>
      </aside>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Portal menu">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <FocusTrap onEscape={() => setOpen(false)} className="contents">
          <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-[var(--bg-elev)] shadow-2xl">
            <div className="flex items-center justify-between border-b hairline p-4">
              <div><p className="font-display font-bold">{me.name}</p><p className="text-[12px] text-[var(--muted)]">{me.tagline}</p></div>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-full border hairline"><X size={17} aria-hidden /></button>
            </div>
            {links}
            <div className="p-3 pt-0">
              <button onClick={() => { logout(); nav('/'); }} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10">
                <LogOut size={17} aria-hidden /> Sign out
              </button>
            </div>
          </div>
          </FocusTrap>
        </div>
      )}

      {/* content */}
      <div className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:pl-8 lg:pr-2">
        <div className="mb-5 flex items-center gap-3 lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open portal menu" className="grid h-10 w-10 place-items-center rounded-full border hairline">
            <Menu size={18} aria-hidden />
          </button>
          <div className="min-w-0">
            <p className="truncate font-display font-bold">{me.name}</p>
            <p className="truncate text-[12px] text-[var(--muted)]">{me.tagline}</p>
          </div>
          <Link to="/portal/notifications" aria-label={`Notifications, ${unread} unread`} className="relative ml-auto grid h-10 w-10 place-items-center rounded-full border hairline">
            <Bell size={17} aria-hidden />
            {unread > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{unread}</span>}
          </Link>
        </div>
        <Outlet />
        <p className="mt-8 flex flex-wrap items-center gap-2 text-[12px] text-[var(--muted)]">
          <Megaphone size={13} aria-hidden /> Demo workspace — all records are sample data for evaluation.
          <span className="inline-flex items-center gap-1"><Video size={13} aria-hidden /> Real deployment connects SSO + SIS backend.</span>
        </p>
      </div>
    </div>
  );
}

function PendingDot() {
  const { db } = usePortal();
  const n = db.requests.filter(r => r.status === 'PENDING').length + db.achievements.filter(a => a.status === 'PENDING').length;
  if (!n) return null;
  return <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-amber-500 px-1 text-[11px] font-bold text-white">{n}</span>;
}
