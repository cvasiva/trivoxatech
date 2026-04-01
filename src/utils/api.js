/**
 * Central API utility — all frontend ↔ backend communication goes through here.
 *
 * Flow:
 *  Public pages  → getData(key)
 *  Contact form  → submitContact(form)
 *  Quote form    → submitQuote(form)
 *  Newsletter    → subscribeNewsletter(email, source)
 *  Admin login   → login(username, password)  → stores JWT
 *  Admin pages   → saveData(key, data)
 *  Admin inbox   → getSubmissions(), markRead(id), deleteSubmission(id)
 *  Admin subs    → getNewsletterSubscribers(), deleteSubscriber(id)
 */

const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// ── Token helpers ────────────────────────────────────────────
export function setToken(token) {
  localStorage.setItem("trivoxa_admin_token", token);
}
export function clearToken() {
  localStorage.removeItem("trivoxa_admin_token");
}
function getToken() {
  return localStorage.getItem("trivoxa_admin_token");
}

// ── Token expiry helpers ─────────────────────────────────────
export function getTokenExpiry() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? new Date(payload.exp * 1000) : null;
  } catch { return null; }
}

export function isTokenExpired() {
  const expiry = getTokenExpiry();
  return expiry ? expiry <= new Date() : true;
}

// ── Core fetch wrapper ───────────────────────────────────────
async function request(method, endpoint, body) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${endpoint}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    clearToken();
    window.dispatchEvent(new CustomEvent("trivoxa:auth:expired"));
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || "Session expired");
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || res.statusText);
  return json;
}

// ── API methods ──────────────────────────────────────────────
export const api = {

  // Auth
  login:        (username, password)                         => request("POST", "/auth/login",    { username, password }),
  register:     (username, email, password, confirmPassword) => request("POST", "/auth/register", { username, email, password, confirmPassword }),
  googleLogin:  (credential)                                 => request("POST", "/auth/google",   { credential }),
  verifyToken:  ()                                           => request("GET",  "/auth/verify"),
  getAdmins:    ()                                           => request("GET",  "/auth/admins"),
  deleteAdmin:  (id)                                         => request("DELETE", `/auth/admins/${id}`),

  // Page data (public read / admin write)
  getData:          (key)        => request("GET", `/data/${key}`),
  saveData:         (key, data)  => request("PUT", `/data/${key}`, data),
  updateIndexHtml:  (seo)        => request("PUT", "/seo/index-html", seo),

  // Enroll / Apply form
  submitEnroll: (form) => request("POST", "/enroll", form),

  // Contact form (Contact page)
  submitContact: (form) => request("POST", "/contact", form),

  // Quote form (ServicesQuote page)
  submitQuote: (form) => request("POST", "/quote", form),

  // Newsletter (Blog sidebar + Careers page)
  subscribeNewsletter: (email, source, name = "", phone = "") => request("POST", "/newsletter", { email, source, name, phone }),
  getNewsletterSubscribers: ()              => request("GET",    "/newsletter"),
  deleteSubscriber:         (id)            => request("DELETE", `/newsletter/${id}`),

  // Admin submissions inbox
  getSubmissions:    (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request("GET", `/submissions${qs ? `?${qs}` : ""}`);
  },
  getSubmissionStats: ()  => request("GET",    "/submissions/stats"),
  markRead:           (id) => request("PATCH",  `/submissions/${id}/read`),
  deleteSubmission:   (id) => request("DELETE", `/submissions/${id}`),

  // Visitor tracking (public)
  trackVisit: (page, sessionId) => request("POST", "/visitors", { page, sessionId }),

  // Analytics (admin)
  getVisitorStats: () => request("GET", "/visitors/stats"),

  // Export (admin)
  getExportCounts: () => request("GET", "/export/counts"),
  purgeExpired: () => request("DELETE", "/export/purge-expired"),
  downloadExcel: () => {
    const token = localStorage.getItem("trivoxa_admin_token");
    const url = `${BASE}/export/all`;
    return fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error("Export failed");
        return res.blob();
      })
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `trivoxa-data-${new Date().toISOString().slice(0, 10)}.xlsx`;
        a.click();
        URL.revokeObjectURL(a.href);
      });
  },
};
