import portfolioData from "../../data/portfolioData.json";
import { PageHeader, Section, Field, Input, Textarea, ImageField, StringList, ObjectCard, AddButton, Grid2, SeoSection, useSave } from "../AdminComponents";

export default function AdminPortfolio() {
  const { data, setData, update, save, saved, saveError } = useSave("portfolioData", portfolioData);

  const updateProject = (i, key, val) => {
    const projects = [...data.gallery.projects];
    projects[i] = { ...projects[i], [key]: val };
    setData((p) => ({ ...p, gallery: { ...p.gallery, projects } }));
  };

  const updateMetric = (projIdx, metIdx, key, val) => {
    const projects = [...data.gallery.projects];
    const metrics = [...projects[projIdx].metrics];
    metrics[metIdx] = { ...metrics[metIdx], [key]: val };
    projects[projIdx] = { ...projects[projIdx], metrics };
    setData((p) => ({ ...p, gallery: { ...p.gallery, projects } }));
  };

  const updateStat = (i, key, val) => {
    const items = [...data.stats.items];
    items[i] = { ...items[i], [key]: val };
    setData((p) => ({ ...p, stats: { ...p.stats, items } }));
  };

  const updateFeature = (i, key, val) => {
    const features = [...data.features];
    features[i] = { ...features[i], [key]: val };
    setData((p) => ({ ...p, features }));
  };

  return (
    <div className="w-full space-y-4">
      <PageHeader title="Portfolio Page" subtitle="Edit hero, project gallery, stats, CTA and bottom features" onSave={save} saved={saved} saveError={saveError} />

      <SeoSection data={data} update={update} altTagFields={[
        { key: "heroImg", label: "Hero Image", hint: "e.g. Trivoxa portfolio of high-impact IT projects" },
      ]} />

      <Section title="Hero Section">
        <Grid2>
          <Field label="Eyebrow"><Input value={data.hero.eyebrow} onChange={(v) => update("hero.eyebrow", v)} /></Field>
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

      <Section title="Gallery Filters">
        <Grid2>
          <Field label="Heading"><Input value={data.gallery.heading} onChange={(v) => update("gallery.heading", v)} /></Field>
          <Field label="View Archived Button"><Input value={data.gallery.viewArchivedBtn} onChange={(v) => update("gallery.viewArchivedBtn", v)} /></Field>
        </Grid2>
        <Field label="Empty Message"><Input value={data.gallery.emptyMsg} onChange={(v) => update("gallery.emptyMsg", v)} /></Field>
        <StringList label="Industry Filters" items={data.gallery.industries} onChange={(v) => update("gallery.industries", v)} />
        <StringList label="Service Filters" items={data.gallery.services} onChange={(v) => update("gallery.services", v)} />
      </Section>

      <Section title="Projects" defaultOpen={false}>
        <div className="space-y-4">
          {data.gallery.projects.map((proj, i) => (
            <ObjectCard key={i} index={i} label="Project" onRemove={() => setData((p) => ({ ...p, gallery: { ...p.gallery, projects: p.gallery.projects.filter((_, idx) => idx !== i) } }))}>
              <Grid2>
                <Field label="Tag (Industry)"><Input value={proj.tag} onChange={(v) => updateProject(i, "tag", v)} /></Field>
                <Field label="Company"><Input value={proj.company} onChange={(v) => updateProject(i, "company", v)} /></Field>
              </Grid2>
              <Grid2>
                <Field label="Title"><Input value={proj.title} onChange={(v) => updateProject(i, "title", v)} /></Field>
                <Field label="Category (Service)"><Input value={proj.category} onChange={(v) => updateProject(i, "category", v)} /></Field>
              </Grid2>
              <Field label="Description"><Textarea value={proj.desc} onChange={(v) => updateProject(i, "desc", v)} rows={2} /></Field>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Metrics</p>
                {proj.metrics.map((m, mi) => (
                  <div key={mi} className="grid grid-cols-2 gap-2">
                    <Field label="Value"><Input value={m.value} onChange={(v) => updateMetric(i, mi, "value", v)} /></Field>
                    <Field label="Label"><Input value={m.label} onChange={(v) => updateMetric(i, mi, "label", v)} /></Field>
                  </div>
                ))}
              </div>
              <ImageField label="Project Image URL" value={proj.img} onChange={(v) => updateProject(i, "img", v)} />
              <Field label="Project Image Alt Tag" hint="Describe this project image for SEO"><Input value={proj.alt || ""} onChange={(v) => updateProject(i, "alt", v)} placeholder="e.g. Neobank digital banking dashboard interface" /></Field>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, gallery: { ...p.gallery, projects: [...p.gallery.projects, { tag: "", company: "", title: "", desc: "", category: "", metrics: [{ value: "", label: "" }, { value: "", label: "" }], img: "" }] } }))} label="Add Project" />
        </div>
      </Section>

      <Section title="Stats Section">
        <Grid2>
          <Field label="Heading"><Input value={data.stats.heading} onChange={(v) => update("stats.heading", v)} /></Field>
          <Field label="Subheading"><Input value={data.stats.subheading} onChange={(v) => update("stats.subheading", v)} /></Field>
        </Grid2>
        <div className="space-y-3">
          {data.stats.items.map((s, i) => (
            <ObjectCard key={i} index={i} label="Stat" onRemove={() => setData((p) => ({ ...p, stats: { ...p.stats, items: p.stats.items.filter((_, idx) => idx !== i) } }))}>
              <Grid2>
                <Field label="Value"><Input value={s.value} onChange={(v) => updateStat(i, "value", v)} /></Field>
                <Field label="Label"><Input value={s.label} onChange={(v) => updateStat(i, "label", v)} /></Field>
              </Grid2>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, stats: { ...p.stats, items: [...p.stats.items, { icon: "FaGlobe", value: "", label: "" }] } }))} label="Add Stat" />
        </div>
      </Section>

      <Section title="CTA Section">
        <Grid2>
          <Field label="Heading"><Input value={data.cta.heading} onChange={(v) => update("cta.heading", v)} /></Field>
          <Field label="Highlight"><Input value={data.cta.highlight} onChange={(v) => update("cta.highlight", v)} /></Field>
        </Grid2>
        <Field label="Subheading"><Input value={data.cta.subheading} onChange={(v) => update("cta.subheading", v)} /></Field>
        <Grid2>
          <Field label="Primary Button"><Input value={data.cta.primaryBtn} onChange={(v) => update("cta.primaryBtn", v)} /></Field>
          <Field label="Secondary Button"><Input value={data.cta.secondaryBtn} onChange={(v) => update("cta.secondaryBtn", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Success Title"><Input value={data.cta.successTitle} onChange={(v) => update("cta.successTitle", v)} /></Field>
          <Field label="Success Message"><Input value={data.cta.successMsg} onChange={(v) => update("cta.successMsg", v)} /></Field>
        </Grid2>
      </Section>

      <Section title="Bottom Features">
        <div className="space-y-3">
          {data.features.map((f, i) => (
            <ObjectCard key={i} index={i} label="Feature" onRemove={() => setData((p) => ({ ...p, features: p.features.filter((_, idx) => idx !== i) }))}>
              <Grid2>
                <Field label="Title"><Input value={f.title} onChange={(v) => updateFeature(i, "title", v)} /></Field>
                <Field label="Description"><Input value={f.desc} onChange={(v) => updateFeature(i, "desc", v)} /></Field>
              </Grid2>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, features: [...p.features, { icon: "FaCheckCircle", title: "", desc: "" }] }))} label="Add Feature" />
        </div>
      </Section>
    </div>
  );
}
