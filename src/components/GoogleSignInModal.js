import { useState, useEffect } from "react";
import { api } from "../utils/api";

const STORAGE_KEY = "trivoxa_popup_dismissed";

export default function GoogleSignInModal() {
  const [show,    setShow]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setShow(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setShow(false);
  };

  const handleGoogleLogin = () => {
    /* Load Google Identity Services on demand */
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = () => initGoogle();
      document.body.appendChild(script);
    } else {
      initGoogle();
    }
  };

  const initGoogle = () => {
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          setLoading(true);
          /* Decode the JWT to get email + name */
          const payload = JSON.parse(atob(response.credential.split(".")[1]));
          const { email, name, picture } = payload;

          /* Save email to newsletter/leads via existing API */
          await api.subscribeNewsletter(email, "google_popup");

          setDone(true);
          setTimeout(dismiss, 2000);

          console.log("[Popup] Google login captured:", { email, name, picture });
        } catch (err) {
          console.error("[Popup] Failed to save:", err.message);
          dismiss();
        } finally {
          setLoading(false);
        }
      },
    });
    window.google.accounts.id.prompt();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="google"
              className="w-5 h-5"
            />
            <span className="text-sm text-gray-600">Sign in to trivoxatech.com</span>
          </div>
          <button onClick={dismiss} className="text-gray-400 hover:text-gray-700 text-xl leading-none">×</button>
        </div>

        {done ? (
          <div className="py-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-800">Welcome to Trivoxa!</p>
            <p className="text-xs text-gray-500 mt-1">You're all set.</p>
          </div>
        ) : (
          <>
            {/* Body */}
            <p className="text-sm text-gray-700 mb-5 text-center leading-relaxed">
              Sign in with Google to get <span className="font-semibold text-indigo-600">exclusive course updates</span> and offers from Trivoxa Technologies.
            </p>

            {/* Google Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition mb-3 disabled:opacity-60"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="google"
                className="w-5 h-5"
              />
              {loading ? "Signing in..." : "Continue with Google"}
            </button>

            <button onClick={dismiss} className="w-full text-xs text-gray-400 hover:text-gray-600 transition py-1">
              No thanks
            </button>

            {/* Footer */}
            <p className="text-[11px] text-gray-400 leading-4 mt-3 text-center">
              By continuing, Google will share your name, email and profile picture with Trivoxa Technologies. See our{" "}
              <span className="text-indigo-500 cursor-pointer hover:underline">privacy policy</span>.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
