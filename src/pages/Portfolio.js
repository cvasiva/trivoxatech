import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGlobe, FaUsers, FaBolt, FaArrowUp, FaCheckCircle, FaChartLine, FaFilter } from "react-icons/fa";
import Footer from "../components/Footer";
import d from "../data/portfolioData.json";
import useSchema from "../hooks/useSchema";

const iconMap = { FaGlobe, FaUsers, FaBolt, FaArrowUp, FaCheckCircle, FaChartLine };

/* ================= HERO ================= */
function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="bg-[#f6f7fb] py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div>
          <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full font-medium">{d.hero.eyebrow}</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 leading-tight">
            {d.hero.title}{" "}<span className="text-indigo-600">{d.hero.highlight}</span>
          </h1>
          <p className="text-gray-500 mt-4 text-sm sm:text-base max-w-lg">{d.hero.paragraph}</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button onClick={() => navigate("/servicesquote")} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium">
              {d.hero.primaryBtn}
            </button>
            <button onClick={() => navigate("/services")} className="border px-6 py-2.5 rounded-lg bg-white text-sm font-medium">
              {d.hero.secondaryBtn}
            </button>
          </div>
        </div>
        <img src={d.hero.img} alt="portfolio" className="rounded-xl shadow-lg w-full h-56 sm:h-72 lg:h-[420px] object-cover" />
      </div>
    </section>
  );
}

