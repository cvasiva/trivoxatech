import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaGlobe, FaChartLine, FaAward } from "react-icons/fa";
import Footer from "../components/Footer";
import staticD from "../data/aboutData.json";
import useSchema from "../hooks/useSchema";
import usePageData from "../hooks/usePageData";
import usePageMeta from "../hooks/usePageMeta";

const iconMap = { FaUsers, FaGlobe, FaChartLine, FaAward };

/* ================= HERO ================= */
function Hero({ d }) {
  const navigate = useNavigate();
  return (
    <section className="bg-[#f5f6fa] px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
        <div>
          <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full inline-block">
            {d.hero.eyebrow}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-4 sm:mt-6 leading-tight">
            {d.hero.title}
            <span className="block text-indigo-600">{d.hero.highlight1}</span>
            <span className="text-cyan-500">{d.hero.highlight2}</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-4 sm:mt-6 max-w-lg leading-relaxed">
            {d.hero.paragraph}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
            <button onClick={() => navigate("/courses")} className="bg-indigo-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-indigo-700 transition">{d.hero.primaryBtn}</button>
            <button onClick={() => navigate("/contact")} className="border border-gray-300 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-50 transition">{d.hero.secondaryBtn}</button>
          </div>
        </div>
        <img src={d.hero.img} className="rounded-xl w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] object-cover" alt="Team collaboration" />
      </div>
    </section>
  );
}

/* ================= STATS ================= */
function Stats({ d }) {
  return (
    <div className="px-4 sm:px-8 lg:px-16 py-8 sm:py-12 mt-[-5rem]">
      <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 text-center p-6 sm:p-8 md:p-10 gap-4 sm:gap-6 md:gap-8">
        {d.stats.map((item, i) => {
          const Icon = iconMap[item.icon] || FaUsers;
          return (
            <div key={i} className="flex flex-col items-center">
              <div className="w-10 sm:w-12 md:w-14 h-10 sm:h-12 md:h-14 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-2 sm:mb-3 text-lg sm:text-xl">
                <Icon />
              </div>
              <p className="font-bold text-base sm:text-lg md:text-xl">{item.value}</p>
              <p className="text-xs sm:text-sm text-gray-500 tracking-wide mt-1">{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= JOURNEY ================= */
function Journey({ d }) {
  const [m0, m1] = d.journey.milestones;
  return (
    <section className="px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-10 sm:mb-12 md:mb-16">
          {d.journey.heading}
        </h2>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
          <div>
            <h3 className="font-semibold text-lg sm:text-xl md:text-2xl">{m0.year}</h3>
            <p className="text-gray-600 mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed">{m0.paragraph}</p>
            <ul className="text-sm sm:text-base mt-4 sm:mt-6 space-y-2 text-gray-600">
              {m0.bullets.map((b, i) => <li key={i}>• {b}</li>)}
            </ul>
          </div>
          <img src={m0.img} className="rounded-xl w-full h-[200px] sm:h-[250px] md:h-[300px] object-cover" alt={m0.year} />
        </div>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
          <img src={m1.img} className="rounded-xl w-full h-[200px] sm:h-[250px] md:h-[300px] object-cover order-2 md:order-1" alt={m1.year} />
          <div className="order-1 md:order-2">
            <h3 className="font-semibold text-lg sm:text-xl md:text-2xl">{m1.year}</h3>
            <p className="text-gray-600 mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed">{m1.paragraph}</p>
            <ul className="text-sm sm:text-base mt-4 sm:mt-6 space-y-2 text-gray-600">
              {m1.bullets.map((b, i) => <li key={i}>• {b}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= TEAM ================= */
function Team({ d }) {
  return (
    <section className="bg-[#f5f6fa] px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">{d.team.heading}</h2>
        <p className="text-gray-600 mb-10 sm:mb-12 md:mb-16 text-sm sm:text-base">{d.team.subheading}</p>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
          {d.team.members.map((m, i) => (
            <div key={i} className="flex flex-col items-center">
              <img src={m.img} className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full object-cover" alt={m.name} />
              <p className="font-semibold mt-3 sm:mt-4 text-sm sm:text-base">{m.name}</p>
              <p className="text-xs sm:text-sm text-indigo-600 mt-1">{m.role}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 px-2 leading-relaxed">{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= RECOGNIZED ================= */
function Recognized({ d }) {
  return (
    <section className="px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 md:py-20 text-center">
      <p className="text-xs sm:text-sm tracking-widest text-gray-500 mb-8 sm:mb-10 md:mb-12">
        {d.recognized.label}
      </p>
      <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12 opacity-70">
        {d.recognized.logos.map((logo, i) => (
          <img key={i} src={logo.src} className="h-5 sm:h-6 md:h-7" alt={logo.name} />
        ))}
      </div>
    </section>
  );
}

/* ================= CTA ================= */
function CTA({ d }) {
  const navigate = useNavigate();
  return (
    <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-12 sm:py-16 md:py-20">
      <div className="relative max-w-5xl mx-auto bg-indigo-100 rounded-2xl overflow-hidden p-6 sm:p-10 md:p-12 lg:p-16 text-center">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-200 rounded-full opacity-40" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-200 rounded-full opacity-40" />
        <span className="inline-block text-xs bg-indigo-500 text-white px-3 py-1 rounded-full mb-4">
          {d.cta.badge}
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
          {d.cta.heading}
        </h2>
        <p className="text-gray-600 mt-4 sm:mt-6 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {d.cta.paragraph}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
          <button onClick={() => navigate("/careers")} className="bg-indigo-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-indigo-700 transition shadow-md">
            {d.cta.primaryBtn}
          </button>
          <button onClick={() => navigate("/contact")} className="bg-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium border border-gray-300 hover:bg-gray-50 transition shadow-sm">
            {d.cta.secondaryBtn}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ================= PAGE ================= */
export default function AboutPage() {
  const d = usePageData("aboutData", staticD);
  usePageMeta({ title: "About Us", description: d.hero.paragraph, canonical: "https://trivoxatechnologis.vercel.app/about" });
  useSchema([
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Trivoxa Technologies",
      "url": "https://trivoxatech.com/about",
      "description": d.hero.paragraph
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Trivoxa Technologies",
      "url": "https://trivoxatech.com",
      "foundingDate": "2018",
      "description": d.hero.paragraph,
      "numberOfEmployees": { "@type": "QuantitativeValue", "value": "50" },
      "member": d.team.members.map((m) => ({
        "@type": "Person",
        "name": m.name,
        "jobTitle": m.role,
        "description": m.bio,
        "image": m.img
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Trivoxa Journey Milestones",
      "itemListElement": d.journey.milestones.map((m, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": m.year,
        "description": m.paragraph
      }))
    }
  ]);
  return (
    <div>
      <Hero d={d} />
      <Stats d={d} />
      <Journey d={d} />
      <Team d={d} />
      <Recognized d={d} />
      <CTA d={d} />
      <Footer />
    </div>
  );
}
