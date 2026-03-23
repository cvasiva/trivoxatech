import { useState, useEffect } from "react";
import { FaTrash, FaSpinner, FaUserShield, FaUser, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import { PageHeader } from "../AdminComponents";

export default function AdminAccounts() {
  const [admins,  setAdmins]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [me,      setMe]      = useState(null);
  const navigate = useNavigate();

  const load = () => {
    Promise.all([api.getAdmins(), api.verifyToken()])
      .then(([list, verify]) => { setAdmins(list); setMe(verify.admin); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm("Remove this admin account?")) return;
    try {
      await api.deleteAdmin(id);
      setAdmins((p) => p.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="w-full space-y-4">
      <PageHeader
        title="Admin Accounts"
        subtitle={`${admins.length} account${admins.length !== 1 ? "s" : ""} registered`}
        onSave={load}
        saved={false}
      />

      {/* Add account button */}
      <button
        onClick={() => navigate("/admin/login")}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition"
      >
        <FaPlus className="text-xs" /> Add New Account
      </button>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <FaSpinner className="animate-spin text-indigo-500 text-2xl" />
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Account</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {admins.map((a) => {
                const isMe = me && String(a.id) === String(me.id);
                return (
                  <tr key={a.id} className={`hover:bg-gray-50 transition ${isMe ? "bg-indigo-50/40" : ""}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
                          {a.username[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{a.username}</p>
                          {isMe && <p className="text-[10px] text-indigo-500 font-medium">You</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{a.email}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium
                        ${a.role === "superadmin"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-gray-100 text-gray-600"}`}>
                        {a.role === "superadmin" ? <FaUserShield className="text-[10px]" /> : <FaUser className="text-[10px]" />}
                        {a.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {!isMe && (
                        <button
                          onClick={() => remove(a.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Remove account"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
