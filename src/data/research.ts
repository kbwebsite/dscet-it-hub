// research.ts — research portal content.
// Areas below are "areas of interest" (not formal department claims) except where
// the official page evidences them (blockchain, ML, cloud, security).
export interface ResearchArea { name: string; desc: string; evidenced: boolean }

export const RESEARCH_AREAS: ResearchArea[] = [
  { name: 'Artificial Intelligence & Machine Learning', desc: 'Deep learning, load balancing, medical imaging, energy systems — evidenced by published papers.', evidenced: true },
  { name: 'Blockchain', desc: 'Verifiable cloud storage and decentralized model training — evidenced by published patents.', evidenced: true },
  { name: 'Cloud Computing', desc: 'Load balancing and scheduling in virtualized environments — evidenced by published papers.', evidenced: true },
  { name: 'Cybersecurity', desc: 'Ethical hacking, vulnerability assessment and network security via the Cyber Security Laboratory.', evidenced: true },
  { name: 'Data Science', desc: 'Predictive modelling for healthcare and engineering systems — an area of interest.', evidenced: false },
  { name: 'Software Engineering', desc: 'Cost estimation and technical-debt management — evidenced by published papers.', evidenced: true },
  { name: 'Networking', desc: 'Communication networking and network security — an area of interest.', evidenced: false },
  { name: 'Internet of Things', desc: 'Connected devices and automation — an area of interest.', evidenced: false },
];

export const INDUSTRY_MOUS = [
  { name: 'VPS Code Builder', desc: 'MoU partner (official). Scope details will be updated.' },
  { name: 'INETZ Technologies', desc: 'MoU partner (official). Scope details will be updated.' },
  { name: 'GRASPEAR Solutions Private Limited', desc: 'MoU partner (official). Scope details will be updated.' },
  { name: 'KAIZEN Tech Soft', desc: 'MoU partner (official). Scope details will be updated.' },
];

export const CONSULTANCY_STATUS = 'Testing and consultancy details will be updated shortly (official).';
export const RD_ACTIVITIES_STATUS = 'R&D activities details will be updated shortly (official).';
export const SCHOLARS_STATUS = 'Research scholar records will be updated.';
