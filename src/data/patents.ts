// patents.ts — VERIFIED patents (dscet.ac.in/information-technology). No invented records.
export interface Patent {
  id: string; title: string; inventors: string[]; faculty: string;
  status: string; year: string; area: string; verified: boolean;
}

export const PATENTS: Patent[] = [
  {
    id: 'pat1',
    title: 'Blockchain based cloud storage with verifiable data integrity',
    inventors: ['Dr. K. Ravikumar', 'R. Swarna Teja', 'P. Varalakshmi'],
    faculty: 'Dr. K. Ravikumar',
    status: 'Published', year: 'Information will be updated.', area: 'Blockchain · Cloud',
    verified: true,
  },
  {
    id: 'pat2',
    title: 'Decentralized machine learning model training using blockchain technology',
    inventors: ['Dr. K. Ravikumar', 'M. R. Monika', 'S. Jothilakshmi'],
    faculty: 'Dr. K. Ravikumar',
    status: 'Published', year: 'Information will be updated.', area: 'Blockchain · ML',
    verified: true,
  },
];
