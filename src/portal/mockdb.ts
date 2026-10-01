// Portal data layer — typed mock backend for the Department Digital Platform.
// Demo workspace data is clearly sample data (see PortalShell badge). Real
// institutional records must only enter through verified admin publishing.
// Swap the load/save helpers with API calls to go live — UI stays untouched.

export type Role = 'student' | 'faculty' | 'hod' | 'admin';

export interface DemoUser { id: string; role: Role; name: string; tagline: string }

export const DEMO_USERS: Record<Role, DemoUser> = {
  student: { id: 'STU-DEMO', role: 'student', name: 'Arjun S', tagline: 'II Year · A Section · 2023IT042' },
  faculty: { id: 'FAC-DEMO', role: 'faculty', name: 'Demo Faculty', tagline: 'Assistant Professor · IT' },
  hod: { id: 'HOD-DEMO', role: 'hod', name: 'Demo HOD', tagline: 'Head of Department · IT' },
  admin: { id: 'ADM-DEMO', role: 'admin', name: 'Dept Admin', tagline: 'Department Administrator' },
};

export interface MarkComp { label: string; max: number; score: number | null }
export interface SubjectResult {
  code: string; name: string; credits: number;
  internal: MarkComp[];
  external: { marks: number | null; grade: string; gp: number | null };
  result: 'PASS' | 'FAIL' | '—';
}
export interface Semester { sem: number; sgpa: number | null; subjects: SubjectResult[] }

export interface AttendanceSub { code: string; name: string; present: number; total: number }
export interface AttendanceDay { date: string; status: 'P' | 'A' | 'OD' | 'H' }

export interface Period { slot: string; from: string; to: string; subject: string; faculty: string; room: string; type: 'Theory' | 'Lab' }
export interface DayTable { day: string; periods: Period[] }

export interface ExamItem { id: string; title: string; kind: 'Internal' | 'Semester' | 'Practical'; date: string; time: string; room: string; notes: string; result: boolean }

export type AssignStatus = 'NOT STARTED' | 'SUBMITTED' | 'LATE' | 'EVALUATED';
export interface Assignment { id: string; subject: string; title: string; faculty: string; dueISO: string; desc: string; status: AssignStatus; grade?: string }

export interface LearnRes { id: string; subject: string; unit: string; title: string; type: 'Notes' | 'PDF' | 'Video' | 'Link'; meta: string }

export type ReqStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export interface RequestItem {
  id: string; kind: 'Leave' | 'OD' | 'Bonafide' | 'Certificate' | 'Permission' | 'Event' | 'Internship' | 'Visit' | 'Project' | 'Other';
  title: string; detail: string; from?: string; to?: string;
  status: ReqStatus; submittedAt: string; approver?: string; remarks?: string;
  student: string; regNo: string; year: string; section: string;
}

export type NotifType = 'Academic' | 'Exam' | 'Attendance' | 'Leave' | 'Events' | 'Assignments' | 'Results' | 'Department' | 'General';
export interface Notification { id: string; type: NotifType; title: string; body: string; timeISO: string; read: boolean; audience: Role | 'all' }

export interface Achievement { id: string; title: string; category: string; date: string; org: string; desc: string; status: 'PENDING' | 'VERIFIED'; student: string }
export interface Project { id: string; title: string; team: string; mentor: string; tech: string; desc: string; progress: number; stage: 'IDEA' | 'APPROVED' | 'IN DEVELOPMENT' | 'REVIEW' | 'COMPLETED' }
export interface Internship { id: string; company: string; role: string; from: string; to: string; location: string; status: 'APPLIED' | 'ONGOING' | 'COMPLETED'; desc: string }
export interface Cert { id: string; name: string; platform: string; org: string; date: string; credential: string; verified: boolean }
export interface Drive { id: string; company: string; role: string; date: string; venue: string; eligibility: string; skills: string; deadline: string; desc: string }

export interface NewsItem { id: string; title: string; category: string; desc: string; timeISO: string; featured: boolean }
export interface DeptEvent {
  id: string; title: string; type: string; startISO: string; endISO: string;
  venue: string; organizer: string; speaker: string; desc: string; registration?: string; live?: boolean;
}
export interface LiveState { active: boolean; title: string; streamUrl: string; eventId?: string; startedAt?: string }
export interface OnDemand { id: string; title: string; kind: string; duration: string; addedAt: string }

