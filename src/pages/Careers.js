import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaHeart, FaGlobe, FaBolt, FaUsers, FaShieldAlt, FaFilter } from "react-icons/fa";
import Footer from "../components/Footer";
import staticD from "../data/careersData.json";
import useSchema from "../hooks/useSchema";
import usePageData from "../hooks/usePageData";

const iconMap = { FaGlobe, FaBolt, FaHeart, FaUsers, FaShieldAlt };

/* ================= HERO ================= */
function CareersHero({ d }) {
  const navigate = useNavigate();
  return (
    <section className="bg-[#f5f6fa] w-full">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
            <div className="flex flex-col justify-center order-2 lg:order-1">
              <span className="inline-flex text-[10px] sm:text-xs bg-indigo-100 text-indigo-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full w-fit">
                {d.hero.badge}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-6 sm:mt-8 md:mt-10 leading-tight text-gray-900">
                {d.hero.title}
                <span className="block text-indigo-600">{d.hero.highlight}</span>
              </h1>
              <p className="text-gray-600 mt-5 sm:mt-6 md:mt-8 max-w-lg text-sm sm:text-base md:text-lg leading-relaxed">
                {d.hero.paragraph}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10 md:mt-12">
                <button
                  onClick={() => document.getElementById("jobs-section").scrollIntoView({ behavior: "smooth" })}
                  className="bg-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 transition duration-300 w-full sm:w-auto"
                >
                  {d.hero.primaryBtn} <FaArrowRight size={16} />
                </button>
                <button onClick={() => navigate("/about")}
                  className="border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-50 transition duration-300 w-full sm:w-auto">
                  {d.hero.secondaryBtn}
                </button>
              </div>
            </div>
            <div className="order-1 lg:order-2 mb-6 lg:mb-0">
              <img src={d.hero.img} className="rounded-xl w-full h-[240px] sm:h-[300px] md:h-[360px] lg:h-[420px] object-cover shadow-lg" alt="Team collaboration" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= WHY ================= */
function WhySection({ d }) {
  return (
    <section className="bg-white w-full">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-14 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">{d.why.heading}</h2>
            <p className="text-gray-500 text-sm sm:text-base md:text-lg mt-4 sm:mt-6 max-w-2xl mx-auto leading-relaxed">{d.why.subheading}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {d.why.items.map((item, i) => {
              const Icon = iconMap[item.icon] || FaBolt;
              return (
                <div key={i} className="border border-gray-200 rounded-xl p-5 sm:p-6 md:p-8 hover:shadow-lg hover:border-indigo-200 transition duration-300 flex flex-col h-full">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-lg mb-4 text-xl flex-shrink-0">
                    <Icon />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg md:text-xl text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= JOBS ================= */
function Jobs({ d }) {
  return (
    <section className="bg-[#f5f6fa] w-full">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-5 sm:p-6 md:p-8 sticky top-20">
                <div className="text-base sm:text-lg font-bold flex items-center gap-2 mb-6 text-gray-900">
                  <FaFilter size={18} /> Filters
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold mb-3 text-gray-900">Department</p>
                    <div className="space-y-2.5">
                      {d.jobs.departments.map((dep) => (
                        <label key={dep} className="flex items-center text-sm cursor-pointer group">
                          <input type="checkbox" className="mr-3 w-4 h-4 rounded cursor-pointer" />
                          <span className="text-gray-700 group-hover:text-indigo-600 transition">{dep}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-3 text-gray-900">Employment Type</p>
                    <div className="space-y-2.5">
                      {d.jobs.employmentTypes.map((type) => (
                        <label key={type} className="flex items-center text-sm cursor-pointer group">
                          <input type="checkbox" className="mr-3 w-4 h-4 rounded cursor-pointer" />
                          <span className="text-gray-700 group-hover:text-indigo-600 transition">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition">Clear all filters</button>
                  <div className="bg-indigo-50 border border-indigo-200 p-5 sm:p-6 rounded-xl mt-6">
                    <p className="font-semibold text-sm sm:text-base text-gray-900">{d.jobs.noFitTitle}</p>
                    <p className="text-gray-600 mt-2 text-sm">{d.jobs.noFitDesc}</p>
                    <button className="text-indigo-600 mt-4 font-semibold text-sm hover:text-indigo-700 transition">{d.jobs.noFitBtn}</button>
                  </div>
                </div>
              </div>
            </div>

            <div id="jobs-section" className="lg:col-span-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{d.jobs.heading}</h2>
                <p className="text-sm sm:text-base text-indigo-600 font-semibold bg-indigo-50 px-3 sm:px-4 py-2 rounded-lg">{d.jobs.countLabel}</p>
              </div>
              <div className="space-y-4 sm:space-y-5">
                {d.jobs.items.map((job, i) => (
                  <div key={i} className="border border-gray-200 bg-white rounded-xl p-4 sm:p-5 md:p-6 hover:shadow-md hover:border-indigo-200 transition duration-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base sm:text-lg md:text-xl text-gray-900 break-words">{job.title}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1.5">{job.type}</p>
                      </div>
                      <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none border border-gray-300 text-gray-700 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50 transition duration-300 whitespace-nowrap">
                          {d.jobs.viewDetailsBtn}
                        </button>
                        <button className="flex-1 sm:flex-none bg-indigo-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg hover:bg-indigo-700 transition duration-300 whitespace-nowrap">
                          {d.jobs.applyBtn}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= TOOLS ================= */
function Tools({ d }) {
  return (
    <section className="bg-white w-full border-t border-gray-200">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-10 sm:py-12 md:py-14 lg:py-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 font-bold tracking-widest uppercase">{d.tools.label}</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {d.tools.items.map((tool) => (
              <span key={tool} className="text-gray-400 text-sm sm:text-base md:text-lg font-medium hover:text-indigo-600 transition duration-300 cursor-pointer">{tool}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= NEWSLETTER ================= */
function Newsletter({ d }) {
  return (
    <section className="bg-gradient-to-br from-indigo-50 to-indigo-100 w-full">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-lg">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center leading-tight">{d.newsletter.heading}</h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg text-center mt-4 sm:mt-6 md:mt-8 leading-relaxed max-w-2xl mx-auto">{d.newsletter.paragraph}</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10 md:mt-12 justify-center">
              <input type="email" placeholder={d.newsletter.placeholder}
                className="px-4 sm:px-6 py-3 sm:py-4 rounded-lg border-2 border-gray-300 text-sm sm:text-base w-full sm:w-auto focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition" />
              <button className="bg-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-indigo-700 transition duration-300 w-full sm:w-auto whitespace-nowrap">
                {d.newsletter.btn}
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 text-center mt-4 sm:mt-6">{d.newsletter.privacy}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= PAGE ================= */
export default function CareersPage() {
  const d = usePageData("careersData", staticD);
  useSchema([
    {
      "@context": "https://schema.org",
      "@type": "EmployerAggregateRating",
      "itemReviewed": { "@type": "Organization", "name": "Trivoxa Technologies", "url": "https://trivoxatech.com" },
      "ratingValue": "4.8",
      "bestRating": "5",
      "ratingCount": "120"
    },
    ...d.jobs.items.map((job) => ({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": job.title,
      "description": `${job.title} at Trivoxa Technologies. ${job.type}.`,
      "employmentType": job.type.includes("Full-time") ? "FULL_TIME" : job.type.includes("Contract") ? "CONTRACTOR" : "PART_TIME",
      "hiringOrganization": { "@type": "Organization", "name": "Trivoxa Technologies", "sameAs": "https://trivoxatech.com" },
      "jobLocation": { "@type": "Place", "address": { "@type": "PostalAddress", "addressCountry": "US" } },
      "workHours": job.type,
      "datePosted": new Date().toISOString().split("T")[0],
      "applicantLocationRequirements": { "@type": "Country", "name": "Worldwide" },
      "jobLocationType": "TELECOMMUTE"
    })),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trivoxatech.com" },
        { "@type": "ListItem", "position": 2, "name": "Careers", "item": "https://trivoxatech.com/careers" }
      ]
    }
  ]);
  return (
    <div className="w-full">
      <CareersHero d={d} />
      <WhySection d={d} />
      <Jobs d={d} />
      <Tools d={d} />
      <Newsletter d={d} />
      <Footer />
    </div>
  );
}
