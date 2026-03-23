import careersData from "../../data/careersData.json";
import { PageHeader, Section, Field, Input, Textarea, ImageField, StringList, ObjectCard, AddButton, Grid2, SeoSection, useSave } from "../AdminComponents";

export default function AdminCareers() {
  const { data, setData, update, save, saved } = useSave("careersData", careersData);

  const updateWhyItem = (i, key, val) => {
    const items = [...data.why.items];
    items[i] = { ...items[i], [key]: val };
    setData((p) => ({ ...p, why: { ...p.why, items } }));
  };

  const updateJob = (i, key, val) => {
    const items = [...data.jobs.items];
    items[i] = { ...items[i], [key]: val };
    setData((p) => ({ ...p, jobs: { ...p.jobs, items } }));
  };

  return (
    <div className="w-full space-y-4">
      <PageHeader title="Careers Page" subtitle="Edit hero, benefits, job listings, tools and newsletter" onSave={save} saved={saved} />

      <SeoSection data={data} update={update} altTagFields={[
        { key: "heroImg", label: "Hero Image", hint: "e.g. Trivoxa team collaborating in a remote-first environment" },
      ]} />

      <Section title="Hero Section">
        <Grid2>
          <Field label="Badge"><Input value={data.hero.badge} onChange={(v) => update("hero.badge", v)} /></Field>
          <Field label="Title"><Input value={data.hero.title} onChange={(v) => update("hero.title", v)} /></Field>
        </Grid2>
        <Field label="Highlight"><Input value={data.hero.highlight} onChange={(v) => update("hero.highlight", v)} /></Field>
        <Field label="Paragraph"><Textarea value={data.hero.paragraph} onChange={(v) => update("hero.paragraph", v)} /></Field>
        <Grid2>
          <Field label="Primary Button"><Input value={data.hero.primaryBtn} onChange={(v) => update("hero.primaryBtn", v)} /></Field>
          <Field label="Secondary Button"><Input value={data.hero.secondaryBtn} onChange={(v) => update("hero.secondaryBtn", v)} /></Field>
        </Grid2>
        <ImageField label="Hero Image URL" value={data.hero.img} onChange={(v) => update("hero.img", v)} />
      </Section>

      <Section title="Why Trivoxa Section">
        <Grid2>
          <Field label="Heading"><Input value={data.why.heading} onChange={(v) => update("why.heading", v)} /></Field>
          <Field label="Subheading"><Input value={data.why.subheading} onChange={(v) => update("why.subheading", v)} /></Field>
        </Grid2>
        <div className="space-y-3">
          {data.why.items.map((item, i) => (
            <ObjectCard key={i} index={i} label="Benefit" onRemove={() => setData((p) => ({ ...p, why: { ...p.why, items: p.why.items.filter((_, idx) => idx !== i) } }))}>
              <Field label="Title"><Input value={item.title} onChange={(v) => updateWhyItem(i, "title", v)} /></Field>
              <Field label="Description"><Textarea value={item.desc} onChange={(v) => updateWhyItem(i, "desc", v)} rows={2} /></Field>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, why: { ...p.why, items: [...p.why.items, { icon: "FaBolt", title: "", desc: "" }] } }))} label="Add Benefit" />
        </div>
      </Section>

      <Section title="Jobs Section">
        <Grid2>
          <Field label="Heading"><Input value={data.jobs.heading} onChange={(v) => update("jobs.heading", v)} /></Field>
          <Field label="Count Label"><Input value={data.jobs.countLabel} onChange={(v) => update("jobs.countLabel", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="View Details Button"><Input value={data.jobs.viewDetailsBtn} onChange={(v) => update("jobs.viewDetailsBtn", v)} /></Field>
          <Field label="Apply Button"><Input value={data.jobs.applyBtn} onChange={(v) => update("jobs.applyBtn", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="No Fit Title"><Input value={data.jobs.noFitTitle} onChange={(v) => update("jobs.noFitTitle", v)} /></Field>
          <Field label="No Fit Button"><Input value={data.jobs.noFitBtn} onChange={(v) => update("jobs.noFitBtn", v)} /></Field>
        </Grid2>
        <Field label="No Fit Description"><Input value={data.jobs.noFitDesc} onChange={(v) => update("jobs.noFitDesc", v)} /></Field>
        <StringList label="Departments (filter)" items={data.jobs.departments} onChange={(v) => update("jobs.departments", v)} />
        <StringList label="Employment Types (filter)" items={data.jobs.employmentTypes} onChange={(v) => update("jobs.employmentTypes", v)} />
        <div className="space-y-3 mt-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Job Listings</p>
          {data.jobs.items.map((job, i) => (
            <ObjectCard key={i} index={i} label="Job" onRemove={() => setData((p) => ({ ...p, jobs: { ...p.jobs, items: p.jobs.items.filter((_, idx) => idx !== i) } }))}>
              <Grid2>
                <Field label="Job Title"><Input value={job.title} onChange={(v) => updateJob(i, "title", v)} /></Field>
                <Field label="Type / Location"><Input value={job.type} onChange={(v) => updateJob(i, "type", v)} /></Field>
              </Grid2>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, jobs: { ...p.jobs, items: [...p.jobs.items, { title: "", type: "Remote • Full-time" }] } }))} label="Add Job" />
        </div>
      </Section>

      <Section title="Tools Section">
        <Field label="Label"><Input value={data.tools.label} onChange={(v) => update("tools.label", v)} /></Field>
        <StringList label="Tools List" items={data.tools.items} onChange={(v) => update("tools.items", v)} placeholder="Tool name..." />
      </Section>

      <Section title="Newsletter Section">
        <Grid2>
          <Field label="Heading"><Input value={data.newsletter.heading} onChange={(v) => update("newsletter.heading", v)} /></Field>
          <Field label="Subscribe Button"><Input value={data.newsletter.btn} onChange={(v) => update("newsletter.btn", v)} /></Field>
        </Grid2>
        <Field label="Paragraph"><Textarea value={data.newsletter.paragraph} onChange={(v) => update("newsletter.paragraph", v)} /></Field>
        <Grid2>
          <Field label="Email Placeholder"><Input value={data.newsletter.placeholder} onChange={(v) => update("newsletter.placeholder", v)} /></Field>
          <Field label="Privacy Note"><Input value={data.newsletter.privacy} onChange={(v) => update("newsletter.privacy", v)} /></Field>
        </Grid2>
      </Section>
    </div>
  );
}
