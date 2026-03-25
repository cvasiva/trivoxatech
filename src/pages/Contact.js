import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPaperPlane, FaEnvelope, FaHeadphones, FaPhoneAlt,
  FaCheckCircle, FaExclamationCircle,
} from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import emailjs from "@emailjs/browser";
import Footer from "../components/Footer";
import staticD from "../data/contactData.json";
import useSchema from "../hooks/useSchema";
import usePageData from "../hooks/usePageData";
import usePageMeta from "../hooks/usePageMeta";

const SVC = "service_928ko6h";
const TPL = "template_jutciy9";
const KEY = "3s_VBlPn-ycSICDIK";

const phoneStyles = `
  .phone-wrap .react-tel-input .form-control {
    width: 100% !important; height: 44px !important; font-size: 14px !important;
    border-radius: 8px !important; padding-left: 58px !important;
    border: 1px solid #d1d5db !important; background: #fff !important;
    color: #111827 !important; outline: none !important;
  }
  .phone-wrap .react-tel-input .form-control:focus {
    border-color: #6366f1 !important;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.15) !important;
  }
  .phone-wrap.error .react-tel-input .form-control {
    border-color: #f87171 !important; background: #fff1f2 !important;
  }
  .phone-wrap .react-tel-input .flag-dropdown {
    border: 1px solid #d1d5db !important; border-right: none !important;
    border-radius: 8px 0 0 8px !important; background: #f9fafb !important;
  }
  .phone-wrap.error .react-tel-input .flag-dropdown { border-color: #f87171 !important; }
  .phone-wrap .react-tel-input .country-list {
    border-radius: 10px !important; font-size: 13px !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important; z-index: 999 !important;
  }
  .phone-wrap .react-tel-input .country-list .country:hover,
  .phone-wrap .react-tel-input .country-list .country.highlight { background: #eef2ff !important; }
  .phone-wrap .react-tel-input .search-box {
    border-radius: 6px !important; font-size: 13px !important;
    border: 1px solid #e5e7eb !important; padding: 6px 10px !important;
    width: calc(100% - 20px) !important;
  }
`;

/* ================= HERO ================= */
function ContactHero({ d }) {
  return (
    <section className="bg-[#f5f6fa] px-4 sm:px-6 lg:px-16 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">{d.hero.eyebrow}</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 leading-tight">
            {d.hero.title}
            <span className="block text-indigo-600">{d.hero.highlight}</span>
            {d.hero.title2}
          </h1>
          <p className="text-gray-600 mt-4 max-w-lg">{d.hero.paragraph}</p>
          <div className="flex items-center gap-3 mt-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <img key={i} src={`https://randomuser.me/api/portraits/men/${i + 20}.jpg`} className="w-8 h-8 rounded-full border-2 border-white" alt="" />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">{d.hero.expertsText}</span> {d.hero.expertsSubtext}
            </p>
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          <img src={d.hero.img} className="rounded-xl w-full" alt="contact" />
        </div>
      </div>
    </section>
  );
}