/* ================= SUCCESS GALLERY ================= */
function SuccessGallery() {
  const [activeIndustry, setActiveIndustry] = useState("All Industries");
  const [activeService, setActiveService] = useState("All Services");

  const filtered = d.gallery.projects.filter((p) => {
    const industryMatch = activeIndustry === "All Industries" || p.tag === activeIndustry;
    const serviceMatch = activeService === "All Services" || p.category === activeService;
    return industryMatch && serviceMatch;
  });

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">{d.gallery.heading}</h2>
            <p className="text-sm text-gray-500 mt-1">Showing <span className="font-medium text-gray-700">{filtered.length}</span> results.</p>
          </div>
          <button className="text-indigo-600 text-sm font-medium whitespace-nowrap">{d.gallery.viewArchivedBtn}</button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 mt-8 flex-wrap">
          <span className="flex items-center gap-2 text-sm text-gray-500 shrink-0"><FaFilter className="text-xs" /> Filter:</span>
          {d.gallery.industries.map((item) => (
            <button key={item} onClick={() => setActiveIndustry(item)}
              className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full border transition ${activeIndustry === item ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`}>
              {item}
            </button>
          ))}
        </div>

        <div className="border-t mt-5" />

        <div className="flex gap-2 sm:gap-3 mt-4 flex-wrap">
          {d.gallery.services.map((item) => (
            <button key={item} onClick={() => setActiveService(item)}
              className={`px-3 sm:px-4 py-1 text-xs rounded-full transition ${activeService === item ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {item}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-10">
            {filtered.map((p, i) => <Card key={i} data={p} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 text-sm">{d.gallery.emptyMsg}</div>
        )}
      </div>
    </section>
  );
}

/* ================= CARD ================= */
function Card({ data }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition">
      <div className="relative">
        <img src={data.img} alt={data.title} className="w-full h-44 sm:h-48 object-cover" />
        <span className="absolute top-3 right-3 bg-white text-xs px-2 py-1 rounded-full shadow font-medium">{data.tag}</span>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-2.5 h-2.5 bg-indigo-300 rounded-full shrink-0"></span>{data.company}
        </div>
        <h3 className="mt-2 font-semibold text-gray-900 text-sm sm:text-base leading-snug">{data.title}</h3>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">{data.desc}</p>
        <div className="flex justify-between mt-5 text-sm font-semibold text-indigo-600">
          {data.metrics.map((m, i) => (
            <div key={i}>
              <p>{m.value}</p>
              <p className="text-[10px] text-gray-400 font-normal mt-1">{m.label}</p>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-3 text-xs text-gray-400">{data.category}</div>
      </div>
    </div>
  );
}

/* ================= STATS ================= */
function StatsSection() {
  return (
    <section className="bg-[#f6f7fb] py-12 sm:py-16 lg:py-20 text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-semibold">{d.stats.heading}</h2>
        <p className="text-gray-500 text-sm sm:text-base mt-2">{d.stats.subheading}</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-10">
          {d.stats.items.map((s, i) => {
            const Icon = iconMap[s.icon] || FaGlobe;
            return (
              <div key={i} className="bg-white border rounded-xl p-5 sm:p-6">
                <div className="w-10 h-10 mx-auto bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full mb-3"><Icon /></div>
                <p className="text-xl sm:text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================= CTA WITH FORM ================= */
function CTASection() {
  const [form, setForm] = useState({ name: "", email: "", project: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required";
    if (!form.project.trim()) e.project = "Please describe your project";
    return e;
  };

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setErrors({ ...errors, [e.target.name]: "" }); };
  const handleSubmit = (e) => { e.preventDefault(); const e2 = validate(); if (Object.keys(e2).length) { setErrors(e2); return; } setSubmitted(true); };

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-8 sm:p-10 lg:p-12 text-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold">
              {d.cta.heading}{" "}<span className="text-cyan-200">{d.cta.highlight}</span>
            </h2>
            <p className="text-sm sm:text-base mt-2 text-indigo-100">{d.cta.subheading}</p>
          </div>
          {submitted ? (
            <div className="bg-white/20 rounded-xl p-6 text-center max-w-md mx-auto">
              <FaCheckCircle className="text-green-300 text-3xl mx-auto mb-3" />
              <p className="font-semibold text-lg">{d.cta.successTitle}</p>
              <p className="text-sm text-indigo-100 mt-1">Thanks <span className="font-medium text-white">{form.name}</span>! {d.cta.successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              <div>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name"
                  className={`w-full bg-white/20 placeholder-indigo-200 text-white border rounded-lg px-4 py-2.5 text-sm outline-none focus:bg-white/30 ${errors.name ? "border-red-300" : "border-white/30"}`} />
                {errors.name && <p className="text-red-200 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <input name="email" value={form.email} onChange={handleChange} placeholder="Email Address"
                  className={`w-full bg-white/20 placeholder-indigo-200 text-white border rounded-lg px-4 py-2.5 text-sm outline-none focus:bg-white/30 ${errors.email ? "border-red-300" : "border-white/30"}`} />
                {errors.email && <p className="text-red-200 text-xs mt-1">{errors.email}</p>}
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <input name="project" value={form.project} onChange={handleChange} placeholder="Describe your project"
                  className={`w-full bg-white/20 placeholder-indigo-200 text-white border rounded-lg px-4 py-2.5 text-sm outline-none focus:bg-white/30 ${errors.project ? "border-red-300" : "border-white/30"}`} />
                {errors.project && <p className="text-red-200 text-xs mt-1">{errors.project}</p>}
              </div>
              <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap justify-center gap-3 mt-2">
                <button type="submit" className="bg-white text-indigo-600 px-6 py-2.5 rounded text-sm font-medium hover:bg-indigo-50 transition">{d.cta.primaryBtn}</button>
                <button type="button" className="bg-white/20 px-6 py-2.5 rounded text-sm font-medium hover:bg-white/30 transition">{d.cta.secondaryBtn}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ================= BOTTOM FEATURES ================= */
function BottomFeatures() {
  return (
    <section className="bg-[#f6f7fb] py-12 sm:py-14 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {d.features.map((f, i) => {
          const Icon = iconMap[f.icon] || FaCheckCircle;
          return (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-lg shrink-0"><Icon /></div>
              <div>
                <h4 className="font-semibold text-sm sm:text-base">{f.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ================= MAIN ================= */
export default function PortfolioPage() {
  useSchema([
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Trivoxa Portfolio & Case Studies",
      "url": "https://trivoxatech.com/portfolio",
      "description": d.hero.paragraph
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": d.gallery.heading,
      "itemListElement": d.gallery.projects.map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": {
          "@type": "CreativeWork",
          "name": p.title,
          "description": p.desc,
          "image": p.img,
          "creator": { "@type": "Organization", "name": "Trivoxa Technologies" },
          "keywords": `${p.tag}, ${p.category}`
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trivoxatech.com" },
        { "@type": "ListItem", "position": 2, "name": "Portfolio", "item": "https://trivoxatech.com/portfolio" }
      ]
    }
  ]);
  return (
    <div>
      <HeroSection />
      <SuccessGallery />
      <StatsSection />
      <CTASection />
      <BottomFeatures />
      <Footer />
    </div>
  );
}
