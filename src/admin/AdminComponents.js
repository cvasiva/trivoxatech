import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaPlus, FaTrash, FaSave, FaCheck } from "react-icons/fa";
import { api } from "../utils/api";

/* ── SAVE BUTTON ── */
export function SaveButton({ onSave, saved }) {
  return (
    <button
      onClick={onSave}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm
        ${saved
          ? "bg-green-500 text-white"
          : "bg-indigo-600 hover:bg-indigo-700 text-white"
        }`}
    >
      {saved ? <FaCheck className="text-xs" /> : <FaSave className="text-xs" />}
      {saved ? "Saved!" : "Save Changes"}
    </button>
  );
}

/* ── SECTION CARD ── */
export function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-sm font-semibold text-gray-800">{title}</span>
        {open ? <FaChevronUp className="text-gray-400 text-xs" /> : <FaChevronDown className="text-gray-400 text-xs" />}
      </button>
      {open && <div className="px-5 pb-5 pt-1 border-t border-gray-100 space-y-4">{children}</div>}
    </div>
  );
}

/* ── FIELD ── */
export function Field({ label, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

/* ── TEXT INPUT ── */
export function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition bg-gray-50 focus:bg-white"
    />
  );
}

/* ── TEXTAREA ── */
export function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition resize-none bg-gray-50 focus:bg-white"
    />
  );
}

/* ── IMAGE PREVIEW ── */
export function ImageField({ label, value, onChange, hint }) {
  return (
    <Field label={label} hint={hint}>
      <Input value={value} onChange={onChange} placeholder="https://..." />
      {value && (
        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 h-32 bg-gray-100">
          <img src={value} alt="preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
        </div>
      )}
    </Field>
  );
}

/* ── ARRAY OF STRINGS ── */
export function StringList({ label, items, onChange, placeholder = "Add item..." }) {
  const add = () => onChange([...items, ""]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i, val) => onChange(items.map((item, idx) => idx === i ? val : item));

  return (
    <Field label={label}>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50 focus:bg-white"
            />
            <button onClick={() => remove(i)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
              <FaTrash className="text-xs" />
            </button>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition">
          <FaPlus className="text-[10px]" /> Add Item
        </button>
      </div>
    </Field>
  );
}

/* ── OBJECT CARD (for arrays of objects) ── */
export function ObjectCard({ index, children, onRemove, label }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50 relative">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label} #{index + 1}</span>
        <button onClick={onRemove} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
          <FaTrash className="text-xs" />
        </button>
      </div>
      {children}
    </div>
  );
}

/* ── ADD BUTTON ── */
export function AddButton({ onClick, label = "Add Item" }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-indigo-200 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 rounded-lg text-sm font-medium transition w-full justify-center"
    >
      <FaPlus className="text-xs" /> {label}
    </button>
  );
}

/* ── SEO SECTION ── */
export function SeoSection({ data, update, altTagFields = [] }) {
  const seo = data.seo || {};
  const upd = (key, val) => update(`seo.${key}`, val);
  return (
    <Section title="SEO & Meta Tags">
      <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
        <span className="text-green-600 text-xs">🔍</span>
        <p className="text-xs text-green-700 font-medium">Controls how this page appears in Google, browser tabs, and social media previews.</p>
      </div>

      {/* H1 + URL */}
      <div className="pb-3 mb-1 border-b border-gray-100">
        <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-3">Page Structure</p>
        <Grid2>
          <Field label="H1 Tag" hint="The main visible heading on this page — only one H1 per page">
            <Input value={seo.h1 || ""} onChange={(v) => upd("h1", v)} placeholder="Main page heading" />
          </Field>
          <Field label="Page URL (Slug)" hint="The URL path for this page, e.g. /about or /courses">
            <Input value={seo.pageUrl || ""} onChange={(v) => upd("pageUrl", v)} placeholder="/page-slug" />
          </Field>
        </Grid2>
      </div>

      {/* Meta */}
      <div className="pb-3 mb-1 border-b border-gray-100">
        <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-3">Meta Tags</p>
        <Grid2>
          <Field label="Page Title" hint="Browser tab & Google result title (50–60 chars)">
            <Input value={seo.title || ""} onChange={(v) => upd("title", v)} placeholder="Page title for search engines" />
          </Field>
          <Field label="Canonical URL" hint="Full URL to prevent duplicate content">
            <Input value={seo.canonical || ""} onChange={(v) => upd("canonical", v)} placeholder="https://trivoxatech.com/page" />
          </Field>
        </Grid2>
        <Field label="Meta Description" hint="Shown under title in Google results (150–160 chars)">
          <Textarea value={seo.description || ""} onChange={(v) => upd("description", v)} placeholder="Brief description for search engines..." rows={2} />
        </Field>
        <Field label="Keywords" hint="Comma-separated (e.g. IT training, web development, React)">
          <Input value={seo.keywords || ""} onChange={(v) => upd("keywords", v)} placeholder="keyword1, keyword2, keyword3" />
        </Field>
      </div>

      {/* Open Graph */}
      <div className="pb-3 mb-1 border-b border-gray-100">
        <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-3">Open Graph (Social Sharing)</p>
        <Grid2>
          <Field label="OG Title" hint="Title shown on Facebook / LinkedIn previews">
            <Input value={seo.ogTitle || ""} onChange={(v) => upd("ogTitle", v)} placeholder="Social share title" />
          </Field>
          <Field label="OG Description" hint="Description in social media link previews">
            <Input value={seo.ogDescription || ""} onChange={(v) => upd("ogDescription", v)} placeholder="Social share description" />
          </Field>
        </Grid2>
        <ImageField label="OG Image URL" value={seo.ogImage || ""} onChange={(v) => upd("ogImage", v)} hint="Recommended: 1200×630px" />
      </div>

      {/* Alt Tags */}
      {altTagFields.length > 0 && (
        <div>
          <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-3">Image Alt Tags</p>
          <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-blue-500 text-xs">🖼️</span>
            <p className="text-xs text-blue-700 font-medium">Alt tags describe images to search engines and screen readers. Be descriptive and include keywords naturally.</p>
          </div>
          <div className="space-y-3">
            {altTagFields.map(({ key, label, hint }) => (
              <Field key={key} label={label} hint={hint}>
                <Input
                  value={(seo.altTags || {})[key] || ""}
                  onChange={(v) => {
                    const altTags = { ...(seo.altTags || {}), [key]: v };
                    upd("altTags", altTags);
                  }}
                  placeholder={`Describe the ${label.toLowerCase()} image...`}
                />
              </Field>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

/* ── PAGE HEADER ── */
export function PageHeader({ title, subtitle, onSave, saved }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
      </div>
      <SaveButton onSave={onSave} saved={saved} />
    </div>
  );
}

/* ── GRID 2 ── */
export function Grid2({ children }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}

/* ── USE SAVE HOOK ── */
export function useSave(dataKey, initialData) {
  const [data, setData] = useState(initialData);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getData(dataKey)
      .then((d) => setData(d))
      .catch(() => {
        // fallback to localStorage if backend unavailable
        try { const s = JSON.parse(localStorage.getItem(dataKey)); if (s) setData(s); } catch {}
      })
      .finally(() => setLoading(false));
  }, [dataKey]);

  const save = async () => {
    try {
      await api.saveData(dataKey, data);
      if (data.seo) await api.updateIndexHtml(data.seo).catch(() => {});
    } catch {
      // fallback
      localStorage.setItem(dataKey, JSON.stringify(data));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (path, value) => {
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  return { data, setData, update, save, saved, loading };
}