/* ================= CONTACT FORM ================= */
function ContactForm({ d }) {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", interestedIn: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendError, setSendError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone || form.phone.replace(/\D/g, "").length < 10) e.phone = "Valid phone required";
    if (!form.interestedIn) e.interestedIn = "Please select";
    if (!form.message.trim() || form.message.trim().length < 10) e.message = "Min 10 characters";
    return e;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
    if (sendError) setSendError("");
  };

  const onPhone = (value) => {
    setForm(p => ({ ...p, phone: value }));
    if (errors.phone) setErrors(p => ({ ...p, phone: "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true); setSendError("");
    try {
      emailjs.init(KEY);
      await emailjs.send(SVC, TPL, {
        from_name: form.fullName,
        from_email: form.email,
        phone: `+${form.phone}`,
        interest: form.interestedIn,
        message: form.message,
        reply_to: form.email,
      });
      setSubmitted(true);
      setForm({ fullName: "", email: "", phone: "", interestedIn: "", message: "" });
    } catch (err) {
      console.error("EmailJS ERR:", err);
      setSendError(err?.text || err?.message || "Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* base input class */
  const inp = (name) =>
    `w-full h-[44px] border rounded-lg px-4 text-sm text-gray-800 bg-white transition focus:outline-none focus:ring-2 ${errors[name]
      ? "border-red-400 bg-red-50 focus:ring-red-100"
      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-100"
    }`;

  if (submitted) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-5">
        <FaCheckCircle className="text-indigo-600 text-4xl" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
      <p className="text-gray-500 text-sm mt-2 max-w-xs">We'll get back to you within 24 hours.</p>
      <button onClick={() => setSubmitted(false)}
        className="mt-6 px-8 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition">
        Send Another
      </button>
    </div>
  );

  return (
    <>
      <style>{phoneStyles}</style>
      <form onSubmit={onSubmit} className="space-y-5">

        {sendError && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600 flex gap-2 items-start">
            <FaExclamationCircle className="mt-0.5 shrink-0" /><span>{sendError}</span>
          </div>
        )}

        {/* Row 1 — Name + Email */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
            <input name="fullName" value={form.fullName} onChange={onChange} placeholder="John Doe" className={inp("fullName")} />
            {errors.fullName && <p className="text-red-500 text-xs flex items-center gap-1"><FaExclamationCircle className="text-[10px]" />{errors.fullName}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
            <input name="email" type="email" value={form.email} onChange={onChange} placeholder="john@example.com" className={inp("email")} />
            {errors.email && <p className="text-red-500 text-xs flex items-center gap-1"><FaExclamationCircle className="text-[10px]" />{errors.email}</p>}
          </div>
        </div>

        {/* Row 2 — Phone + Interested In (same height) */}
        <div className="grid sm:grid-cols-2 gap-4 items-start">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
            <div className={`phone-wrap${errors.phone ? " error" : ""}`}>
              <PhoneInput
                country="in"
                value={form.phone}
                onChange={onPhone}
                preferredCountries={["in", "us", "gb", "au", "ca", "ae"]}
                enableSearch
                searchPlaceholder="Search country..."
                disableSearchIcon
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs flex items-center gap-1"><FaExclamationCircle className="text-[10px]" />{errors.phone}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Interested In <span className="text-red-500">*</span></label>
            {/* wrapper keeps arrow perfectly centred regardless of content */}
            <div className="relative w-full">
              <select
                name="interestedIn"
                value={form.interestedIn}
                onChange={onChange}
                className={`w-full h-[44px] border rounded-lg pl-4 pr-10 text-sm bg-white appearance-none cursor-pointer transition focus:outline-none focus:ring-2 ${errors.interestedIn
                  ? "border-red-400 bg-red-50 focus:ring-red-100"
                  : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-100"
                  } ${!form.interestedIn ? "text-gray-400" : "text-gray-800"}`}
              >
                {d.form.interestOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.value === ""}>{opt.label}</option>
                ))}
              </select>
              {/* custom arrow — absolutely centred vertically */}
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                width="12" height="12" viewBox="0 0 12 12" fill="currentColor"
              >
                <path d="M6 8L1 3h10z" />
              </svg>
            </div>
            {errors.interestedIn && <p className="text-red-500 text-xs flex items-center gap-1"><FaExclamationCircle className="text-[10px]" />{errors.interestedIn}</p>}
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 flex justify-between">
            <span>Message <span className="text-red-500">*</span></span>
            <span className="font-normal text-gray-400 text-xs">{form.message.length} / 1000</span>
          </label>
          <textarea
            name="message" value={form.message} onChange={onChange} rows={5}
            placeholder="Tell us about your goals or project..."
            className={`w-full border rounded-lg px-4 py-3 text-sm text-gray-800 bg-white resize-none transition focus:outline-none focus:ring-2 ${errors.message ? "border-red-400 bg-red-50 focus:ring-red-100" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-100"
              }`}
          />
          {errors.message && <p className="text-red-500 text-xs flex items-center gap-1"><FaExclamationCircle className="text-[10px]" />{errors.message}</p>}
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}
          className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
          {loading
            ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending...</>
            : <><FaPaperPlane className="text-xs" />Send Message</>}
        </button>

        <p className="text-center text-xs text-gray-400">🔒 Your information is safe. We never share your data.</p>
      </form>
    </>
  );
}

/* ================= FORM + RIGHT ================= */
function ContactMain({ d }) {
  return (
    <section className="px-4 sm:px-6 lg:px-16 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">{d.form.heading}</h2>
          <p className="text-gray-600 mt-2 text-sm">{d.form.subheading}</p>
          <div className="mt-6">
            <ContactForm d={d} />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs text-indigo-600 mb-3 font-semibold">{d.directAccess.label}</p>
            <div className="border rounded-xl p-4 mb-3 hover:shadow-md transition">
              <p className="font-semibold flex gap-2 items-center"><FaEnvelope /> {d.directAccess.sales.title}</p>
              <p className="text-sm text-gray-600">{d.directAccess.sales.desc}</p>
              <p className="text-sm text-indigo-600 font-medium">{d.directAccess.sales.email}</p>
            </div>
            <div className="border rounded-xl p-4 hover:shadow-md transition">
              <p className="font-semibold flex gap-2 items-center"><FaHeadphones /> {d.directAccess.support.title}</p>
              <p className="text-sm text-gray-600">{d.directAccess.support.desc}</p>
              <p className="text-sm text-indigo-600 font-medium">{d.directAccess.support.phone}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-indigo-600 mb-3 font-semibold">{d.offices.label}</p>
            {d.offices.items.map((office, i) => (
              <div key={i} className={`border rounded-xl p-4 flex gap-4 hover:shadow-md transition ${i < d.offices.items.length - 1 ? "mb-3" : ""}`}>
                <img src={office.img} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" alt={office.city} />
                <div>
                  <p className="font-semibold">{office.city}</p>
                  <p className="text-xs text-gray-600">{office.address}</p>
                  <p className="text-xs flex items-center gap-1"><FaPhoneAlt /> {office.phone}</p>
                  <p className="text-xs text-indigo-600 mt-1 cursor-pointer hover:underline">VIEW ON MAP ↗</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border rounded-xl p-4 hover:shadow-md transition">
            <p className="font-semibold">{d.hours.title}</p>
            <div className="text-sm mt-3 space-y-1">
              {d.hours.schedule.map((s, i) => (
                <p key={i}>{s.day}: <span className="float-right">{s.time}</span></p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= TRUSTED ================= */
function Trusted({ d }) {
  return (
    <section className="text-center py-10 border-t">
      <p className="text-xs tracking-widest text-gray-500 mb-6">{d.trusted.label}</p>
      <div className="flex flex-wrap justify-center gap-10 text-gray-400 font-semibold">
        {d.trusted.brands.map((brand, i) => <span key={i}>{brand}</span>)}
      </div>
    </section>
  );
}

/* ================= BOTTOM CTA ================= */
function BottomCTA({ d }) {
  const navigate = useNavigate();
  return (
    <section className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 sm:px-6 lg:px-16 py-12 text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">{d.bottomCta.heading}</h2>
          <p className="mt-2 text-sm text-indigo-100">{d.bottomCta.subheading}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate("/courses")} className="bg-white text-black px-5 py-2 rounded-lg hover:bg-gray-100 transition font-medium">
            {d.bottomCta.primaryBtn}
          </button>
          <button onClick={() => navigate("/courses")} className="border border-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition font-medium">
            {d.bottomCta.secondaryBtn}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ================= PAGE ================= */
export default function ContactPage() {
  const d = usePageData("contactData", staticD);
  usePageMeta({ title: "Contact Us", description: d.hero.paragraph, canonical: "https://trivoxatechnologis.vercel.app/contact" });
  useSchema([
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Trivoxa Technologies",
      "url": "https://trivoxatech.com",
      "email": d.directAccess.sales.email,
      "telephone": d.directAccess.support.phone,
      "description": d.hero.paragraph,
      "image": d.hero.img,
      "priceRange": "$$",
      "openingHoursSpecification": d.hours.schedule.map((s) => ({
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": s.day,
        "opens": s.time.split(" - ")[0] || "09:00",
        "closes": s.time.split(" - ")[1] || "18:00"
      })),
      "location": d.offices.items.map((o) => ({
        "@type": "Place",
        "name": o.city,
        "address": { "@type": "PostalAddress", "streetAddress": o.address },
        "telephone": o.phone
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Trivoxa Technologies",
      "url": "https://trivoxatech.com/contact",
      "description": d.hero.paragraph
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trivoxatech.com" },
        { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://trivoxatech.com/contact" }
      ]
    }
  ]);
  return (
    <div>
      <ContactHero d={d} />
      <ContactMain d={d} />
      <Trusted d={d} />
      <BottomCTA d={d} />
      <Footer />
    </div>
  );
}
