// achievements.ts — verified recognition only; everything else pending.
export interface Achievement { id: string; group: string; title: string; detail: string; year: string; verified: boolean }

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', group: 'Department', title: 'NBA accreditation (2023)', detail: 'As recorded in the official department details.', year: '2023', verified: true },
  { id: 'a2', group: 'Students', title: '50+ students in symposiums, hackathons & conferences', detail: 'Active participation at MNM Jain College, Jeppiaar University, NPSBCET and Pondicherry University, including paper presentations and workshops.', year: 'Information will be updated.', verified: true },
  { id: 'a3', group: 'Students', title: 'Oracle international certification course', detail: 'International certification course offered (official highlight).', year: 'Information will be updated.', verified: true },
];
export const ACHIEVEMENTS_STATUS = 'Further student, faculty and research achievements will be updated.';
