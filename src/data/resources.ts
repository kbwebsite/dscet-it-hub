// resources.ts — resource center + department library (verified) + timetable/calendar (pending).
export interface Doc { id: string; title: string; category: string; meta: string; kind: string; href: string; verified: boolean }

export const DOCUMENTS: Doc[] = [
  { id: 'd1', title: 'B.Tech IT — Programme, PO/PSO & Eligibility (official)', category: 'Syllabus', meta: 'dscet.ac.in · official page', kind: 'LINK', href: 'https://dscet.ac.in/btech-information-technology/', verified: true },
  { id: 'd2', title: 'Regulations & Curriculum (DSCET)', category: 'Regulations', meta: 'dscet.ac.in · official', kind: 'LINK', href: 'https://dscet.ac.in/regulations-and-curriculum', verified: true },
  { id: 'd3', title: 'IT Department Page (official reference)', category: 'Handbooks', meta: 'dscet.ac.in · official', kind: 'LINK', href: 'https://dscet.ac.in/information-technology/', verified: true },
  { id: 'd4', title: 'Semester syllabus documents', category: 'Syllabus', meta: 'Information will be updated.', kind: 'PDF', href: '#', verified: false },
  { id: 'd5', title: 'Previous year question papers', category: 'Question Papers', meta: 'Information will be updated.', kind: 'PDF', href: '#', verified: false },
  { id: 'd6', title: 'Lab manuals', category: 'Lab Manuals', meta: 'Coming soon.', kind: 'PDF', href: '#', verified: false },
];

export const LIBRARY = {
  books: 500,
  intlJournals: 'Information will be updated.',
  nationalJournals: 'Information will be updated.',
  newspapers: 'Information will be updated.',
  hours: '8:30 AM to 3:30 PM',
  note: 'The Information Technology department maintains a separate department library for IT students (official).',
};

export const TIMETABLE_STATUS = 'Class, laboratory and examination timetables will be updated.';
export const CALENDAR_STATUS = 'The academic calendar will be updated. Refer to the DSCET academic calendar and Anna University schedules in the interim.';
