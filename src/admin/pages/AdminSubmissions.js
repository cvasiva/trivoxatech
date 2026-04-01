import { useState, useEffect, useMemo } from "react";
import {
  FaTrash, FaEnvelopeOpen, FaEnvelope, FaSpinner,
  FaInbox, FaFileExcel, FaTable, FaThList,
  FaExclamationTriangle, FaClock, FaSearch, FaTimes,
} from "react-icons/fa";
import { api } from "../../utils/api";

const TABS = [
  { label: "All",     value: ""        },
  { label: "Contact", value: "contact" },
  { label: "Quotes",  value: "quote"   },
  { label: "Unread",  value: "unread"  },
];

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

function expiryInfo(createdAt) {
  const expireAt = new Date(new Date(createdAt).getTime() + THIRTY_DAYS);
  const daysLeft = Math.ceil((expireAt - Date.now()) / (24 * 60 * 60 * 1000));
  return { date: expireAt.toLocaleDateString(), daysLeft, isExpired: daysLeft <= 0, isWarning: daysLeft > 0 && daysLeft <= 5 };
}

function ExpiryBadge({ createdAt }) {
  const { daysLeft, isExpired, isWarning } = expiryInfo(createdAt);
  if (isExpired) return (
    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium whitespace-nowrap">
      <FaClock className="text-[8px]" /> Expired
    </span>
  );
  if (isWarning) return (
    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-medium whitespace-nowrap">
      <FaClock className="text-[8px]" /> {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium whitespace-nowrap">
      <FaClock className="text-[8px]" /> {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
    </span>
  );
}

const INIT_FILTERS = { search: "", expiry: "all", dateFrom: "", dateTo: "", sort: "newest" };

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [stats,       setStats]       = useState({});
  const [tab,         setTab]         = useState("");
  const [selected,    setSelected]    = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [view,        setView]        = useState("table");
  const [downloading, setDownloading] = useState(false);
  const [purging,     setPurging]     = useState(false);
  const [purgeResult, setPurgeResult] = useState(null);
  const [filters,     setFilters]     = useState(INIT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [checkedIds,  setCheckedIds]  = useState(new Set());

  const load = (activeTab = tab) => {
    setLoading(true);
    const params = {};
    if (activeTab === "unread") params.unread = "true";
    else if (activeTab)         params.type   = activeTab;
    Promise.all([api.getSubmissions(params), api.getSubmissionStats()])
      .then(([res, s]) => { setSubmissions(res.submissions); setStats(s); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const switchTab = (t) => { setTab(t); setSelected(null); setCheckedIds(new Set()); load(t); };

  const markRead = async (id) => {
    await api.markRead(id).catch(() => {});
    setSubmissions((p) => p.map((s) => s.id === id ? { ...s, read: true } : s));
    setStats((p) => ({ ...p, unread: Math.max(0, (p.unread || 1) - 1) }));
  };

  const remove = async (id) => {
    await api.deleteSubmission(id).catch(() => {});
    setSubmissions((p) => p.filter((s) => s.id !== id));
    setCheckedIds((p) => { const n = new Set(p); n.delete(id); return n; });
    if (selected?.id === id) setSelected(null);
    load(tab);
  };

  const bulkDelete = async () => {
    if (!window.confirm(`Delete ${checkedIds.size} selected submission${checkedIds.size !== 1 ? "s" : ""}?`)) return;
    await Promise.all([...checkedIds].map((id) => api.deleteSubmission(id).catch(() => {})));
    setSubmissions((p) => p.filter((s) => !checkedIds.has(s.id)));
    if (checkedIds.has(selected?.id)) setSelected(null);
    setCheckedIds(new Set());
    load(tab);
  };

  const downloadExcel = async () => { setDownloading(true); await api.downloadExcel().catch(() => {}); setDownloading(false); };

  const purgeExpired = async () => {
    if (!window.confirm("Delete all data older than 30 days? This cannot be undone.")) return;
    setPurging(true); setPurgeResult(null);
    try { const r = await api.purgeExpired(); setPurgeResult(r.deleted); load(tab); } catch {}
    finally { setPurging(false); }
  };

  const setFilter = (key, val) => setFilters((p) => ({ ...p, [key]: val }));
  const clearFilters = () => setFilters(INIT_FILTERS);
  const activeFilterCount = Object.entries(filters).filter(([k, v]) => v !== INIT_FILTERS[k]).length;

  // ── Client-side filtering + sorting ──────────────────────
  const filtered = useMemo(() => {
    let list = [...submissions];

    // search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter((s) =>
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.phone?.toLowerCase().includes(q) ||
        s.message?.toLowerCase().includes(q) ||
        s.interest?.toLowerCase().includes(q) ||
        s.service?.toLowerCase().includes(q)
      );
    }

    // expiry filter
    if (filters.expiry === "expired")  list = list.filter((s) => expiryInfo(s.createdAt).isExpired);
    if (filters.expiry === "warning")  list = list.filter((s) => expiryInfo(s.createdAt).isWarning);
    if (filters.expiry === "safe")     list = list.filter((s) => { const e = expiryInfo(s.createdAt); return !e.isExpired && !e.isWarning; });

    // date range
    if (filters.dateFrom) list = list.filter((s) => new Date(s.createdAt) >= new Date(filters.dateFrom));
    if (filters.dateTo)   list = list.filter((s) => new Date(s.createdAt) <= new Date(filters.dateTo + "T23:59:59"));

    // sort
    if (filters.sort === "newest")  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (filters.sort === "oldest")  list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (filters.sort === "name")    list.sort((a, b) => a.name.localeCompare(b.name));
    if (filters.sort === "expiring") list.sort((a, b) => expiryInfo(a.createdAt).daysLeft - expiryInfo(b.createdAt).daysLeft);

    return list;
  }, [submissions, filters]);

  const toggleCheck = (id) => setCheckedIds((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allChecked = filtered.length > 0 && filtered.every((s) => checkedIds.has(s.id));
  const someChecked = !allChecked && filtered.some((s) => checkedIds.has(s.id));
  const toggleAll = () => setCheckedIds(allChecked ? new Set() : new Set(filtered.map((s) => s.id)));

  const sel = (key) => `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white ${filters[key] !== INIT_FILTERS[key] ? "border-indigo-400 text-indigo-700" : "border-gray-300 text-gray-700"}`;

  return (
    <div className="w-full space-y-4">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Submissions Inbox</h1>
          <p className="text-sm text-gray-500">{stats.total || 0} total · {stats.unread || 0} unread · {stats.todayCount || 0} today</p>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadExcel} disabled={downloading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
            <FaFileExcel className="shrink-0" /> {downloading ? "Downloading..." : "Download Excel"}
          </button>
          <button onClick={purgeExpired} disabled={purging}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
            <FaExclamationTriangle className="shrink-0" /> {purging ? "Purging..." : "Purge Expired"}
          </button>
        </div>
      </div>

      {purgeResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
          ✅ Purged — Contacts: {purgeResult.contacts}, Enrollments: {purgeResult.enrollments}, Newsletter: {purgeResult.newsletter}
        </div>
      )}

      {/* STAT PILLS */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: "All",     count: stats.total    },
          { label: "Contact", count: stats.contacts },
          { label: "Quotes",  count: stats.quotes   },
          { label: "Unread",  count: stats.unread   },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-center min-w-[80px]">
            <p className="text-lg font-bold text-gray-900">{s.count ?? "—"}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      {/* TABS + VIEW TOGGLE + FILTER TOGGLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.value} onClick={() => switchTab(t.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition whitespace-nowrap
                ${tab === t.value ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center shrink-0">
          <button onClick={() => setShowFilters((p) => !p)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition
              ${showFilters || activeFilterCount > 0 ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}>
            <FaSearch className="text-xs" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{activeFilterCount}</span>
            )}
          </button>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button onClick={() => setView("table")}
              className={`p-2 rounded-md transition ${view === "table" ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"}`}>
              <FaTable className="text-sm" />
            </button>
            <button onClick={() => setView("card")}
              className={`p-2 rounded-md transition ${view === "card" ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"}`}>
              <FaThList className="text-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* FILTER PANEL */}
      {showFilters && (
        <div className="bg-white border border-indigo-100 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-gray-700">Filter & Search</p>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition">
                <FaTimes className="text-[10px]" /> Clear all
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text" value={filters.search}
                onChange={(e) => setFilter("search", e.target.value)}
                placeholder="Search name, email, message..."
                className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            {/* Expiry filter */}
            <div>
              <select value={filters.expiry} onChange={(e) => setFilter("expiry", e.target.value)} className={sel("expiry")}>
                <option value="all">All Expiry Status</option>
                <option value="safe">🟢 Safe (6–30 days left)</option>
                <option value="warning">🟠 Expiring Soon (≤5 days)</option>
                <option value="expired">🔴 Expired</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <select value={filters.sort} onChange={(e) => setFilter("sort", e.target.value)} className={sel("sort")}>
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="name">Sort: Name A–Z</option>
                <option value="expiring">Sort: Expiring Soonest</option>
              </select>
            </div>

            {/* Date From */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
              <input type="date" value={filters.dateFrom} onChange={(e) => setFilter("dateFrom", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                title="Date from" />
              <input type="date" value={filters.dateTo} onChange={(e) => setFilter("dateTo", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                title="Date to" />
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of {submissions.length} submissions
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <FaSpinner className="animate-spin text-indigo-500 text-2xl" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
          <FaInbox className="text-gray-300 text-4xl mx-auto mb-3" />
          <p className="text-gray-400 text-sm">{submissions.length === 0 ? "No submissions found." : "No results match your filters."}</p>
          {submissions.length > 0 && (
            <button onClick={clearFilters} className="mt-3 text-xs text-indigo-500 hover:underline">Clear filters</button>
          )}
        </div>
      ) : view === "table" ? (

        /* ── TABLE VIEW ── */
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
          {checkedIds.size > 0 && (
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-indigo-50 border-b border-indigo-100">
              <span className="text-sm text-indigo-700 font-medium">{checkedIds.size} selected</span>
              <div className="flex gap-2">
                <button onClick={() => setCheckedIds(new Set())} className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 bg-white transition">Deselect all</button>
                <button onClick={bulkDelete} className="flex items-center gap-1.5 text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition">
                  <FaTrash className="text-[10px]" /> Delete selected
                </button>
              </div>
            </div>
          )}
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={allChecked} ref={(el) => { if (el) el.indeterminate = someChecked; }}
                    onChange={toggleAll} className="w-4 h-4 rounded border-gray-300 text-indigo-600 cursor-pointer" />
                </th>
                {["Type","Name","Email","Phone","Interest / Service","Message","Read","Submitted","Expires On",""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((s) => {
                const exp = expiryInfo(s.createdAt);
                return (
                  <tr key={s.id} className={`hover:bg-gray-50 transition
                    ${checkedIds.has(s.id) ? "bg-indigo-50" : exp.isExpired ? "bg-red-50/40" : exp.isWarning ? "bg-orange-50/30" : !s.read ? "bg-indigo-50/30" : ""}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={checkedIds.has(s.id)} onChange={() => toggleCheck(s.id)}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 cursor-pointer" />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap
                        ${s.type === "quote" ? "bg-purple-50 text-purple-600" : "bg-indigo-50 text-indigo-600"}`}>
                        {s.type === "quote" ? "Quote" : "Contact"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600">{s.email}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{s.phone || "—"}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{s.interest || s.service || "—"}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate">{s.message || "—"}</td>
                    <td className="px-4 py-3">
                      {s.read ? <FaEnvelopeOpen className="text-gray-400" /> : <FaEnvelope className="text-indigo-500" />}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><ExpiryBadge createdAt={s.createdAt} /></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => remove(s.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                        <FaTrash className="text-xs" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-100 inline-block" /> Expired</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-orange-100 inline-block" /> Expiring soon</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-indigo-100 inline-block" /> Unread</span>
            </div>
            <p className="text-xs text-gray-400">Showing {filtered.length} of {submissions.length}</p>
          </div>
        </div>

      ) : (

        /* ── CARD VIEW ── */
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            {filtered.map((s) => (
              <button key={s.id}
                onClick={() => { setSelected(s); if (!s.read) markRead(s.id); }}
                className={`w-full text-left bg-white border rounded-xl p-4 hover:shadow-sm transition-all
                  ${selected?.id === s.id ? "border-indigo-300 shadow-sm" : "border-gray-200"}
                  ${!s.read ? "border-l-4 border-l-indigo-500" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {s.read ? <FaEnvelopeOpen className="text-gray-400 shrink-0" /> : <FaEnvelope className="text-indigo-500 shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
                      <p className="text-xs text-gray-500 truncate">{s.email}</p>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); remove(s.id); }}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition shrink-0">
                    <FaTrash className="text-xs" />
                  </button>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {s.type && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                      ${s.type === "quote" ? "bg-purple-50 text-purple-600" : "bg-indigo-50 text-indigo-600"}`}>
                      {s.type === "quote" ? "Quote" : "Contact"}
                    </span>
                  )}
                  {(s.interest || s.service) && (
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s.interest || s.service}</span>
                  )}
                  <ExpiryBadge createdAt={s.createdAt} />
                </div>
              </button>
            ))}
          </div>

          {selected ? (() => {
            const exp = expiryInfo(selected.createdAt);
            return (
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 h-fit sticky top-[57px]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{selected.name}</p>
                    <p className="text-sm text-gray-500">{selected.email}</p>
                    {selected.phone && <p className="text-sm text-gray-500">{selected.phone}</p>}
                  </div>
                  <button onClick={() => remove(selected.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition">
                    <FaTrash />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selected.type && (
                    <span className={`text-xs px-3 py-1 rounded-full font-medium
                      ${selected.type === "quote" ? "bg-purple-50 text-purple-600" : "bg-indigo-50 text-indigo-600"}`}>
                      {selected.type === "quote" ? "Quote Request" : "Contact Form"}
                    </span>
                  )}
                  {selected.service  && <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{selected.service}</span>}
                  {selected.budget   && <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{selected.budget}</span>}
                  {selected.timeline && <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{selected.timeline}</span>}
                  {selected.interest && <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{selected.interest}</span>}
                </div>
                {selected.message && (
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</div>
                )}
                <div className={`rounded-lg px-4 py-3 text-xs flex items-center gap-2
                  ${exp.isExpired ? "bg-red-50 border border-red-200 text-red-600"
                    : exp.isWarning ? "bg-orange-50 border border-orange-200 text-orange-600"
                    : "bg-gray-50 border border-gray-200 text-gray-500"}`}>
                  <FaClock className="shrink-0" />
                  <div>
                    <p className="font-medium">
                      {exp.isExpired ? "This record has expired and will be auto-deleted"
                        : exp.isWarning ? `Expires in ${exp.daysLeft} day${exp.daysLeft !== 1 ? "s" : ""} — download Excel to save`
                        : `Expires on ${exp.date} (${exp.daysLeft} days left)`}
                    </p>
                    <p className="mt-0.5 text-gray-400">Submitted: {new Date(selected.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          })() : (
            <div className="bg-white border border-dashed border-gray-200 rounded-xl p-16 text-center text-gray-400 text-sm h-fit">
              Select a message to view details
            </div>
          )}
        </div>
      )}
    </div>
  );
}
