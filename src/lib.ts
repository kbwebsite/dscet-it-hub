// DSCET · Department of Information Technology — central site configuration.
// VERIFIED facts carry source: 'dscet.ac.in'. Anything unknown uses pending
// placeholders ("Information will be updated.") — never invented data.
export const SITE = {
  department: 'Department of Information Technology',
  shortName: 'IT',
  college: 'Dhanalakshmi Srinivasan College of Engineering and Technology',
  collegeShort: 'DSCET',
  university: 'Anna University, Chennai',
  tagline: 'Building technology professionals for a connected, intelligent and digital future.',
  // Verified college contact (dscet.ac.in footer). Department-specific email is not published.
  email: 'dscet@yahoo.co.in',
  phone: '044-27442844 / 044-27443844',
  admissionsPhone: '70944 66503 / 70944 66498',
  address: 'East Coast Road, Mamallapuram, Chennai – 603104',
  district: 'Chengalpattu District, Tamil Nadu, India',
  officeHours: 'Mon–Fri · 9:00 AM – 5:00 PM',
  officialDeptUrl: 'https://dscet.ac.in/information-technology/',
  officialProgramUrl: 'https://dscet.ac.in/btech-information-technology/',
  hod: {
    // Verified: name only, per official department page. All else pending.
    name: 'Dr. Ravikumar',
    designation: 'Head of Department',
    qualification: 'Information will be updated.',
    email: 'Information will be updated.',
    phone: 'Information will be updated.',
    office: 'Department of Information Technology, DSCET',
  },
}

export interface NavChild { to: string; label: string; desc?: string }
export interface NavGroup { label: string; to: string; children?: NavChild[] }

// Clean grouped navigation (§27). Flat NAV_LINKS retained for mobile menu + footer.
export const NAV_GROUPS: NavGroup[] = [
  { label: 'Home', to: '/' },
  {
    label: 'Department', to: '/about',
    children: [
      { to: '/about', label: 'Overview', desc: 'About, vision, mission & PEOs' },
      { to: '/about#hod', label: 'HOD', desc: 'Head of Department' },
      { to: '/about#milestones', label: 'Milestones', desc: 'Interactive timeline since 2001' },
    ],
  },
  {
    label: 'Academics', to: '/academics',
    children: [
      { to: '/academics', label: 'B.Tech IT', desc: 'Programme overview & eligibility' },
      { to: '/academics#curriculum', label: 'Curriculum', desc: 'PO · PSO · PEO · structure' },
      { to: '/resources', label: 'Resources', desc: 'Syllabus, regulations & papers' },
    ],
  },
  {
    label: 'People', to: '/faculty',
    children: [
      { to: '/faculty', label: 'Faculty', desc: 'Directory (being updated)' },
      { to: '/students', label: 'Students', desc: 'Clubs, projects & activities' },
      { to: '/alumni', label: 'Alumni', desc: 'Stories & network' },
    ],
  },
  {
    label: 'Research', to: '/research',
    children: [
      { to: '/research', label: 'Research Areas', desc: 'Areas of interest & focus' },
      { to: '/research#publications', label: 'Publications', desc: 'Verified journal library' },
      { to: '/research#patents', label: 'Patents', desc: 'Published patents' },
      { to: '/students#projects', label: 'Projects', desc: 'Student & research builds' },
      { to: '/research#industry', label: 'Industry Connect', desc: 'MoUs & collaboration' },
    ],
  },
  {
    label: 'Campus', to: '/labs',
    children: [
      { to: '/labs', label: 'Laboratories', desc: 'System SW · Networks · Cyber' },
      { to: '/resources#library', label: 'Library', desc: 'Department library' },
      { to: '/facilities', label: 'Facilities', desc: 'Campus spaces' },
      { to: '/gallery', label: 'Gallery', desc: 'Photo & media' },
    ],
  },
  {
    label: 'Activities', to: '/events',
    children: [
      { to: '/events', label: 'Events', desc: 'Upcoming & past' },
      { to: '/achievements', label: 'Achievements', desc: 'Verified recognition' },
      { to: '/events#news', label: 'News', desc: 'Announcements & notices' },
    ],
  },
  {
    label: 'Resources', to: '/resources',
    children: [
      { to: '/resources', label: 'Documents', desc: 'Syllabus, forms & circulars' },
      { to: '/timetable', label: 'Timetable', desc: 'Class & lab slots' },
      { to: '/calendar', label: 'Academic Calendar', desc: 'Semesters & deadlines' },
    ],
  },
  { label: 'Contact', to: '/contact' },
]

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'Department' },
  { to: '/academics', label: 'Academics' },
  { to: '/faculty', label: 'Faculty' },
  { to: '/research', label: 'Research' },
  { to: '/labs', label: 'Labs' },
  { to: '/students', label: 'Students' },
  { to: '/placements', label: 'Placements' },
  { to: '/events', label: 'Activities' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/alumni', label: 'Alumni' },
  { to: '/resources', label: 'Resources' },
  { to: '/contact', label: 'Contact' },
]

// Official-data mode (§38): only genuine numeric facts animate as counters.
export const VERIFIED_SNAPSHOT = [
  { value: 2001, label: 'Established', plain: true, source: 'dscet.ac.in' },
  { value: 240, label: 'Sanctioned Intake (2024)', suffix: '', source: 'dscet.ac.in' },
  { value: 500, label: 'Dept. Library Books', suffix: '+', source: 'dscet.ac.in' },
  { value: 8, label: 'Verified Journal Papers', suffix: '', source: 'dscet.ac.in' },
]

export const PENDING_NOTICE = 'Information will be updated.';
