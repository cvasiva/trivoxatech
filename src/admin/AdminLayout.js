import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaHome, FaInfoCircle, FaBook, FaNewspaper, FaBriefcase,
  FaCogs, FaEnvelope, FaImages, FaFileAlt, FaQuoteRight,
  FaBars, FaTimes, FaSignOutAlt, FaChevronRight, FaInbox, FaBell, FaUsersCog,
} from "react-icons/fa";
import logo from "../images/trivoxalogo.png";
import { clearToken, getTokenExpiry } from "../utils/api";

const navItems = [
  { to: "/admin", label: "Home", icon: <FaHome />, end: true },
  { to: "/admin/about", label: "About", icon: <FaInfoCircle /> },
  { to: "/admin/courses", label: "Courses Page", icon: <FaBook /> },
  { to: "/admin/coursedetails", label: "Course Details", icon: <FaFileAlt /> },
  { to: "/admin/blogs", label: "Blogs Page", icon: <FaNewspaper /> },
  { to: "/admin/blogdetail", label: "Blog Detail", icon: <FaFileAlt /> },
  { to: "/admin/careers", label: "Careers", icon: <FaBriefcase /> },
  { to: "/admin/services", label: "Services", icon: <FaCogs /> },
  { to: "/admin/servicesquote", label: "Services Quote", icon: <FaQuoteRight /> },
  { to: "/admin/contact", label: "Contact", icon: <FaEnvelope /> },
  { to: "/admin/portfolio", label: "Portfolio", icon: <FaImages /> },
  { to: "/admin/submissions", label: "Submissions",  icon: <FaInbox /> },
  { to: "/admin/newsletter",  label: "Newsletter",   icon: <FaBell /> },
  { to: "/admin/accounts",    label: "Admin Accounts", icon: <FaUsersCog /> },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionWarning, setSessionWarning] = useState(null); // minutes left
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect immediately on 401 from any API call
    const onExpired = () => {
      clearToken();
      navigate("/admin/login");
    };
    window.addEventListener("trivoxa:auth:expired", onExpired);

    // Check token expiry every minute and warn at ≤15 min
    const check = () => {
      const expiry = getTokenExpiry();
      if (!expiry) return;
      const minsLeft = Math.floor((expiry - Date.now()) / 60000);
      if (minsLeft <= 0) { onExpired(); return; }
      setSessionWarning(minsLeft <= 15 ? minsLeft : null);
    };
    check();
    const interval = setInterval(check, 60000);

    return () => {
      window.removeEventListener("trivoxa:auth:expired", onExpired);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* LOGO */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <img src={logo} alt="Trivoxa" className="h-8 w-auto" />
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">Trivoxa</p>
            <p className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">Admin Panel</p>
          </div>
          <button
            className="ml-auto lg:hidden text-gray-400 hover:text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">Pages</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
                ${isActive
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <span className="text-base shrink-0">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              <FaChevronRight className="text-[10px] opacity-0 group-hover:opacity-50 transition" />
            </NavLink>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="px-3 py-4 border-t border-gray-100 space-y-2">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
          >
            <FaHome className="text-base" />
            View Website
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition"
            onClick={() => { clearToken(); navigate("/admin/login"); }}>
            <FaSignOutAlt className="text-base" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* TOP BAR */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-4 sticky top-0 z-[1020]">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700 p-1"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars className="text-lg" />
          </button>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">Content Management</p>
            <p className="text-xs text-gray-400">Edit page content — changes reflect on the live site</p>
          </div>
          {sessionWarning && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg">
              <span className="text-xs text-yellow-700 font-medium">
                Session expires in {sessionWarning} min{sessionWarning !== 1 ? "s" : ""}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500 hidden sm:inline">Live</span>
          </div>
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
