import React, { useState } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { api } from "../utils/api";

const INITIAL = { name: "", email: "", phone: "" };

function validate(f) {
  const e = {};
  if (!f.name.trim() || f.name.trim().length < 2) e.name = "Full name is required (min 2 chars)";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Valid email is required";
  if (f.phone.trim() && f.phone.replace(/\D/g, "").length < 10) e.phone = "Phone must have at least 10 digits";
  return e;
}

const CTAForm = () => {
  const [form, setForm]       = useState(INITIAL);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.submitContact({
        name: form.name,
        email: form.email,
        phone: form.phone,
        interest: "Demo Booking",
        message: `Demo booking request from ${form.name}`,
      });
      setSuccess(true);
      setForm(INITIAL);
      setTimeout(() => setSuccess(false), 6000);
    } catch (err) {
      setApiError(err.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inp = (name) =>
    `w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition text-sm text-gray-900 ${
      errors[name] ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-indigo-500"
    }`;

  return (
    <aside className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-indigo-600">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Book Your Free Demo</h3>
      <p className="text-sm text-gray-600 mb-6">Fill your details and our team will contact you within 24 hours.</p>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex gap-2 items-center text-sm text-green-700 mb-4">
          <FaCheckCircle /> Demo booked! We'll contact you within 24 hours.
        </div>
      )}

      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 items-center text-sm text-red-600 mb-4">
          <FaExclamationCircle /> {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input type="text" name="name" value={form.name} onChange={handleChange}
            placeholder="Your name" className={inp("name")} />
          {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle className="text-[10px]" />{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Work Email *</label>
          <input type="email" name="email" value={form.email} onChange={handleChange}
            placeholder="your@email.com" className={inp("email")} />
          {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle className="text-[10px]" />{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange}
            placeholder="+91 9876543210" className={inp("phone")} />
          {errors.phone && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle className="text-[10px]" />{errors.phone}</p>}
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? "Booking..." : "Reserve My Spot Now"}
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-4 text-center">We respect your privacy. No spam, ever.</p>
    </aside>
  );
};

export default CTAForm;
