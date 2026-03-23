import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome, FaInfoCircle, FaBook, FaNewspaper, FaBriefcase,
  FaCogs, FaEnvelope, FaImages, FaFileAlt, FaQuoteRight,
  FaArrowRight, FaEdit, FaInbox,
} from "react-icons/fa";
import { api } from "../../utils/api";

const pages = [
  { to: "/admin/home", label: "Home", icon: <FaHome />, desc: "Hero, courses, stats, testimonials, blog section", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  { to: "/admin/about", label: "About", icon: <FaInfoCircle />, desc: "Mission, team, journey, recognized brands", color: "bg-purple-50 text-purple-600 border-purple-100" },
  { to: "/admin/courses", label: "Courses Page", icon: <FaBook />, desc: "Hero, filters, CTA section", color: "bg-blue-50 text-blue-600 border-blue-100" },
  { to: "/admin/coursedetails", label: "Course Details", icon: <FaFileAlt />, desc: "Enrollment, syllabus, tools, certificate, FAQ", color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
  { to: "/admin/blogs", label: "Blogs Page", icon: <FaNewspaper />, desc: "Hero, categories, tags, sidebar, CTA", color: "bg-teal-50 text-teal-600 border-teal-100" },
  { to: "/admin/blogdetail", label: "Blog Detail", icon: <FaFileAlt />, desc: "Blog posts content, author, related", color: "bg-green-50 text-green-600 border-green-100" },
  { to: "/admin/careers", label: "Careers", icon: <FaBriefcase />, desc: "Job listings, benefits, tools, newsletter", color: "bg-yellow-50 text-yellow-600 border-yellow-100" },
  { to: "/admin/services", label: "Services", icon: <FaCogs />, desc: "Service cards, lifecycle, team, success stories", color: "bg-orange-50 text-orange-600 border-orange-100" },
  { to: "/admin/servicesquote", label: "Services Quote", icon: <FaQuoteRight />, desc: "Pricing, features, testimonial, form", color: "bg-red-50 text-red-600 border-red-100" },
  { to: "/admin/contact", label: "Contact", icon: <FaEnvelope />, desc: "Form options, offices, hours, trusted brands", color: "bg-pink-50 text-pink-600 border-pink-100" },
  { to: "/admin/portfolio", label: "Portfolio", icon: <FaImages />, desc: "Projects gallery, stats, CTA, features", color: "bg-rose-50 text-rose-600 border-rose-100" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getSubmissionStats().then(setStats).catch(() => {});
  }, []);

  return (
    <div>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Select a page to edit its content. All changes are saved via the backend API.</p>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Pages",   value: "11" },
          { label: "Data Files",    value: "11" },
          { label: "Unread Msgs",   value: stats ? String(stats.unread)  : "—", alert: stats?.unread > 0 },
          { label: "Today's Leads", value: stats ? String(stats.todayCount) : "—" },
        ].map((s, i) => (
          <div key={i} className={`bg-white border rounded-xl p-4 text-center ${s.alert ? "border-indigo-300" : "border-gray-200"}`}>
            <p className={`text-2xl font-bold ${s.alert ? "text-indigo-600" : "text-gray-900"}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* QUICK LINK — Submissions */}
      {stats?.unread > 0 && (
        <button
          onClick={() => navigate("/admin/submissions")}
          className="w-full mb-6 flex items-center gap-3 px-5 py-3 bg-indigo-50 border border-indigo-200 rounded-xl text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition"
        >
          <FaInbox />
          You have {stats.unread} unread message{stats.unread > 1 ? "s" : ""} — View Inbox
          <FaArrowRight className="ml-auto text-xs" />
        </button>
      )}

      {/* PAGES GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((page) => (
          <button
            key={page.to}
            onClick={() => navigate(page.to)}
            className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:shadow-md hover:border-indigo-200 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border text-lg ${page.color}`}>
                {page.icon}
              </div>
              <FaEdit className="text-gray-300 group-hover:text-indigo-400 transition text-sm mt-1" />
            </div>
            <p className="font-semibold text-gray-900 text-sm">{page.label}</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{page.desc}</p>
            <div className="flex items-center gap-1 mt-3 text-xs text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition">
              Edit Page <FaArrowRight className="text-[10px]" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
