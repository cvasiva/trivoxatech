import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaClock, FaSignal, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Footer from "../components/Footer";
import * as staticCourseData from "../data/courseData";
import staticD from "../data/coursesData.json";
import useSchema from "../hooks/useSchema";
import usePageData from "../hooks/usePageData";

/* ================= HERO ================= */
function Hero({ d }) {
  return (
    <section className="bg-indigo-50 text-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">Home › Courses Hub</p>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
        {d.hero.heading} <span className="text-indigo-600">{d.hero.highlight}</span>
      </h1>
      <p className="text-gray-600 mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
        {d.hero.paragraph}
      </p>
    </section>
  );
}

function CoursesSection({ d, allCourses }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchError, setSearchError] = useState("");
  const itemsPerPage = 6;

  const categories = ["All", "Development", "Design", "Cloud", "Marketing"];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredCourses = useMemo(() => {
    let filtered = allCourses;
    if (searchTerm.trim().length > 0 && searchTerm.trim().length < 2) {
      setSearchError("Search term must be at least 2 characters");
      return [];
    }
    setSearchError("");
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.desc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== "All") filtered = filtered.filter((c) => c.category === selectedCategory);
    if (selectedLevel !== "All") filtered = filtered.filter((c) => c.level === selectedLevel);
    return filtered;
  }, [searchTerm, selectedCategory, selectedLevel, allCourses]);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
  const handleCategoryChange = (cat) => { setSelectedCategory(cat); setCurrentPage(1); };
  const handleLevelChange = (level) => { setSelectedLevel(level); setCurrentPage(1); };
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  return (
    <section className="bg-[#f8f9fc] py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 mb-8 sm:mb-10 lg:mb-12">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Search Courses</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50">
              <FaSearch className="text-gray-400 text-sm" />
              <input
                placeholder={d.hero.searchPlaceholder}
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full outline-none text-sm bg-transparent"
              />
            </div>
            {searchError && <p className="text-red-500 text-xs mt-1">{searchError}</p>}
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {categories.map((cat) => (
                <button key={cat} onClick={() => handleCategoryChange(cat)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg border transition whitespace-nowrap ${selectedCategory === cat ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-300 bg-white hover:bg-indigo-50"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Level</label>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {levels.map((level) => (
                <button key={level} onClick={() => handleLevelChange(level)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg border transition whitespace-nowrap ${selectedLevel === level ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-300 bg-white hover:bg-indigo-50"}`}>
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm text-gray-600">
            Showing <span className="font-semibold">{paginatedCourses.length}</span> of <span className="font-semibold">{filteredCourses.length}</span> courses
          </p>
        </div>

        {paginatedCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-12 lg:mb-16">
            {paginatedCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300">
                <div className="relative h-40 sm:h-44 lg:h-48 overflow-hidden bg-gray-200">
                  <img src={course.img} alt={course.title} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                  <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-white text-xs px-2 sm:px-3 py-1 rounded-full shadow-md font-medium">{course.level}</span>
                  <span className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-indigo-600 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-medium">{course.price}</span>
                </div>
                <div className="p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4">
                  <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <span className="flex items-center gap-1 whitespace-nowrap"><FaClock className="text-indigo-600" /> {course.duration}</span>
                    <span className="flex items-center gap-1 whitespace-nowrap"><FaSignal className="text-indigo-600" /> {course.category}</span>
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg line-clamp-2">{course.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{course.desc}</p>
                  <div className="flex justify-between items-center text-xs sm:text-sm pt-2">
                    <span className="flex items-center gap-1 text-gray-700 font-medium">
                      <FaStar className="text-yellow-500" /> {course.rating} ({course.reviews})
                    </span>
                  </div>
                  <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                    <button onClick={() => navigate(`/coursedetails/${course.id}`)} className="flex-1 bg-indigo-600 text-white py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-indigo-700 transition">
                      {d.card.enrollBtn}
                    </button>
                    <button className="flex-1 border border-gray-300 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50 transition">
                      {d.card.detailsBtn}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-500 text-sm sm:text-base">{d.empty}</p>
          </div>
        )}

        {filteredCourses.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-10 sm:mt-12 lg:mt-16">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
              className="p-2 sm:p-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition">
              <FaChevronLeft className="text-sm" />
            </button>
            <div className="flex gap-1 sm:gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => handlePageChange(page)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg border transition ${currentPage === page ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-300 hover:bg-gray-100"}`}>
                  {page}
                </button>
              ))}
            </div>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
              className="p-2 sm:p-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition">
              <FaChevronRight className="text-sm" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ================= CTA ================= */
function CTA({ d }) {
  return (
    <section className="bg-indigo-50 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8 lg:gap-12">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">{d.enterpriseCta.heading}</h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2 sm:mt-3">{d.enterpriseCta.paragraph}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <button className="bg-indigo-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-indigo-700 transition whitespace-nowrap">
            {d.enterpriseCta.primaryBtn}
          </button>
          <button className="border border-indigo-600 text-indigo-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-indigo-50 transition whitespace-nowrap">
            {d.enterpriseCta.secondaryBtn}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ================= PAGE ================= */
export default function CoursesPage() {
  const d = usePageData("coursesData", staticD);
  const courseDataLive = usePageData("courseData", { courses: staticCourseData.allCourses });
  const allCourses = courseDataLive?.courses || staticCourseData.allCourses;
  useSchema([
    {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "Trivoxa Technologies",
      "url": "https://trivoxatech.com",
      "description": d.hero.paragraph,
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": d.hero.heading,
        "itemListElement": allCourses.map((c) => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Course",
            "name": c.title,
            "description": c.desc,
            "provider": { "@type": "Organization", "name": "Trivoxa Technologies" },
            "url": `https://trivoxatech.com/coursedetails/${c.id}`
          }
        }))
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": d.hero.heading,
      "url": "https://trivoxatech.com/courses",
      "itemListElement": allCourses.map((c, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": c.title,
        "url": `https://trivoxatech.com/coursedetails/${c.id}`
      }))
    }
  ]);
  return (
    <div>
      <Hero d={d} />
      <CoursesSection d={d} allCourses={allCourses} />
      <CTA d={d} />
      <Footer />
    </div>
  );
}
