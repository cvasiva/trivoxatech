import { useState, useEffect } from "react";
import { api } from "../utils/api";

const STORAGE_KEY = "trivoxa_popup_dismissed";

export default function LeadPopup() {
  const [show,    setShow]    = useState(false);
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setShow(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email.");
    setLoading(true);
    try {
      await api.subscribeNewsletter(email.trim().toLowerCase(), "popup");
      setDone(true);
      setTimeout(dismiss, 2500);
    } catch (err) {
      setError(err?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-4 sm:pb-0">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Top banner */}
        <div className="bg-indigo-600 px-5 py-4 relative">
          <button onClick={dismiss} className="absolute top-3 right-4 text-indigo-200 hover:text-white text-xl leading-none">×</button>
          <p className="text-white font-bold text-base">🎓 Get Free Course Updates</p>
          <p className="text-indigo-200 text-xs mt-0.5">Join 500+ students already enrolled</p>
        </div>

        <div className="px-5 py-5">
          {done ? (
            <div className="py-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold text-gray-800">You're in, {name.split(" ")[0]}!</p>
              <p className="text-xs text-gray-500 mt-1">We'll keep you updated with the latest courses.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Get Free Updates →"}
              </button>
              <button type="button" onClick={dismiss} className="w-full text-xs text-gray-400 hover:text-gray-600 transition py-1">
                No thanks
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
