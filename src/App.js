import React, { useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PageLoader from './components/PageLoader';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import CoursesPage from './pages/Courses';
import CareersPage from './pages/Careers';
import CourseDetails from './pages/CourseDetails';
import Blogs from './pages/blogs';
import BlogDetail from './pages/BlogDetail';
import ServicesQuotePage from './pages/ServicesQuote';
import PortfolioPage from './pages/Portfolio';
import {
  AdminLayout, AdminLogin, AdminDashboard,
  AdminHome, AdminAbout, AdminCourses, AdminCourseDetails,
  AdminBlogs, AdminBlogDetail, AdminCareers, AdminServices,
  AdminServicesQuote, AdminContact, AdminPortfolio,
  AdminSubmissions, AdminNewsletter, AdminAccounts,
} from './admin/index';

const WA_NUMBER = "916300275894"; // ← your number: country code + digits
const WA_MSG = encodeURIComponent("Hi! I'm interested in enrolling at Trivoxa Technologies. Please guide me.");

function RequireAuth({ children }) {
  return localStorage.getItem('trivoxa_admin_token')
    ? children
    : <Navigate to="/admin/login" replace />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function WhatsAppFloat() {
  const { pathname } = useLocation();
  const [hovered, setHovered] = React.useState(false);
  if (pathname.startsWith('/admin')) return null;
  return (
    <a
      href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 99999,
        backgroundColor: hovered ? '#1ebe57' : '#25D366',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px 12px 16px',
        borderRadius: '50px',
        textDecoration: 'none',
        fontWeight: '700',
        fontSize: '15px',
        boxShadow: hovered ? '0 8px 25px rgba(37,211,102,0.6)' : '0 4px 15px rgba(37,211,102,0.4)',
        whiteSpace: 'nowrap',
        transform: hovered ? 'scale(1.07)' : 'scale(1)',
        transition: 'all 0.25s ease',
      }}
    >
      <FaWhatsapp size={24} />
      Enroll via WhatsApp
    </a>
  );
}

function SiteLayout({ children }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  return (
    <>
      {!isAdmin && <Navbar />}
      {!isAdmin && <PageLoader />}
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <WhatsAppFloat />
      <div className="App">
        <SiteLayout>
          <Routes>
            {/* ── PUBLIC ROUTES ── */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/coursedetails/:id" element={<CourseDetails />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/services" element={<Services />} />
            <Route path="/servicesquote" element={<ServicesQuotePage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/portfolio" element={<PortfolioPage />} />

            {/* ── ADMIN ROUTES ── */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
              <Route index element={<AdminDashboard />} />
              <Route path="home" element={<AdminHome />} />
              <Route path="about" element={<AdminAbout />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="coursedetails" element={<AdminCourseDetails />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="blogdetail" element={<AdminBlogDetail />} />
              <Route path="careers" element={<AdminCareers />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="servicesquote" element={<AdminServicesQuote />} />
              <Route path="contact" element={<AdminContact />} />
              <Route path="portfolio" element={<AdminPortfolio />} />
              <Route path="submissions" element={<AdminSubmissions />} />
              <Route path="newsletter"  element={<AdminNewsletter />} />
              <Route path="accounts"    element={<AdminAccounts />} />
            </Route>
          </Routes>
        </SiteLayout>
      </div>
    </Router>
  );
}

export default App;
