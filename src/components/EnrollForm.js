import React, { useState } from "react";
import { FaWhatsapp, FaTimes, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { api } from "../utils/api";

const INITIAL = { name: "", email: "", phone: "", whatsapp: "", course: "", message: "" };

function validate(f) {
  const e = {};
  if (!f.name.trim() || f.name.trim().length < 2) e.name = "Full name is required (min 2 chars)";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Valid email is required";
  if (!f.phone.trim() || f.phone.replace(/\D/g, "").length < 10) e.phone = "Phone number (min 10 digits) is required";
  if (!f.whatsapp.trim() || f.whatsapp.replace(/\D/g, "").length < 10) e.whatsapp = "WhatsApp number (min 10 digits) is required";
  if (!f.message.trim() || f.message.trim().length < 10) e.message = "Tell us a bit more (min 10 chars)";
  return e;
}

const Field = ({ label, name, type = "text", placeholder, icon, form, errors, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label} *</label>
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">{icon}</span>}
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border rounded-lg py-2.5 focus:outline-none focus:ring-2 transition text-sm text-gray-900 ${icon ? "pl-9 pr-4" : "px-4"} ${
          errors[name] ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-500"
        }`}
      />
    </div>
    {errors[name] && (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <FaExclamationCircle /> {errors[name]}
      </p>
    )}
  </div>
);

export default function EnrollForm({ courseName = "", onClose }) {
  const [form, setForm] = useState({ ...INITIAL, course: courseName });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.submitEnroll(form);
      setSuccess(true);
      setForm({ ...INITIAL, course: courseName });
    } catch (err) {
      setErrors({ submit: err.message || "Submission failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Apply / Enroll Now</h2>
            {courseName && <p className="text-xs text-indigo-600 mt-0.5">{courseName}</p>}
          </div>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <FaTimes size={18} />
            </button>
          )}
        </div>

        <div className="px-6 py-5">
          {success ? (
            <div className="text-center py-8">
              <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">Application Submitted!</h3>
              <p className="text-sm text-gray-500 mt-2">
                We've received your application and will contact you via email and WhatsApp within 24 hours.
              </p>
              {onClose && (
                <button
                  onClick={onClose}
                  className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
                >
                  Close
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Full Name" name="name" placeholder="Your full name" form={form} errors={errors} onChange={handleChange} />
              <Field label="Email Address" name="email" type="email" placeholder="you@example.com" form={form} errors={errors} onChange={handleChange} />

              <div className="grid grid-cols-2 gap-4">
                <Field label="Phone Number" name="phone" type="tel" placeholder="+91 9876543210" form={form} errors={errors} onChange={handleChange} />
                <Field
                  label="WhatsApp Number"
                  name="whatsapp"
                  type="tel"
                  placeholder="+91 9876543210"
                  icon={<FaWhatsapp />}
                  form={form} errors={errors} onChange={handleChange}
                />
              </div>

              {/* Course (pre-filled, editable) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Interested In</label>
                <input
                  type="text"
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Development"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message / Query *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell us about your background or any questions..."
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 transition resize-none ${
                    errors.message ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FaExclamationCircle /> {errors.message}
                  </p>
                )}
              </div>

              {errors.submit && (
                <p className="text-red-500 text-sm text-center">{errors.submit}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>

              <p className="text-xs text-gray-400 text-center">
                We'll reach out via email & WhatsApp within 24 hours.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
