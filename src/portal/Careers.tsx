// Student career center — placement drives, eligibility, deadlines and
// one-tap registration (filed as a tracked request). Sample drives are
// clearly demo data; real drives arrive via the admin console.
import { Link } from 'react-router-dom';
import { Briefcase, Check } from 'lucide-react';
import { usePortal, fmtD } from './store';
import { SectionHead, StatusBadge, EmptyMini, btnPrimary } from './widgets';
import { Reveal } from '../components/ui';

export function Careers() {
  const { db, applyRequest } = usePortal();
  const registered = (id: string) => db.requests.some(r => r.detail.includes(`ref:${id}`));
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="Career center" title="Placement drives"
        lede="Company drives with eligibility, skills, venue and deadlines. Registration is tracked as a request."
        action={<Link to="/portal/records" className="text-[13px] font-semibold text-[var(--gold)]">My internships →</Link>} />
      {db.drives.length === 0 && <EmptyMini title="No active drives" hint="New company drives appear here once the placement cell posts them." />}
      <div className="grid gap-3 md:grid-cols-2">
        {db.drives.map(d => {
          const done = registered(d.id);
          return (
            <Reveal key={d.id}>
              <article className="glass card-lift flex h-full flex-col rounded-3xl p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span aria-hidden className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#4f46e5] text-white"><Briefcase size={19} /></span>
                  <div><h3 className="font-display text-lg leading-tight">{d.role}</h3>
                    <p className="text-sm text-[var(--muted)]">{d.company}</p></div>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-2 text-[13px]">
                  {[['Drive date', fmtD(d.date)], ['Venue', d.venue], ['Apply by', fmtD(d.deadline)], ['Eligibility', d.eligibility]].map(([k, v]) => (
                    <div key={k} className="rounded-xl border hairline px-3 py-2"><dt className="text-[12px] text-[var(--muted)]">{k}</dt><dd className="font-medium">{v}</dd></div>
                  ))}
                </dl>
                <p className="mt-2 text-[13px]"><span className="text-[var(--muted)]">Skills: </span>{d.skills}</p>
                <p className="mt-1 text-[13px] text-[var(--muted)]">{d.desc}</p>
                <div className="mt-4 flex items-center gap-2">
                  <StatusBadge value={done ? 'APPROVED' : 'UPCOMING'} />
                  {done ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-300"><Check size={15} aria-hidden /> Registered — track under Requests</span>
                  ) : (
                    <button
                      onClick={() => applyRequest({ kind: 'Event', title: `Drive registration: ${d.company} — ${d.role}`, detail: `Registered via Career Center. ref:${d.id} · ${d.date} · ${d.venue}`, student: 'Arjun S', regNo: '2023IT042', year: 'II', section: 'A' })}
                      className={btnPrimary + ' ml-auto'}>Register interest</button>
                  )}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
      <p className="text-[12px] text-[var(--muted)]">Placement training schedules and interview information are announced via Notifications. Sample drives shown for demo evaluation.</p>
    </div>
  );
}
