import { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { Navbar, Footer } from './components/layout';
import { ThemeProvider } from './components/ui';
import { AuthProvider } from './auth';

// Route-level code splitting — each page ships as its own chunk
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Academics = lazy(() => import('./pages/Academics'));
const FacultyList = lazy(() => import('./pages/Faculty').then(m => ({ default: m.FacultyList })));
const FacultyDetail = lazy(() => import('./pages/Faculty').then(m => ({ default: m.FacultyDetail })));
const Research = lazy(() => import('./pages/Research'));
const Labs = lazy(() => import('./pages/Labs').then(m => ({ default: m.Labs })));
const Facilities = lazy(() => import('./pages/Labs').then(m => ({ default: m.Facilities })));
const Students = lazy(() => import('./pages/Students').then(m => ({ default: m.Students })));
const Achievements = lazy(() => import('./pages/Students').then(m => ({ default: m.Achievements })));
const Placements = lazy(() => import('./pages/Placements'));
const Events = lazy(() => import('./pages/Events'));
const Resources = lazy(() => import('./pages/Resources'));
const Alumni = lazy(() => import('./pages/Alumni').then(m => ({ default: m.Alumni })));
const Gallery = lazy(() => import('./pages/Alumni').then(m => ({ default: m.Gallery })));
const Contact = lazy(() => import('./pages/Contact'));
const SearchPage = lazy(() => import('./pages/System').then(m => ({ default: m.SearchPage })));
const Login = lazy(() => import('./pages/System').then(m => ({ default: m.Login })));
const NotFound = lazy(() => import('./pages/System').then(m => ({ default: m.NotFound })));

// Department Digital Platform — public live pages + role portals (code-split)
import { PortalShell } from './portal/PortalShell';
import { RequireRole, PortalIndex, PortalProvider } from './portal/store';
const PortalLogin = lazy(() => import('./portal/PortalLogin'));
const CalendarPage = lazy(() => import('./portal/Calendar').then(m => ({ default: m.CalendarPage })));
const LiveTvPage = lazy(() => import('./portal/LiveTv'));
const StudentDashboard = lazy(() => import('./portal/Student').then(m => ({ default: m.StudentDashboard })));
const StudentProfile = lazy(() => import('./portal/Student').then(m => ({ default: m.StudentProfile })));
const StudentAcademics = lazy(() => import('./portal/Student').then(m => ({ default: m.StudentAcademics })));
const StudentMarks = lazy(() => import('./portal/Student').then(m => ({ default: m.StudentMarks })));
const StudentAttendance = lazy(() => import('./portal/Student').then(m => ({ default: m.StudentAttendance })));
const Timetable = lazy(() => import('./portal/StudentServices').then(m => ({ default: m.Timetable })));
const Exams = lazy(() => import('./portal/StudentServices').then(m => ({ default: m.Exams })));
const Assignments = lazy(() => import('./portal/StudentServices').then(m => ({ default: m.Assignments })));
const LearnResources = lazy(() => import('./portal/StudentServices').then(m => ({ default: m.LearnResources })));
const Leave = lazy(() => import('./portal/StudentServices').then(m => ({ default: m.Leave })));
const Requests = lazy(() => import('./portal/StudentServices').then(m => ({ default: m.Requests })));
const PNotifications = lazy(() => import('./portal/StudentServices').then(m => ({ default: m.Notifications })));
const Records = lazy(() => import('./portal/StudentServices').then(m => ({ default: m.Records })));
const Careers = lazy(() => import('./portal/Careers').then(m => ({ default: m.Careers })));
const FacultyDashboard = lazy(() => import('./portal/Faculty').then(m => ({ default: m.FacultyDashboard })));
const StudentsDirectory = lazy(() => import('./portal/Faculty').then(m => ({ default: m.StudentsDirectory })));
const FacAttendance = lazy(() => import('./portal/Faculty').then(m => ({ default: m.FacAttendance })));
const FacMarks = lazy(() => import('./portal/Faculty').then(m => ({ default: m.FacMarks })));
const FacAssignments = lazy(() => import('./portal/Faculty').then(m => ({ default: m.FacAssignments })));
const FacApprovals = lazy(() => import('./portal/Faculty').then(m => ({ default: m.FacApprovals })));
const HodDashboard = lazy(() => import('./portal/Leadership').then(m => ({ default: m.HodDashboard })));
const AdminPanel = lazy(() => import('./portal/Leadership').then(m => ({ default: m.AdminPanel })));

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [pathname]);
  return null;
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div aria-hidden className="scroll-progress" style={{ scaleX: scrollYProgress }} />;
}

