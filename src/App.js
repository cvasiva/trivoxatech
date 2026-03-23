import React, { useEffect } from 'react';
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

/* Redirect to login if no token */
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

/* Wrapper: hides Navbar/PageLoader for admin routes */
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
