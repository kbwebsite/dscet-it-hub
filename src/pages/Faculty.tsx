import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { FACULTY, FACULTY_STATUS, FACULTY_ROLES } from '../data/faculty';
import { PageHero } from '../components/layout';
import { Reveal, EmptyState } from '../components/ui';
import { PendingNotice } from '../components/visuals';
import { FacultyCard } from '../components/cards';

export function FacultyList() {
  return (
    <>
      <PageHero eyebrow="People" title="Faculty directory."
        lede="Database-driven profiles — photograph, designation, qualification, specialization, research and contact — ready to publish the moment official data arrives."
        trail={[{ label: 'Home', to: '/' }, { label: 'Faculty' }]} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5" aria-label="Faculty directory">
        <div className="flex flex-wrap gap-2" aria-label="Role filter">
          {FACULTY_ROLES.map(r => (
            <span key={r} className="rounded-full border hairline px-3.5 py-1.5 text-[13px] text-[var(--muted)]">{r}</span>
          ))}
        </div>
        {FACULTY.length === 0 ? (
          <div className="mt-6">
            <EmptyState title={FACULTY_STATUS} hint="The official department page confirms faculty details are coming shortly. This directory — search, filters and profile pages — is already built and will populate without any redesign." icon={<Users size={18} aria-hidden />} />
            <Reveal className="mt-4"><PendingNotice text="Faculty profiles are being updated. (Source: dscet.ac.in/information-technology — 'Faculty details will be updated shortly.')" /></Reveal>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{FACULTY.map(f => <FacultyCard key={f.id} f={f} />)}</div>
        )}
      </section>
    </>
  );
}

export function FacultyDetail() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-5">
      <h1 className="font-display text-3xl">Faculty profiles are being updated.</h1>
      <p className="mt-2 text-[var(--muted)]">Individual profile pages go live with the official roster.</p>
      <Link to="/faculty" className="mt-5 inline-block rounded-full bg-[#070d1d] px-5 py-2.5 text-sm text-white dark:bg-[#38bdf8] dark:text-[#04070e]">Back to directory</Link>
    </div>
  );
}
