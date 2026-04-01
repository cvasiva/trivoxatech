import { useState, useEffect, useMemo } from "react";
import { FaTrash, FaSpinner, FaEnvelope, FaFileExcel, FaClock, FaSearch, FaTimes } from "react-icons/fa";
import { api } from "../../utils/api";

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

const INIT_FILTERS = { search: "", source: "all", expiry: "all", dateFrom: "", dateTo: "", sort: "newest" };

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [filters,     setFilters]     = useState(INIT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [checkedIds,  setCheckedIds]  = useState(new Set());

  const load = () => {
    api.getNewsletterSubscribers()
      .then(setSubscribers)
      .catch(() => setSubscribers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    await api.deleteSubscriber(id).catch(() => {});
    setSubscribers((p) => p.filter((s) => s.id !== id));
    setCheckedIds((p) => { const n = new Set(p); n.delete(id); return n; });
  };

  const bulkDelete = async () => {
    if (!window.confirm(`Delete ${checkedIds.size} selected subscriber${checkedIds.size !== 1 ? "s" : ""}?`)) return;
    await Promise.all([...checkedIds].map((id) => api.deleteSubscriber(id).catch(() => {})));
    setSubscribers((p) => p.filter((s) => !checkedIds.has(s.id)));
    setCheckedIds(new Set());
  };

  const downloadExcel = async () => { setDownloading(true); await api.downloadExcel().catch(() => {}); setDownloading(false); };

  const setFilter = (key, val) => setFilters((p) => ({ ...p, [key]: val }));
  const clearFilters = () => setFilters(INIT_FILTERS);
  const activeFilterCount = Object.entries(filters).filter(([k, v]) => v !== INIT_FILTERS[k]).length;

  const sources = useMemo(() => ["all", ...new Set(subscribers.map((s) => s.source).filter(Boolean))], [subscribers]);

  const filtered = useMemo(() => {
    let list = [...subscribers];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter((s) => s.email.toLowerCase().includes(q));
    }

    if (filters.source !== "all") list = list.filter((s) => (s.source || "website") === filters.source);

    if (filters.expiry === "expired") list = list.filter((s) => expiryInfo(s.createdAt || s.subscribedAt).isExpired);
    if (filters.expiry === "warning") list = list.filter((s) => expiryInfo(s.createdAt || s.subscribedAt).isWarning);
    if (filters.expiry === "safe")    list = list.filter((s) => { const e = expiryInfo(s.createdAt || s.subscribedAt); return !e.isExpired && !e.isWarning; });

    if (filters.dateFrom) list = list.filter((s) => new Date(s.createdAt || s.subscribedAt) >= new Date(filters.dateFrom));
    if (filters.dateTo)   list = list.filter((s) => new Date(s.createdAt || s.subscribedAt) <= new Date(filters.dateTo + "T23:59:59"));

    if (filters.sort === "newest")   list.sort((a, b) => new Date(b.createdAt || b.subscribedAt) - new Date(a.createdAt || a.subscribedAt));
    if (filters.sort === "oldest")   list.sort((a, b) => new Date(a.createdAt || a.subscribedAt) - new Date(b.createdAt || b.subscribedAt));
    if (filters.sort === "email")    list.sort((a, b) => a.email.localeCompare(b.email));
    if (filters.sort === "expiring") list.sort((a, b) => expiryInfo(a.createdAt || a.subscribedAt).daysLeft - expiryInfo(b.createdAt || b.subscribedAt).daysLeft);

    return list;
  }, [subscribers, filters]);

  const toggleCheck = (id) => setCheckedIds((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allChecked  = filtered.length > 0 && filtered.every((s) => checkedIds.has(s.id));
  const someChecked = !allChecked && filtered.some((s) => checkedIds.has(s.id));
  const toggleAll   = () => setCheckedIds(allChecked ? new Set() : new Set(filtered.map((s) => s.id)));

  const sel = (key) => `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white ${filters[key] !== INIT_FILTERS[key] ? "border-indigo-400 text-indigo-700" : "border-gray-300 text-gray-700"}`;

  return (
    <div className="w-full space-y-4">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="text-sm text-gray-500">{subscribers.length} total subscribers</p>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadExcel} disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
            <FaFileExcel /> {downloading ? "Downloading..." : "Download Excel"}
          </button>
        </div>
      </div>

      {/* SOURCE PILLS */}
      {sources.filter((s) => s !== "all").length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {sources.filter((s) => s !== "all").map((src) => (
            <button key={src} onClick={() => setFilter("source", filters.source === src ? "all" : src)}
              className={`border rounded-lg px-4 py-2 text-left transition ${filters.source === src ? "border-indigo-400 bg-indigo-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
              <p className="text-sm font-bold text-gray-900">{subscribers.filter((s) => (s.source || "website") === src).length}</p>
              <p className="text-[10px] text-gray-500 capitalize">{src}</p>
            </button>
          ))}
        </div>
      )}

      {/* FILTER TOGGLE */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => setShowFilters((p) => !p)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition
            ${showFilters || activeFilterCount > 0 ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}>
          <FaSearch className="text-xs" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{activeFilterCount}</span>
          )}
        </button>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition">
            <FaTimes className="text-[10px]" /> Clear filters
          </button>
        )}
      </div>

      {/* FILTER PANEL */}
      {showFilters && (
        <div className="bg-white border border-indigo-100 rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-gray-700 mb-1">Filter & Search</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input type="text" value={filters.search} onChange={(e) => setFilter("search", e.target.value)}
                placeholder="Search by email..."
                className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>

            {/* Source */}
            <select value={filters.source} onChange={(e) => setFilter("source", e.target.value)} className={sel("source")}>
              {sources.map((s) => (
                <option key={s} value={s}>{s === "all" ? "All Sources" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>

            {/* Expiry */}
            <select value={filters.expiry} onChange={(e) => setFilter("expiry", e.target.value)} className={sel("expiry")}>
              <option value="all">All Expiry Status</option>
              <option value="safe">🟢 Safe (6–30 days left)</option>
              <option value="warning">🟠 Expiring Soon (≤5 days)</option>
              <option value="expired">🔴 Expired</option>
            </select>

            {/* Sort */}
            <select value={filters.sort} onChange={(e) => setFilter("sort", e.target.value)} className={sel("sort")}>
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="email">Sort: Email A–Z</option>
              <option value="expiring">Sort: Expiring Soonest</option>
            </select>

            {/* Date range */}
            <div className="grid grid-cols-2 gap-2 sm:col-span-2">
              <input type="date" value={filters.dateFrom} onChange={(e) => setFilter("dateFrom", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                title="Subscribed from" />
              <input type="date" value={filters.dateTo} onChange={(e) => setFilter("dateTo", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                title="Subscribed to" />
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of {subscribers.length} subscribers
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <FaSpinner className="animate-spin text-indigo-500 text-2xl" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
          <FaEnvelope className="text-gray-300 text-4xl mx-auto mb-3" />
          <p className="text-gray-400 text-sm">{subscribers.length === 0 ? "No subscribers yet." : "No results match your filters."}</p>
          {subscribers.length > 0 && (
            <button onClick={clearFilters} className="mt-3 text-xs text-indigo-500 hover:underline">Clear filters</button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
          {checkedIds.size > 0 && (
            <div className="flex items-center justify-between gap-3 px-5 py-2.5 bg-indigo-50 border-b border-indigo-100">
              <span className="text-sm text-indigo-700 font-medium">{checkedIds.size} selected</span>
              <div className="flex gap-2">
                <button onClick={() => setCheckedIds(new Set())} className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 bg-white transition">Deselect all</button>
                <button onClick={bulkDelete} className="flex items-center gap-1.5 text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition">
                  <FaTrash className="text-[10px]" /> Delete selected
                </button>
              </div>
            </div>
          )}
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 w-10">
                  <input type="checkbox" checked={allChecked} ref={(el) => { if (el) el.indeterminate = someChecked; }}
                    onChange={toggleAll} className="w-4 h-4 rounded border-gray-300 text-indigo-600 cursor-pointer" />
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Source</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Subscribed On</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Expires On</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((s, i) => {
                const dt = s.createdAt || s.subscribedAt;
                const exp = expiryInfo(dt);
                return (
                  <tr key={s.id} className={`hover:bg-gray-50 transition
                    ${checkedIds.has(s.id) ? "bg-indigo-50" : exp.isExpired ? "bg-red-50/40" : exp.isWarning ? "bg-orange-50/30" : ""}`}>
                    <td className="px-5 py-3">
                      <input type="checkbox" checked={checkedIds.has(s.id)} onChange={() => toggleCheck(s.id)}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 cursor-pointer" />
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-5 py-3 text-gray-800 font-medium">{s.name || "—"}</td>
                    <td className="px-5 py-3 text-gray-800">{s.email}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs whitespace-nowrap">{s.phone || "—"}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full capitalize">{s.source || "website"}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs whitespace-nowrap">{new Date(dt).toLocaleString()}</td>
                    <td className="px-5 py-3"><ExpiryBadge createdAt={dt} /></td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => remove(s.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                        <FaTrash className="text-xs" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-100 inline-block" /> Expired</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-orange-100 inline-block" /> Expiring soon</span>
            </div>
            <p className="text-xs text-gray-400">Showing {filtered.length} of {subscribers.length}</p>
          </div>
        </div>
      )}
    </div>
  );
}
