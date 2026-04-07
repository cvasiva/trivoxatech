import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { api, setToken } from "../../utils/api";
import logo from "../../images/Trivoxalogo.png";

const INPUT_CLS =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50 focus:bg-white transition";

/* ── Shared sub-components ───────────────────────────────── */
function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={INPUT_CLS + " pr-10"}
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

function Divider() {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs text-gray-400 font-medium">or</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

function ErrorBox({ msg }) {
  if (!msg) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
      <p className="text-xs text-red-600 font-medium">{msg}</p>
    </div>
  );
}

/* ── Google Sign-In ──────────────────────────────────────── */
function GoogleSignIn({ onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const hasGoogle = Boolean(process.env.REACT_APP_GOOGLE_CLIENT_ID);

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

  if (!hasGoogle) return null;

  return (
    <div className="w-full">
      <div style={{ width: "100%" }}>
        <GoogleLogin
          onSuccess={handleCredential}
          onError={() => onError("Google sign-in was cancelled or failed")}
          useOneTap={false}
          shape="rectangular"
          theme="outline"
          size="large"
          text="continue_with"
          width="368"
        />
      </div>
      {loading && (
        <p className="text-xs text-center text-gray-500 mt-2">Verifying with Google…</p>
      )}
    </div>
  );
}

/* ── Sign In Form ────────────────────────────────────────── */
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
      <GoogleSignIn
        onSuccess={() => navigate("/admin")}
        onError={(msg) => setError(msg)}
      />

      {process.env.REACT_APP_GOOGLE_CLIENT_ID && <Divider />}

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
        <PasswordInput
          value={form.password}
          onChange={set("password")}
          placeholder="Enter your password"
        />
      </div>

      <ErrorBox msg={error} />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>

      <p className="text-center text-xs text-gray-500">
        Need an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-indigo-600 font-semibold hover:underline"
        >
          Create Account
        </button>
      </p>
    </form>
  );
}

/* ── Create Account Form ─────────────────────────────────── */
function CreateAccountForm({ onSwitch }) {
  const [form,     setForm]     = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const navigate = useNavigate();

  const set = (k) => (v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
    setApiError("");
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6)           s++;
    if (p.length >= 10)          s++;
    if (/[A-Z]/.test(p))         s++;
    if (/[0-9]/.test(p))         s++;
    if (/[^A-Za-z0-9]/.test(p))  s++;
    return s;
  })();

  const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const STRENGTH_BAR    = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-green-600"];
  const STRENGTH_TEXT   = ["", "text-red-500", "text-orange-500", "text-yellow-600", "text-green-600", "text-green-700"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
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
      if (err.message?.includes("Username"))
        setErrors((p) => ({ ...p, username: err.message }));
      else if (err.message?.includes("Email"))
        setErrors((p) => ({ ...p, email: err.message }));
      else
        setApiError(err.message || "Registration failed");
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
      <GoogleSignIn
        onSuccess={() => navigate("/admin")}
        onError={(msg) => setApiError(msg)}
      />

      {process.env.REACT_APP_GOOGLE_CLIENT_ID && <Divider />}

      {/* Username */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Username
        </label>
        <input
          type="text"
          value={form.username}
          onChange={(e) => set("username")(e.target.value)}
          className={INPUT_CLS + (errors.username ? " border-red-400" : "")}
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
          className={INPUT_CLS + (errors.email ? " border-red-400" : "")}
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
                  className={
                    "h-1 flex-1 rounded-full transition-all " +
                    (i <= strength ? STRENGTH_BAR[strength] : "bg-gray-200")
                  }
                />
              ))}
            </div>
            <p className={"text-xs font-medium " + STRENGTH_TEXT[strength]}>
              {STRENGTH_LABELS[strength]}
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

      <ErrorBox msg={apiError} />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
      >
        {loading ? "Creating account…" : "Create Account"}
      </button>

      <p className="text-center text-xs text-gray-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-indigo-600 font-semibold hover:underline"
        >
          Sign In
        </button>
      </p>
    </form>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function AdminLogin() {
  const [tab, setTab] = useState("signin");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-40 blur-3xl" />
      </div>

      <div className="relative bg-white border border-gray-200 rounded-2xl shadow-lg w-full max-w-md p-6 sm:p-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Trivoxa" className="h-12 w-auto mb-3" />
          <h1 className="text-lg font-bold text-gray-900">Trivoxa Admin</h1>
          <p className="text-xs text-indigo-600 font-semibold uppercase tracking-widest mt-0.5">
            Content Management Panel
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          {[
            { key: "signin",   label: "Sign In"        },
            { key: "register", label: "Create Account" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={
                "flex-1 py-2 text-xs font-semibold rounded-lg transition " +
                (tab === t.key
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700")
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "signin"
          ? <SignInForm        onSwitch={() => setTab("register")} />
          : <CreateAccountForm onSwitch={() => setTab("signin")}   />
        }
      </div>
    </div>
  );
}
