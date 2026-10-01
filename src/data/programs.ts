// programs.ts — B.Tech Information Technology (verified: dscet.ac.in/btech-information-technology).
export interface Program {
  id: string; level: string; name: string; duration: string;
  intake: string; eligibility: string[]; admission: string[];
  outcomes: { code: string; title: string; desc: string }[];
  specificOutcomes: { code: string; desc: string }[];
  downloads: { label: string; meta: string; href: string }[];
}

export const PROGRAMS: Program[] = [
  {
    id: 'btech-it',
    level: 'Undergraduate',
    name: 'B.Tech — Information Technology',
    duration: '4 years · 8 semesters',
    intake: 'Sanctioned intake 240 (2024). Previously 60 → 120 (2022).',
    eligibility: [
      'B.Tech (Regular): Higher Secondary (10+2, Academic Stream) with Mathematics, Physics and Chemistry — or Higher Secondary Vocational Stream (Engineering/Technology groups) as prescribed by the Government of Tamil Nadu.',
      'B.Tech (Lateral Entry): Diploma in Engineering/Technology (Tamil Nadu State Board or equivalent) into third semester of the corresponding branch — or B.Sc. (10+2+3) with Mathematics, with two additional Engineering subjects as prescribed.',
    ],
    admission: [
      'Admission through TNEA (Tamil Nadu Engineering Admission) counselling by Anna University — state-level counselling for B.E./B.Tech seats in Tamil Nadu.',
      'TNEA merit is drawn from qualifying examination marks; counselling schedule and venue are communicated via official call letter.',
      'Required documents: Transfer Certificate, 10th & 12th mark sheets, Community Certificate, 12th hall ticket, nativity/demand-draft/refugee certificates where applicable.',
    ],
    outcomes: [
      { code: 'PO1', title: 'Engineering Knowledge', desc: 'Apply math, science, and engineering fundamentals to complex problems.' },
      { code: 'PO2', title: 'Problem Analysis', desc: 'Identify and analyze complex problems using research and sustainability principles.' },
      { code: 'PO3', title: 'Design Solutions', desc: 'Design systems and processes considering health, safety, cost, culture, and environment.' },
      { code: 'PO4', title: 'Investigations', desc: 'Use experiments, modelling, and data analysis to reach valid conclusions.' },
      { code: 'PO5', title: 'Engineering Tools', desc: 'Apply modern tools for modelling and problem-solving, recognizing their limits.' },
      { code: 'PO6', title: 'Society & Environment', desc: 'Assess societal, legal, and environmental impacts of engineering solutions.' },
      { code: 'PO7', title: 'Ethics', desc: 'Commit to ethics, human values, diversity, and legal compliance.' },
      { code: 'PO8', title: 'Teamwork', desc: 'Work effectively as an individual and in multidisciplinary teams.' },
      { code: 'PO9', title: 'Communication', desc: 'Communicate clearly in reports, presentations, and documentation across diverse groups.' },
      { code: 'PO10', title: 'Management & Finance', desc: 'Apply management and economic principles in projects and teamwork.' },
      { code: 'PO11', title: 'Lifelong Learning', desc: 'Engage in continuous learning, adapt to new technologies, and think critically.' },
    ],
    specificOutcomes: [
      { code: 'PSO1', desc: 'Design and develop efficient and sustainable Information System for Societal and Industrial applications.' },
      { code: 'PSO2', desc: 'Acquire skills in pace with rapid advancements in the field of Information Technology for development of innovative solutions in real world problems.' },
      { code: 'PSO3', desc: 'Exhibit research aptitude, work effectively in multidisciplinary teams and uphold ethical practices.' },
    ],
    downloads: [
      { label: 'B.Tech IT — Official Programme Page', meta: 'dscet.ac.in · PO/PSO/eligibility', href: 'https://dscet.ac.in/btech-information-technology/' },
      { label: 'Regulations & Curriculum (DSCET)', meta: 'dscet.ac.in · official', href: 'https://dscet.ac.in/regulations-and-curriculum' },
      { label: 'Syllabus & Curriculum Documents', meta: 'Information will be updated.', href: '#' },
    ],
  },
];
