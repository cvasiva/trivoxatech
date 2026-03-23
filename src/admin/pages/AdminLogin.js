import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { api, setToken } from "../../utils/api";
import logo from "../../images/trivoxalogo.png";

const INPUT_CLS =
  "w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50 focus:bg-white transition";

function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${INPUT_CLS} pr-10`}
        required
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
      </button>
    </div>
  );
}

function FieldError({ msg }) {
  return msg ? <p className="text-xs text-red-500 mt-1">{msg}</p> : null;
}

/* ── GOOGLE SIGN-IN WRAPPER ─────────────────────────────── */
function GoogleSignIn({ onSuccess, onError }) {
  const [loading, setLoading] = useState(false);

  const handleCredential = async (credentialResponse) => {
    setLoading(true);
    try {
      const { token } = await api.googleLogin(credentialResponse.credential);
      setToken(token);
      onSuccess();
    } catch (err) {
      onError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="[&>div]:w-full [&>div>div]:w-full [&_iframe]:w-full">
        <GoogleLogin
          onSuccess={handleCredential}
          onError={() => onError("Google sign-in was cancelled or failed")}
          useOneTap={false}
          shape="rectangular"
          theme="outline"
          size="large"
          text="continue_with"
          width="100%"
        />
      </div>
      {loading && (
        <p className="text-xs text-center text-gray-500 mt-2">Verifying with Google…</p>
      )}
    </div>
  );
}

/* ── DIVIDER ─────────────────────────────────────────────── */
function Divider() {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs text-gray-400 font-medium">or</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

/* ── SIGN IN ─────────────────────────────────────────────── */
function SignInForm({ onSwitch }) {
  const [form,    setForm]    = useState({ username: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await api.login(form.username, form.password);
      setToken(token);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Google */}
      <GoogleSignIn
        onSuccess={() => navigate("/admin")}
        onError={(msg) => setError(msg)}
      />

      <Divider />

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Username
        </label>
        <input
          type="text"
          value={form.username}
          onChange={(e) => set("username")(e.target.value)}
          className={INPUT_CLS}
          placeholder="Enter your username"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Password
        </label>
        <PasswordInput value={form.password} onChange={set("password")} placeholder="Enter your password" />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <p className="text-xs text-red-600 font-medium">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>

      <p className="text-center text-xs text-gray-500">
        Need an account?{" "}
        <button type="button" onClick={onSwitch} className="text-indigo-600 font-semibold hover:underline">
          Create Account
        </button>
      </p>
    </form>
  );
}

/* ── CREATE ACCOUNT ──────────────────────────────────────── */
function CreateAccountForm({ onSwitch }) {
  const [form,    setForm]    = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [errors,  setErrors]  = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const set = (k) => (v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
    setApiError("");
  };

  // Password strength
  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6)                    s++;
    if (p.length >= 10)                   s++;
    if (/[A-Z]/.test(p))                  s++;
    if (/[0-9]/.test(p))                  s++;
    if (/[^A-Za-z0-9]/.test(p))           s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-green-600"][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Client-side validation
    const errs = {};
    if (!form.username.trim() || form.username.trim().length < 3)
      errs.username = "Username must be at least 3 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address";
    if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";

    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const { token } = await api.register(
        form.username, form.email, form.password, form.confirmPassword
      );
      setToken(token);
      setSuccess(true);
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      // Handle field-level errors from backend
      if (err.message?.includes("Username")) setErrors((p) => ({ ...p, username: err.message }));
      else if (err.message?.includes("Email")) setErrors((p) => ({ ...p, email: err.message }));
      else setApiError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <FaCheckCircle className="text-green-500 text-4xl" />
        <p className="font-semibold text-gray-900">Account created!</p>
        <p className="text-sm text-gray-500">Redirecting to dashboard…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Google */}
      <GoogleSignIn
        onSuccess={() => navigate("/admin")}
        onError={(msg) => setApiError(msg)}
      />

      <Divider />

      {/* Username */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Username
        </label>
        <input
          type="text"
          value={form.username}
          onChange={(e) => set("username")(e.target.value)}
          className={`${INPUT_CLS} ${errors.username ? "border-red-400" : "border-gray-200"}`}
          placeholder="Choose a username"
          required
        />
        <FieldError msg={errors.username} />
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Email Address
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => set("email")(e.target.value)}
          className={`${INPUT_CLS} ${errors.email ? "border-red-400" : "border-gray-200"}`}
          placeholder="admin@example.com"
          required
        />
        <FieldError msg={errors.email} />
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Password
        </label>
        <PasswordInput
          value={form.password}
          onChange={set("password")}
          placeholder="Create a password"
        />
        {form.password && (
          <div className="mt-2 space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : "bg-gray-200"}`}
                />
              ))}
            </div>
            <p className={`text-[11px] font-medium ${strengthColor.replace("bg-", "text-")}`}>
              {strengthLabel}
            </p>
          </div>
        )}
        <FieldError msg={errors.password} />
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Confirm Password
        </label>
        <PasswordInput
          value={form.confirmPassword}
          onChange={set("confirmPassword")}
          placeholder="Repeat your password"
        />
        <FieldError msg={errors.confirmPassword} />
      </div>

      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <p className="text-xs text-red-600 font-medium">{apiError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
      >
        {loading ? "Creating account…" : "Create Account"}
      </button>

      <p className="text-center text-xs text-gray-500">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-indigo-600 font-semibold hover:underline">
          Sign In
        </button>
      </p>
    </form>
  );
}

/* ── PAGE ────────────────────────────────────────────────── */
export default function AdminLogin() {
  const [tab, setTab] = useState("signin");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full max-w-sm p-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Trivoxa" className="h-10 w-auto mb-2" />
          <p className="text-[11px] text-indigo-600 font-semibold uppercase tracking-widest">Admin Panel</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          {[
            { key: "signin",  label: "Sign In"        },
            { key: "register", label: "Create Account" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition
                ${tab === t.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "signin"
          ? <SignInForm   onSwitch={() => setTab("register")} />
          : <CreateAccountForm onSwitch={() => setTab("signin")} />
        }
      </div>
    </div>
  );
}
