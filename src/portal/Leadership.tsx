// HOD control center + department admin console.
// Analytics derive from directory + audit data; alerts follow configurable rules.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, CalendarCheck, ShieldCheck, Radio, Newspaper, CalendarPlus, Bell, Trash2, Plus, RotateCcw } from 'lucide-react';
import { usePortal, fmtDT, timeAgo, eventStatus, Role } from './store';
import type { LearnRes } from './mockdb';
import { SectionHead, StatCard, StatusBadge, Donut, Bars, ProgressBar, EmptyMini, inp, btnPrimary, btnGhost, CountdownText } from './widgets';
import { Reveal } from '../components/ui';
import { ReqCard } from './StudentServices';

const ATTENDANCE_FLOOR = 75;

export function HodDashboard() {
  const { db } = usePortal();
  const dir = db.directory.filter(s => s.cgpa !== null);
  const avgCgpa = dir.reduce((a, s) => a + (s.cgpa ?? 0), 0) / Math.max(1, dir.length);
  const avgAtt = dir.reduce((a, s) => a + s.attendance, 0) / Math.max(1, dir.length);
  const pass = dir.filter(s => (s.cgpa ?? 0) >= 6).length;
  const low = db.directory.filter(s => s.attendance < ATTENDANCE_FLOOR);
  const pending = db.requests.filter(r => r.status === 'PENDING').length
    + db.achievements.filter(a => a.status === 'PENDING').length;
  const byYear = ['I', 'II', 'III', 'IV'].map(y => {
    const g = db.directory.filter(s => s.year === y && s.cgpa !== null);
    return { label: `Yr ${y}`, value: g.length ? g.reduce((a, s) => a + (s.cgpa ?? 0), 0) / g.length : null };
  });
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="HOD control center" title="Department overview"
        lede="Liveroll: students, attendance, approvals, research and placements. Demo data throughout." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Students (demo)" value={String(db.directory.length)} sub="Across years" icon={<Users size={17} aria-hidden className="text-[var(--gold)]" />} />
        <StatCard label="Avg. attendance" value={`${avgAtt.toFixed(1)}%`} sub="Directory sample" icon={<CalendarCheck size={17} aria-hidden className="text-[var(--gold)]" />} />
        <StatCard label="Pending approvals" value={String(pending)} sub="Requests + achievements" icon={<ShieldCheck size={17} aria-hidden className="text-[var(--gold)]" />} />
        <StatCard label="Live TV" value={db.live.active ? 'ON AIR' : 'Offline'} sub={db.live.active ? db.live.title : 'No active stream'} icon={<Radio size={17} aria-hidden className="text-[var(--gold)]" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-3xl p-5 sm:p-6">
          <h3 className="font-display text-lg">CGPA average by year</h3>
          <div className="mt-4"><Bars data={byYear} /></div>
          <p className="mt-3 text-[13px] text-[var(--muted)]">Overall average {avgCgpa.toFixed(2)} · {pass}/{dir.length} above 6.0 CGPA (demo cohort).</p>
        </div>
        <div className="glass rounded-3xl p-5 sm:p-6">
          <h3 className="font-display text-lg">Attendance health</h3>
          <div className="mt-3"><Donut value={avgAtt} label="Average attendance" /></div>
          <div className="mt-3"><ProgressBar value={avgAtt} /></div>
        </div>
      </div>

      <div className="glass rounded-3xl border-red-500/30 p-5 sm:p-6" style={{ borderColor: low.length ? undefined : undefined }}>
        <h3 className="font-display text-lg">Low-attendance alerts <span className="text-sm font-normal text-[var(--muted)]">(below {ATTENDANCE_FLOOR}%)</span></h3>
        {low.length === 0 ? <div className="mt-3"><EmptyMini title="No alerts — cohort is healthy" /></div> : (
          <ul className="mt-3 space-y-2">
            {low.map(s => (
              <li key={s.regNo} className="flex items-center gap-3 rounded-2xl border border-red-500/25 bg-red-500/5 px-4 py-2.5 text-sm">
                <span className="font-mono">{s.regNo}</span><span className="font-medium">{s.name}</span>
                <span className="ml-auto font-bold text-red-500">{s.attendance}%</span>
                <span className="text-[12px] text-[var(--muted)]">Mentor follow-up suggested</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg">Approval queue</h3>
            <Link to="/portal/faculty/approvals" className="text-[13px] font-semibold text-[var(--gold)]">Open queue →</Link>
          </div>
          <div className="mt-3 space-y-2">
            {db.requests.filter(r => r.status === 'PENDING').slice(0, 3).map(r => <ReqCard key={r.id} r={r} />)}
            {pending === 0 && <EmptyMini title="Queue clear" />}
          </div>
        </div>
        <div className="glass rounded-3xl p-5 sm:p-6">
          <h3 className="font-display text-lg">Latest audit trail</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {db.audit.slice(0, 5).map(a => (
              <li key={a.id} className="rounded-2xl border hairline px-4 py-2.5">
                <p className="font-medium">{a.action} <span className="font-normal text-[var(--muted)]">— {a.actor}</span></p>
                <p className="text-[12px] text-[var(--muted)]">{a.detail} · {timeAgo(a.timeISO)}</p>
              </li>
            ))}
          </ul>
          <Link to="/portal/admin" className="mt-3 inline-block text-[13px] font-semibold text-[var(--gold)]">Full activity log →</Link>
        </div>
      </div>
    </div>
  );
}

type Tab = 'Overview' | 'News' | 'Events' | 'Live TV' | 'Careers' | 'Resources' | 'Notices' | 'Users' | 'Audit';

export function AdminPanel() {
  const { db, publishNews, deleteNews, addEvent, deleteEvent, toggleEventLive, setLive, addOnDemand, addResource, addDrive, deleteDrive, notify, resetDemo } = usePortal();
  const [tab, setTab] = useState<Tab>('Overview');
  const [news, setNews] = useState({ title: '', category: 'General Announcement', desc: '', featured: false });
  const [ev, setEv] = useState({ title: '', type: 'Workshop', start: '', end: '', venue: '', organizer: 'Dept. of IT', speaker: '', desc: '', registration: '' });
  const [stream, setStream] = useState(db.live.streamUrl);
  const [liveTitle, setLiveTitle] = useState(db.live.title);
  const [od, setOd] = useState({ title: '', kind: 'Lecture', duration: '' });
  const [notice, setNotice] = useState({ audience: 'all' as Role | 'all', title: '', body: '' });
  const [res, setRes] = useState<{ subject: string; unit: string; title: string; type: LearnRes['type']; meta: string }>({ subject: 'CS3491', unit: 'Unit 1', title: '', type: 'Notes', meta: '' });
  const [drv, setDrv] = useState({ company: '', role: '', date: '', venue: '', eligibility: '', skills: '', deadline: '', desc: '' });
  const tabs: Tab[] = ['Overview', 'News', 'Events', 'Live TV', 'Careers', 'Resources', 'Notices', 'Users', 'Audit'];

  return (
    <div className="space-y-5">
      <SectionHead eyebrow="Department admin" title="Complete management console"
        lede="Publish news, schedule events, control Live TV, notify roles, inspect users and audit. Everything is permission-gated."
        action={<button onClick={() => { if (confirm('Reset demo workspace to seed data?')) resetDemo(); }} className={btnGhost}><RotateCcw size={15} aria-hidden /> Reset demo</button>} />
      <div className="flex gap-2 overflow-x-auto no-scrollbar" role="tablist" aria-label="Admin sections">
        {tabs.map(t => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${tab === t ? 'border-transparent bg-[#070d1d] text-white dark:bg-[#38bdf8] dark:text-[#04070e]' : 'hairline glass'}`}>{t}</button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="News published" value={String(db.news.length)} icon={<Newspaper size={17} aria-hidden className="text-[var(--gold)]" />} />
          <StatCard label="Events scheduled" value={String(db.events.length)} icon={<CalendarPlus size={17} aria-hidden className="text-[var(--gold)]" />} />
          <StatCard label="Stream status" value={db.live.active ? 'LIVE' : 'OFF'} sub={db.live.title || 'No stream'} icon={<Radio size={17} aria-hidden className="text-[var(--gold)]" />} />
          <StatCard label="Audit entries" value={String(db.audit.length)} icon={<Bell size={17} aria-hidden className="text-[var(--gold)]" />} />
        </div>
      )}

      {tab === 'News' && (
        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <form className="glass h-fit rounded-3xl p-5" aria-label="Publish news"
            onSubmit={e => { e.preventDefault(); if (!news.title.trim()) return; publishNews(news); setNews({ title: '', category: 'General Announcement', desc: '', featured: false }); }}>
            <label className="mb-1.5 block text-[13px] font-medium" htmlFor="nw-t">Headline</label>
            <input id="nw-t" value={news.title} onChange={e => setNews({ ...news, title: e.target.value })} className={inp} required />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="nw-c">Category</label>
                <select id="nw-c" value={news.category} onChange={e => setNews({ ...news, category: e.target.value })} className={inp}>
                  {['Breaking Department News', 'Academic', 'Student', 'Faculty', 'Research', 'Events', 'Achievements', 'Placement', 'Examination', 'General Announcement'].map(c => <option key={c}>{c}</option>)}
                </select></div>
              <label className="mt-6 flex items-center gap-2 text-[13px]"><input type="checkbox" checked={news.featured} onChange={e => setNews({ ...news, featured: e.target.checked })} className="h-4 w-4 accent-[#0284c7]" /> Featured</label>
            </div>
            <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="nw-d">Summary</label>
            <textarea id="nw-d" rows={3} value={news.desc} onChange={e => setNews({ ...news, desc: e.target.value })} className={inp} required />
            <button className={btnPrimary + ' mt-3 w-full'}><Plus size={15} aria-hidden /> Publish (notifies all)</button>
          </form>
          <div className="space-y-2.5">
            {db.news.length === 0 && <EmptyMini title="No news yet" hint="Published items appear on the homepage instantly." />}
            {db.news.map(n => (
              <article key={n.id} className="glass rounded-2xl p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[12px] text-[var(--gold)]">{n.category}{n.featured ? ' · FEATURED' : ''}</span>
                  <span className="ml-auto text-[12px] text-[var(--muted)]">{fmtDT(n.timeISO)}</span>
                  <button onClick={() => deleteNews(n.id, 'Dept Admin')} aria-label={`Delete ${n.title}`} className="grid h-8 w-8 place-items-center rounded-full text-red-500 hover:bg-red-500/10"><Trash2 size={15} aria-hidden /></button>
                </div>
                <h3 className="mt-1 font-semibold">{n.title}</h3>
                <p className="text-sm text-[var(--muted)]">{n.desc}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === 'Events' && (
        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <form className="glass h-fit rounded-3xl p-5" aria-label="Create event"
            onSubmit={e => {
              e.preventDefault(); if (!ev.title.trim() || !ev.start || !ev.end) return;
              addEvent({ ...ev, startISO: new Date(ev.start).toISOString(), endISO: new Date(ev.end).toISOString(), live: false });
              setEv({ title: '', type: 'Workshop', start: '', end: '', venue: '', organizer: 'Dept. of IT', speaker: '', desc: '', registration: '' });
            }}>
            <label className="mb-1.5 block text-[13px] font-medium" htmlFor="ev-t">Event title</label>
            <input id="ev-t" value={ev.title} onChange={e => setEv({ ...ev, title: e.target.value })} className={inp} required />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="ev-ty">Type</label>
                <select id="ev-ty" value={ev.type} onChange={e => setEv({ ...ev, type: e.target.value })} className={inp}>
                  {['Workshop', 'Seminar', 'Hackathon', 'Guest Lecture', 'FDP', 'Technical Symposium', 'Paper Presentation', 'Industrial Visit', 'Competition', 'Club Event', 'Student Activity'].map(t => <option key={t}>{t}</option>)}
                </select></div>
              <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="ev-v">Venue</label>
                <input id="ev-v" value={ev.venue} onChange={e => setEv({ ...ev, venue: e.target.value })} className={inp} /></div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="ev-s">Starts</label>
                <input id="ev-s" type="datetime-local" value={ev.start} onChange={e => setEv({ ...ev, start: e.target.value })} className={inp} required /></div>
              <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="ev-e">Ends</label>
                <input id="ev-e" type="datetime-local" value={ev.end} min={ev.start} onChange={e => setEv({ ...ev, end: e.target.value })} className={inp} required /></div>
            </div>
            <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="ev-sp">Speaker</label>
            <input id="ev-sp" value={ev.speaker} onChange={e => setEv({ ...ev, speaker: e.target.value })} className={inp} />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="ev-org">Organizer</label>
                <input id="ev-org" value={ev.organizer} onChange={e => setEv({ ...ev, organizer: e.target.value })} className={inp} /></div>
              <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="ev-reg">Registration</label>
                <input id="ev-reg" value={ev.registration} onChange={e => setEv({ ...ev, registration: e.target.value })} placeholder="e.g. Free · via form" className={inp} /></div>
            </div>
            <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="ev-d">Description</label>
            <textarea id="ev-d" rows={2} value={ev.desc} onChange={e => setEv({ ...ev, desc: e.target.value })} className={inp} />
            <button className={btnPrimary + ' mt-3 w-full'}><Plus size={15} aria-hidden /> Schedule event</button>
          </form>
          <div className="space-y-2.5">
            {db.events.length === 0 && <EmptyMini title="No events scheduled" hint="Scheduled events drive homepage countdowns and LIVE transitions." />}
            {db.events.map(x => (
              <article key={x.id} className="glass rounded-2xl p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[12px] text-[var(--gold)]">{x.type}</span>
                  <span className="ml-auto flex items-center gap-2">
                    <StatusBadge value={x.live ? 'LIVE' : eventStatus(x, Date.now())} pulse={!!x.live} />
                    <button onClick={() => toggleEventLive(x.id, 'Dept Admin')} className={btnGhost}>{x.live ? 'End live' : 'Go live'}</button>
                    <button onClick={() => deleteEvent(x.id, 'Dept Admin')} aria-label={`Delete ${x.title}`} className="grid h-8 w-8 place-items-center rounded-full text-red-500 hover:bg-red-500/10"><Trash2 size={15} aria-hidden /></button>
                  </span>
                </div>
                <h3 className="mt-1 font-semibold">{x.title}</h3>
                <p className="text-[13px] text-[var(--muted)]">{fmtDT(x.startISO)} → {fmtDT(x.endISO)} · {x.venue}</p>
                <p className="mt-2"><CountdownText targetISO={x.startISO} /></p>
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === 'Live TV' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <form className="glass h-fit rounded-3xl p-5" aria-label="Live stream control"
            onSubmit={e => { e.preventDefault(); setLive({ title: liveTitle, streamUrl: stream }, 'Dept Admin'); }}>
            <p className="eyebrow text-[var(--gold)]">Stream control</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
              Status: {db.live.active ? <StatusBadge value="LIVE" pulse /> : <StatusBadge value="COMPLETED" />}
              <span className="font-normal text-[var(--muted)]">{db.live.active ? db.live.title : 'Department Live TV is currently offline.'}</span>
            </p>
            <label className="mb-1.5 mt-4 block text-[13px] font-medium" htmlFor="lv-t">Stream title</label>
            <input id="lv-t" value={liveTitle} onChange={e => setLiveTitle(e.target.value)} placeholder="e.g. Guest Lecture — AI in Healthcare" className={inp} />
            <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="lv-u">YouTube live URL (only YouTube embeds allowed)</label>
            <input id="lv-u" value={stream} onChange={e => setStream(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" className={inp} />
            <div className="mt-4 flex gap-2">
              <button type="submit" onClick={() => setLive({ active: true, startedAt: new Date().toISOString() }, 'Dept Admin')} className={btnPrimary}>Go live</button>
              <button type="button" onClick={() => setLive({ active: false }, 'Dept Admin')} className={btnGhost}>Stop stream</button>
            </div>
            <p className="mt-3 text-[12px] text-[var(--muted)]">Only official college/department streams. Never embed copyrighted or unauthorized content.</p>
          </form>
          <form className="glass h-fit rounded-3xl p-5" aria-label="Add on-demand video"
            onSubmit={e => { e.preventDefault(); if (!od.title.trim()) return; addOnDemand(od); setOd({ title: '', kind: 'Lecture', duration: '' }); }}>
            <p className="eyebrow text-[var(--gold)]">On-demand library</p>
            <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="od-t">Title</label>
            <input id="od-t" value={od.title} onChange={e => setOd({ ...od, title: e.target.value })} className={inp} required />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="od-k">Kind</label>
                <select id="od-k" value={od.kind} onChange={e => setOd({ ...od, kind: e.target.value })} className={inp}>
                  {['Lecture', 'Event', 'Workshop', 'Seminar', 'Student activity'].map(k => <option key={k}>{k}</option>)}
                </select></div>
              <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="od-d">Duration</label>
                <input id="od-d" value={od.duration} onChange={e => setOd({ ...od, duration: e.target.value })} placeholder="42 min" className={inp} /></div>
            </div>
            <button className={btnPrimary + ' mt-3 w-full'}><Plus size={15} aria-hidden /> Add recording</button>
            <p className="mt-3 text-[13px] text-[var(--muted)]">{db.onDemand.length} recordings in library.</p>
          </form>
        </div>
      )}

      {tab === 'Notices' && (
        <form className="glass max-w-xl rounded-3xl p-5" aria-label="Send notice"
          onSubmit={e => { e.preventDefault(); if (!notice.title.trim()) return; notify(notice.audience, 'Department', notice.title, notice.body || notice.title); setNotice({ audience: 'all', title: '', body: '' }); }}>
          <p className="eyebrow text-[var(--gold)]">Broadcast notice</p>
          <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="nt-a">Audience</label>
          <select id="nt-a" value={notice.audience} onChange={e => setNotice({ ...notice, audience: e.target.value as Role | 'all' })} className={inp}>
            <option value="all">Everyone</option><option value="student">Students</option><option value="faculty">Faculty</option><option value="hod">HOD</option>
          </select>
          <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="nt-t">Title</label>
          <input id="nt-t" value={notice.title} onChange={e => setNotice({ ...notice, title: e.target.value })} className={inp} required />
          <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="nt-b">Body</label>
          <textarea id="nt-b" rows={3} value={notice.body} onChange={e => setNotice({ ...notice, body: e.target.value })} className={inp} />
          <button className={btnPrimary + ' mt-3'}>Send to inboxes</button>
        </form>
      )}

      {tab === 'Careers' && (
        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <form className="glass h-fit rounded-3xl p-5" aria-label="Post placement drive"
            onSubmit={e => { e.preventDefault(); if (!drv.company.trim() || !drv.role.trim()) return; addDrive(drv); setDrv({ company: '', role: '', date: '', venue: '', eligibility: '', skills: '', deadline: '', desc: '' }); }}>
            <label className="mb-1.5 block text-[13px] font-medium" htmlFor="dr-c">Company</label>
            <input id="dr-c" value={drv.company} onChange={e => setDrv({ ...drv, company: e.target.value })} className={inp} required />
            <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="dr-r">Role</label>
            <input id="dr-r" value={drv.role} onChange={e => setDrv({ ...drv, role: e.target.value })} className={inp} required />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="dr-d">Drive date</label>
                <input id="dr-d" type="date" value={drv.date} onChange={e => setDrv({ ...drv, date: e.target.value })} className={inp} /></div>
              <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="dr-dl">Apply by</label>
                <input id="dr-dl" type="date" value={drv.deadline} onChange={e => setDrv({ ...drv, deadline: e.target.value })} className={inp} /></div>
            </div>
            <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="dr-v">Venue</label>
            <input id="dr-v" value={drv.venue} onChange={e => setDrv({ ...drv, venue: e.target.value })} className={inp} />
            <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="dr-e">Eligibility</label>
            <input id="dr-e" value={drv.eligibility} onChange={e => setDrv({ ...drv, eligibility: e.target.value })} placeholder="CGPA 7.5+, 2027 batch" className={inp} />
            <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="dr-s">Required skills</label>
            <input id="dr-s" value={drv.skills} onChange={e => setDrv({ ...drv, skills: e.target.value })} placeholder="DSA · React · SQL" className={inp} />
            <label className="mb-1.5 mt-3 block text-[13px] font-medium" htmlFor="dr-x">Description</label>
            <textarea id="dr-x" rows={2} value={drv.desc} onChange={e => setDrv({ ...drv, desc: e.target.value })} className={inp} />
            <button className={btnPrimary + ' mt-3 w-full'}><Plus size={15} aria-hidden /> Post drive</button>
          </form>
          <div className="space-y-2.5">
            {db.drives.length === 0 && <EmptyMini title="No drives posted" />}
            {db.drives.map(d => (
              <article key={d.id} className="glass rounded-2xl p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{d.role} · {d.company}</h3>
                  <button onClick={() => deleteDrive(d.id, 'Dept Admin')} aria-label={`Remove ${d.company} drive`} className="ml-auto grid h-8 w-8 place-items-center rounded-full text-red-500 hover:bg-red-500/10"><Trash2 size={15} aria-hidden /></button>
                </div>
                <p className="text-[13px] text-[var(--muted)]">{d.date || 'date TBD'} · {d.venue} · Apply by {d.deadline || '—'} · {d.eligibility}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === 'Resources' && (
        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <form className="glass h-fit rounded-3xl p-5" aria-label="Publish learning resource"
            onSubmit={e => { e.preventDefault(); if (!res.title.trim()) return; addResource(res); setRes({ subject: 'CS3491', unit: 'Unit 1', title: '', type: 'Notes', meta: '' }); }}>
            <label className="mb-1.5 block text-[13px] font-medium" htmlFor="rs-t">Title</label>
            <input id="rs-t" value={res.title} onChange={e => setRes({ ...res, title: e.target.value })} className={inp} required />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="rs-s">Subject</label>
                <select id="rs-s" value={res.subject} onChange={e => setRes({ ...res, subject: e.target.value })} className={inp}>
                  {['CS3491', 'CS3451', 'CS3461', 'IT3401'].map(s => <option key={s}>{s}</option>)}
                </select></div>
              <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="rs-u">Unit</label>
                <input id="rs-u" value={res.unit} onChange={e => setRes({ ...res, unit: e.target.value })} className={inp} /></div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="rs-ty">Type</label>
                <select id="rs-ty" value={res.type} onChange={e => setRes({ ...res, type: e.target.value as LearnRes['type'] })} className={inp}>
                  {['Notes', 'PDF', 'Video', 'Link'].map(t => <option key={t}>{t}</option>)}
                </select></div>
              <div><label className="mb-1.5 block text-[13px] font-medium" htmlFor="rs-m">Meta</label>
                <input id="rs-m" value={res.meta} onChange={e => setRes({ ...res, meta: e.target.value })} placeholder="PDF · 20 pages" className={inp} /></div>
            </div>
            <button className={btnPrimary + ' mt-3 w-full'}><Plus size={15} aria-hidden /> Publish to students</button>
          </form>
          <div className="space-y-2.5">
            {db.resources.map(r => (
              <article key={r.id} className="glass rounded-2xl p-4">
                <p className="font-mono text-[11px] text-[var(--gold)]">{r.subject} · {r.unit} · {r.type}</p>
                <h3 className="mt-0.5 font-semibold">{r.title}</h3>
                <p className="text-[13px] text-[var(--muted)]">{r.meta}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === 'Users' && (
        <div className="glass overflow-x-auto rounded-3xl">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead><tr className="border-b hairline text-[12px] uppercase tracking-wider text-[var(--muted)]">
              {['Register no.', 'Name', 'Year', 'Sec', 'CGPA', 'Attendance'].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}
            </tr></thead>
            <tbody>
              {db.directory.map(s => (
                <tr key={s.regNo} className="border-t hairline">
                  <td className="px-4 py-2.5 font-mono">{s.regNo}</td><td className="px-4 py-2.5 font-medium">{s.name}</td>
                  <td className="px-4 py-2.5">{s.year}</td><td className="px-4 py-2.5">{s.section}</td>
                  <td className="px-4 py-2.5 tabular-nums">{s.cgpa === null ? '—' : s.cgpa.toFixed(2)}</td>
                  <td className="px-4 py-2.5 tabular-nums">{s.attendance}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Audit' && (
        <div className="space-y-2">
          {db.audit.map(a => (
            <Reveal key={a.id}>
              <div className="glass rounded-2xl px-4 py-3 text-sm">
                <p><strong>{a.actor}</strong> <span className="font-mono text-[11px] text-[var(--muted)]">({a.role})</span> — {a.action}</p>
                <p className="text-[13px] text-[var(--muted)]">{a.detail} · {fmtDT(a.timeISO)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
