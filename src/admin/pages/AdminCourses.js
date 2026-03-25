import coursesData from "../../data/coursesData.json";
import courseDataJson from "../../data/courseData.json";
import { useState } from "react";
import { api } from "../../utils/api";
import {
  PageHeader, Section, Field, Input, Textarea, ImageField,
  StringList, ObjectCard, AddButton, Grid2, SeoSection, useSave,
} from "../AdminComponents";
import { FaSave, FaCheck } from "react-icons/fa";

/* ── Course Catalog Editor ── */
function CourseCatalog() {
  const [courses, setCourses] = useState(courseDataJson.courses);
  const [saved, setSaved] = useState(false);

  const update = (i, key, val) => {
    setCourses((p) => { const c = [...p]; c[i] = { ...c[i], [key]: val }; return c; });
  };

  const remove = (i) => setCourses((p) => p.filter((_, idx) => idx !== i));

  const add = () => setCourses((p) => [...p, {
    id: Date.now(), title: "", subtitle: "", desc: "", longDesc: "",
    img: "", category: "Development", level: "Beginner",
    duration: "", price: "", originalPrice: "", emi: "",
    seatsLeft: 10, rating: 4.5, reviews: 0, cohortDate: "",
    highlights: [], includes: [], syllabus: [], tools: [],
    careers: [], testimonials: [], faqs: [], related: [],
  }]);

  const save = async () => {
    try {
      await api.saveData("courseData", { courses });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { alert("Save failed: " + e.message); }
  };

  return (
    <Section title="Course Catalog (All Courses)">
      <div className="flex justify-end mb-2">
        <button onClick={save}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm ${saved ? "bg-green-500 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}>
          {saved ? <><FaCheck className="text-xs" /> Saved!</> : <><FaSave className="text-xs" /> Save Catalog</>}
        </button>
      </div>
      <div className="space-y-4">
        {courses.map((c, i) => (
          <ObjectCard key={c.id} index={i} label={c.title || "New Course"} onRemove={() => remove(i)}>
            <Grid2>
              <Field label="Title"><Input value={c.title} onChange={(v) => update(i, "title", v)} /></Field>
              <Field label="Subtitle"><Input value={c.subtitle} onChange={(v) => update(i, "subtitle", v)} /></Field>
            </Grid2>
            <Field label="Short Description"><Input value={c.desc} onChange={(v) => update(i, "desc", v)} /></Field>
            <Field label="Long Description"><Textarea value={c.longDesc} onChange={(v) => update(i, "longDesc", v)} /></Field>
            <ImageField label="Course Image URL" value={c.img} onChange={(v) => update(i, "img", v)} />
            <Grid2>
              <Field label="Category">
                <select value={c.category} onChange={(e) => update(i, "category", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                  {["Development", "Design", "Cloud", "Marketing"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Level">
                <select value={c.level} onChange={(e) => update(i, "level", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                  {["Beginner", "Intermediate", "Advanced"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
            </Grid2>
            <Grid2>
              <Field label="Duration"><Input value={c.duration} onChange={(v) => update(i, "duration", v)} placeholder="e.g. 12 Weeks" /></Field>
              <Field label="Cohort Date"><Input value={c.cohortDate} onChange={(v) => update(i, "cohortDate", v)} placeholder="e.g. June 1st" /></Field>
            </Grid2>
            <Grid2>
              <Field label="Price"><Input value={c.price} onChange={(v) => update(i, "price", v)} placeholder="e.g. $499" /></Field>
              <Field label="Original Price"><Input value={c.originalPrice} onChange={(v) => update(i, "originalPrice", v)} placeholder="e.g. $699" /></Field>
            </Grid2>
            <Grid2>
              <Field label="EMI"><Input value={c.emi} onChange={(v) => update(i, "emi", v)} placeholder="e.g. $42/month" /></Field>
              <Field label="Seats Left"><Input value={String(c.seatsLeft)} onChange={(v) => update(i, "seatsLeft", Number(v))} placeholder="e.g. 12" /></Field>
            </Grid2>
            <StringList label="Highlights" items={c.highlights || []} onChange={(v) => update(i, "highlights", v)} />
            <StringList label="Includes" items={c.includes || []} onChange={(v) => update(i, "includes", v)} />
            <StringList label="Syllabus Modules" items={c.syllabus || []} onChange={(v) => update(i, "syllabus", v)} />
            <StringList label="Tools" items={c.tools || []} onChange={(v) => update(i, "tools", v)} />
            <StringList label="FAQs" items={c.faqs || []} onChange={(v) => update(i, "faqs", v)} />
          </ObjectCard>
        ))}
        <AddButton onClick={add} label="Add New Course" />
      </div>
    </Section>
  );
}

/* ── Page ── */
export default function AdminCourses() {
  const { data, update, save, saved } = useSave("coursesData", coursesData);
  return (
    <div className="w-full space-y-4">
      <PageHeader title="Courses Page" subtitle="Edit page content and full course catalog" onSave={save} saved={saved} />

      <SeoSection data={data} update={update} altTagFields={[]} />

      <Section title="Hero Section">
        <Grid2>
          <Field label="Heading"><Input value={data.hero.heading} onChange={(v) => update("hero.heading", v)} /></Field>
          <Field label="Highlight"><Input value={data.hero.highlight} onChange={(v) => update("hero.highlight", v)} /></Field>
        </Grid2>
        <Field label="Paragraph"><Textarea value={data.hero.paragraph} onChange={(v) => update("hero.paragraph", v)} /></Field>
        <Field label="Search Placeholder"><Input value={data.hero.searchPlaceholder} onChange={(v) => update("hero.searchPlaceholder", v)} /></Field>
      </Section>

      <Section title="Card Buttons">
        <Grid2>
          <Field label="Enroll Button"><Input value={data.card.enrollBtn} onChange={(v) => update("card.enrollBtn", v)} /></Field>
          <Field label="Details Button"><Input value={data.card.detailsBtn} onChange={(v) => update("card.detailsBtn", v)} /></Field>
        </Grid2>
        <Field label="Empty State Message"><Input value={data.empty} onChange={(v) => update("empty", v)} /></Field>
      </Section>

      <Section title="Enterprise CTA">
        <Field label="Heading"><Input value={data.enterpriseCta.heading} onChange={(v) => update("enterpriseCta.heading", v)} /></Field>
        <Field label="Paragraph"><Textarea value={data.enterpriseCta.paragraph} onChange={(v) => update("enterpriseCta.paragraph", v)} /></Field>
        <Grid2>
          <Field label="Primary Button"><Input value={data.enterpriseCta.primaryBtn} onChange={(v) => update("enterpriseCta.primaryBtn", v)} /></Field>
          <Field label="Secondary Button"><Input value={data.enterpriseCta.secondaryBtn} onChange={(v) => update("enterpriseCta.secondaryBtn", v)} /></Field>
        </Grid2>
      </Section>

      <CourseCatalog />
    </div>
  );
}
