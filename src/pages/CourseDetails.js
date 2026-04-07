import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EnrollForm from "../components/EnrollForm";
import ContactForm from "../components/ContactForm";
import {
  FaClock, FaSignal, FaStar, FaCheckCircle, FaPlay, FaCertificate,
  FaChevronDown, FaChevronUp, FaLaptopCode, FaNodeJs, FaDatabase,
  FaCss3Alt, FaReact, FaPython, FaDocker, FaAws, FaFigma, FaArrowLeft,
} from "react-icons/fa";
import Footer from "../components/Footer";
import staticCourseDetails from "../data/courseDetailsData.json";
import * as staticCourseData from "../data/courseData";
import useSchema from "../hooks/useSchema";
import usePageData from "../hooks/usePageData";
import usePageMeta from "../hooks/usePageMeta";

const toSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const toolIconMap = {
  // Dev
  "React":            <FaReact className="text-[#61DAFB]" />,
  "React Native":     <FaReact className="text-[#61DAFB]" />,
  "Node.js":          <FaNodeJs className="text-[#339933]" />,
  "MongoDB":          <FaDatabase className="text-[#47A248]" />,
  "Tailwind CSS":     <FaCss3Alt className="text-[#06B6D4]" />,
  "VS Code":          <FaLaptopCode className="text-[#007ACC]" />,
  "Python":           <FaPython className="text-[#3776AB]" />,
  "Docker":           <FaDocker className="text-[#2496ED]" />,
  "Figma":            <FaFigma className="text-[#F24E1E]" />,
  "AWS Console":      <FaAws className="text-[#FF9900]" />,
  "CloudFormation":   <FaAws className="text-[#FF9900]" />,
  // Design
  "Adobe XD":         <img src="https://cdn.worldvectorlogo.com/logos/adobe-xd-2.svg"             alt="Adobe XD"       className="w-7 h-7 object-contain" />,
  "Miro":             <img src="https://cdn.worldvectorlogo.com/logos/miro-2.svg"                  alt="Miro"           className="w-7 h-7 object-contain" />,
  "Notion":           <img src="https://cdn.worldvectorlogo.com/logos/notion-2.svg"                alt="Notion"         className="w-7 h-7 object-contain" />,
  "Zeplin":           <img src="https://cdn.worldvectorlogo.com/logos/zeplin.svg"                  alt="Zeplin"         className="w-7 h-7 object-contain" />,
  "FigJam":           <img src="https://cdn.worldvectorlogo.com/logos/figma-1.svg"                 alt="FigJam"         className="w-7 h-7 object-contain" />,
  "Storybook":        <img src="https://cdn.worldvectorlogo.com/logos/storybook-1.svg"             alt="Storybook"      className="w-7 h-7 object-contain" />,
  "Photoshop":        <img src="https://cdn.worldvectorlogo.com/logos/adobe-photoshop-2.svg"       alt="Photoshop"      className="w-7 h-7 object-contain" />,
  "Illustrator":      <img src="https://cdn.worldvectorlogo.com/logos/adobe-illustrator-cc-3.svg"  alt="Illustrator"    className="w-7 h-7 object-contain" />,
  "InDesign":         <img src="https://cdn.worldvectorlogo.com/logos/adobe-indesign-cc.svg"       alt="InDesign"       className="w-7 h-7 object-contain" />,
  "Canva":            <img src="https://cdn.worldvectorlogo.com/logos/canva-1.svg"                 alt="Canva"          className="w-7 h-7 object-contain" />,
  // Marketing
  "Google Analytics": <img src="https://cdn.worldvectorlogo.com/logos/google-analytics-4.svg"     alt="Google Analytics" className="w-7 h-7 object-contain" />,
  "SEMrush":          <img src="https://cdn.worldvectorlogo.com/logos/semrush.svg"                 alt="SEMrush"        className="w-7 h-7 object-contain" />,
  "Mailchimp":        <img src="https://cdn.worldvectorlogo.com/logos/mailchimp.svg"               alt="Mailchimp"      className="w-7 h-7 object-contain" />,
  "HubSpot":          <img src="https://cdn.worldvectorlogo.com/logos/hubspot.svg"                 alt="HubSpot"        className="w-7 h-7 object-contain" />,
  "Meta Ads Manager": <img src="https://cdn.worldvectorlogo.com/logos/meta-1.svg"                  alt="Meta Ads"       className="w-7 h-7 object-contain" />,
  "Hootsuite":        <img src="https://cdn.worldvectorlogo.com/logos/hootsuite.svg"               alt="Hootsuite"      className="w-7 h-7 object-contain" />,
  "Buffer":           <img src="https://cdn.worldvectorlogo.com/logos/buffer-1.svg"                alt="Buffer"         className="w-7 h-7 object-contain" />,
  "Sprout Social":    <img src="https://cdn.worldvectorlogo.com/logos/sprout-social.svg"           alt="Sprout Social"  className="w-7 h-7 object-contain" />,
  // Cloud / DevOps
  "Terraform":        <img src="https://cdn.worldvectorlogo.com/logos/terraform-enterprise.svg"   alt="Terraform"      className="w-7 h-7 object-contain" />,
  "Grafana":          <img src="https://cdn.worldvectorlogo.com/logos/grafana.svg"                 alt="Grafana"        className="w-7 h-7 object-contain" />,
  "Kubernetes":       <img src="https://cdn.worldvectorlogo.com/logos/kubernets.svg"               alt="Kubernetes"     className="w-7 h-7 object-contain" />,
  "Jenkins":          <img src="https://cdn.worldvectorlogo.com/logos/jenkins-1.svg"               alt="Jenkins"        className="w-7 h-7 object-contain" />,
  "GitHub Actions":   <img src="https://cdn.worldvectorlogo.com/logos/github-icon-1.svg"           alt="GitHub Actions" className="w-7 h-7 object-contain" />,
  "Prometheus":       <img src="https://cdn.worldvectorlogo.com/logos/prometheus.svg"              alt="Prometheus"     className="w-7 h-7 object-contain" />,
  "Helm":             <img src="https://cdn.worldvectorlogo.com/logos/helm.svg"                    alt="Helm"           className="w-7 h-7 object-contain" />,
  "ArgoCD":           <img src="https://cdn.worldvectorlogo.com/logos/argo-icon-color.svg"         alt="ArgoCD"         className="w-7 h-7 object-contain" />,
  "Istio":            <img src="https://cdn.worldvectorlogo.com/logos/istio.svg"                   alt="Istio"          className="w-7 h-7 object-contain" />,
  // Data Science
  "Jupyter":          <img src="https://cdn.worldvectorlogo.com/logos/jupyter.svg"                 alt="Jupyter"        className="w-7 h-7 object-contain" />,
  "Pandas":           <img src="https://cdn.worldvectorlogo.com/logos/pandas.svg"                  alt="Pandas"         className="w-7 h-7 object-contain" />,
  "Scikit-learn":     <img src="https://cdn.worldvectorlogo.com/logos/scikit-learn.svg"            alt="Scikit-learn"   className="w-7 h-7 object-contain" />,
  "Tableau":          <img src="https://cdn.worldvectorlogo.com/logos/tableau-software.svg"        alt="Tableau"        className="w-7 h-7 object-contain" />,
  // Mobile
  "Expo":             <img src="https://cdn.worldvectorlogo.com/logos/expo-1.svg"                  alt="Expo"           className="w-7 h-7 object-contain" />,
  "Firebase":         <img src="https://cdn.worldvectorlogo.com/logos/firebase-1.svg"              alt="Firebase"       className="w-7 h-7 object-contain" />,
  "Redux":            <img src="https://cdn.worldvectorlogo.com/logos/redux.svg"                   alt="Redux"          className="w-7 h-7 object-contain" />,
  "Xcode":            <img src="https://cdn.worldvectorlogo.com/logos/xcode.svg"                   alt="Xcode"          className="w-7 h-7 object-contain" />,
  // Frontend
  "Next.js":          <img src="https://cdn.worldvectorlogo.com/logos/next-js.svg"                 alt="Next.js"        className="w-7 h-7 object-contain" />,
  "TypeScript":       <img src="https://cdn.worldvectorlogo.com/logos/typescript.svg"              alt="TypeScript"     className="w-7 h-7 object-contain" />,
  "Vercel":           <img src="https://cdn.worldvectorlogo.com/logos/vercel.svg"                  alt="Vercel"         className="w-7 h-7 object-contain" />,
  "Prisma":           <img src="https://cdn.worldvectorlogo.com/logos/prisma-2.svg"                alt="Prisma"         className="w-7 h-7 object-contain" />,
};

