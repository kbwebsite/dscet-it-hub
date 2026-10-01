import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { SITE, PENDING_NOTICE } from '../lib';
import { PageHero } from '../components/layout';
import { SectionHeader, Reveal, ContactForm } from '../components/ui';
import { VerifiedBadge } from '../components/visuals';

export default function Contact() {
  return (
    <>
      <PageHero eyebrow="Visit · Call · Write" title="Talk to the department."
        lede="Verified college contact information. Department-specific email addresses are not officially published — no address is invented here."
        trail={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-5 lg:grid-cols-[380px_1fr]">
        <Reveal>
          <aside className="glass h-fit rounded-3xl p-6" aria-label="Contact details">
            <p className="eyebrow text-[var(--gold)]">College & department</p>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex gap-2.5"><MapPin size={16} aria-hidden className="mt-0.5 shrink-0 text-[var(--gold)]" /><span>{SITE.address}<br />{SITE.district} <VerifiedBadge /></span></li>
              <li className="flex gap-2.5"><Phone size={16} aria-hidden className="mt-0.5 shrink-0 text-[var(--gold)]" /><span>Office: {SITE.phone}<br /><span className="text-[var(--muted)]">Admissions: {SITE.admissionsPhone}</span> <VerifiedBadge /></span></li>
              <li className="flex gap-2.5"><Mail size={16} aria-hidden className="mt-0.5 shrink-0 text-[var(--gold)]" /><span>{SITE.email} <VerifiedBadge /><br /><span className="text-[var(--muted)]">Department email: {PENDING_NOTICE}</span></span></li>
              <li className="flex gap-2.5"><Clock size={16} aria-hidden className="mt-0.5 shrink-0 text-[var(--gold)]" /><span>Dept. Library: 8:30 AM – 3:30 PM (verified)<br /><span className="text-[var(--muted)]">Office: {SITE.officeHours}</span></span></li>
            </ul>
            <div className="mt-5 overflow-hidden rounded-2xl border hairline" aria-label="Map">
              <iframe title="DSCET Mamallapuram on OpenStreetMap — official Google Maps embed will replace this before launch"
                src="https://www.openstreetmap.org/export/embed.html?bbox=80.10%2C12.55%2C80.30%2C12.70&layer=mapnik&marker=12.6269%2C80.1927"
                className="h-52 w-full" loading="lazy" />
            </div>
            <a href="https://dscet.ac.in/" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-[var(--gold)]">Official DSCET website <ExternalLink size={13} aria-hidden /></a>
          </aside>
        </Reveal>
        <Reveal delay={0.06}>
          <div>
            <SectionHeader eyebrow="Enquiry" title="Send a department enquiry." lede="Validated form with clear success/error states. Connects to the college ticketing endpoint before launch." />
            <div className="mt-6"><ContactForm /></div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