const PAGE_TITLES: Record<string, string> = {
  '/': 'Home',
  '/about': 'Department Profile',
  '/academics': 'B.Tech IT Programme',
  '/faculty': 'Faculty Directory',
  '/research': 'Research & Innovation',
  '/labs': 'Laboratories',
  '/facilities': 'Facilities',
  '/students': 'Student Experience',
  '/placements': 'Placements',
  '/events': 'Events',
  '/news': 'News & Notices',
  '/achievements': 'Achievements',
  '/timetable': 'Timetable',
  '/calendar': 'Academic Calendar',
  '/resources': 'Resources & Library',
  '/alumni': 'Alumni',
  '/gallery': 'Gallery',
  '/contact': 'Contact',
  '/search': 'Search',
  '/login': 'Portal Login',
  '/live': 'Live TV',
  '/portal/login': 'Portal Login',
  '/portal': 'Department Portal',
  '/portal/dashboard': 'Student Dashboard',
};

function PageMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const base = 'DSCET · Department of Information Technology';
    let label = PAGE_TITLES[pathname];
    if (!label) {
      if (pathname.startsWith('/faculty/')) label = 'Faculty Profile';
      else if (pathname.startsWith('/portal')) label = 'Department Portal';
      else label = 'Page Not Found';
    }
    document.title = `${label} | ${base}`;
  }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-28" role="status" aria-label="Loading page">
      <span aria-hidden className="loader-ring" />
    </div>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 700);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  if (!show) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"
      className="btn-glow fixed bottom-6 right-6 z-[70] grid h-11 w-11 place-items-center rounded-full bg-[#38bdf8] text-[#04070e]">
      <ArrowUp size={18} aria-hidden />
    </button>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortalProvider>
        <ScrollTop />
        <PageMeta />
        <ScrollProgress />
        <Navbar />
        <main id="main" className="min-h-[70vh]">
          <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/faculty" element={<FacultyList />} />
            <Route path="/faculty/:id" element={<FacultyDetail />} />
            <Route path="/research" element={<Research />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/students" element={<Students />} />
            <Route path="/placements" element={<Placements />} />
            <Route path="/events" element={<Events />} />
            <Route path="/news" element={<Events />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/timetable" element={<Resources />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/live" element={<LiveTvPage />} />
            <Route path="/portal/login" element={<PortalLogin />} />
            <Route path="/portal" element={<RequireRole allow={['student', 'faculty', 'hod', 'admin']}><PortalShell /></RequireRole>}>
              <Route index element={<PortalIndex />} />
              <Route path="dashboard" element={<RequireRole allow={['student']}><StudentDashboard /></RequireRole>} />
              <Route path="profile" element={<RequireRole allow={['student']}><StudentProfile /></RequireRole>} />
              <Route path="academics" element={<RequireRole allow={['student']}><StudentAcademics /></RequireRole>} />
              <Route path="marks" element={<RequireRole allow={['student']}><StudentMarks /></RequireRole>} />
              <Route path="attendance" element={<RequireRole allow={['student']}><StudentAttendance /></RequireRole>} />
              <Route path="timetable" element={<RequireRole allow={['student']}><Timetable /></RequireRole>} />
              <Route path="exams" element={<RequireRole allow={['student']}><Exams /></RequireRole>} />
              <Route path="assignments" element={<RequireRole allow={['student']}><Assignments /></RequireRole>} />
              <Route path="resources" element={<RequireRole allow={['student']}><LearnResources /></RequireRole>} />
              <Route path="leave" element={<RequireRole allow={['student']}><Leave /></RequireRole>} />
              <Route path="requests" element={<RequireRole allow={['student']}><Requests /></RequireRole>} />
              <Route path="records" element={<RequireRole allow={['student']}><Records /></RequireRole>} />
              <Route path="careers" element={<RequireRole allow={['student']}><Careers /></RequireRole>} />
              <Route path="notifications" element={<RequireRole allow={['student', 'faculty', 'hod', 'admin']}><PNotifications /></RequireRole>} />
              <Route path="faculty" element={<RequireRole allow={['faculty', 'hod', 'admin']}><FacultyDashboard /></RequireRole>} />
              <Route path="faculty/students" element={<RequireRole allow={['faculty', 'hod', 'admin']}><StudentsDirectory /></RequireRole>} />
              <Route path="faculty/attendance" element={<RequireRole allow={['faculty', 'hod', 'admin']}><FacAttendance /></RequireRole>} />
              <Route path="faculty/marks" element={<RequireRole allow={['faculty', 'hod', 'admin']}><FacMarks /></RequireRole>} />
              <Route path="faculty/assignments" element={<RequireRole allow={['faculty', 'hod', 'admin']}><FacAssignments /></RequireRole>} />
              <Route path="faculty/approvals" element={<RequireRole allow={['faculty', 'hod', 'admin']}><FacApprovals /></RequireRole>} />
              <Route path="hod" element={<RequireRole allow={['hod', 'admin']}><HodDashboard /></RequireRole>} />
              <Route path="admin" element={<RequireRole allow={['admin']}><AdminPanel /></RequireRole>} />
            </Route>
            <Route path="/resources" element={<Resources />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </main>
        <BackToTop />
        <Footer />
        </PortalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
