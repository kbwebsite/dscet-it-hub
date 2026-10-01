// Student core views — dashboard, profile, academics, marks, attendance.
// Students only ever see their own (demo) record: privacy by construction.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, CalendarCheck, ClipboardList, Bell, Clock4, ArrowRight, Printer, Download, Lock } from 'lucide-react';
import { usePortal, greeting, fmtDT, eventStatus } from './store';
import { DEMO_USERS } from './mockdb';
import { SectionHead, StatCard, StatusBadge, ProgressBar, Donut, Bars, CountdownText, EmptyMini, btnPrimary, btnGhost } from './widgets';
import { Reveal } from '../components/ui';

const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function StudentDashboard() {
  const { db, session } = usePortal();
  const me = DEMO_USERS.student;
  const cgpa = 8.63;
  const todayName = DAY[new Date().getDay()];
  const today = db.timetable.find(t => t.day === todayName);
  const toMin = (s: string) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  const cur = new Date().getHours() * 60 + new Date().getMinutes();
  const next = today?.periods.find(p => toMin(p.to) > cur);
  const nextIn = (() => {
    if (!next) return null;
    const m = toMin(next.from) - cur;
    if (m <= 0) return 'starting now';
    const h = Math.floor(m / 60);
    return `in ${h > 0 ? `${h}h ` : ''}${m % 60}m`;
  })();
  const pendingReqs = db.requests.filter(r => r.regNo === '2023IT042' && r.status === 'PENDING').length;
  const upcoming = db.events.filter(e => eventStatus(e, Date.now()) === 'UPCOMING').slice(0, 3);
  const notices = db.notifications.filter(n => !n.read && (n.audience === 'student' || n.audience === 'all')).slice(0, 3);
  const dueSoon = db.assignments.filter(a => a.status === 'NOT STARTED').length;

  return (
    <div className="space-y-6">
      <div className="panel-gradient glow-accent relative overflow-hidden rounded-3xl border border-white/10 p-6 text-white sm:p-8">
        <p className="eyebrow text-[#38bdf8]">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl">{greeting()}, {me.name.split(' ')[0]}.</h1>
        <p className="mt-1 text-sm text-white/65">II Year · A Section · Sem 4 · 2023IT042 — here is your day at a glance.</p>
        {next && nextIn ? (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
            <Clock4 size={15} aria-hidden className="text-[#38bdf8]" />
            Next: <strong>{next.subject}</strong> · {next.room} · {nextIn}
          </p>
        ) : (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
            <Clock4 size={15} aria-hidden className="text-[#38bdf8]" /> No more classes today — enjoy your evening.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="CGPA" value={cgpa.toFixed(2)} sub="Up to Sem 3" icon={<GraduationCap size={17} aria-hidden className="text-[var(--gold)]" />} />
        <StatCard label="Attendance" value={`${db.attendance.overall}%`} sub="Overall · Sem 4" icon={<CalendarCheck size={17} aria-hidden className="text-[var(--gold)]" />} />
        <StatCard label="Pending requests" value={String(pendingReqs)} sub="Leave · OD · certificates" icon={<ClipboardList size={17} aria-hidden className="text-[var(--gold)]" />} />
        <StatCard label="Due assignments" value={String(dueSoon)} sub="Not started" icon={<Bell size={17} aria-hidden className="text-[var(--gold)]" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">Today's classes{today ? ` — ${today.day}` : ''}</h2>
            <Link to="/portal/timetable" className="text-[13px] font-semibold text-[var(--gold)]">Full week →</Link>
          </div>
          {!today ? <div className="mt-3"><EmptyMini title="No classes scheduled today" hint="Weekend — labs reopen Monday." /></div> : (
            <ul className="mt-3 space-y-2">
              {today.periods.map(p => (
                <li key={p.slot} className="flex items-center gap-3 rounded-2xl border hairline px-4 py-2.5 text-sm">
                  <span className="font-mono text-[12px] text-[var(--muted)]">{p.from}–{p.to}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate font-medium">{p.subject}</span>
                    <span className="block text-[12px] text-[var(--muted)]">{p.faculty} · {p.room}</span></span>
                  <span className="rounded-full bg-black/5 px-2 py-0.5 font-mono text-[10px] dark:bg-white/10">{p.type}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="glass rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">Latest announcements</h2>
            <Link to="/portal/notifications" className="text-[13px] font-semibold text-[var(--gold)]">All →</Link>
          </div>
          {notices.length === 0 ? <div className="mt-3"><EmptyMini title="You're all caught up" /></div> : (
            <ul className="mt-3 space-y-2">
              {notices.map(n => (
                <li key={n.id} className="rounded-2xl border hairline px-4 py-2.5">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--muted)]">{n.type} · {fmtDT(n.timeISO)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="glass rounded-3xl p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg">Upcoming events</h2>
          <Link to="/events" className="text-[13px] font-semibold text-[var(--gold)]">Events desk →</Link>
        </div>
        {upcoming.length === 0 ? <div className="mt-3"><EmptyMini title="No upcoming events" hint="New workshops, seminars and drives appear here once published." /></div> : (
          <ul className="mt-3 grid gap-2 md:grid-cols-3">
            {upcoming.map(e => (
              <li key={e.id} className="rounded-2xl border hairline p-4">
                <p className="font-medium">{e.title}</p>
                <p className="mt-1 text-[12px] text-[var(--muted)]">{fmtDT(e.startISO)} · {e.venue}</p>
                <p className="mt-2"><CountdownText targetISO={e.startISO} /></p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="glass rounded-3xl p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg">Examinations</h2>
          <Link to="/portal/exams" className="text-[13px] font-semibold text-[var(--gold)]">Exam center →</Link>
        </div>
        <ul className="mt-3 grid gap-2 md:grid-cols-2">
          {db.exams.map(x => (
            <li key={x.id} className="rounded-2xl border hairline px-4 py-2.5 text-sm">
              <span className="font-medium">{x.title}</span>
              <span className="block text-[12px] text-[var(--muted)]">{x.kind} · {x.date} · {x.room}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-display text-lg">Quick actions</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ['Apply leave', '/portal/leave'], ['My marks', '/portal/marks'], ['Timetable', '/portal/timetable'], ['Assignments', '/portal/assignments'],
          ].map(([l, to]) => (
            <Link key={to + l} to={to} className="glass card-lift flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-semibold">
              {l} <ArrowRight size={15} aria-hidden className="text-[var(--gold)]" />
            </Link>
          ))}
        </div>
      </div>
      {session && <p className="hidden">{session.name}</p>}
    </div>
  );
}

export function StudentProfile() {
  const rows: [string, string][] = [
    ['Name', 'Arjun S'], ['Register number', '2023IT042'], ['Roll number', 'IT-22-042'],
    ['Department', 'Information Technology'], ['Year / Section / Semester', 'II / A / 4'],
    ['Batch / Admission year', '2023–2027 / 2023'], ['Date of birth', '14 Mar 2006'],
    ['Gender', 'Male'], ['Email', 'arjun.s.2023@[college].edu'], ['Phone', '+91 98XXX X2104 (masked in demo)'],
    ['Parent / Guardian', 'S. Kumar'], ['Parent contact', '+91 98XXX X7781 (masked in demo)'],
    ['Address', '12, Beach Road, Mamallapuram (sample)'], ['Blood group', 'O+ (sample)'],
  ];
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="Profile" title="Arjun S · 2023IT042" lede="Your official student record. Contact the department office to correct any detail." />
      <div className="glass rounded-3xl p-5 sm:p-7">
        <div className="flex items-center gap-4">
          <span aria-hidden className="font-display grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-[#0284c7] to-[#4f46e5] text-2xl text-white">AS</span>
          <div><p className="font-display text-xl">Arjun S</p><p className="text-sm text-[var(--muted)]">B.Tech IT · II Year A · Semester 4</p></div>
          <span className="ml-auto hidden rounded-full bg-emerald-500/15 px-3 py-1 text-[12px] font-bold text-emerald-600 sm:inline dark:text-emerald-300">ENROLLED</span>
        </div>
        <dl className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b hairline pb-2.5 text-sm">
              <dt className="text-[var(--muted)]">{k}</dt><dd className="text-right font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 flex items-start gap-2 text-[12px] text-[var(--muted)]">
          <Lock size={13} aria-hidden className="mt-0.5 shrink-0" />
          Privacy: only you (and authorized faculty/HOD/admin roles) can view this record. It is never published on public pages.
        </p>
      </div>
    </div>
  );
}

export function StudentAcademics() {
  const { db } = usePortal();
  const done = db.semesters.filter(s => s.sgpa !== null);
  const cgpa = done.reduce((a, s) => a + (s.sgpa ?? 0), 0) / Math.max(1, done.length);
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="My academics" title="Performance at a glance" lede="SGPA history, credits and semester cards. Full subject tables live under My Marks." />
      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <div className="glass rounded-3xl p-5 sm:p-6">
          <p className="eyebrow text-[var(--gold)]">Cumulative GPA</p>
          <p className="font-display mt-1 text-5xl">{cgpa.toFixed(2)}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Across {done.length} completed semesters</p>
          <div className="mt-4"><Donut value={(cgpa / 10) * 100} label="CGPA progress" /></div>
        </div>
        <div className="glass rounded-3xl p-5 sm:p-6">
          <p className="eyebrow text-[var(--gold)]">SGPA trend</p>
          <div className="mt-4"><Bars data={db.semesters.map(s => ({ label: `S${s.sem}`, value: s.sgpa }))} /></div>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {db.semesters.map(s => (
          <Reveal key={s.sem}>
            <div className="glass card-lift rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg">Semester {s.sem}</h3>
                <span className="font-display text-2xl">{s.sgpa === null ? '—' : s.sgpa.toFixed(2)}</span>
              </div>
              <p className="mt-1 text-[13px] text-[var(--muted)]">{s.subjects.length} subjects · {s.subjects.reduce((a, x) => a + x.credits, 0)} credits · {s.sgpa === null ? 'In progress' : `${s.subjects.filter(x => x.result === 'PASS').length} passed`}</p>
              <Link to="/portal/marks" className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--gold)]">Subject details <ArrowRight size={13} aria-hidden /></Link>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function StudentMarks() {
  const { db } = usePortal();
  const [sem, setSem] = useState<number>(4);
  const s = db.semesters.find(x => x.sem === sem) ?? db.semesters[0];
  const csv = () => {
    const rows = [['Semester', 'Code', 'Subject', 'Credits', 'IA1/20', 'IA2/20', 'Assign/10', 'Ext/100', 'Grade', 'GP', 'Result']];
    db.semesters.forEach(x => x.subjects.forEach(subj => rows.push([
      String(x.sem), subj.code, subj.name, String(subj.credits),
      str(subj.internal[0].score), str(subj.internal[1].score), str(subj.internal[2].score),
      str(subj.external.marks), subj.external.grade, str(subj.external.gp), subj.result,
    ])));
    const blob = new Blob([rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'marks-2023IT042.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const str = (v: number | null) => (v === null ? '—' : String(v));
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="My marks" title="Internal & semester results"
        lede="Semester filter, subject-wise breakup, CSV download and print. Only your record is ever visible here."
        action={<div className="flex gap-2">
          <button onClick={csv} className={btnGhost}><Download size={15} aria-hidden /> CSV</button>
          <button onClick={() => window.print()} className={btnPrimary}><Printer size={15} aria-hidden /> Print</button>
        </div>} />
      <div className="flex gap-2" role="tablist" aria-label="Semester filter">
        {db.semesters.map(x => (
          <button key={x.sem} role="tab" aria-selected={sem === x.sem} onClick={() => setSem(x.sem)}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${sem === x.sem ? 'border-transparent bg-[#070d1d] text-white dark:bg-[#38bdf8] dark:text-[#04070e]' : 'hairline glass'}`}>
            Sem {x.sem}
          </button>
        ))}
      </div>
      <div className="glass overflow-x-auto rounded-3xl">
        <table className="w-full min-w-[760px] text-left text-sm">
          <caption className="sr-only">Marks for semester {s.sem}</caption>
          <thead><tr className="border-b hairline text-[12px] uppercase tracking-wider text-[var(--muted)]">
            {['Subject', 'IA-1 /20', 'IA-2 /20', 'Assign /10', 'Ext /100', 'Grade', 'GP', 'Result'].map(h => <th key={h} scope="col" className="px-4 py-3">{h}</th>)}
          </tr></thead>
          <tbody>
            {s.subjects.map(subj => (
              <tr key={subj.code} className="border-b hairline last:border-0">
                <th scope="row" className="px-4 py-3"><span className="block font-semibold">{subj.code}</span><span className="block text-[12px] font-normal text-[var(--muted)]">{subj.name} · {subj.credits} cr</span></th>
                {subj.internal.map(c => <td key={c.label} className="px-4 py-3 tabular-nums">{str(c.score)}</td>)}
                <td className="px-4 py-3 tabular-nums">{str(subj.external.marks)}</td>
                <td className="px-4 py-3 font-semibold">{subj.external.grade}</td>
                <td className="px-4 py-3 tabular-nums">{str(subj.external.gp)}</td>
                <td className="px-4 py-3"><StatusBadge value={subj.result === '—' ? 'UPCOMING' : subj.result} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-[var(--muted)]">SGPA Sem {s.sem}: <strong>{s.sgpa === null ? 'in progress' : s.sgpa.toFixed(2)}</strong> · Internal entries are updated by faculty; contact the exam cell for corrections.</p>
    </div>
  );
}

export function StudentAttendance() {
  const { db } = usePortal();
  const dot: Record<string, string> = { P: 'bg-emerald-500', A: 'bg-red-500', OD: 'bg-amber-500', H: 'bg-black/20 dark:bg-white/20' };
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="My attendance" title="Present, accounted for" lede="Overall, subject-wise and recent history. Below 75% triggers a support alert to your mentor." />
      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <div className="glass rounded-3xl p-5 sm:p-6">
          <Donut value={db.attendance.overall} label="Semester attendance" />
          <div className="mt-4"><ProgressBar value={db.attendance.overall} /></div>
          <p className="mt-2 text-[12px] text-[var(--muted)]">75% minimum required for examination eligibility (as per university norms).</p>
        </div>
        <div className="glass rounded-3xl p-5 sm:p-6">
          <h3 className="font-display text-lg">Subject-wise</h3>
          <ul className="mt-3 space-y-3">
            {db.attendance.subjects.map(s => {
              const pct = (s.present / s.total) * 100;
              return (
                <li key={s.code}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{s.code} · {s.name}</span>
                    <span className="font-mono text-[12px] text-[var(--muted)]">{s.present}/{s.total} · {pct.toFixed(1)}%</span>
                  </div>
                  <div className="mt-1.5"><ProgressBar value={pct} /></div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="glass rounded-3xl p-5 sm:p-6">
        <h3 className="font-display text-lg">Recent history</h3>
        <div className="mt-3 flex flex-wrap gap-2" role="list" aria-label="Attendance history">
          {db.attendance.history.map((h, i) => (
            <span key={i} role="listitem" title={`${h.date}: ${h.status}`} className={`grid h-9 w-9 place-items-center rounded-xl text-[11px] font-bold text-white ${dot[h.status]}`}>{h.status}</span>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-[var(--muted)]">P present · A absent · OD on-duty · H holiday</p>
      </div>
    </div>
  );
}
