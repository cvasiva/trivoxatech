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
  subscribeNewsletter:      (email, source) => request("POST",   "/newsletter", { email, source }),
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
};
