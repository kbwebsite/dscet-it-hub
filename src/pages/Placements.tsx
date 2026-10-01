import { Link } from 'react-router-dom';
import { Building2, TrendingUp, Briefcase } from 'lucide-react';
import { INDUSTRY_MOUS } from '../data/research';
import { PageHero } from '../components/layout';
import { Reveal } from '../components/ui';
import { VerifiedBadge, PendingNotice, IndustryFlow } from '../components/visuals';

export default function Placements() {
  return (
    <>
      <PageHero eyebrow="Careers" title="Placements without fiction."
        lede="Overview, recruiters, training, process and alumni careers. No percentages or packages appear here until the placement cell publishes verified figures."
        trail={[{ label: 'Home', to: '/' }, { label: 'Placements' }]} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5" aria-label="Placement overview">
        <Reveal>
          <article className="glass rounded-3xl p-6 sm:p-8">
            <p className="eyebrow text-[var(--gold)]">Official note · <VerifiedBadge /></p>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl">Good placement records since the inception of the program.</h2>
            <p className="mt-2 max-w-2xl text-[15px] text-[var(--muted)]">That is the department's verified statement. Detailed statistics — rates, recruiters, highest and average packages — will be published once officially released.</p>
            <div className="mt-4"><PendingNotice text="Placement statistics will be updated." /></div>
          </article>
        </Reveal>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {[
            { icon: TrendingUp, t: 'Placement process', d: 'Drive schedule, eligibility and rounds will be updated with the placement cell calendar.' },
            { icon: Briefcase, t: 'Training & career development', d: 'Aptitude, communication, technical training and mock interviews. Program details will be updated.' },
            { icon: Building2, t: 'Recruiters & internships', d: 'Recruiter and internship records will be updated. Industry-linked project partners are listed under Industry Connect.' },
          ].map(c => (
            <Reveal key={c.t}><article className="glass card-lift rounded-2xl p-6"><c.icon aria-hidden className="text-[var(--gold)]" /><h3 className="font-display mt-2 text-xl">{c.t}</h3><p className="mt-2 text-sm text-[var(--muted)]">{c.d}</p></article></Reveal>
          ))}
        </div>
        <Reveal className="mt-8">
          <h3 className="font-display text-xl">Verified MoU partners</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {INDUSTRY_MOUS.map(m => <span key={m.name} className="glass rounded-full px-4 py-2 text-sm font-medium">{m.name}</span>)}
          </div>
          <div className="mt-8"><IndustryFlow partners={INDUSTRY_MOUS} /></div>
        </Reveal>
        <Reveal className="mt-8">
          <Link to="/alumni" className="inline-flex items-center gap-2 rounded-full bg-[#070d1d] px-6 py-3 text-sm font-semibold text-white dark:bg-[#38bdf8] dark:text-[#04070e]">Alumni careers →</Link>
        </Reveal>
      </section>
    </>
  );
}
