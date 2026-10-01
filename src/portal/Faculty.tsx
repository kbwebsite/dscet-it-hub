// Faculty portal — classes today, student directory, attendance marking,
// internal-marks entry, assignment management and approval queues.
// Permission-gated: these views render only for faculty/hod/admin roles.
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, CalendarCheck, ClipboardList, PenLine, ShieldCheck, Check, X, Plus } from 'lucide-react';
import { usePortal, fmtDT } from './store';
import { SectionHead, StatCard, StatusBadge, EmptyMini, inp, btnPrimary, btnGhost } from './widgets';
import { Reveal } from '../components/ui';
import { ReqCard } from './StudentServices';

export function FacultyDashboard() {
  const { db } = usePortal();
  const pending = db.requests.filter(r => r.status === 'PENDING').length
    + db.achievements.filter(a => a.status === 'PENDING').length;
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long' });
  const classes = db.timetable.find(t => t.day === today)?.periods.length ?? 0;
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="Faculty workspace" title="Today at a glance"
        lede="Classes, pending approvals and quick links. Demo faculty: Demo Faculty (Assistant Professor, IT)." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Classes today" value={today === 'Sunday' || today === 'Saturday' ? '0' : String(classes)} sub={today} icon={<CalendarCheck size={17} aria-hidden className="text-[var(--gold)]" />} />
        <StatCard label="Pending approvals" value={String(pending)} sub="Leave · OD · achievements" icon={<ShieldCheck size={17} aria-hidden className="text-[var(--gold)]" />} />
        <StatCard label="Students" value={String(db.directory.length)} sub="Across years (demo)" icon={<Users size={17} aria-hidden className="text-[var(--gold)]" />} />
        <StatCard label="Assignments" value={String(db.assignments.length)} sub="Active items" icon={<PenLine size={17} aria-hidden className="text-[var(--gold)]" />} />
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {[
          ['Mark attendance', '/portal/faculty/attendance', 'Today’s roster is ready.'],
          ['Enter internal marks', '/portal/faculty/marks', 'IA-1 · IA-2 · assignments.'],
          ['Review approvals', '/portal/faculty/approvals', `${pending} items waiting.`],
        ].map(([l, to, d]) => (
          <Reveal key={to}>
            <Link to={to} className="glass card-lift block rounded-2xl p-5">
              <p className="font-semibold">{l}</p><p className="mt-0.5 text-[13px] text-[var(--muted)]">{d}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function StudentsDirectory() {
  const { db } = usePortal();
  const [q, setQ] = useState('');
  const list = useMemo(() => db.directory.filter(s =>
    (s.regNo + s.name + s.year + s.section).toLowerCase().includes(q.toLowerCase())), [q, db.directory]);
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="Student directory" title="Search students"
        lede="Search by register number, name, year or section. Contact details stay hidden — only academic indicators are shown." />
      <label className="block max-w-md">
        <span className="sr-only">Search students</span>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="2023IT042 · Arjun · II · A…" className={inp} />
      </label>
      <div className="glass overflow-x-auto rounded-3xl">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead><tr className="border-b hairline text-[12px] uppercase tracking-wider text-[var(--muted)]">
            {['Register no.', 'Name', 'Year', 'Sec', 'CGPA', 'Attendance'].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}
          </tr></thead>
          <tbody>
            {list.map(s => (
              <tr key={s.regNo} className="border-t hairline">
                <td className="px-4 py-2.5 font-mono">{s.regNo}</td>
                <td className="px-4 py-2.5 font-medium">{s.name}</td>
                <td className="px-4 py-2.5">{s.year}</td>
                <td className="px-4 py-2.5">{s.section}</td>
                <td className="px-4 py-2.5 tabular-nums">{s.cgpa === null ? '—' : s.cgpa.toFixed(2)}</td>
                <td className="px-4 py-2.5"><span className={s.attendance < 75 ? 'font-semibold text-red-500' : ''}>{s.attendance}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {list.length === 0 && <EmptyMini title="No students match" />}
    </div>
  );
}

export function FacAttendance() {
  const { db, markRoster, saveRoster } = usePortal();
  const [saved, setSaved] = useState(false);
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="Attendance" title={`Mark attendance — ${db.roster.date}`}
        lede="Toggle each student, then save. Saves are audit-logged with your name."
        action={<button onClick={() => { saveRoster('Demo Faculty'); setSaved(true); setTimeout(() => setSaved(false), 2500); }} className={btnPrimary}>
          <Check size={15} aria-hidden /> Save attendance</button>} />
      {saved && <p role="status" className="rounded-2xl bg-emerald-500/15 px-4 py-2.5 text-sm font-medium text-emerald-600 dark:text-emerald-300">Saved and logged to the audit trail.</p>}
      <div className="glass overflow-hidden rounded-3xl">
        {db.roster.rows.map(r => (
          <div key={r.regNo} className="flex items-center gap-3 border-b hairline px-4 py-3 last:border-0 sm:px-5">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{r.name}</p>
              <p className="font-mono text-[12px] text-[var(--muted)]">{r.regNo}</p>
            </div>
            <div className="flex gap-2" role="group" aria-label={`Attendance for ${r.name}`}>
              <button onClick={() => markRoster(r.regNo, true)} aria-pressed={r.present === true}
                className={`rounded-full px-4 py-2 text-[13px] font-bold ${r.present === true ? 'bg-emerald-500 text-white' : 'border hairline'}`}>P</button>
              <button onClick={() => markRoster(r.regNo, false)} aria-pressed={r.present === false}
                className={`rounded-full px-4 py-2 text-[13px] font-bold ${r.present === false ? 'bg-red-500 text-white' : 'border hairline'}`}>A</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FacMarks() {
  const { db, updateMark } = usePortal();
  const [sem, setSem] = useState(4);
  const s = db.semesters.find(x => x.sem === sem) ?? db.semesters[0];
  const [msg, setMsg] = useState('');
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="Internal marks" title="Enter & update marks"
        lede="IA-1 (/20), IA-2 (/20) and Assignment (/10). Every change is audit-logged." />
      <div className="flex gap-2" role="tablist" aria-label="Semester">
        {db.semesters.map(x => (
          <button key={x.sem} role="tab" aria-selected={sem === x.sem} onClick={() => setSem(x.sem)}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${sem === x.sem ? 'border-transparent bg-[#070d1d] text-white dark:bg-[#38bdf8] dark:text-[#04070e]' : 'hairline glass'}`}>Sem {x.sem}</button>
        ))}
      </div>
      {msg && <p role="status" className="rounded-2xl bg-emerald-500/15 px-4 py-2.5 text-sm text-emerald-600 dark:text-emerald-300">{msg}</p>}
      <div className="glass overflow-x-auto rounded-3xl">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead><tr className="border-b hairline text-[12px] uppercase tracking-wider text-[var(--muted)]">
            {['Subject', 'IA-1 /20', 'IA-2 /20', 'Assign /10'].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}
          </tr></thead>
          <tbody>
            {s.subjects.map(subj => (
              <tr key={subj.code} className="border-t hairline">
                <th scope="row" className="px-4 py-3"><span className="block font-semibold">{subj.code}</span><span className="block text-[12px] font-normal text-[var(--muted)]">{subj.name}</span></th>
                {subj.internal.map(c => (
                  <td key={c.label} className="px-4 py-3">
                    <input type="number" min={0} max={c.max} value={c.score ?? ''} placeholder="—"
                      aria-label={`${subj.code} ${c.label}`}
                      onChange={e => {
                        const v = e.target.value === '' ? null : Math.max(0, Math.min(c.max, Number(e.target.value)));
                        updateMark(s.sem, subj.code, c.label, v, 'Demo Faculty');
                        setMsg(`Saved ${subj.code} · ${c.label} = ${v ?? '—'}`);
                      }}
                      className="w-20 rounded-xl border hairline bg-transparent px-3 py-2 text-sm tabular-nums outline-none focus:border-[var(--gold)]" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function FacAssignments() {
  const { db, addAssignment, gradeAssignment } = usePortal();
  const [f, setF] = useState({ subject: 'CS3491', title: '', due: '', desc: '' });
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="Assignments" title="Create & evaluate" lede="New items appear instantly on student dashboards with notifications." />
      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <form className="glass h-fit rounded-3xl p-5" aria-label="Create assignment"
          onSubmit={e => { e.preventDefault(); if (!f.title.trim() || !f.due) return; addAssignment({ ...f, faculty: 'Demo Faculty', dueISO: new Date(f.due).toISOString(), desc: f.desc || 'See attachment / lab instruction.' }); setF({ subject: 'CS3491', title: '', due: '', desc: '' }); }}>
          <label className="mb-1.5 block text-[13px] font-medium" htmlFor="fa-s">Subject</label>
          <select id="fa-s" value={f.subject} onChange={e => setF({ ...f, subject: e.target.value })} className={inp}>
            {['CS3491', 'CS3451', 'CS3461', 'IT3401'].map(x => <option key={x}>{x}</option>)}
          </select>
          <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="fa-t">Title</label>
          <input id="fa-t" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} className={inp} required />
          <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="fa-due">Due date</label>
          <input id="fa-due" type="date" value={f.due} onChange={e => setF({ ...f, due: e.target.value })} className={inp} required />
          <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="fa-x">Description</label>
          <textarea id="fa-x" rows={2} value={f.desc} onChange={e => setF({ ...f, desc: e.target.value })} className={inp} />
          <button className={btnPrimary + ' mt-3 w-full'}><Plus size={15} aria-hidden /> Publish assignment</button>
        </form>
        <div className="space-y-3">
          {db.assignments.map(a => (
            <article key={a.id} className="glass rounded-2xl p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[12px] text-[var(--muted)]">{a.subject}</span>
                <span className="ml-auto"><StatusBadge value={a.status} /></span>
              </div>
              <h3 className="mt-1 font-semibold">{a.title}</h3>
              <p className="text-[13px] text-[var(--muted)]">Due {fmtDT(a.dueISO)}{a.grade ? ` · Grade: ${a.grade}` : ''}</p>
              {a.status !== 'NOT STARTED' && a.status !== 'EVALUATED' && (
                <div className="mt-2 flex gap-2">
                  <input id={`g-${a.id}`} placeholder="Grade (e.g. A)" className="w-32 rounded-xl border hairline bg-transparent px-3 py-1.5 text-sm outline-none focus:border-[var(--gold)]" />
                  <button onClick={() => { const el = document.getElementById(`g-${a.id}`) as HTMLInputElement | null; gradeAssignment(a.id, el?.value || 'Graded'); }} className={btnGhost}>Evaluate</button>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FacApprovals() {
  const { decideRequest, verifyAchievement, verifyCert, db } = usePortal();
  const [tab, setTab] = useState<'Requests' | 'Achievements'>('Requests');
  const [remark, setRemark] = useState('');
  const reqs = db.requests.filter(r => r.status === 'PENDING');
  const achs = db.achievements.filter(a => a.status === 'PENDING');
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="Approvals" title="Leave, OD, requests & achievements"
        lede="Approve or reject with remarks — students are notified instantly. Rejections require a reason." />
      <div className="flex gap-2" role="tablist" aria-label="Approval queues">
        {(['Requests', 'Achievements'] as const).map(t => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${tab === t ? 'border-transparent bg-[#070d1d] text-white dark:bg-[#38bdf8] dark:text-[#04070e]' : 'hairline glass'}`}>
            {t} ({t === 'Requests' ? reqs.length : achs.length})
          </button>
        ))}
      </div>
      <label className="block max-w-md">
        <span className="mb-1.5 block text-[13px] font-medium">Remark for next decision (required to reject)</span>
        <input value={remark} onChange={e => setRemark(e.target.value)} placeholder="e.g. Approved — attendance updated" className={inp} />
      </label>
      {tab === 'Requests' && (
        <div className="space-y-3">
          {reqs.length === 0 && <EmptyMini title="Queue clear" hint="No pending requests." />}
          {reqs.map(r => (
            <div key={r.id}>
              <ReqCard r={r} />
              <div className="mt-2 flex gap-2">
                <button onClick={() => decideRequest(r.id, true, remark || 'Approved', 'Demo Faculty')} className={btnPrimary}><Check size={15} aria-hidden /> Approve</button>
                <button
                  onClick={() => { if (!remark.trim()) { alert('A reason is required to reject.'); return; } decideRequest(r.id, false, remark, 'Demo Faculty'); setRemark(''); }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 px-5 py-2.5 text-sm font-semibold text-red-500">
                  <X size={15} aria-hidden /> Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === 'Achievements' && (
        <div className="space-y-3">
          {achs.length === 0 && <EmptyMini title="Nothing to verify" />}
          {achs.map(a => (
            <article key={a.id} className="glass rounded-2xl p-4">
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-[13px] text-[var(--muted)]">{a.student} · {a.category} · {a.org} — {a.desc}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => verifyAchievement(a.id, true, 'Demo Faculty')} className={btnPrimary}><Check size={15} aria-hidden /> Verify (can go public)</button>
                <button onClick={() => verifyAchievement(a.id, false, 'Demo Faculty')} className={btnGhost}>Send back</button>
              </div>
            </article>
          ))}
        </div>
      )}
      <div className="space-y-3">
        <h3 className="font-display text-lg">Pending certifications</h3>
        {db.certs.filter(c => !c.verified).length === 0 && <EmptyMini title="No pending certificates" />}
        {db.certs.filter(c => !c.verified).map(c => (
          <article key={c.id} className="glass flex flex-wrap items-center gap-2 rounded-2xl p-4">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{c.name}</p>
              <p className="text-[13px] text-[var(--muted)]">{c.platform} · {c.org} · {c.credential || 'no credential ID'}</p>
            </div>
            <button onClick={() => verifyCert(c.id, 'Demo Faculty')} className={btnPrimary}><Check size={15} aria-hidden /> Verify</button>
          </article>
        ))}
      </div>
      <div className="space-y-3">
        <h3 className="font-display text-lg">Recently decided</h3>
        {db.requests.filter(r => r.status !== 'PENDING').slice(0, 4).map(r => <ReqCard key={r.id} r={r} />)}
      </div>
    </div>
  );
}

export function useFacUtils() { return { ClipboardList }; }
void ClipboardList;
