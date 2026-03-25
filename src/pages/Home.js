import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers, FaBriefcase, FaGraduationCap, FaStar,
  FaCode, FaGlobe, FaShieldAlt, FaMobileAlt, FaBriefcase as FaBag,
  FaGraduationCap as FaGrad, FaLaptopCode,
} from "react-icons/fa";
import Footer from "../components/Footer";
import hero from "../images/hero.jpg";
import infoclass from "../images/infoclass.jpg";
import erfolgreich from "../images/Erfolgreich.jpg";
import fullstack from "../images/fullstack.jpg";
import uxuidesign from "../images/uxuidesign.jpg";
import digitalM from "../images/digitalM.jpg";
import staticD from "../data/homeData.json";
import useSchema from "../hooks/useSchema";
import usePageData from "../hooks/usePageData";
import usePageMeta from "../hooks/usePageMeta";

const iconMap = { FaUsers, FaBriefcase, FaGraduationCap, FaStar, FaGrad, FaLaptopCode };
const localImgMap = { 1: fullstack, 2: uxuidesign, 3: digitalM };
const D = createContext(staticD);
const useD = () => useContext(D);

/* ================= HERO ================= */
function HeroSection() {
  const d = useD();
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-indigo-50 via-white to-purple-50 py-8 sm:py-12 md:py-16 lg:py-20 2xl:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <span className="inline-block bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full mb-4">
              {d.hero.eyebrow}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              {d.hero.title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                {d.hero.highlight}
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-7 max-w-xl leading-relaxed">
              {d.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-7">
              <button onClick={() => navigate("/courses")} className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg shadow-lg hover:opacity-95 transition">
                {d.hero.primaryBtn}
              </button>
              <button onClick={() => navigate("/contact")} className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
                {d.hero.secondaryBtn}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[21, 22, 23, 24].map((i) => (
                  <img key={i} src={`https://randomuser.me/api/portraits/men/${i}.jpg`} className="w-8 h-8 rounded-full border-2 border-white" alt="" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">{d.hero.statsText}</p>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end mt-6 lg:mt-0">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <div className="absolute -inset-4 rounded-3xl" style={{ background: "linear-gradient(90deg,rgba(99,102,241,.08),rgba(139,92,246,.06))", transform: "rotate(-3deg)" }} />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white">
                <img src={hero} alt="hero" className="w-full h-64 sm:h-80 lg:h-96 object-cover" />
              </div>
              <div className="absolute -left-4 sm:-left-6 -bottom-4 sm:-bottom-6 bg-white rounded-xl shadow-md px-4 py-3 flex items-center gap-3 w-60">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" /></svg>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{d.hero.badge.value}</p>
                  <p className="text-xs text-gray-500">{d.hero.badge.label}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= TRUSTED ================= */
function TrustedSection() {
  const d = useD();
  const icons = [FaCode, FaGlobe, FaShieldAlt, FaMobileAlt, FaUsers, FaBag];
  return (
    <section className="py-8 sm:py-10 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs tracking-widest text-gray-500 font-semibold mb-6 uppercase">{d.trusted.label}</p>
        <div className="flex items-center justify-center gap-8 sm:gap-12 lg:gap-16 flex-wrap">
          {icons.map((Icon, i) => <Icon key={i} className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />)}
        </div>
      </div>
    </section>
  );
}

/* ================= COURSES ================= */
function CoursesSection() {
  const d = useD();
  const navigate = useNavigate();
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{d.courses.heading}</h2>
            <p className="text-sm sm:text-base text-gray-500 mt-2">{d.courses.subheading}</p>
          </div>
          <button onClick={() => navigate("/courses")} className="text-indigo-600 text-sm font-semibold hover:underline whitespace-nowrap">
            {d.courses.viewAllBtn}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {d.courses.items.map((c) => (
            <div key={c.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
              <img src={c.img || localImgMap[c.id]} alt={c.title} className="w-full h-44 sm:h-48 object-cover" />
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 text-base leading-snug">{c.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{c.subtitle}</p>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => navigate(`/coursedetails/${c.id}`)} className="flex-1 bg-indigo-600 text-white text-sm py-2 rounded-lg hover:bg-indigo-700 transition">{d.courses.enrollBtn}</button>
                  <button onClick={() => navigate(`/coursedetails/${c.id}`)} className="flex-1 border text-sm py-2 rounded-lg hover:bg-gray-50 transition">{d.courses.syllabusBtn}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= INFO ================= */
function InfoSection() {
  const d = useD();
  const navigate = useNavigate();
  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="bg-[#25F4F41A] rounded-lg flex items-center justify-center h-56 w-full shadow-md">
                <FaGlobe className="text-6xl text-[#25F4F4FF]" />
              </div>
              <div className="rounded-lg overflow-hidden shadow-md h-56 w-full">
                <img src={d.info.img1 || infoclass} alt="class" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="rounded-lg overflow-hidden shadow-md h-56 w-full">
                <img src={d.info.img2 || erfolgreich} alt="project" className="w-full h-full object-cover" />
              </div>
              <div className="bg-[#6161EA1A] rounded-lg flex items-center justify-center h-56 w-full shadow-md">
                <FaCode className="text-6xl text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <p className="text-indigo-600 font-semibold text-sm">{d.info.eyebrow}</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{d.info.heading}</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{d.info.paragraph}</p>
            <ul className="space-y-4">
              {d.info.features.map(({ title, desc, icon }, i) => {
                const Icon = iconMap[icon] || FaGrad;
                return (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                      <Icon className="text-xl text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">{title}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5">{desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <button onClick={() => navigate("/services")} className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition text-sm">
              {d.info.btn}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= STATS ================= */
function StatsSection() {
  const d = useD();
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {d.stats.map(({ icon, value, label }, i) => {
            const Icon = iconMap[icon] || FaUsers;
            return (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-3 text-xl"><Icon /></div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
                <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide mt-1">{label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================= TESTIMONIALS ================= */
function TestimonialsSection() {
  const d = useD();
  return (
    <section className="bg-[#f5f6fa] border-t-2 border-[#E0E2E6FF] py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{d.testimonials.heading}</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">{d.testimonials.subheading}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {d.testimonials.items.map((item, i) => (
            <div key={i} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="flex text-indigo-600 mb-3 text-lg">{"★★★★★"}</div>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">"{item.text}"</p>
              <div className="flex items-center gap-3">
                <img src={item.img} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= SUCCESS STORIES ================= */
function SuccessStoriesSection() {
  const d = useD();
  const navigate = useNavigate();
  return (
    <section className="bg-white border-t-2 border-[#E0E2E6FF] py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{d.successStories.heading}</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-xl leading-relaxed">{d.successStories.subheading}</p>
          </div>
          <button onClick={() => navigate("/portfolio")} className="border border-gray-300 px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition whitespace-nowrap flex-shrink-0">
            {d.successStories.viewBtn}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {d.successStories.items.map((item, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden group h-56 sm:h-72 lg:h-80 shadow-md hover:shadow-lg transition">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white space-y-2">
                <span className="inline-block text-xs bg-indigo-600 px-3 py-1 rounded-full font-medium">{item.tag}</span>
                <h3 className="text-lg sm:text-xl font-semibold leading-snug">{item.title}</h3>
                <p className="text-sm text-gray-200 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= CTA FORM ================= */
function CTASection() {
  const d = useD();
  return (
    <section className="bg-[#f3f4fb] py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-5 text-center lg:text-left order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {d.cta.heading}
              <span className="block text-indigo-600">{d.cta.headingHighlight}</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">{d.cta.paragraph}</p>
            <ul className="space-y-2.5 text-sm text-gray-700">
              {d.cta.bullets.map((item, i) => (
                <li key={i} className="flex items-start gap-2 justify-center lg:justify-start">
                  <span className="mt-0.5 text-indigo-600 flex-shrink-0">✔</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 order-1 lg:order-2">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{d.cta.formTitle}</h3>
            <p className="text-gray-500 text-xs sm:text-sm mt-1.5 mb-5">{d.cta.formSubtitle}</p>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600">FULL NAME</label>
                  <input type="text" placeholder="John Doe" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">WORK EMAIL</label>
                  <input type="email" placeholder="john@company.com" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">INTERESTED IN</label>
                <select className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition">
                  <option value="">Select course</option>
                  {d.cta.courseOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">MESSAGE (OPTIONAL)</label>
                <textarea placeholder="How can we help you?" rows={3} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition text-sm">
                {d.cta.submitBtn}
              </button>
              <p className="text-xs text-gray-400 text-center">{d.cta.privacyNote}</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= BLOG ================= */
function BlogSection() {
  const d = useD();
  const navigate = useNavigate();
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{d.blog.heading}</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-xl leading-relaxed">{d.blog.subheading}</p>
          </div>
          <button onClick={() => navigate("/blogs")} className="border border-gray-300 px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition whitespace-nowrap flex-shrink-0">
            {d.blog.viewBtn}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {d.blog.items.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
              <img src={item.img} alt={item.title} className="w-full h-44 sm:h-48 object-cover" />
              <div className="p-5 space-y-2">
                <p className="text-xs text-indigo-600 font-semibold">{item.date}</p>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= EXPORT ================= */
export default function Home() {
  const d = usePageData("homeData", staticD);
  usePageMeta({
    title: d.seo?.title,
    description: d.seo?.description,
    keywords: d.seo?.keywords,
    canonical: d.seo?.canonical,
    ogTitle: d.seo?.ogTitle,
    ogDescription: d.seo?.ogDescription,
    ogImage: d.seo?.ogImage,
  });
  useSchema([
    { "@context": "https://schema.org", "@type": "Organization", "name": "Trivoxa Technologies", "url": "https://trivoxatech.com", "logo": "https://trivoxatech.com/logo.png", "description": d.hero.subtitle, "sameAs": ["https://linkedin.com/company/trivoxatech", "https://twitter.com/trivoxatech"], "contactPoint": { "@type": "ContactPoint", "contactType": "customer service", "email": "hello@trivoxatech.com" } },
    { "@context": "https://schema.org", "@type": "WebSite", "name": "Trivoxa Technologies", "url": "https://trivoxatech.com", "potentialAction": { "@type": "SearchAction", "target": "https://trivoxatech.com/courses?q={search_term_string}", "query-input": "required name=search_term_string" } },
    { "@context": "https://schema.org", "@type": "ItemList", "name": d.courses.heading, "itemListElement": d.courses.items.map((c, i) => ({ "@type": "ListItem", "position": i + 1, "name": c.title, "url": `https://trivoxatech.com/coursedetails/${c.id}` })) },
    { "@context": "https://schema.org", "@type": "ItemList", "name": d.testimonials.heading, "itemListElement": d.testimonials.items.map((t, i) => ({ "@type": "ListItem", "position": i + 1, "item": { "@type": "Review", "reviewBody": t.text, "author": { "@type": "Person", "name": t.name }, "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" } } })) },
  ]);
  return (
    <D.Provider value={d}>
      <div>
        <HeroSection />
        <TrustedSection />
        <CoursesSection />
        <InfoSection />
        <StatsSection />
        <TestimonialsSection />
        <SuccessStoriesSection />
        <CTASection />
        <BlogSection />
        <Footer />
      </div>
    </D.Provider>
  );
}
