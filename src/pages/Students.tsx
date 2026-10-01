import { PROJECT_CATEGORIES, PROJECTS, PROJECTS_STATUS, INDUSTRY_PROJECT_NOTE } from '../data/projects';
import { ACHIEVEMENTS, ACHIEVEMENTS_STATUS } from '../data/achievements';
import { PageHero } from '../components/layout';
import { SectionHeader, EmptyState, Reveal } from '../components/ui';
import { VerifiedBadge, PendingNotice } from '../components/visuals';
import { AchievementTile } from '../components/cards';

export function Students() {
  return (
    <>
      <PageHero eyebrow="Student experience" title="Build, compete, present, ship."
        lede="Projects, hackathons, symposiums, paper presentations, workshops, internships and certifications — the complete student ecosystem, honestly labelled."
        trail={[{ label: 'Home', to: '/' }, { label: 'Students' }]} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5" aria-label="Student ecosystem">
        <SectionHeader eyebrow="Verified participation" title="50+ students on national stages"
          lede="Symposiums, hackathons, paper presentations, conferences and workshops at MNM Jain College, Jeppiaar University, NPSBCET and Pondicherry University." />
        <p className="mt-3"><VerifiedBadge /></p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[['Hackathons', 'Inter-collegiate build sprints. Records will be updated.'], ['Symposiums', 'Technical symposium participation. Records will be updated.'], ['Paper Presentations', 'Student papers at conferences. Records will be updated.'], ['Workshops & Certifications', 'Oracle international certification (verified) plus value-added courses.']].map(([t, d]) => (
            <Reveal key={t}><article className="glass card-lift rounded-2xl p-5"><h3 className="font-display text-lg">{t}</h3><p className="mt-1 text-sm text-[var(--muted)]">{d}</p></article></Reveal>
          ))}
        </div>
      </section>
      <section id="projects" className="scroll-mt-24 border-t hairline bg-[var(--bg-elev)]/60" aria-label="Project showcase">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-5">
          <SectionHeader eyebrow="Showcase" title="Student project gallery"
            lede={`Categories ready: ${PROJECT_CATEGORIES.slice(1).join(' · ')}. ${INDUSTRY_PROJECT_NOTE}`} />
          <div className="mt-6">
            {PROJECTS.length === 0
              ? <EmptyState title="Verified projects will appear here" hint={PROJECTS_STATUS} />
              : null}
          </div>
          <div className="mt-4"><PendingNotice text={PROJECTS_STATUS} /></div>
        </div>
      </section>
    </>
  );
}

export function Achievements() {
  return (
    <>
      <PageHero eyebrow="Recognition" title="Achievements on the record."
        lede="Only verified recognition appears below. Further student, faculty and research achievements will be added with evidence."
        trail={[{ label: 'Home', to: '/' }, { label: 'Achievements' }]} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5" aria-label="Achievements timeline">
        <ol className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map(a => <AchievementTile key={a.id} a={a} />)}
        </ol>
        <Reveal className="mt-6"><PendingNotice text={ACHIEVEMENTS_STATUS} /></Reveal>
      </section>
    </>
  );
}
