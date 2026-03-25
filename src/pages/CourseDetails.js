import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EnrollForm from "../components/EnrollForm";
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

const toolIconMap = {
  "React": <FaReact />, "Node.js": <FaNodeJs />, "MongoDB": <FaDatabase />,
  "Tailwind CSS": <FaCss3Alt />, "VS Code": <FaLaptopCode />, "Python": <FaPython />,
  "Docker": <FaDocker />, "Figma": <FaFigma />, "AWS Console": <FaAws />,
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
          <div key={t} className="border rounded-lg p-4 text-center text-sm">
            <div className="text-xl mb-2">{toolIconMap[t] || <FaLaptopCode />}</div>
            {t}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= CERTIFICATE ================= */
function Certificate({ d }) {
  const c = d.certificate;
  return (
    <section className="px-4 sm:px-8 lg:px-16 py-12">
      <div className="max-w-5xl mx-auto bg-indigo-100 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
        <img src={c.img} className="w-40 rounded" alt="certificate" />
        <div>
          <h3 className="font-semibold text-lg">{c.heading}</h3>
          <p className="text-sm text-gray-600 mt-2">{c.paragraph}</p>
          <ul className="text-sm mt-2 space-y-1">
            {c.points.map((p, i) => <li key={i}>✔ {p}</li>)}
          </ul>
        </div>
      </div>
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
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {testimonials.map((t) => (
          <div key={t.name} className="border p-4 rounded-lg">
            <p className="font-semibold">{t.name}</p>
            <p className="text-xs text-gray-500">{t.role}</p>
            <p className="text-sm mt-2">"{t.text}"</p>
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
              onClick={() => navigate(`/coursedetails/${c.id}`)}
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
  const { id } = useParams();
  const navigate = useNavigate();
  const d = usePageData("courseDetailsData", staticCourseDetails);
  const courseDataLive = usePageData("courseData", { courses: staticCourseData.allCourses });
  const allCourses = courseDataLive?.courses || staticCourseData.allCourses;
  const course = allCourses.find((c) => c.id === Number(id));

  usePageMeta(course ? {
    title: course.title,
    description: course.longDesc || course.desc,
    canonical: `https://trivoxatechnologis.vercel.app/coursedetails/${course.id}`,
    ogImage: course.img,
  } : { title: "Course Details" });

  useSchema(course ? [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": course.title,
      "description": course.longDesc || course.desc,
      "url": `https://trivoxatech.com/coursedetails/${course.id}`,
      "image": course.img,
      "provider": { "@type": "Organization", "name": "Trivoxa Technologies", "url": "https://trivoxatech.com" },
      "educationalLevel": course.level,
      "timeRequired": course.duration,
      "offers": {
        "@type": "Offer",
        "price": course.price ? course.price.replace(/[^0-9.]/g, "") : "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": `https://trivoxatech.com/coursedetails/${course.id}`
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
        { "@type": "ListItem", "position": 3, "name": course.title, "item": `https://trivoxatech.com/coursedetails/${course.id}` }
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
      <Certificate d={d} />
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
