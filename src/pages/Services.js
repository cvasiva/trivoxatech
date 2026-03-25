import { useNavigate } from "react-router-dom";
import { FaGlobe, FaPalette, FaBullhorn, FaCheckCircle, FaBolt, FaChartLine } from "react-icons/fa";
import Footer from "../components/Footer";
import staticD from "../data/servicesData.json";
import useSchema from "../hooks/useSchema";
import usePageData from "../hooks/usePageData";
import usePageMeta from "../hooks/usePageMeta";

const iconMap = { FaGlobe, FaPalette, FaBullhorn, FaBolt, FaChartLine };

/* ================= HERO ================= */
function HeroSection({ d }) {
  const navigate = useNavigate();
  return (
    <section className="bg-[#f8f9fc] py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div>
          <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">{d.hero.eyebrow}</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 leading-tight">
            {d.hero.title}{" "}<span className="text-indigo-600">{d.hero.highlight}</span>
          </h1>
          <p className="text-gray-500 mt-4 text-sm sm:text-base max-w-lg">{d.hero.paragraph}</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button onClick={() => navigate("/servicesquote")} className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium">
              {d.hero.primaryBtn}
            </button>
            <button className="border px-5 py-2.5 rounded-lg bg-white text-sm font-medium">{d.hero.secondaryBtn}</button>
          </div>
          <div className="flex gap-10 mt-8">
            {d.hero.stats.map((s, i) => (
              <div key={i}>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-gray-500 text-xs uppercase tracking-wide mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <img src={d.hero.img} alt="services" className="rounded-xl w-full h-56 sm:h-72 lg:h-[420px] object-cover" />
      </div>
    </section>
  );
}

/* ================= SERVICES ================= */
function ServicesSection({ d }) {
  const navigate = useNavigate();
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold">{d.services.heading}</h2>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm sm:text-base">{d.services.subheading}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-10">
          {d.services.items.map((s, i) => {
            const Icon = iconMap[s.icon] || FaGlobe;
            return (
              <div key={i} className="bg-[#fafafa] border rounded-xl p-5 sm:p-6 text-left flex flex-col">
                <div className="w-10 h-10 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-lg shrink-0">
                  <Icon />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mt-4">{s.title}</h3>
                <p className="text-gray-500 text-sm mt-2">{s.desc}</p>
                <ul className="mt-4 space-y-2 text-sm flex-1">
                  {s.features.map((f, idx) => (
                    <li key={idx} className="flex gap-2 items-center">
                      <FaCheckCircle className="text-indigo-500 text-xs shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate("/servicesquote", { state: { service: s.title } })}
                  className="w-full mt-5 bg-indigo-600 text-white py-2.5 rounded text-sm font-medium">
                  {d.services.quoteBtn}
                </button>
                <button className="w-full mt-2 border py-2.5 rounded bg-white text-sm font-medium">{d.services.demoBtn}</button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================= LIFECYCLE ================= */
function LifecycleSection({ d }) {
  return (
    <section className="bg-[#f1f3ff] py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">{d.lifecycle.eyebrow}</span>
        <h3 className="text-xl sm:text-2xl font-semibold mt-4">{d.lifecycle.heading}</h3>
        <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-xl">{d.lifecycle.subheading}</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-10 text-center">
          {d.lifecycle.steps.map((s, i) => (
            <div key={i}>
              <div className="w-10 h-10 mx-auto bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">{s.no}</div>
              <h4 className="font-semibold mt-3 text-sm sm:text-base">{s.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= TEAM ================= */
function TeamSection({ d }) {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold">{d.team.heading}</h3>
          <p className="text-gray-500 mt-3 text-sm sm:text-base">{d.team.subheading}</p>
          <div className="mt-5 space-y-4">
            {d.team.highlights.map((h, i) => {
              const Icon = iconMap[h.icon] || FaBolt;
              return (
                <div key={i} className="flex gap-3 items-start">
                  <Icon className="text-indigo-600 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">{h.title}</p>
                    <p className="text-xs text-gray-500">{h.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="mt-6 bg-indigo-600 text-white px-5 py-2.5 rounded text-sm font-medium">{d.team.btn}</button>
        </div>
        <div className="bg-[#fafafa] border rounded-xl p-6 grid grid-cols-2 gap-6 text-center">
          {d.team.members.map((m, i) => (
            <div key={i}>
              <img src={m.img} alt={m.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto object-cover" />
              <p className="text-sm font-semibold mt-2">{m.name}</p>
              <p className="text-xs text-gray-500">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= SUCCESS ================= */
function SuccessSection({ d }) {
  return (
    <section className="bg-[#f8f9fc] py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold">{d.successStories.heading}</h3>
          <button className="border px-4 py-2 rounded text-sm font-medium">{d.successStories.viewBtn}</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
          {d.successStories.items.map((p, i) => (
            <div key={i} className="bg-white border rounded-xl overflow-hidden">
              <img src={p.img} alt={p.title} className="w-full h-44 sm:h-52 object-cover" />
              <div className="p-4 sm:p-5">
                <p className="text-xs text-indigo-600 font-medium">{p.tag}</p>
                <h4 className="font-semibold mt-1 text-sm sm:text-base">{p.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{p.metric}</p>
                <button className="text-indigo-600 text-sm mt-2">Read Case Study →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= CTA ================= */
function CTASection({ d }) {
  return (
    <section className="bg-gradient-to-r from-indigo-500 to-purple-500 py-14 sm:py-16 lg:py-20 text-white text-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">{d.cta.heading}</h2>
        <p className="mt-3 text-indigo-100 text-sm sm:text-base">{d.cta.subheading}</p>
        <div className="mt-6 flex justify-center flex-wrap gap-3">
          <button className="bg-white text-indigo-600 px-6 py-2.5 rounded text-sm font-medium">{d.cta.primaryBtn}</button>
          <button className="bg-white/20 px-6 py-2.5 rounded text-sm font-medium">{d.cta.secondaryBtn}</button>
        </div>
      </div>
    </section>
  );
}

/* ================= MAIN ================= */
export default function ServicesPage() {
  const d = usePageData("servicesData", staticD);
  usePageMeta({ title: "Services", description: d.hero.paragraph, canonical: "https://trivoxatechnologis.vercel.app/services" });
  useSchema([
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Trivoxa Technologies",
      "url": "https://trivoxatech.com/services",
      "description": d.hero.paragraph,
      "image": d.hero.img,
      "priceRange": "$$",
      "areaServed": "Worldwide",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": d.services.heading,
        "itemListElement": d.services.items.map((s) => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": s.title,
            "description": s.desc
          }
        }))
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": d.services.heading,
      "itemListElement": d.services.items.map((s, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": s.title,
        "description": s.desc
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trivoxatech.com" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://trivoxatech.com/services" }
      ]
    }
  ]);
  return (
    <div className="min-h-screen">
      <HeroSection d={d} />
      <ServicesSection d={d} />
      <LifecycleSection d={d} />
      <TeamSection d={d} />
      <SuccessSection d={d} />
      <CTASection d={d} />
      <Footer />
    </div>
  );
}
