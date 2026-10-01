// Student services — timetable, exams, assignments, resources, leave,
// requests (incl. OD), notifications and records (achievements/projects/
// internships/certifications). All mutations persist + write audit entries.
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, Bell } from 'lucide-react';
import { usePortal, fmtDT, fmtD, timeAgo, useNow } from './store';
import { RequestItem, ReqStatus } from './mockdb';
import { SectionHead, StatusBadge, ProgressBar, CountdownText, EmptyMini, inp, btnPrimary, btnGhost } from './widgets';
import { Reveal } from '../components/ui';

const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function Timetable() {
  const { db } = usePortal();
  const now = useNow(30000);
  const todayName = DAY[new Date().getDay()];
  const toMin = (s: string) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  const cur = new Date().getHours() * 60 + new Date().getMinutes();
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="My timetable" title="Week at a glance" lede="Today is highlighted. Room and faculty shown per period." />
      <div className="grid gap-3">
        {db.timetable.map(d => {
          const isToday = d.day === todayName;
          const next = isToday ? d.periods.find(p => toMin(p.to) > cur) : null;
          return (
            <Reveal key={d.day}>
              <div className={`glass rounded-3xl p-5 ${isToday ? 'ring-2 ring-[var(--gold)]' : ''}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg">{d.day} {isToday && <span className="ml-2 rounded-full bg-[var(--gold)]/15 px-2.5 py-0.5 text-[11px] font-bold text-[var(--gold)]">TODAY</span>}</h3>
                  {isToday && next && <p className="text-[13px] text-[var(--muted)]">Next: <strong>{next.subject}</strong> · {next.from}</p>}
                </div>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead><tr className="text-[12px] uppercase tracking-wider text-[var(--muted)]">
                      {['Slot', 'Time', 'Subject', 'Faculty', 'Room', 'Type'].map(h => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {d.periods.map(p => (
                        <tr key={p.slot} className={`border-t hairline ${next?.slot === p.slot ? 'bg-[var(--gold)]/10' : ''}`}>
                          <td className="px-3 py-2.5 font-mono">{p.slot}</td>
                          <td className="px-3 py-2.5 font-mono text-[13px]">{p.from}–{p.to}</td>
                          <td className="px-3 py-2.5 font-medium">{p.subject}</td>
                          <td className="px-3 py-2.5 text-[var(--muted)]">{p.faculty}</td>
                          <td className="px-3 py-2.5">{p.room}</td>
                          <td className="px-3 py-2.5"><span className="rounded-full bg-black/5 px-2 py-0.5 font-mono text-[10px] dark:bg-white/10">{p.type}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

export function Exams() {
  const { db } = usePortal();
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="Examination center" title="Schedules & results" lede="Internal, semester and practical schedules with rooms and instructions." />
      <div className="grid gap-3 md:grid-cols-2">
        {db.exams.map(e => (
          <Reveal key={e.id}>
            <article className="glass card-lift h-full rounded-3xl p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <StatusBadge value={e.kind === 'Internal' ? 'UPCOMING' : 'PENDING'} />
                {e.result && <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-300">RESULT AVAILABLE</span>}
              </div>
              <h3 className="font-display mt-2 text-xl">{e.title}</h3>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                {[['Date', e.date], ['Time', e.time], ['Hall / Room', e.room]].map(([k, v]) => (
                  <div key={k} className="rounded-xl border hairline px-3 py-2"><dt className="text-[12px] text-[var(--muted)]">{k}</dt><dd className="font-medium">{v}</dd></div>
                ))}
              </dl>
              <p className="mt-3 text-[13px] text-[var(--muted)]">{e.notes}</p>
              {e.result
                ? <Link to="/portal/marks" className={btnPrimary + ' mt-4'}>View result</Link>
                : <p className="mt-3 text-[13px] text-[var(--muted)]">Results appear here the moment the exam cell publishes them — you'll be notified.</p>}
            </article>
          </Reveal>
        ))}
      </div>
      <div className="glass rounded-2xl p-5 text-sm">
        <p className="font-semibold">Exam instructions</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-[var(--muted)]">
          <li>Carry ID card and hall ticket; report 20 minutes early.</li>
          <li>Record notebooks must be completed before practical exams.</li>
          <li>Malpractice leads to disciplinary action per university norms.</li>
        </ul>
      </div>
    </div>
  );
}

export function Assignments() {
  const { db, submitAssignment } = usePortal();
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="Assignments" title="Due, done, evaluated" lede="Submit before the deadline. Late submissions are flagged automatically." />
      <div className="grid gap-3">
        {db.assignments.map(a => {
          const late = a.status === 'NOT STARTED' && new Date(a.dueISO).getTime() < Date.now();
          return (
            <Reveal key={a.id}>
              <article className="glass rounded-3xl p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[12px] text-[var(--muted)]">{a.subject} · {a.faculty}</span>
                  <span className="ml-auto"><StatusBadge value={late ? 'LATE' : a.status} /></span>
                </div>
                <h3 className="font-display mt-1.5 text-xl">{a.title}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{a.desc}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <p className="text-[13px]">Due: <strong>{fmtDT(a.dueISO)}</strong></p>
                  {a.grade && <p className="text-[13px]">Grade: <strong>{a.grade}</strong></p>}
                  {a.status === 'NOT STARTED' && (
                    <button onClick={() => submitAssignment(a.id)} className={btnPrimary + ' ml-auto'}><Check size={15} aria-hidden /> Mark submitted</button>
                  )}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

export function LearnResources() {
  const { db } = usePortal();
  const [sub, setSub] = useState('All');
  const subs = ['All', ...Array.from(new Set(db.resources.map(r => r.subject)))];
  const list = db.resources.filter(r => sub === 'All' || r.subject === sub);
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="Learning resources" title="Notes & materials"
        lede="Faculty-published notes, PDFs, lab manuals and videos."
        action={<Link to="/resources" className={btnGhost}>Public library →</Link>} />
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Subject filter">
        {subs.map(s => (
          <button key={s} role="tab" aria-selected={sub === s} onClick={() => setSub(s)}
            className={`rounded-full border px-4 py-1.5 text-[13px] ${sub === s ? 'border-transparent bg-[#070d1d] text-white dark:bg-[#38bdf8] dark:text-[#04070e]' : 'hairline glass'}`}>{s}</button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(r => (
          <Reveal key={r.id}>
            <article className="glass card-lift h-full rounded-2xl p-5">
              <p className="font-mono text-[11px] text-[var(--gold)]">{r.subject} · {r.unit} · {r.type}</p>
              <h3 className="mt-1.5 font-semibold">{r.title}</h3>
              <p className="mt-1 text-[13px] text-[var(--muted)]">{r.meta}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

const KIND_FIELDS = {
  Leave: { from: true, extra: '' }, OD: { from: true, extra: 'Event name & venue' },
  Bonafide: { from: false, extra: 'Purpose' }, Certificate: { from: false, extra: 'Certificate needed' },
  Permission: { from: true, extra: 'Permission sought for' }, Event: { from: true, extra: 'Event details' },
  Internship: { from: true, extra: 'Company & role' }, Visit: { from: true, extra: 'Destination & purpose' },
  Project: { from: false, extra: 'Project title & mentor' }, Other: { from: false, extra: '' },
};

export function Leave() {
  const { applyRequest, db } = usePortal();
  const [f, setF] = useState({ type: 'Sick', from: '', to: '', reason: '' });
  const mine = db.requests.filter(r => r.regNo === '2023IT042' && r.kind === 'Leave');
  const days = f.from && f.to ? Math.max(1, Math.round((+new Date(f.to) - +new Date(f.from)) / 864e5) + 1) : 0;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.from || !f.to || !f.reason.trim()) return;
    applyRequest({ kind: 'Leave', title: `${f.type} leave — ${days} day${days > 1 ? 's' : ''}`, detail: f.reason, from: f.from, to: f.to, student: 'Arjun S', regNo: '2023IT042', year: 'II', section: 'A' });
    setF({ type: 'Sick', from: '', to: '', reason: '' });
  };
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="Leave management" title="Apply & track leave" lede="Applications go to your faculty advisor — track PENDING → APPROVED / REJECTED here." />
      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <form onSubmit={submit} className="glass h-fit rounded-3xl p-5 sm:p-6" aria-label="Leave application form">
          <label className="mb-1.5 block text-[13px] font-medium" htmlFor="lv-type">Leave type</label>
          <select id="lv-type" value={f.type} onChange={e => setF({ ...f, type: e.target.value })} className={inp}>
            {['Sick', 'Casual', 'On-duty (event)', 'Medical', 'Family'].map(t => <option key={t}>{t}</option>)}
          </select>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="lv-from">From</label>
              <input id="lv-from" type="date" value={f.from} onChange={e => setF({ ...f, from: e.target.value })} className={inp} required /></div>
            <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="lv-to">To</label>
              <input id="lv-to" type="date" value={f.to} min={f.from} onChange={e => setF({ ...f, to: e.target.value })} className={inp} required /></div>
          </div>
          <p className="mt-2 font-mono text-[12px] text-[var(--muted)]" aria-live="polite">Duration: {days} day{days === 1 ? '' : 's'}</p>
          <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="lv-reason">Reason</label>
          <textarea id="lv-reason" rows={3} value={f.reason} onChange={e => setF({ ...f, reason: e.target.value })} placeholder="Brief reason…" className={inp} required />
          <button className={btnPrimary + ' mt-4 w-full'}>Submit application</button>
        </form>
        <div className="space-y-3">
          {mine.length === 0 && <EmptyMini title="No leave applications yet" />}
          {mine.map(r => <ReqCard key={r.id} r={r} />)}
        </div>
      </div>
    </div>
  );
}

export function ReqCard({ r }: { r: RequestItem }) {
  return (
    <article className="glass rounded-2xl p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[12px] text-[var(--muted)]">{r.id} · {r.kind}</span>
        <span className="ml-auto"><StatusBadge value={r.status} pulse={r.status === 'PENDING'} /></span>
      </div>
      <h3 className="mt-1.5 font-semibold">{r.title}</h3>
      <p className="mt-0.5 text-sm text-[var(--muted)]">{r.detail}</p>
      <p className="mt-2 text-[12px] text-[var(--muted)]">
        Submitted {fmtDT(r.submittedAt)}{r.from ? ` · ${r.from} → ${r.to}` : ''}
        {r.approver ? ` · by ${r.approver}` : ''}{r.remarks ? ` — “${r.remarks}”` : ''}
      </p>
    </article>
  );
}

export function Requests() {
  const { applyRequest, db } = usePortal();
  const [tab, setTab] = useState('All');
  const [kind, setKind] = useState<keyof typeof KIND_FIELDS>('Bonafide');
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const tabs = ['All', 'Leave', 'OD', 'Bonafide', 'Certificate', 'Permission', 'Event', 'Internship', 'Visit', 'Project', 'Other'];
  const mine = db.requests.filter(r => r.regNo === '2023IT042' && (tab === 'All' || r.kind === tab));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !detail.trim()) return;
    applyRequest({
      kind, title, detail: `${KIND_FIELDS[kind].extra ? KIND_FIELDS[kind].extra + ': ' : ''}${detail}`,
      from: KIND_FIELDS[kind].from ? from || undefined : undefined,
      to: KIND_FIELDS[kind].from ? to || undefined : undefined,
      student: 'Arjun S', regNo: '2023IT042', year: 'II', section: 'A',
    });
    setTitle(''); setDetail(''); setFrom(''); setTo('');
  };
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="Request center" title="Certificates, OD, permissions & more"
        lede="Every request gets an ID, timestamped status and approver remarks. OD covers symposiums, hackathons, workshops and visits." />
      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <form onSubmit={submit} className="glass h-fit rounded-3xl p-5 sm:p-6" aria-label="New request form">
          <label className="mb-1.5 block text-[13px] font-medium" htmlFor="rq-kind">Request type</label>
          <select id="rq-kind" value={kind} onChange={e => setKind(e.target.value as keyof typeof KIND_FIELDS)} className={inp}>
            {Object.keys(KIND_FIELDS).filter(k => k !== 'Leave').map(k => <option key={k}>{k}</option>)}
          </select>
          <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="rq-title">Title</label>
          <input id="rq-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. OD for Hackathon finals" className={inp} required />
          <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="rq-detail">{KIND_FIELDS[kind].extra || 'Description'}</label>
          <textarea id="rq-detail" rows={3} value={detail} onChange={e => setDetail(e.target.value)} className={inp} required />
          {KIND_FIELDS[kind].from && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="rq-from">From</label>
                <input id="rq-from" type="date" value={from} onChange={e => setFrom(e.target.value)} className={inp} /></div>
              <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="rq-to">To</label>
                <input id="rq-to" type="date" value={to} min={from} onChange={e => setTo(e.target.value)} className={inp} /></div>
            </div>
          )}
          <button className={btnPrimary + ' mt-4 w-full'}><Plus size={15} aria-hidden /> Submit request</button>
        </form>
        <div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1" role="tablist" aria-label="Request filter">
            {tabs.map(t => (
              <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] ${tab === t ? 'border-transparent bg-[#070d1d] text-white dark:bg-[#38bdf8] dark:text-[#04070e]' : 'hairline glass'}`}>{t}</button>
            ))}
          </div>
          <div className="mt-3 space-y-3">
            {mine.length === 0 && <EmptyMini title={`No ${tab === 'All' ? '' : tab + ' '}requests`} hint="Submit from the form — status appears here instantly." />}
            {mine.map(r => <ReqCard key={r.id} r={r} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Notifications() {
  const { db, markRead, markAllRead, session } = usePortal();
  const [f, setF] = useState('All');
  const role = session?.role ?? 'student';
  const list = db.notifications
    .filter(n => n.audience === role || n.audience === 'all')
    .filter(n => f === 'All' || n.type === f);
  const types = ['All', ...Array.from(new Set(db.notifications.map(n => n.type)))];
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="Inbox" title="Notifications"
        lede="Academic, exam, leave, event and result alerts — pushed here the moment staff act."
        action={<button onClick={() => markAllRead(role)} className={btnGhost}><Check size={15} aria-hidden /> Mark all read</button>} />
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Type filter">
        {types.map(t => (
          <button key={t} role="tab" aria-selected={f === t} onClick={() => setF(t)}
            className={`rounded-full border px-3.5 py-1.5 text-[13px] ${f === t ? 'border-transparent bg-[#070d1d] text-white dark:bg-[#38bdf8] dark:text-[#04070e]' : 'hairline glass'}`}>{t}</button>
        ))}
      </div>
      <div className="space-y-2.5">
        {list.length === 0 && <EmptyMini title="No notifications" />}
        {list.map(n => (
          <button key={n.id} onClick={() => markRead(n.id)} className={`block w-full rounded-2xl border p-4 text-left transition ${n.read ? 'hairline opacity-70' : 'glass border-[var(--gold)]'}`}>
            <span className="flex items-center gap-2 text-[12px] text-[var(--muted)]">
              <Bell size={12} aria-hidden /> {n.type} · {timeAgo(n.timeISO)}
              {!n.read && <span className="ml-auto h-2 w-2 rounded-full bg-[#38bdf8]" aria-label="unread" />}
            </span>
            <span className="mt-1 block font-semibold">{n.title}</span>
            <span className="mt-0.5 block text-sm text-[var(--muted)]">{n.body}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function Records() {
  const { db, submitAchievement, addProject, setProgress, addInternship, addCert } = usePortal();
  const [tab, setTab] = useState<'Achievements' | 'Projects' | 'Internships' | 'Certifications'>('Achievements');
  const [a, setA] = useState({ title: '', category: 'Hackathon', date: '', org: '', desc: '' });
  const [p, setP] = useState({ title: '', team: '', tech: '', desc: '' });
  const [c, setC] = useState({ name: '', platform: '', org: '', date: '', credential: '' });
  const cats = ['Hackathon', 'Paper presentation', 'Certification', 'Competition', 'Internship', 'Sports', 'Technical', 'Research', 'Innovation'];
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="My records" title="Achievements, projects & career"
        lede="Submissions go to faculty for verification — only verified achievements can appear on the public site." />
      <div className="flex gap-2" role="tablist" aria-label="Records">
        {(['Achievements', 'Projects', 'Internships', 'Certifications'] as const).map(t => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${tab === t ? 'border-transparent bg-[#070d1d] text-white dark:bg-[#38bdf8] dark:text-[#04070e]' : 'hairline glass'}`}>{t}</button>
        ))}
      </div>

      {tab === 'Achievements' && (
        <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
          <form className="glass h-fit rounded-3xl p-5" aria-label="Submit achievement"
            onSubmit={e => { e.preventDefault(); if (!a.title.trim()) return; submitAchievement({ ...a, student: 'Arjun S' }); setA({ title: '', category: 'Hackathon', date: '', org: '', desc: '' }); }}>
            <label className="mb-1.5 block text-[13px] font-medium" htmlFor="ac-t">Achievement</label>
            <input id="ac-t" value={a.title} onChange={e => setA({ ...a, title: e.target.value })} className={inp} required />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="ac-c">Category</label>
                <select id="ac-c" value={a.category} onChange={e => setA({ ...a, category: e.target.value })} className={inp}>{cats.map(x => <option key={x}>{x}</option>)}</select></div>
              <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="ac-d">Date</label>
                <input id="ac-d" type="date" value={a.date} onChange={e => setA({ ...a, date: e.target.value })} className={inp} /></div>
            </div>
            <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="ac-o">Organization</label>
            <input id="ac-o" value={a.org} onChange={e => setA({ ...a, org: e.target.value })} className={inp} />
            <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="ac-x">Description</label>
            <textarea id="ac-x" rows={2} value={a.desc} onChange={e => setA({ ...a, desc: e.target.value })} className={inp} />
            <button className={btnPrimary + ' mt-3 w-full'}>Submit for verification</button>
          </form>
          <div className="space-y-3">
            {db.achievements.map(x => (
              <article key={x.id} className="glass rounded-2xl p-4">
                <div className="flex flex-wrap items-center gap-2"><span className="font-mono text-[12px] text-[var(--muted)]">{x.category} · {x.date || 'date TBD'}</span><span className="ml-auto"><StatusBadge value={x.status} /></span></div>
                <h3 className="mt-1 font-semibold">{x.title}</h3>
                <p className="text-sm text-[var(--muted)]">{x.org} — {x.desc}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === 'Projects' && (
        <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
          <form className="glass h-fit rounded-3xl p-5" aria-label="Add project"
            onSubmit={e => { e.preventDefault(); if (!p.title.trim()) return; addProject({ ...p, mentor: 'Demo Faculty', progress: 5, stage: 'IDEA' }); setP({ title: '', team: '', tech: '', desc: '' }); }}>
            <label className="mb-1.5 block text-[13px] font-medium" htmlFor="pj-t">Project title</label>
            <input id="pj-t" value={p.title} onChange={e => setP({ ...p, title: e.target.value })} className={inp} required />
            <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="pj-team">Team</label>
            <input id="pj-team" value={p.team} onChange={e => setP({ ...p, team: e.target.value })} placeholder="Names…" className={inp} />
            <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="pj-tech">Technology</label>
            <input id="pj-tech" value={p.tech} onChange={e => setP({ ...p, tech: e.target.value })} placeholder="React · Node · …" className={inp} />
            <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="pj-d">Description</label>
            <textarea id="pj-d" rows={2} value={p.desc} onChange={e => setP({ ...p, desc: e.target.value })} className={inp} />
            <button className={btnPrimary + ' mt-3 w-full'}>Add project</button>
          </form>
          <div className="space-y-3">
            {db.projects.map(x => (
              <article key={x.id} className="glass rounded-2xl p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{x.title}</h3>
                  <span className="ml-auto"><StatusBadge value={x.stage === 'COMPLETED' ? 'COMPLETED' : 'ONGOING'} /></span>
                </div>
                <p className="mt-0.5 text-[13px] text-[var(--muted)]">{x.team} · Mentor: {x.mentor} · {x.tech}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{x.desc}</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1"><ProgressBar value={x.progress} /></div>
                  <span className="font-mono text-[12px]">{x.progress}%</span>
                  <input type="range" min={0} max={100} step={5} value={x.progress} onChange={e => setProgress(x.id, Number(e.target.value))}
                    aria-label={`Progress for ${x.title}`} className="w-28 accent-[#0284c7]" />
                </div>
                <p className="mt-1 font-mono text-[11px] text-[var(--muted)]">STAGE: {x.stage}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === 'Internships' && (
        <div className="space-y-3">
          {db.internships.map(x => (
            <article key={x.id} className="glass rounded-2xl p-4">
              <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{x.role} · {x.company}</h3><span className="ml-auto"><StatusBadge value={x.status} /></span></div>
              <p className="mt-0.5 text-[13px] text-[var(--muted)]">{x.from} → {x.to} · {x.location}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{x.desc}</p>
            </article>
          ))}
          <p className="text-[13px] text-[var(--muted)]">New internships are recorded via Requests → Internship (offer letter verified by faculty).</p>
        </div>
      )}

      {tab === 'Certifications' && (
        <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
          <form className="glass h-fit rounded-3xl p-5" aria-label="Add certification"
            onSubmit={e => { e.preventDefault(); if (!c.name.trim()) return; addCert(c); setC({ name: '', platform: '', org: '', date: '', credential: '' }); }}>
            <label className="mb-1.5 block text-[13px] font-medium" htmlFor="ct-n">Certification</label>
            <input id="ct-n" value={c.name} onChange={e => setC({ ...c, name: e.target.value })} className={inp} required />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="ct-p">Platform</label>
                <input id="ct-p" value={c.platform} onChange={e => setC({ ...c, platform: e.target.value })} className={inp} /></div>
              <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="ct-d">Date</label>
                <input id="ct-d" type="date" value={c.date} onChange={e => setC({ ...c, date: e.target.value })} className={inp} /></div>
            </div>
            <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="ct-o">Organization</label>
            <input id="ct-o" value={c.org} onChange={e => setC({ ...c, org: e.target.value })} className={inp} />
            <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="ct-id">Credential ID</label>
            <input id="ct-id" value={c.credential} onChange={e => setC({ ...c, credential: e.target.value })} className={inp} />
            <button className={btnPrimary + ' mt-3 w-full'}>Add certification</button>
          </form>
          <div className="space-y-3">
            {db.certs.map(x => (
              <article key={x.id} className="glass rounded-2xl p-4">
                <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{x.name}</h3>
                  <span className="ml-auto"><StatusBadge value={x.verified ? 'VERIFIED' : 'PENDING'} /></span></div>
                <p className="mt-0.5 text-[13px] text-[var(--muted)]">{x.platform} · {x.org} · {x.date || 'date TBD'} · {x.credential || 'no credential ID'}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
