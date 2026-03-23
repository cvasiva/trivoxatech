import { useState, useEffect } from "react";
import { FaTrash, FaEnvelopeOpen, FaEnvelope, FaSpinner, FaInbox } from "react-icons/fa";
import { api } from "../../utils/api";
import { PageHeader } from "../AdminComponents";

const TABS = [
  { label: "All",      value: ""        },
  { label: "Contact",  value: "contact" },
  { label: "Quotes",   value: "quote"   },
  { label: "Unread",   value: "unread"  },
];

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [stats,       setStats]       = useState({});
  const [tab,         setTab]         = useState("");
  const [selected,    setSelected]    = useState(null);
  const [loading,     setLoading]     = useState(true);

  const load = (activeTab = tab) => {
    setLoading(true);
    const params = {};
    if (activeTab === "unread") params.unread = "true";
    else if (activeTab)         params.type   = activeTab;

    Promise.all([
      api.getSubmissions(params),
      api.getSubmissionStats(),
    ])
      .then(([res, s]) => { setSubmissions(res.submissions); setStats(s); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const switchTab = (t) => { setTab(t); setSelected(null); load(t); };

  const markRead = async (id) => {
    await api.markRead(id).catch(() => {});
    setSubmissions((p) => p.map((s) => s.id === id ? { ...s, read: true } : s));
    setStats((p) => ({ ...p, unread: Math.max(0, (p.unread || 1) - 1) }));
  };

  const remove = async (id) => {
    await api.deleteSubmission(id).catch(() => {});
    setSubmissions((p) => p.filter((s) => s.id !== id));
    if (selected?.id === id) setSelected(null);
    load(tab);
  };

  return (
    <div className="w-full space-y-4">
      <PageHeader
        title="Submissions Inbox"
        subtitle={`${stats.total || 0} total · ${stats.unread || 0} unread · ${stats.todayCount || 0} today`}
        onSave={() => load()}
        saved={false}
      />

      {/* STAT PILLS */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: "All",      count: stats.total    },
          { label: "Contact",  count: stats.contacts },
          { label: "Quotes",   count: stats.quotes   },
          { label: "Unread",   count: stats.unread   },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-center min-w-[80px]">
            <p className="text-lg font-bold text-gray-900">{s.count ?? "—"}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => switchTab(t.value)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition
              ${tab === t.value ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <FaSpinner className="animate-spin text-indigo-500 text-2xl" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
          <FaInbox className="text-gray-300 text-4xl mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No submissions found.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {/* LIST */}
          <div className="space-y-2">
            {submissions.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSelected(s); if (!s.read) markRead(s.id); }}
                className={`w-full text-left bg-white border rounded-xl p-4 hover:shadow-sm transition-all
                  ${selected?.id === s.id ? "border-indigo-300 shadow-sm" : "border-gray-200"}
                  ${!s.read ? "border-l-4 border-l-indigo-500" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {s.read
                      ? <FaEnvelopeOpen className="text-gray-400 shrink-0" />
                      : <FaEnvelope className="text-indigo-500 shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
                      <p className="text-xs text-gray-500 truncate">{s.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-gray-400">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); remove(s.id); }}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  {s.type && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                      ${s.type === "quote" ? "bg-purple-50 text-purple-600" : "bg-indigo-50 text-indigo-600"}`}>
                      {s.type === "quote" ? "Quote Request" : "Contact"}
                    </span>
                  )}
                  {(s.interest || s.service) && (
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {s.interest || s.service}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* DETAIL */}
          {selected ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 h-fit sticky top-24">
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
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>
              )}

              <p className="text-xs text-gray-400">
                Received: {new Date(selected.createdAt).toLocaleString()}
              </p>
            </div>
          ) : (
            <div className="bg-white border border-dashed border-gray-200 rounded-xl p-16 text-center text-gray-400 text-sm h-fit">
              Select a message to view details
            </div>
          )}
        </div>
      )}
    </div>
  );
}
