import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaLayerGroup,
  FaCode,
  FaGlobe,
  FaMobileAlt,
  FaShieldAlt,
  FaBolt,
  FaQuoteRight,
  FaChartLine,
  FaUsers,
  FaArrowLeft,
} from "react-icons/fa";
import Footer from "../components/Footer";
import useSchema from "../hooks/useSchema";
import usePageMeta from "../hooks/usePageMeta";

const serviceOptions = ["Web Development", "UI/UX Design", "Digital Marketing"];
const budgetOptions = ["< $1,000", "$1,000 – $5,000", "$5,000 – $20,000", "$20,000+"];
const timelineOptions = ["ASAP", "1 – 3 Months", "3 – 6 Months", "6+ Months"];

/* ================= STICKY BACK ================= */
function StickyBack() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      onClick={() => navigate("/services")}
      className={`fixed top-24 left-4 sm:left-6 lg:left-8 z-50 flex items-center gap-2 bg-white border border-gray-200 shadow-md px-3 sm:px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <FaArrowLeft className="text-xs" />
      <span className="hidden sm:inline">Back to Services</span>
      <span className="sm:hidden">Back</span>
    </button>
  );
}

/* ================= HERO ================= */
function HeroSection() {
  return (
    <section className="bg-[#f7f8fc] py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

        {/* LEFT */}
        <div>

          <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
            Professional IT Services
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 leading-tight">
            Custom <span className="text-indigo-600">Web Development</span>{" "}
            & Engineering
          </h1>

          <p className="text-gray-500 mt-4 text-sm sm:text-base max-w-lg">
            We build scalable, high-performance web applications that convert
            visitors into loyal customers. From MVP to enterprise-grade systems.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium">
              Book Free Demo
            </button>
            <button className="border px-5 py-2.5 rounded-lg bg-white text-sm font-medium">
              View Portfolio
            </button>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <div className="flex -space-x-2">
              {avatars.map((a, i) => (
                <img key={i} src={a} alt="avatar" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
              ))}
            </div>
            <p className="text-sm text-gray-500">
              <strong>50+ Projects</strong> successfully delivered this year.
            </p>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <img
          src="https://images.unsplash.com/photo-1558655146-d09347e92766"
          alt="services quote"
          className="rounded-xl shadow-lg w-full h-56 sm:h-72 lg:h-[420px] object-cover"
        />
      </div>
    </section>
  );
}

/* ================= PROBLEM ================= */
function ProblemSection() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <h2 className="text-2xl sm:text-3xl font-semibold">Solving Modern Business Challenges</h2>
        <p className="text-gray-500 text-sm sm:text-base mt-2">
          Inefficient digital presence costs more than just money — it costs market share.
        </p>

        <div className="grid sm:grid-cols-2 mt-10 rounded-xl overflow-hidden border">
          <div className="bg-white p-6 sm:p-8 text-left">
            <p className="text-red-500 text-xs font-semibold uppercase tracking-wide">The Problem</p>
            <ul className="mt-4 space-y-3 text-sm">
              {problems.map((p, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <FaTimesCircle className="text-red-500 mt-0.5 shrink-0" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-indigo-50 p-6 sm:p-8 text-left">
            <p className="text-indigo-600 text-xs font-semibold uppercase tracking-wide">The Trivoxa Edge</p>
            <ul className="mt-4 space-y-3 text-sm">
              {solutions.map((s, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <FaCheckCircle className="text-indigo-600 mt-0.5 shrink-0" /> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= FEATURES ================= */
function FeaturesSection() {
  return (
    <section className="bg-[#f7f8fc] py-12 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <h2 className="text-2xl sm:text-3xl font-semibold">Comprehensive Scope of Work</h2>
        <p className="text-gray-500 text-sm sm:text-base mt-2">
          We handle everything from the initial sketch to the final deployment.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-10">
          {features.map((f, i) => (
            <div key={i} className="bg-white border rounded-xl p-5 sm:p-6 text-left">
              <div className="w-10 h-10 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-lg mb-3">
                {f.icon}
              </div>
              <h3 className="font-semibold text-sm sm:text-base">{f.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= STATS ================= */
function StatsSection() {
  return (
    <section className="bg-gradient-to-r from-indigo-500 to-purple-500 py-10 sm:py-12 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s, i) => (
          <div key={i}>
            <p className="text-2xl sm:text-3xl font-bold">{s.value}</p>
            <p className="text-xs uppercase text-indigo-100 mt-1 tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= PRICING ================= */
function PricingSection() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <h2 className="text-2xl sm:text-3xl font-semibold">Transparent Pricing Models</h2>
        <p className="text-gray-500 text-sm sm:text-base mt-2">
          Flexible engagement models designed to fit your project.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-10">
          {pricing.map((p, i) => (
            <div
              key={i}
              className={`border rounded-xl p-5 sm:p-6 text-left flex flex-col ${p.highlight ? "border-indigo-500 shadow-lg" : ""}`}
            >
              {p.highlight && (
                <span className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full self-start">
                  Most Popular
                </span>
              )}
              <h3 className="mt-3 font-semibold text-base sm:text-lg">{p.title}</h3>
              <p className="text-2xl sm:text-3xl font-bold mt-2">{p.price}</p>
              <ul className="mt-4 space-y-2 text-sm flex-1">
                {p.features.map((f, idx) => (
                  <li key={idx} className="flex gap-2 items-center">
                    <FaCheckCircle className="text-indigo-500 text-xs shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button className="mt-5 w-full bg-indigo-600 text-white py-2.5 rounded text-sm font-medium">
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= TESTIMONIAL ================= */
function TestimonialSection() {
  return (
    <section className="bg-[#f7f8fc] py-12 sm:py-16 lg:py-20 text-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <FaQuoteRight className="mx-auto text-indigo-200 text-3xl mb-4" />
        <p className="text-base sm:text-lg font-medium leading-relaxed">
          "Trivoxa didn't just build our website; they built our business foundation.
          Within 3 months our inbound leads increased by 160%."
        </p>
        <img
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="Sarah Jenkins"
          className="w-12 h-12 rounded-full mx-auto mt-5 object-cover"
        />
        <p className="text-sm font-semibold mt-2">Sarah Jenkins</p>
        <p className="text-xs text-gray-500">CEO at CloudScale Industries</p>
      </div>
    </section>
  );
}

/* ================= FORM ================= */
function FormSection() {
  const { state } = useLocation();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    service: state?.service || "", budget: "", timeline: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.service) e.service = "Please select a service";
    if (!form.budget) e.budget = "Please select a budget";
    if (!form.message.trim()) e.message = "Please describe your project";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="bg-[#eef0ff] py-12 sm:py-16 lg:py-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <FaCheckCircle className="text-green-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold mt-5">Quote Request Sent!</h2>
          <p className="text-gray-500 text-sm mt-2">
            Thanks <span className="font-medium text-gray-700">{form.name}</span>! Our team will get back to you within 24 hours.
          </p>
          <div className="mt-5 bg-white border rounded-xl p-4 text-left text-sm space-y-2">
            <p><span className="text-gray-400">Service:</span> <span className="font-medium">{form.service}</span></p>
            <p><span className="text-gray-400">Budget:</span> <span className="font-medium">{form.budget}</span></p>
            <p><span className="text-gray-400">Timeline:</span> <span className="font-medium">{form.timeline || "Not specified"}</span></p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#eef0ff] py-12 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

        {/* LEFT */}
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold">Ready to Build Your Digital Future?</h3>
          <p className="text-gray-500 text-sm sm:text-base mt-3">
            Fill out the form and we'll get back within 24 hours with a tailored proposal.
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex gap-3 items-start">
              <FaChartLine className="text-indigo-600 mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Data-Driven Strategy</p>
                <p className="text-xs text-gray-500">Every decision backed by analytics and market research.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <FaUsers className="text-indigo-600 mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Collaborative Workflow</p>
                <p className="text-xs text-gray-500">You're involved at every stage of the process.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white border rounded-xl p-5 space-y-3">
            {[
              "We review your request within 2 hours",
              "A solution architect contacts you",
              "We send a tailored proposal",
              "Project kickoff within 48 hours",
            ].map((step, i) => (
              <div key={i} className="flex gap-3 items-center text-sm text-gray-600">
                <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-semibold shrink-0">
                  {i + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 sm:p-8 space-y-5 shadow-sm">

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                name="name" value={form.name} onChange={handleChange}
                placeholder="John Smith"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 ${errors.name ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                name="email" value={form.email} onChange={handleChange}
                placeholder="john@company.com"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 ${errors.email ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                name="phone" value={form.phone} onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Company Name</label>
              <input
                name="company" value={form.company} onChange={handleChange}
                placeholder="Acme Inc."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Service Required *</label>
            <select
              name="service" value={form.service} onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 bg-white ${errors.service ? "border-red-400" : "border-gray-300"}`}
            >
              <option value="">Select a service</option>
              {serviceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Budget Range *</label>
              <select
                name="budget" value={form.budget} onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 bg-white ${errors.budget ? "border-red-400" : "border-gray-300"}`}
              >
                <option value="">Select budget</option>
                {budgetOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Project Timeline</label>
              <select
                name="timeline" value={form.timeline} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              >
                <option value="">Select timeline</option>
                {timelineOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Project Description *</label>
            <textarea
              name="message" value={form.message} onChange={handleChange}
              rows={4} placeholder="Describe your project goals and requirements..."
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 resize-none ${errors.message ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
            Get My Free Quote →
          </button>
        </form>

      </div>
    </section>
  );
}

/* ================= MAIN ================= */
export default function ServicesQuotePage() {
  usePageMeta({ title: "Get a Quote", description: "Get a custom quote for web development, UI/UX design and digital marketing services from Trivoxa Technologies.", canonical: "https://trivoxatechnologis.vercel.app/servicesquote" });
  useSchema([
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Custom Web Development & Engineering",
      "url": "https://trivoxatech.com/services/quote",
      "description": "We build scalable, high-performance web applications that convert visitors into loyal customers.",
      "provider": { "@type": "Organization", "name": "Trivoxa Technologies", "url": "https://trivoxatech.com" },
      "areaServed": "Worldwide",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Pricing Plans",
        "itemListElement": pricing.map((p) => ({
          "@type": "Offer",
          "name": p.title,
          "price": p.price,
          "priceCurrency": "USD",
          "itemOffered": { "@type": "Service", "name": p.title }
        }))
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Review",
      "reviewBody": "Trivoxa didn't just build our website; they built our business foundation. Within 3 months our inbound leads increased by 160%.",
      "author": { "@type": "Person", "name": "Sarah Jenkins" },
      "itemReviewed": { "@type": "Organization", "name": "Trivoxa Technologies" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trivoxatech.com" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://trivoxatech.com/services" },
        { "@type": "ListItem", "position": 3, "name": "Get a Quote", "item": "https://trivoxatech.com/services/quote" }
      ]
    }
  ]);
  return (
    <div className="min-h-screen">
      <StickyBack />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <StatsSection />
      <PricingSection />
      <TestimonialSection />
      <FormSection />
      <Footer />
    </div>
  );
}

/* ================= DATA ================= */
const avatars = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/65.jpg",
  "https://randomuser.me/api/portraits/men/45.jpg",
];

const problems = [
  "Slow page loads causing 40%+ bounce rates.",
  "Outdated tech stacks that are hard to scale.",
  "Fragmented user experiences across devices.",
  "Security vulnerabilities and lack of compliance.",
];

const solutions = [
  "Edge-computed performance with <1s load times.",
  "Future-proof architecture using Next.js.",
  "Pixel-perfect mobile-first design.",
  "SOC2 compliant security.",
];

const features = [
  { icon: <FaLayerGroup />, title: "Full-Stack Engineering", desc: "Robust backend systems built to scale." },
  { icon: <FaCode />, title: "API Integrations", desc: "Secure third-party integrations." },
  { icon: <FaGlobe />, title: "E-commerce Solutions", desc: "Scalable storefronts and platforms." },
  { icon: <FaMobileAlt />, title: "PWA Development", desc: "Mobile-first progressive web apps." },
  { icon: <FaShieldAlt />, title: "Quality Assurance", desc: "Bug-free, tested releases." },
  { icon: <FaBolt />, title: "Performance Optimization", desc: "Sub-second load times guaranteed." },
];

const stats = [
  { value: "45%", label: "Conversion Lift" },
  { value: "99.9%", label: "Uptime Guaranteed" },
  { value: "2M+", label: "Lines of Code" },
  { value: "4.9/5", label: "Client Satisfaction" },
];

const pricing = [
  {
    title: "Fixed Scope",
    price: "$4,999",
    features: ["UI/UX Design Kit", "Up to 10 Pages", "CMS Integration", "3 Months Support"],
  },
  {
    title: "Dedicated Retainer",
    price: "$2,400/mo",
    highlight: true,
    features: ["Dedicated Dev Team", "Unlimited Revisions", "CI/CD Pipeline", "Priority Support"],
  },
  {
    title: "Enterprise",
    price: "Custom",
    features: ["Custom Architecture", "Microservices", "Advanced Security", "SLA Guarantee"],
  },
];
