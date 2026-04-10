import { useState, useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { api } from "../utils/api";

const STORAGE_KEY = "trivoxa_popup_dismissed";

export default function LeadPopup() {
  const [show,    setShow]    = useState(false);
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [phone,   setPhone]   = useState("");

  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [errors,  setErrors]  = useState({});

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setShow(false);
  };

  const validate = () => {
    const e = {};
    if (!name.trim() || name.trim().length < 2)                          e.name  = "Full name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))               e.email = "Enter a valid email address";
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\s|-/g, "")))               e.phone = "Enter a valid 10-digit mobile number";
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    try {
      await api.subscribeNewsletter(email.trim().toLowerCase(), "popup", name.trim(), phone.trim());
      setDone(true);
      setTimeout(dismiss, 3000);
    } catch (err) {
      setErrors({ submit: err?.message || "Something went wrong. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const inp = (key) =>
    `w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${
      errors[key]
        ? "border-red-400 bg-red-50 focus:ring-red-200"
        : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
    }`;

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-4 pb-4 sm:pb-0">
      <div className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-100" style={{ backgroundColor: "#faf5ff" }}>

        {/* Header — matches website indigo */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-5 relative">
          {/* <button onClick={dismiss}
            className="absolute top-4 right-4 text-white hover:text-white transition">
            <FaTimes className="text-sm" />
          </button> */}
          <p className="text-xs font-semibold text-purple-200 uppercase tracking-widest mb-1">Free Enrollment</p>
          <h2 className="text-white font-bold text-lg leading-snug">Get Free Course Updates</h2>
          <p className="text-purple-100 text-xs mt-1">Join 500+ learners already improving their skills.</p>
        </div>

        {/* Form */}
        <div className="px-6 py-5">
          {done ? (
            <div className="py-6 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaCheckCircle className="text-green-500 text-2xl" />
              </div>
              <p className="font-bold text-gray-900 text-base">You're in, {name.split(" ")[0]}!</p>
              <p className="text-gray-500 text-sm mt-1">We'll keep you updated with the latest courses and offers.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3">

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="John Doe" value={name}
                  onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                  className={inp("name")} />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FaExclamationCircle className="text-[10px]" />{errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                <input type="email" placeholder="john@example.com" value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                  className={inp("email")} />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FaExclamationCircle className="text-[10px]" />{errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                <input type="tel" placeholder="+91 xxxxx xxxx" value={phone}
                  maxLength={10}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors((p) => ({ ...p, phone: "" })); }}
                  className={inp("phone")} />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FaExclamationCircle className="text-[10px]" />{errors.phone}
                  </p>
                )}
              </div>

              {errors.submit && (
                <p className="text-red-500 text-xs text-center flex items-center justify-center gap-1">
                  <FaExclamationCircle className="text-[10px]" />{errors.submit}
                </p>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 text-white py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-60 mt-1">
                {loading ? "Submitting..." : "Get Free Updates"}
              </button>

              <button type="button" onClick={dismiss}
                className="w-full text-xs text-gray-400 hover:text-gray-600 transition py-1">
                No thanks
              </button>

              <p className="text-center text-xs text-gray-400">🔒 No spam. We respect your privacy.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
