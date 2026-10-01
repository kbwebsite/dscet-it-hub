// Portal store — session, role permissions, mock-backend actions, audit trail.
// Realtime-ready: every mutation funnels through `commit()`, so a WebSocket /
// SSE / polling layer can later subscribe in one place. No over-engineering:
// polling hooks (useNow) drive countdowns and live-status transitions.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  DEMO_USERS, PortalDB, RequestItem, ReqStatus, Notification, NotifType,
  DeptEvent, NewsItem, LiveState, OnDemand, Assignment, LearnRes, Achievement,
  Project, Internship, Cert, Drive, loadDB, saveDB, resetDB, loadSession, saveSession, uid, nowISO,
} from './mockdb';
import type { Role } from './mockdb';
export type { Role };

/* ---------------- permissions ---------------- */
const PERMS: Record<Role, string[]> = {
  student: ['self:read', 'request:create', 'record:submit', 'assignment:submit'],
  faculty: ['self:read', 'students:read', 'attendance:mark', 'marks:enter', 'assignment:manage', 'resource:publish', 'request:decide', 'achievement:verify', 'notice:send'],
  hod: ['self:read', 'students:read', 'request:decide', 'achievement:verify', 'analytics:view', 'notice:send', 'event:manage'],
  admin: ['*'],
};
export function can(role: Role, perm: string) {
  const p = PERMS[role];
  return p.includes('*') || p.includes(perm);
}