export interface AuditItem { id: string; actor: string; role: Role; action: string; detail: string; timeISO: string }
export interface DirectoryStudent { regNo: string; name: string; year: string; section: string; cgpa: number | null; attendance: number }
export interface RosterRow { regNo: string; name: string; present: boolean | null }

export interface PortalDB {
  semesters: Semester[];
  attendance: { overall: number; subjects: AttendanceSub[]; history: AttendanceDay[] };
  timetable: DayTable[];
  exams: ExamItem[];
  assignments: Assignment[];
  resources: LearnRes[];
  requests: RequestItem[];
  notifications: Notification[];
  achievements: Achievement[];
  projects: Project[];
  internships: Internship[];
  certs: Cert[];
  drives: Drive[];
  news: NewsItem[];
  events: DeptEvent[];
  live: LiveState;
  onDemand: OnDemand[];
  audit: AuditItem[];
  directory: DirectoryStudent[];
  roster: { date: string; rows: RosterRow[] };
}

export const uid = () => `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
export const nowISO = () => new Date().toISOString();

const sub = (code: string, name: string, credits: number, im: [number | null, number | null, number | null], ex: [number | null, string, number | null], result: SubjectResult['result']): SubjectResult => ({
  code, name, credits,
  internal: [
    { label: 'Internal 1', max: 20, score: im[0] },
    { label: 'Internal 2', max: 20, score: im[1] },
    { label: 'Assignment', max: 10, score: im[2] },
  ],
  external: { marks: ex[0], grade: ex[1], gp: ex[2] }, result,
});

export const SEED: PortalDB = {
  semesters: [
    { sem: 1, sgpa: 8.42, subjects: [
      sub('HS3151', 'Professional English I', 3, [17, 18, 9], [78, 'A', 8], 'PASS'),
      sub('MA3151', 'Matrices & Calculus', 4, [16, 15, 8], [71, 'A', 8], 'PASS'),
      sub('PH3151', 'Engineering Physics', 3, [18, 17, 9], [85, 'A+', 9], 'PASS'),
      sub('CS3151', 'Problem Solving in C', 3, [19, 18, 10], [88, 'A+', 9], 'PASS'),
    ]},
    { sem: 2, sgpa: 8.65, subjects: [
      sub('CS3251', 'Data Structures', 3, [18, 19, 9], [82, 'A+', 9], 'PASS'),
      sub('CS3271', 'Data Structures Lab', 2, [19, 19, 10], [91, 'O', 10], 'PASS'),
      sub('MA3251', 'Statistics & Numerical Methods', 4, [15, 16, 8], [69, 'B+', 7], 'PASS'),
      sub('CS3291', 'Digital Principles', 3, [17, 16, 9], [74, 'A', 8], 'PASS'),
    ]},
    { sem: 3, sgpa: 8.81, subjects: [
      sub('CS3351', 'Data Structures & Algorithms', 3, [18, 18, 9], [80, 'A+', 9], 'PASS'),
      sub('CS3301', 'Database Systems', 3, [17, 18, 9], [79, 'A', 8], 'PASS'),
      sub('CS3311', 'DBMS Laboratory', 2, [20, 19, 10], [94, 'O', 10], 'PASS'),
      sub('CS3352', 'Theory of Computation', 4, [16, 15, 8], [70, 'B+', 7], 'PASS'),
    ]},
    { sem: 4, sgpa: null, subjects: [
      sub('CS3491', 'Computer Networks', 3, [17, null, 8], [null, '—', null], '—'),
      sub('CS3451', 'Operating Systems', 3, [16, null, 9], [null, '—', null], '—'),
      sub('CS3461', 'OS Laboratory', 2, [18, null, null], [null, '—', null], '—'),
      sub('IT3401', 'Web Technology', 3, [18, null, 9], [null, '—', null], '—'),
    ]},
  ],
  attendance: {
    overall: 87.4,
    subjects: [
      { code: 'CS3491', name: 'Computer Networks', present: 31, total: 36 },
      { code: 'CS3451', name: 'Operating Systems', present: 30, total: 34 },
      { code: 'CS3461', name: 'OS Laboratory', present: 16, total: 17 },
      { code: 'IT3401', name: 'Web Technology', present: 29, total: 33 },
    ],
    history: [
      { date: 'Mon', status: 'P' }, { date: 'Tue', status: 'P' }, { date: 'Wed', status: 'P' },
      { date: 'Thu', status: 'A' }, { date: 'Fri', status: 'P' }, { date: 'Mon', status: 'P' },
      { date: 'Tue', status: 'OD' }, { date: 'Wed', status: 'P' }, { date: 'Thu', status: 'P' },
      { date: 'Fri', status: 'P' }, { date: 'Mon', status: 'P' }, { date: 'Tue', status: 'P' },
      { date: 'Wed', status: 'H' }, { date: 'Thu', status: 'P' },
    ],
  },
  timetable: [
    { day: 'Monday', periods: [
      { slot: 'P1', from: '09:00', to: '09:50', subject: 'CS3491 · Networks', faculty: 'Demo Faculty', room: 'IT-301', type: 'Theory' },
      { slot: 'P2', from: '09:50', to: '10:40', subject: 'CS3451 · OS', faculty: 'Demo Faculty', room: 'IT-301', type: 'Theory' },
      { slot: 'P3', from: '11:00', to: '12:30', subject: 'CS3461 · OS Lab', faculty: 'Demo Faculty', room: 'System SW Lab', type: 'Lab' },
      { slot: 'P4', from: '13:30', to: '14:20', subject: 'IT3401 · Web Tech', faculty: 'Demo Faculty', room: 'IT-302', type: 'Theory' },
    ]},
    { day: 'Tuesday', periods: [
      { slot: 'P1', from: '09:00', to: '09:50', subject: 'IT3401 · Web Tech', faculty: 'Demo Faculty', room: 'IT-302', type: 'Theory' },
      { slot: 'P2', from: '09:50', to: '10:40', subject: 'CS3491 · Networks', faculty: 'Demo Faculty', room: 'Network Lab', type: 'Theory' },
      { slot: 'P3', from: '11:00', to: '12:30', subject: 'Mini Project Hour', faculty: 'Mentor', room: 'Project Lab', type: 'Lab' },
    ]},
    { day: 'Wednesday', periods: [
      { slot: 'P1', from: '09:00', to: '09:50', subject: 'CS3451 · OS', faculty: 'Demo Faculty', room: 'IT-301', type: 'Theory' },
      { slot: 'P2', from: '09:50', to: '10:40', subject: 'CS3491 · Networks', faculty: 'Demo Faculty', room: 'IT-301', type: 'Theory' },
      { slot: 'P3', from: '11:00', to: '11:50', subject: 'Placement Training', faculty: 'CDC Cell', room: 'Seminar Hall', type: 'Theory' },
    ]},
    { day: 'Thursday', periods: [
      { slot: 'P1', from: '09:00', to: '10:30', subject: 'IT3401 · Web Lab', faculty: 'Demo Faculty', room: 'System SW Lab', type: 'Lab' },
      { slot: 'P2', from: '11:00', to: '11:50', subject: 'CS3451 · OS', faculty: 'Demo Faculty', room: 'IT-301', type: 'Theory' },
    ]},
    { day: 'Friday', periods: [
      { slot: 'P1', from: '09:00', to: '09:50', subject: 'CS3491 · Networks', faculty: 'Demo Faculty', room: 'Network Lab', type: 'Theory' },
      { slot: 'P2', from: '09:50', to: '10:40', subject: 'Club Activity', faculty: 'Club Mentor', room: 'IT Block', type: 'Theory' },
    ]},
  ],
  exams: [
    { id: 'ex1', title: 'Internal Assessment II', kind: 'Internal', date: 'To be scheduled', time: '9:30 AM onwards', room: 'IT Block halls', notes: 'Timetable will be confirmed by the exam cell.', result: false },
    { id: 'ex2', title: 'Semester Practical Examinations', kind: 'Practical', date: 'To be scheduled', time: 'As per batch slots', room: 'IT Laboratories', notes: 'Record notebooks must be completed before the exam.', result: false },
  ],
  assignments: [
    { id: 'as1', subject: 'CS3491', title: 'Subnetting & CIDR problem set', faculty: 'Demo Faculty', dueISO: new Date(Date.now() + 3 * 864e5).toISOString(), desc: 'Solve the 10-problem set on subnet design and submit as PDF.', status: 'NOT STARTED' },
    { id: 'as2', subject: 'IT3401', title: 'Responsive portfolio build', faculty: 'Demo Faculty', dueISO: new Date(Date.now() - 2 * 864e5).toISOString(), desc: 'Build and deploy a two-page responsive site.', status: 'SUBMITTED' },
  ],
  resources: [
    { id: 'r1', subject: 'CS3491', unit: 'Unit 1', title: 'Network models & TCP/IP notes', type: 'Notes', meta: 'PDF · 42 pages' },
    { id: 'r2', subject: 'CS3451', unit: 'Unit 2', title: 'Process scheduling solved problems', type: 'PDF', meta: 'PDF · 18 pages' },
    { id: 'r3', subject: 'IT3401', unit: 'Unit 3', title: 'Flexbox & Grid visual guide', type: 'Video', meta: 'Video · 24 min' },
  ],
  requests: [
    { id: 'REQ-1042', kind: 'Leave', title: 'Fever — 2 days', detail: 'Viral fever, resting at home.', from: '2026-09-28', to: '2026-09-29', status: 'APPROVED', submittedAt: '2026-09-27T08:12:00', approver: 'Demo Faculty', remarks: 'Get well soon. Attendance updated.', student: 'Arjun S', regNo: '2023IT042', year: 'II', section: 'A' },
    { id: 'REQ-1043', kind: 'OD', title: 'Hackathon — BuildFest finals', detail: 'On-duty for inter-college hackathon finals at city campus.', from: '2026-10-09', to: '2026-10-10', status: 'PENDING', submittedAt: '2026-10-01T10:02:00', student: 'Arjun S', regNo: '2023IT042', year: 'II', section: 'A' },
    { id: 'REQ-1044', kind: 'Bonafide', title: 'Bonafide for bank account', detail: 'Required for education documentation at bank.', status: 'PENDING', submittedAt: '2026-10-02T09:20:00', student: 'Priya D', regNo: '2023IT018', year: 'II', section: 'A' },
  ],
  notifications: [
    { id: 'nt1', type: 'Academic', title: 'IA-II schedule will be released soon', body: 'The exam cell will publish the Internal Assessment II timetable. Keep records ready.', timeISO: new Date(Date.now() - 5 * 36e5).toISOString(), read: false, audience: 'all' },
    { id: 'nt2', type: 'Assignments', title: 'Subnetting problem set due in 3 days', body: 'CS3491 assignment deadline approaching. Submit as PDF.', timeISO: new Date(Date.now() - 26 * 36e5).toISOString(), read: false, audience: 'student' },
    { id: 'nt3', type: 'Leave', title: 'Leave REQ-1042 approved', body: 'Your leave for Sep 28–29 was approved by Demo Faculty.', timeISO: new Date(Date.now() - 3 * 864e5).toISOString(), read: true, audience: 'student' },
    { id: 'nt4', type: 'Events', title: 'BuildFest hackathon finals', body: 'Shortlisted teams report at the city campus on Oct 9.', timeISO: new Date(Date.now() - 4 * 864e5).toISOString(), read: true, audience: 'student' },
  ],
  achievements: [
    { id: 'ac1', title: 'BuildFest hackathon — finalist', category: 'Hackathon', date: '2026-09-20', org: 'City Tech Fest', desc: 'Top-10 finish among 120 teams for a campus grievance portal.', status: 'VERIFIED', student: 'Arjun S' },
    { id: 'ac2', title: 'Oracle Cloud Foundations', category: 'Certification', date: '2026-08-14', org: 'Oracle', desc: 'Completed cloud foundations certification.', status: 'PENDING', student: 'Arjun S' },
  ],
  projects: [
    { id: 'pj1', title: 'Campus grievance portal', team: 'Arjun S + 3', mentor: 'Demo Faculty', tech: 'React · Node · Postgres', desc: 'Ticketing portal with role-based dashboards for hostel grievances.', progress: 70, stage: 'IN DEVELOPMENT' },
  ],
  internships: [
    { id: 'in1', company: 'Demo Startup', role: 'Frontend Intern', from: '2026-06-01', to: '2026-07-15', location: 'Remote', status: 'COMPLETED', desc: 'Built dashboard components and documentation site.' },
  ],
  certs: [
    { id: 'ct1', name: 'Oracle Cloud Foundations', platform: 'Oracle', org: 'Oracle', date: '2026-08-14', credential: 'OCF-2026-8841', verified: false },
  ],
  drives: [
    { id: 'dr1', company: 'Sample FinTech', role: 'SDE Intern', date: '2026-11-02', venue: 'Placement Cell', eligibility: 'CGPA 7.5+, 2027 batch', skills: 'DSA · React · SQL', deadline: '2026-10-25', desc: 'Sample drive for demo evaluation.' },
    { id: 'dr2', company: 'Sample Cloud Co.', role: 'Cloud Trainee', date: '2026-11-18', venue: 'Seminar Hall', eligibility: 'CGPA 7.0+, no backlogs', skills: 'Linux · Networking · Python', deadline: '2026-11-10', desc: 'Sample drive for demo evaluation.' },
  ],
  news: [],
  events: [],
  live: { active: false, title: '', streamUrl: '' },
  onDemand: [],
  audit: [
    { id: 'au0', actor: 'System', role: 'admin', action: 'Workspace seeded', detail: 'Demo workspace initialised with sample data.', timeISO: new Date(Date.now() - 6 * 864e5).toISOString() },
  ],
  directory: [
    { regNo: '2023IT042', name: 'Arjun S', year: 'II', section: 'A', cgpa: 8.63, attendance: 87.4 },
    { regNo: '2023IT018', name: 'Priya D', year: 'II', section: 'A', cgpa: 9.02, attendance: 93.1 },
    { regNo: '2023IT031', name: 'Karthik M', year: 'II', section: 'A', cgpa: 7.48, attendance: 71.2 },
    { regNo: '2023IT007', name: 'Divya R', year: 'II', section: 'B', cgpa: 8.91, attendance: 90.5 },
    { regNo: '2022IT055', name: 'Sanjay K', year: 'III', section: 'A', cgpa: 8.12, attendance: 82.0 },
    { regNo: '2024IT003', name: 'Meera V', year: 'I', section: 'A', cgpa: null, attendance: 95.3 },
  ],
  roster: {
    date: new Date().toISOString().slice(0, 10),
    rows: [
      { regNo: '2023IT042', name: 'Arjun S', present: true },
      { regNo: '2023IT018', name: 'Priya D', present: true },
      { regNo: '2023IT031', name: 'Karthik M', present: null },
      { regNo: '2023IT007', name: 'Divya R', present: true },
      { regNo: '2022IT055', name: 'Sanjay K', present: false },
      { regNo: '2024IT003', name: 'Meera V', present: null },
    ],
  },
};

const KEY = 'dscet-portal-v1';
const SKEY = 'dscet-portal-session';

export function loadDB(): PortalDB {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(SEED);
    const parsed = JSON.parse(raw) as Partial<PortalDB>;
    return { ...structuredClone(SEED), ...parsed };
  } catch { return structuredClone(SEED); }
}
export function saveDB(db: PortalDB) {
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { /* private mode */ }
}
export function resetDB(): PortalDB {
  const fresh = structuredClone(SEED);
  saveDB(fresh);
  return fresh;
}
export function loadSession(): { role: Role; userId: string } | null {
  try {
    const raw = localStorage.getItem(SKEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
export function saveSession(s: { role: Role; userId: string } | null) {
  try { s ? localStorage.setItem(SKEY, JSON.stringify(s)) : localStorage.removeItem(SKEY); } catch { /* noop */ }
}
