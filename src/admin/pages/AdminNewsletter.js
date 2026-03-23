import { useState, useEffect } from "react";
import { FaTrash, FaSpinner, FaEnvelope } from "react-icons/fa";
import { api } from "../../utils/api";
import { PageHeader } from "../AdminComponents";

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading,     setLoading]     = useState(true);

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
  };

  const sources = [...new Set(subscribers.map((s) => s.source).filter(Boolean))];

  return (
    <div className="w-full space-y-4">
      <PageHeader
        title="Newsletter Subscribers"
        subtitle={`${subscribers.length} total subscribers`}
        onSave={load}
        saved={false}
      />

      {/* SOURCE BREAKDOWN */}
      {sources.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {sources.map((src) => (
            <div key={src} className="bg-white border border-gray-200 rounded-lg px-4 py-2">
              <p className="text-sm font-semibold text-gray-900">
                {subscribers.filter((s) => s.source === src).length}
              </p>
              <p className="text-[10px] text-gray-500 capitalize">{src}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <FaSpinner className="animate-spin text-indigo-500 text-2xl" />
        </div>
      ) : subscribers.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
          <FaEnvelope className="text-gray-300 text-4xl mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No subscribers yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Source</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3 text-gray-800">{s.email}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full capitalize">
                      {s.source || "website"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    {new Date(s.subscribedAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => remove(s.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