/* ---------------- time utilities ---------------- */
export function useNow(stepMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), stepMs);
    return () => clearInterval(t);
  }, [stepMs]);
  return now;
}
export type EvStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED';
export function eventStatus(e: { startISO: string; endISO: string; live?: boolean }, now: number): EvStatus {
  if (e.live) return 'LIVE';
  const s = new Date(e.startISO).getTime(), en = new Date(e.endISO).getTime();
  if (Number.isNaN(s) || Number.isNaN(en)) return 'UPCOMING';
  if (now < s) return 'UPCOMING';
  if (now <= en) return 'LIVE';
  return 'COMPLETED';
}
export function countdownParts(targetMs: number, now: number) {
  const d = Math.max(0, targetMs - now);
  return {
    days: Math.floor(d / 864e5),
    hours: Math.floor(d / 36e5) % 24,
    mins: Math.floor(d / 6e4) % 60,
    secs: Math.floor(d / 1e3) % 60,
  };
}
export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
export function fmtDT(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
}
export function fmtD(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
export function timeAgo(iso: string) {
  const d = new Date(iso).getTime() - Date.now();
  const m = Math.round(Math.abs(d) / 6e4);
  if (Number.isNaN(m)) return '';
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

/* ---------------- context ---------------- */
interface Session { role: Role; userId: string; name: string }
interface PortalCtx {
  session: Session | null;
  db: PortalDB;
  loginAs: (role: Role) => void;
  logout: () => void;
  resetDemo: () => void;
  notify: (audience: Role | 'all', type: NotifType, title: string, body: string) => void;
  markRead: (id: string) => void;
  markAllRead: (audience: Role | 'all') => void;
  applyRequest: (r: Omit<RequestItem, 'id' | 'status' | 'submittedAt'>) => void;
  decideRequest: (id: string, ok: boolean, remarks: string, by: string) => void;
  submitAchievement: (a: Omit<Achievement, 'id' | 'status'>) => void;
  verifyAchievement: (id: string, ok: boolean, by: string) => void;
  addProject: (p: Omit<Project, 'id'>) => void;
  setProgress: (id: string, progress: number) => void;
  addInternship: (i: Omit<Internship, 'id'>) => void;
  addCert: (c: Omit<Cert, 'id' | 'verified'>) => void;
  verifyCert: (id: string, by: string) => void;
  addDrive: (d: Omit<Drive, 'id'>) => void;
  deleteDrive: (id: string, by: string) => void;
  submitAssignment: (id: string) => void;
  addAssignment: (a: Omit<Assignment, 'id' | 'status'>) => void;
  gradeAssignment: (id: string, grade: string) => void;
  addResource: (r: Omit<LearnRes, 'id'>) => void;
  markRoster: (regNo: string, present: boolean) => void;
  saveRoster: (by: string) => void;
  updateMark: (sem: number, code: string, label: string, score: number | null, by: string) => void;
  publishNews: (n: Omit<NewsItem, 'id' | 'timeISO'>) => void;
  deleteNews: (id: string, by: string) => void;
  addEvent: (e: Omit<DeptEvent, 'id'>) => void;
  deleteEvent: (id: string, by: string) => void;
  toggleEventLive: (id: string, by: string) => void;
  setLive: (patch: Partial<LiveState>, by: string) => void;
  addOnDemand: (o: Omit<OnDemand, 'id' | 'addedAt'>) => void;
}

const Ctx = createContext<PortalCtx | null>(null);
export const usePortal = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePortal must be used inside PortalProvider');
  return v;
};

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<PortalDB>(() => loadDB());
  const [session, setSession] = useState<Session | null>(() => {
    const s = loadSession();
    if (!s) return null;
    const u = DEMO_USERS[s.role];
    return u ? { ...s, name: u.name } : null;
  });

  const commit = useCallback((next: PortalDB) => {
    setDb(next);
    saveDB(next);
  }, []);

  const audit = useCallback((prev: PortalDB, actor: string, role: Role, action: string, detail: string) => ({
    ...prev,
    audit: [{ id: uid(), actor, role, action, detail, timeISO: nowISO() }, ...prev.audit].slice(0, 200),
  }), []);

  const notify = useCallback((audience: Role | 'all', type: NotifType, title: string, body: string) => {
    setDb(prev => {
      const next: PortalDB = {
        ...prev,
        notifications: [{ id: uid(), type, title, body, timeISO: nowISO(), read: false, audience }, ...prev.notifications].slice(0, 200),
      };
      saveDB(next);
      return next;
    });
  }, []);

  const value = useMemo<PortalCtx>(() => ({
    session, db,
    loginAs: (role: Role) => {
      const u = DEMO_USERS[role];
      saveSession({ role, userId: u.id });
      setSession({ role, userId: u.id, name: u.name });
    },
    logout: () => { saveSession(null); setSession(null); },
    resetDemo: () => setDb(resetDB()),
    notify,
    markRead: (id: string) => setDb(prev => {
      const next = { ...prev, notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n) };
      saveDB(next); return next;
    }),
    markAllRead: (audience: Role | 'all') => setDb(prev => {
      const next = {
        ...prev,
        notifications: prev.notifications.map(n =>
          (n.audience === audience || n.audience === 'all' || audience === 'all') ? { ...n, read: true } : n),
      };
      saveDB(next); return next;
    }),
    applyRequest: (r) => setDb(prev => {
      const item: RequestItem = { ...r, id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`, status: 'PENDING', submittedAt: nowISO() };
      let next: PortalDB = { ...prev, requests: [item, ...prev.requests] };
      next = audit(next, r.student, 'student', 'Request submitted', `${item.kind} · ${item.title} (${item.id})`);
      next = {
        ...next,
        notifications: [{ id: uid(), type: 'Leave' as NotifType, title: `New ${item.kind} request ${item.id}`, body: `${item.student} (${item.regNo}) — ${item.title}`, timeISO: nowISO(), read: false, audience: 'faculty' as Role }, ...next.notifications],
      };
      saveDB(next); return next;
    }),
    decideRequest: (id, ok, remarks, by) => setDb(prev => {
      const target = prev.requests.find(x => x.id === id);
      if (!target) return prev;
      let next: PortalDB = {
        ...prev,
        requests: prev.requests.map(x => x.id === id ? { ...x, status: ok ? 'APPROVED' as ReqStatus : 'REJECTED' as ReqStatus, approver: by, remarks } : x),
      };
      next = audit(next, by, 'faculty', `Request ${ok ? 'approved' : 'rejected'}`, `${id} — ${remarks || 'no remarks'}`);
      next = {
        ...next,
        notifications: [{ id: uid(), type: 'Leave', title: `${target.kind} request ${ok ? 'approved' : 'rejected'}`, body: `${id}: ${remarks || 'No remarks.'}`, timeISO: nowISO(), read: false, audience: 'student' }, ...next.notifications],
      };
      saveDB(next); return next;
    }),
    submitAchievement: (a) => setDb(prev => {
      let next: PortalDB = { ...prev, achievements: [{ ...a, id: uid(), status: 'PENDING' }, ...prev.achievements] };
      next = audit(next, a.student, 'student', 'Achievement submitted', a.title);
      saveDB(next); return next;
    }),
    verifyAchievement: (id, ok, by) => setDb(prev => {
      let next: PortalDB = { ...prev, achievements: prev.achievements.map(a => a.id === id ? { ...a, status: ok ? 'VERIFIED' as const : 'PENDING' as const } : a) };
      next = audit(next, by, 'faculty', `Achievement ${ok ? 'verified' : 'sent back'}`, id);
      saveDB(next); return next;
    }),
    addProject: (p) => setDb(prev => {
      const next = { ...prev, projects: [{ ...p, id: uid() }, ...prev.projects] };
      saveDB(next); return next;
    }),
    setProgress: (id, progress) => setDb(prev => {
      const next = { ...prev, projects: prev.projects.map(p => p.id === id ? { ...p, progress, stage: progress >= 100 ? 'COMPLETED' as const : p.stage === 'IDEA' && progress > 0 ? 'IN DEVELOPMENT' as const : p.stage } : p) };
      saveDB(next); return next;
    }),
    addInternship: (i) => setDb(prev => {
      const next = { ...prev, internships: [{ ...i, id: uid() }, ...prev.internships] };
      saveDB(next); return next;
    }),
    addCert: (c) => setDb(prev => {
      const next = { ...prev, certs: [{ ...c, id: uid(), verified: false }, ...prev.certs] };
      saveDB(next); return next;
    }),
    verifyCert: (id, by) => setDb(prev => {
      const next = audit({ ...prev, certs: prev.certs.map(c => c.id === id ? { ...c, verified: true } : c) }, by, 'faculty', 'Certification verified', id);
      saveDB(next); return next;
    }),
    addDrive: (d) => setDb(prev => {
      const next = audit({ ...prev, drives: [{ ...d, id: uid() }, ...prev.drives] }, 'Dept Admin', 'admin', 'Placement drive posted', `${d.company} — ${d.role}`);
      saveDB(next); return next;
    }),
    deleteDrive: (id, by) => setDb(prev => {
      const next = audit({ ...prev, drives: prev.drives.filter(d => d.id !== id) }, by, 'admin', 'Placement drive removed', id);
      saveDB(next); return next;
    }),
    submitAssignment: (id) => setDb(prev => {
      const next = { ...prev, assignments: prev.assignments.map(a => a.id === id ? { ...a, status: 'SUBMITTED' as const } : a) };
      saveDB(next); return next;
    }),
    addAssignment: (a) => setDb(prev => {
      const next = { ...prev, assignments: [{ ...a, id: uid(), status: 'NOT STARTED' as const }, ...prev.assignments] };
      saveDB(next); return next;
    }),
    gradeAssignment: (id, grade) => setDb(prev => {
      const next = { ...prev, assignments: prev.assignments.map(a => a.id === id ? { ...a, status: 'EVALUATED' as const, grade } : a) };
      saveDB(next); return next;
    }),
    addResource: (r) => setDb(prev => {
      const next = { ...prev, resources: [{ ...r, id: uid() }, ...prev.resources] };
      saveDB(next); return next;
    }),
    markRoster: (regNo, present) => setDb(prev => {
      const next = { ...prev, roster: { ...prev.roster, rows: prev.roster.rows.map(r => r.regNo === regNo ? { ...r, present } : r) } };
      saveDB(next); return next;
    }),
    saveRoster: (by) => setDb(prev => {
      const done = prev.roster.rows.filter(r => r.present !== null).length;
      const next = audit(prev, by, 'faculty', 'Attendance saved', `${prev.roster.date} — ${done}/${prev.roster.rows.length} marked`);
      saveDB(next); return next;
    }),
    updateMark: (sem, code, label, score, by) => setDb(prev => {
      const next: PortalDB = {
        ...prev,
        semesters: prev.semesters.map(s => s.sem !== sem ? s : {
          ...s,
          subjects: s.subjects.map(subj => subj.code !== code ? subj : {
            ...subj, internal: subj.internal.map(c => c.label === label ? { ...c, score } : c),
          }),
        }),
      };
      const saved = audit(next, by, 'faculty', 'Internal mark updated', `Sem ${sem} · ${code} · ${label} → ${score ?? '—'}`);
      saveDB(saved); return saved;
    }),
    publishNews: (n) => setDb(prev => {
      const item: NewsItem = { ...n, id: uid(), timeISO: nowISO() };
      let next: PortalDB = { ...prev, news: [item, ...prev.news] };
      next = audit(next, 'Dept Admin', 'admin', 'News published', item.title);
      next = { ...next, notifications: [{ id: uid(), type: 'Department', title: item.title, body: item.desc, timeISO: nowISO(), read: false, audience: 'all' }, ...next.notifications] };
      saveDB(next); return next;
    }),
    deleteNews: (id, by) => setDb(prev => {
      const next = audit({ ...prev, news: prev.news.filter(n => n.id !== id) }, by, 'admin', 'News removed', id);
      saveDB(next); return next;
    }),
    addEvent: (e) => setDb(prev => {
      const item: DeptEvent = { ...e, id: uid() };
      let next: PortalDB = { ...prev, events: [...prev.events, item].sort((a, b) => +new Date(a.startISO) - +new Date(b.startISO)) };
      next = audit(next, 'Dept Admin', 'admin', 'Event created', item.title);
      next = { ...next, notifications: [{ id: uid(), type: 'Events', title: `New event: ${item.title}`, body: `${fmtDT(item.startISO)} · ${item.venue}`, timeISO: nowISO(), read: false, audience: 'all' }, ...next.notifications] };
      saveDB(next); return next;
    }),
    deleteEvent: (id, by) => setDb(prev => {
      const next = audit({ ...prev, events: prev.events.filter(e => e.id !== id) }, by, 'admin', 'Event removed', id);
      saveDB(next); return next;
    }),
    toggleEventLive: (id, by) => setDb(prev => {
      const next = audit({
        ...prev,
        events: prev.events.map(e => e.id === id ? { ...e, live: !e.live } : e),
      }, by, 'admin', 'Event live toggled', id);
      saveDB(next); return next;
    }),
    setLive: (patch, by) => setDb(prev => {
      const next = audit({ ...prev, live: { ...prev.live, ...patch } }, by, 'admin', patch.active ? 'Live TV activated' : 'Live TV stopped', patch.title || '');
      saveDB(next); return next;
    }),
    addOnDemand: (o) => setDb(prev => {
      const next = { ...prev, onDemand: [{ ...o, id: uid(), addedAt: nowISO() }, ...prev.onDemand] };
      saveDB(next); return next;
    }),
  }), [session, db, commit, audit, notify]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/* ---------------- route guards ---------------- */
export function RequireRole({ allow, children }: { allow: Role[]; children: React.ReactNode }) {
  const { session } = usePortal();
  if (!session) return <Navigate to="/portal/login" replace />;
  if (!allow.includes(session.role)) return <Navigate to="/portal" replace />;
  return <>{children}</>;
}

export function PortalIndex() {
  const { session } = usePortal();
  if (!session) return <Navigate to="/portal/login" replace />;
  const dest = session.role === 'student' ? '/portal/dashboard'
    : session.role === 'faculty' ? '/portal/faculty'
    : session.role === 'hod' ? '/portal/hod' : '/portal/admin';
  return <Navigate to={dest} replace />;
}