/* ================= STICKY BACK BUTTON ================= */
function StickyBack({ course }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed top-24 left-4 sm:left-6 lg:left-8 z-50 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <button
        onClick={() => navigate("/courses")}
        className="flex items-center gap-2 bg-white border border-gray-200 shadow-md hover:shadow-lg hover:border-indigo-300 text-gray-700 hover:text-indigo-600 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200"
      >
        <FaArrowLeft className="text-xs" />
        <span className="hidden sm:inline">Back to Courses</span>
        <span className="sm:hidden">Back</span>
      </button>
    </div>
  );
}

/* ================= HERO ================= */
function CourseHero({ course, onEnroll, d }) {
  const h = d.hero;
  return (
    <section className="bg-[#f5f6fa] px-4 sm:px-8 lg:px-16 py-16">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">{course.subtitle}</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-4 leading-tight">
            {course.title.split(" ").slice(0, -1).join(" ")}
            <span className="block text-indigo-600">{course.title.split(" ").slice(-1)}</span>
          </h1>
          <p className="text-gray-600 mt-4 max-w-lg">{course.longDesc}</p>
          <div className="flex items-center gap-2 mt-3 text-sm">
            <FaStar className="text-yellow-500" /> {course.rating} / 5.0 ({course.reviews.toLocaleString()}+ {h.reviewsLabel})
          </div>
          <div className="flex gap-4 mt-6">
            <button onClick={onEnroll} className="bg-indigo-600 text-white px-6 py-3 rounded-lg">{h.enrollBtn}</button>
            <button onClick={onEnroll} className="border px-6 py-3 rounded-lg">{h.demoBtn}</button>
          </div>
        </div>
        <div className="relative">
          <img src={course.img} alt={course.title} className="rounded-xl w-full h-[350px] object-cover" />
          <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow text-sm flex items-center gap-2">
            <FaCertificate /> {h.badge}
          </div>
        </div>
      </div>
      <div className="bg-indigo-600 text-white mt-10 rounded-lg p-5 grid grid-cols-2 sm:grid-cols-4 text-center text-sm">
        <div><FaClock className="mx-auto mb-1" /> {course.duration}</div>
        <div><FaPlay className="mx-auto mb-1" /> {h.metaLabels[0]}</div>
        <div><FaSignal className="mx-auto mb-1" /> {course.level}</div>
        <div><FaCheckCircle className="mx-auto mb-1" /> {course.seatsLeft} {h.metaLabels[1]}</div>
      </div>
    </section>
  );
}

