// department.ts — VERIFIED institutional facts (source: dscet.ac.in/information-technology/).
// Preserve meaning; do not alter factual numbers. Everything else → pending.
export interface Milestone { year: string; title: string; desc: string; verified: boolean }
export interface DeptFact { label: string; value: string; verified: boolean }

export const DEPARTMENT = {
  name: 'Department of Information Technology',
  established: 2001,
  hod: 'Dr. Ravikumar', // name only — official page lists "HOD: Dr. Ravikumar"
  program: 'B.Tech Information Technology',
  about:
    'Information Technology (IT) is a specialized branch of engineering dedicated to designing, developing, managing, and securing information systems and digital infrastructure. It covers a wide range of areas such as software engineering, cloud computing, cybersecurity, data analytics, networking, and artificial intelligence. IT professionals engage with advanced technologies including blockchain, the Internet of Things (IoT), big data, and automation to improve efficiency, enhance security, and strengthen connectivity across various sectors.',
  vision:
    'To emerge as a leading center in Information Technology education, research, and innovation by promoting the creation and sharing of knowledge, and by nurturing skilled IT professionals who effectively contribute to national development and address global challenges.',
  mission: [
    'To deliver value-based education in Information Technology through an effective integration of theoretical knowledge, practical exposure, and innovation.',
    'To encourage research, development, and consultancy in emerging IT domains to meet local, global, societal, and industrial needs.',
    'To develop technically proficient, ethically responsible, and globally competitive professionals dedicated to lifelong learning and sustainable development goals.',
  ],
  peos: [
    'PEO 1: Graduates of the program will be proficient in identifying, formulating and solving complex problems by applying their knowledge of mathematics, science and Information Technology principles.',
    'PEO 2: Graduates of the program will be capable of analysing, designing, implementing and managing software projects through continuous learning and use modern tools to meet real-world constraints.',
    'PEO 3: Graduates of the program exhibit professionalism with ethical attitude, communication, team work and will contribute to society needs.',
  ],
};

export const MILESTONES: Milestone[] = [
  { year: '2001', title: 'Establishment of the Information Technology department', desc: 'Department founded at DSCET, Mamallapuram.', verified: true },
  { year: '2012', title: 'Permanent affiliation from Anna University', desc: 'The Department of IT received permanent affiliation from Anna University.', verified: true },
  { year: '2022', title: 'Sanctioned intake increased from 60 to 120', desc: 'Sanctioned intake for the IT course was increased from 60 to 120 students.', verified: true },
  { year: '2023', title: 'NBA accreditation · total strength 120', desc: 'NBA accreditation (2023). The reported total strength of the IT department is 120 students.', verified: true },
  { year: '2024', title: 'Intake increased from 120 to 240', desc: 'As reported on the official department page.', verified: true },
];

export const DEPT_DETAILS: DeptFact[] = [
  { label: 'NBA accreditation', value: '2023', verified: true },
  { label: 'Best Industry-linked department award', value: 'Information will be updated.', verified: false },
  { label: 'Research centre', value: 'Information will be updated.', verified: false },
  { label: 'Faculty awards and fellowships', value: 'Information will be updated.', verified: false },
  { label: 'Sponsored research projects', value: 'Information will be updated.', verified: false },
  { label: 'Publications by faculty (national/international journals)', value: '3 (as listed on official page; journal library below records 8 verified papers)', verified: true },
  { label: 'Student participation', value: 'Over 50+ students actively participated in Symposiums, Hackathons, Paper Presentations, Conferences, and Workshops at reputed institutions like MNM Jain College, Jeppiaar University, NPSBCET and Pondicherry University.', verified: true },
  { label: "Student projects with industry", value: 'Vcodez, fldsmith and other leading private industries (as listed).', verified: true },
  { label: 'MoUs', value: 'VPS Code Builder, INETZ Technologies, GRASPEAR Solutions Private Limited, KAIZEN Tech Soft.', verified: true },
  { label: 'International certification course', value: 'Oracle', verified: true },
];

export const HIGHLIGHTS = [
  { n: '01', title: 'Consistent placements since inception', desc: 'Good placement records since from the inception of the program (official highlight; statistics will be updated).', verified: true },
  { n: '02', title: '50+ active student participants', desc: 'Symposiums, hackathons, paper presentations, conferences and workshops at reputed institutions.', verified: true },
  { n: '03', title: 'Strong industry collaborations', desc: 'VPS Code Builder, INETZ Technologies, GRASPEAR Solutions and KAIZEN Tech Soft.', verified: true },
];
