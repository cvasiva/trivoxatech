import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPaperPlane, FaEnvelope, FaHeadphones, FaPhoneAlt,
  FaCheckCircle, FaExclamationCircle,
} from "react-icons/fa";
import MuiPhoneNumber from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Footer from "../components/Footer";
import d from "../data/contactData.json";
import useSchema from "../hooks/useSchema";
import { api } from "../utils/api";

const phoneInputStyles = `
  .react-tel-input { width: 100% !important; }
  .react-tel-input .form-control { width: 100% !important; border: 1px solid #d1d5db !important; padding: 0.5rem 0.75rem !important; border-radius: 0.5rem !important; font-size: 0.875rem !important; padding-left: 65px !important; height: auto !important; transition: all 0.2s !important; letter-spacing: 0 !important; }
  .react-tel-input .form-control:focus { outline: none !important; border-color: #4f46e5 !important; box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1) !important; }
  .react-tel-input .flag-dropdown { border: 1px solid #d1d5db !important; border-radius: 0.5rem 0 0 0.5rem !important; background-color: #f9fafb !important; padding: 0.5rem 0.75rem !important; height: auto !important; transition: all 0.2s !important; }
  .react-tel-input .flag-dropdown:hover { background-color: #f3f4f6 !important; }
  .react-tel-input .flag-dropdown.open { border-radius: 0.5rem 0 0 0 !important; }
  .react-tel-input .country-list { border: 1px solid #d1d5db !important; border-radius: 0.5rem !important; max-height: 256px !important; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important; }
  .react-tel-input .country-list .country { padding: 0.75rem !important; font-size: 0.875rem !important; cursor: pointer !important; }
  .react-tel-input .country-list .country:hover { background-color: #eef2ff !important; }
  .react-tel-input .country-list .country.highlight { background-color: #e0e7ff !important; }
  .react-tel-input .flag { margin-right: 0.5rem !important; }
`;

/* ================= HERO ================= */
function ContactHero() {
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

/* ================= FORM + RIGHT ================= */
function ContactMain() {
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", interestedIn: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = "Full name is required";
    else if (formData.fullName.trim().length < 2) e.fullName = "Name must be at least 2 characters";
    else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) e.fullName = "Name can only contain letters and spaces";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Please enter a valid email address";
    if (formData.phone.trim()) {
      const digits = formData.phone.replace(/\D/g, "");
      if (digits.length < 10) e.phone = "Phone number must have at least 10 digits";
      else if (digits.length > 15) e.phone = "Phone number cannot exceed 15 digits";
    } else { e.phone = "Phone number is required"; }
    if (!formData.interestedIn) e.interestedIn = "Please select an option";
    if (!formData.message.trim()) e.message = "Message is required";
    else if (formData.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    else if (formData.message.trim().length > 1000) e.message = "Message cannot exceed 1000 characters";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setLoading(true);
    try {
      await api.submitContact({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        interest: formData.interestedIn,
        message: formData.message,
      });
      setSubmitted(true);
      setFormData({ fullName: "", email: "", phone: "", interestedIn: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setErrors({ message: "Failed to send. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const phoneDigitsOnly = formData.phone.replace(/\D/g, "");

  return (
    <section className="px-4 sm:px-6 lg:px-16 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">{d.form.heading}</h2>
          <p className="text-gray-600 mt-2 text-sm">{d.form.subheading}</p>
          <div className="bg-white border rounded-xl p-6 sm:p-8 mt-6 space-y-4">
            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3 items-start">
                <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-800">{d.form.successTitle}</p>
                  <p className="text-sm text-green-700">{d.form.successMsg}</p>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-2">Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe"
                    className={`border px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm w-full focus:outline-none focus:ring-2 transition ${errors.fullName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"}`} />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle className="text-xs" /> {errors.fullName}</p>}
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-2">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@company.com"
                    className={`border px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm w-full focus:outline-none focus:ring-2 transition ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"}`} />
                  {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle className="text-xs" /> {errors.email}</p>}
                </div>
              </div>
              <div className="w-full">
                <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-2">Phone Number *</label>
                <MuiPhoneNumber country={"in"} value={formData.phone} onChange={handlePhoneChange}
                  preferredCountries={["us", "gb", "in", "au", "ca"]} enableAreaCodes countryCodeEditable={false}
                  containerClass="w-full" inputClass="w-full" />
                <div className="flex justify-between items-start mt-1">
                  {errors.phone && <p className="text-red-500 text-xs flex items-center gap-1"><FaExclamationCircle className="text-xs" /> {errors.phone}</p>}
                  {phoneDigitsOnly && <p className="text-xs text-gray-500">{phoneDigitsOnly.length} digits</p>}
                </div>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-2">Interested In *</label>
                <select name="interestedIn" value={formData.interestedIn} onChange={handleChange}
                  className={`border px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm w-full focus:outline-none focus:ring-2 transition appearance-none bg-white cursor-pointer ${errors.interestedIn ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"}`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234B5563' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", paddingRight: "2.5rem" }}>
                  {d.form.interestOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {errors.interestedIn && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle className="text-xs" /> {errors.interestedIn}</p>}
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-2">Message * ({formData.message.length}/1000)</label>
                <textarea name="message" value={formData.message} onChange={handleChange}
                  placeholder="How can we help you achieve your goals?" rows={4}
                  className={`border px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm w-full focus:outline-none focus:ring-2 transition resize-none ${errors.message ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"}`} />
                {errors.message && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle className="text-xs" /> {errors.message}</p>}
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-indigo-600 text-white py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base">
                {loading ? "Sending..." : d.form.submitBtn} <FaPaperPlane />
              </button>
              <p className="text-xs text-gray-400 text-center">{d.form.privacyNote}</p>
            </form>
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
function Trusted() {
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
function BottomCTA() {
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
      <style>{phoneInputStyles}</style>
      <ContactHero />
      <ContactMain />
      <Trusted />
      <BottomCTA />
      <Footer />
    </div>
  );
}