/* ================= WHY + PRICE ================= */
function WhyCourse({ course, onEnroll, d }) {
  const w = d.whyCourse;
  return (
    <section className="px-4 sm:px-8 lg:px-16 py-16">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold">{w.heading}</h2>
          <p className="text-gray-500 text-sm mt-2">{w.subheading}</p>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {course.highlights.map((item) => (
              <div key={item} className="border rounded-lg p-4 text-sm">{item}</div>
            ))}
          </div>
          <h3 className="text-xl font-semibold mt-10">{w.syllabusHeading}</h3>
          <Syllabus modules={course.syllabus} placeholder={w.syllabusPlaceholder} />
        </div>
        <div className="border rounded-xl p-6">
          <p className="text-xs text-indigo-600">{w.earlyBirdLabel}</p>
          <h2 className="text-3xl font-bold mt-2">
            {course.price} <span className="text-sm line-through text-gray-400">{course.originalPrice}</span>
          </h2>
          <p className="text-sm text-gray-500">{w.emiLabel} {course.emi}</p>
          <button onClick={onEnroll} className="bg-indigo-600 text-white w-full py-3 rounded-lg mt-4">{w.enrollBtn}</button>
          <button onClick={onEnroll} className="border w-full py-3 rounded-lg mt-2">{w.demoBtn}</button>
          <ul className="text-sm mt-4 space-y-2">
            {course.includes.map((item) => <li key={item}>✔ {item}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ================= SYLLABUS ACCORDION ================= */
function Syllabus({ modules, placeholder }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="mt-4 space-y-3">
      {modules.map((m, i) => (
        <div key={i} className="border rounded-lg">
          <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex justify-between p-4 text-left">
            {m} {open === i ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {open === i && (
            <div className="p-4 text-sm text-gray-600">{placeholder}</div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ================= TOOLS ================= */
function Tools({ tools, d }) {
  return (
    <section className="px-4 sm:px-8 lg:px-16 py-14">
      <h2 className="text-xl font-bold">{d.tools.heading}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-6">
        {tools.map((t) => (
          <div key={t} className="border border-gray-200 rounded-xl p-4 text-center hover:shadow-md hover:border-indigo-200 transition bg-white">
            <div className="text-2xl mb-2 flex items-center justify-center h-8">
              {toolIconMap[t] || <FaLaptopCode className="text-gray-400" />}
            </div>
            <p className="text-xs font-medium text-gray-700 mt-1">{t}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= CERTIFICATE ================= */
function Certificate({ d, course }) {
  const c = d.certificate;
  const [zoom, setZoom] = useState(false);
  const [showContact, setShowContact] = useState(false);
  return (
    <section className="w-full bg-gradient-to-r from-blue-600 to-blue-300 text-white py-12 px-4 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            {course.title} <br /> Training Certification
          </h1>
          <p className="text-sm md:text-lg text-blue-100 mb-8 max-w-xl mx-auto md:mx-0">{c.paragraph}</p>
          <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 mb-6">
            <button onClick={() => setShowContact(true)} className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition">{c.primaryBtn}</button>
            <button onClick={() => { const a = document.createElement('a'); a.href = c.img; a.download = 'sample-certificate.jpg'; a.target = '_blank'; a.click(); }} className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition">{c.secondaryBtn}</button>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-blue-100">
            <span className="text-green-400 text-lg">✔</span>
            <p>{c.footnote}</p>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white rounded-xl shadow-2xl p-3 max-w-md w-full">
            <div className="relative group cursor-pointer" onClick={() => setZoom(true)}>
              <img src={c.img} alt="Certificate" className="rounded-lg w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition bg-black bg-opacity-60 px-4 py-2 rounded-full">🔍 Click to view full screen</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ZOOM MODAL */}
      {zoom && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4" onClick={() => setZoom(false)}>
          <div className="relative max-w-4xl w-full">
            <button onClick={() => setZoom(false)} className="absolute -top-10 right-0 text-white text-3xl font-bold hover:text-gray-300">✕</button>
            <img src={c.img} alt="Certificate Full" className="w-full h-auto rounded-xl shadow-2xl" />
          </div>
        </div>
      )}

      {/* GET IN TOUCH MODAL */}
      {showContact && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={() => setShowContact(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Get In Touch</h2>
                <p className="text-xs text-indigo-600 mt-0.5">We'll get back to you within 24 hours</p>
              </div>
              <button onClick={() => setShowContact(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition">✕</button>
            </div>
            <div className="px-6 py-5">
              <ContactForm />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ================= CAREER ================= */
function Career({ careers, duration, d }) {
  const c = d.career;
  return (
    <section className="bg-[#f5f6fa] px-4 sm:px-8 lg:px-16 py-14">
      <h2 className="text-2xl font-bold text-center">{c.heading}</h2>
      <p className="text-center text-gray-500 text-sm mt-2">{c.subheading} {duration} of training.</p>
      <div className="grid sm:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto">
        {careers.map((c) => (
          <div key={c.role} className="border p-4 rounded-lg">
            <h3 className="font-semibold">{c.role}</h3>
            <p className="text-xs text-indigo-600">Avg. Salary: {c.salary}</p>
            <p className="text-xs mt-1">{c.companies}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= TESTIMONIALS ================= */
function Testimonials({ testimonials, d }) {
  return (
    <section className="px-4 sm:px-8 lg:px-16 py-14">
      <h2 className="text-2xl font-bold">{d.testimonials.heading}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-6">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white p-5 sm:p-6 rounded-2xl border shadow-sm hover:shadow-md transition">
            <div className="flex text-indigo-600 mb-3 text-lg">{"★★★★★"}</div>
            <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <img src={t.img || `https://randomuser.me/api/portraits/men/${i + 10}.jpg`} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= FAQ ================= */
function FAQ({ faqs, d }) {
  return (
    <section className="bg-[#f5f6fa] px-4 sm:px-8 lg:px-16 py-14">
      <h2 className="text-2xl font-bold text-center">{d.faq.heading}</h2>
      <div className="max-w-3xl mx-auto mt-6 space-y-3">
        {faqs.map((q) => (
          <div key={q} className="border p-4 rounded">{q}</div>
        ))}
      </div>
    </section>
  );
}

/* ================= RELATED ================= */
function Related({ relatedIds, allCourses, d }) {
  const navigate = useNavigate();
  const relatedCourses = allCourses.filter((c) => relatedIds.includes(c.id));
  return (
    <section className="px-4 sm:px-8 lg:px-16 py-14">
      <h2 className="text-2xl font-bold">{d.related.heading}</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        {relatedCourses.map((c) => (
          <div key={c.id} className="border rounded-lg p-3">
            <div className="h-28 bg-gray-200 rounded mb-2 overflow-hidden">
              <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
            </div>
            <p className="text-sm font-medium">{c.title}</p>
            <button
              onClick={() => navigate(`/courses/${c.slug || toSlug(c.title)}`)}
              className="text-indigo-600 text-xs mt-1"
            >
              {d.related.viewBtn}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= CTA ================= */
function CTA({ cohortDate, onEnroll, d }) {
  const c = d.cta;
  return (
    <section className="bg-indigo-600 text-white text-center py-16">
      <h2 className="text-2xl font-bold">{c.heading}</h2>
      <p className="text-sm mt-2">{c.subtext} {cohortDate}. {c.urgency}</p>
      <button onClick={onEnroll} className="bg-white text-black px-6 py-3 rounded-lg mt-6">{c.btn}</button>
    </section>
  );
}

/* ================= PAGE ================= */
export default function CoursePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const d = usePageData("courseDetailsData", staticCourseDetails);
  const courseDataLive = usePageData("courseData", { courses: staticCourseData.allCourses });
  const allCourses = courseDataLive?.courses || staticCourseData.allCourses;
  const course = allCourses.find((c) => (c.slug || toSlug(c.title)) === slug);

  usePageMeta({
    title:         d.seo?.title       || (course ? course.title : ""),
    description:   d.seo?.description || (course ? course.longDesc || course.desc : ""),
    keywords:      d.seo?.keywords    || "",
    ogTitle:       d.seo?.ogTitle     || (course ? course.title : ""),
    ogDescription: d.seo?.ogDescription || (course ? course.longDesc || course.desc : ""),
    ogImage:       d.seo?.ogImage     || (course ? course.img : ""),
    canonical: d.seo?.canonical || (course ? `https://trivoxatechnologies.in/courses/${course.slug}` : ""),
  });

  useSchema(course ? [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": course.title,
      "description": course.longDesc || course.desc,
      "url": `https://trivoxatechnologies.in/courses/${course.slug}`,
      "image": course.img,
      "provider": { "@type": "Organization", "name": "Trivoxa Technologies", "url": "https://trivoxatech.com" },
      "educationalLevel": course.level,
      "timeRequired": course.duration,
      "offers": {
        "@type": "Offer",
        "price": course.price ? course.price.replace(/[^0-9.]/g, "") : "0",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "url": `https://trivoxatechnologies.in/courses/${course.slug}`
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": course.rating,
        "reviewCount": course.reviews,
        "bestRating": "5"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "online",
        "startDate": course.cohortDate || ""
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": (course.faqs || []).map((q) => ({
        "@type": "Question",
        "name": q,
        "acceptedAnswer": { "@type": "Answer", "text": q }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trivoxatech.com" },
        { "@type": "ListItem", "position": 2, "name": "Courses", "item": "https://trivoxatech.com/courses" },
        { "@type": "ListItem", "position": 3, "name": course.title, "item": `https://trivoxatechnologies.in/courses/${course.slug}` }
      ]
    }
  ] : []);

  const [showEnroll, setShowEnroll] = useState(false);

  if (!course) {
    return (
      <div className="text-center py-32">
        <h2 className="text-2xl font-bold">{d.notFound?.heading || "Course not found"}</h2>
        <button onClick={() => navigate("/courses")} className="mt-4 text-indigo-600 underline">
          {d.notFound?.backBtn || "Back to Courses"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <StickyBack />
      <CourseHero course={course} onEnroll={() => setShowEnroll(true)} d={d} />
      <WhyCourse course={course} onEnroll={() => setShowEnroll(true)} d={d} />
      <Tools tools={course.tools} d={d} />
      <Certificate d={d} course={course} />
      <Career careers={course.careers} duration={course.duration} d={d} />
      <Testimonials testimonials={course.testimonials} d={d} />
      <FAQ faqs={course.faqs} d={d} />
      <Related relatedIds={course.related} allCourses={allCourses} d={d} />
      <CTA cohortDate={course.cohortDate} onEnroll={() => setShowEnroll(true)} d={d} />
      <Footer />
      {showEnroll && (
        <EnrollForm courseName={course.title} onClose={() => setShowEnroll(false)} />
      )}
    </div>
  );
}
