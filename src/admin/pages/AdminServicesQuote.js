import servicesQuoteData from "../../data/servicesQuoteData.json";
import { PageHeader, Section, Field, Input, Textarea, ImageField, StringList, ObjectCard, AddButton, Grid2, SeoSection, useSave } from "../AdminComponents";

export default function AdminServicesQuote() {
  const { data, setData, update, save, saved, saveError } = useSave("servicesQuoteData", servicesQuoteData);

  const updateFeature = (i, key, val) => {
    const items = [...data.features.items];
    items[i] = { ...items[i], [key]: val };
    setData((p) => ({ ...p, features: { ...p.features, items } }));
  };

  const updatePlan = (i, key, val) => {
    const items = [...data.pricing.items];
    items[i] = { ...items[i], [key]: val };
    setData((p) => ({ ...p, pricing: { ...p.pricing, items } }));
  };

  return (
    <div className="w-full space-y-4">
      <PageHeader title="Services Quote Page" subtitle="Edit hero, problem/solution, features, pricing, testimonial and form" onSave={save} saved={saved} saveError={saveError} />

      <SeoSection data={data} update={update} altTagFields={[
        { key: "heroImg", label: "Hero Image", hint: "e.g. Trivoxa web development and engineering services" },
        { key: "testimonialAvatar", label: "Testimonial Avatar", hint: "e.g. Sarah Jenkins CEO at CloudScale Industries" },
      ]} />

      <Section title="Hero Section">
        <Grid2>
          <Field label="Eyebrow"><Input value={data.hero.eyebrow} onChange={(v) => update("hero.eyebrow", v)} /></Field>
          <Field label="Title"><Input value={data.hero.title} onChange={(v) => update("hero.title", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Highlight"><Input value={data.hero.highlight} onChange={(v) => update("hero.highlight", v)} /></Field>
          <Field label="Title 2"><Input value={data.hero.title2} onChange={(v) => update("hero.title2", v)} /></Field>
        </Grid2>
        <Field label="Paragraph"><Textarea value={data.hero.paragraph} onChange={(v) => update("hero.paragraph", v)} /></Field>
        <Grid2>
          <Field label="Primary Button"><Input value={data.hero.primaryBtn} onChange={(v) => update("hero.primaryBtn", v)} /></Field>
          <Field label="Secondary Button"><Input value={data.hero.secondaryBtn} onChange={(v) => update("hero.secondaryBtn", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Projects Value"><Input value={data.hero.projectsValue} onChange={(v) => update("hero.projectsValue", v)} /></Field>
          <Field label="Projects Label"><Input value={data.hero.projectsLabel} onChange={(v) => update("hero.projectsLabel", v)} /></Field>
        </Grid2>
        <ImageField label="Hero Image URL" value={data.hero.img} onChange={(v) => update("hero.img", v)} />
      </Section>

      <Section title="Problem / Solution">
        <Grid2>
          <Field label="Heading"><Input value={data.problem.heading} onChange={(v) => update("problem.heading", v)} /></Field>
          <Field label="Subheading"><Input value={data.problem.subheading} onChange={(v) => update("problem.subheading", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Problem Column Label"><Input value={data.problem.problemLabel} onChange={(v) => update("problem.problemLabel", v)} /></Field>
          <Field label="Solution Column Label"><Input value={data.problem.solutionLabel} onChange={(v) => update("problem.solutionLabel", v)} /></Field>
        </Grid2>
        <StringList label="Problems List" items={data.problem.problems} onChange={(v) => update("problem.problems", v)} />
        <StringList label="Solutions List" items={data.problem.solutions} onChange={(v) => update("problem.solutions", v)} />
      </Section>

      <Section title="Features / Scope of Work">
        <Grid2>
          <Field label="Heading"><Input value={data.features.heading} onChange={(v) => update("features.heading", v)} /></Field>
          <Field label="Subheading"><Input value={data.features.subheading} onChange={(v) => update("features.subheading", v)} /></Field>
        </Grid2>
        <div className="space-y-3">
          {data.features.items.map((f, i) => (
            <ObjectCard key={i} index={i} label="Feature" onRemove={() => setData((p) => ({ ...p, features: { ...p.features, items: p.features.items.filter((_, idx) => idx !== i) } }))}>
              <Grid2>
                <Field label="Title"><Input value={f.title} onChange={(v) => updateFeature(i, "title", v)} /></Field>
                <Field label="Description"><Input value={f.desc} onChange={(v) => updateFeature(i, "desc", v)} /></Field>
              </Grid2>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, features: { ...p.features, items: [...p.features.items, { icon: "FaBolt", title: "", desc: "" }] } }))} label="Add Feature" />
        </div>
      </Section>

      <Section title="Stats Bar">
        <div className="space-y-3">
          {data.stats.map((s, i) => (
            <ObjectCard key={i} index={i} label="Stat" onRemove={() => setData((p) => ({ ...p, stats: p.stats.filter((_, idx) => idx !== i) }))}>
              <Grid2>
                <Field label="Value"><Input value={s.value} onChange={(v) => { const stats = [...data.stats]; stats[i] = { ...stats[i], value: v }; setData((p) => ({ ...p, stats })); }} /></Field>
                <Field label="Label"><Input value={s.label} onChange={(v) => { const stats = [...data.stats]; stats[i] = { ...stats[i], label: v }; setData((p) => ({ ...p, stats })); }} /></Field>
              </Grid2>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, stats: [...p.stats, { value: "", label: "" }] }))} label="Add Stat" />
        </div>
      </Section>

      <Section title="Pricing Plans">
        <Grid2>
          <Field label="Heading"><Input value={data.pricing.heading} onChange={(v) => update("pricing.heading", v)} /></Field>
          <Field label="Subheading"><Input value={data.pricing.subheading} onChange={(v) => update("pricing.subheading", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Popular Label"><Input value={data.pricing.popularLabel} onChange={(v) => update("pricing.popularLabel", v)} /></Field>
          <Field label="Select Button"><Input value={data.pricing.selectBtn} onChange={(v) => update("pricing.selectBtn", v)} /></Field>
        </Grid2>
        <div className="space-y-3">
          {data.pricing.items.map((plan, i) => (
            <ObjectCard key={i} index={i} label="Plan" onRemove={() => setData((p) => ({ ...p, pricing: { ...p.pricing, items: p.pricing.items.filter((_, idx) => idx !== i) } }))}>
              <Grid2>
                <Field label="Plan Name"><Input value={plan.title} onChange={(v) => updatePlan(i, "title", v)} /></Field>
                <Field label="Price"><Input value={plan.price} onChange={(v) => updatePlan(i, "price", v)} /></Field>
              </Grid2>
              <StringList label="Features" items={plan.features} onChange={(v) => updatePlan(i, "features", v)} />
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, pricing: { ...p.pricing, items: [...p.pricing.items, { title: "", price: "", features: [] }] } }))} label="Add Plan" />
        </div>
      </Section>

      <Section title="Testimonial">
        <Field label="Quote"><Textarea value={data.testimonial.quote} onChange={(v) => update("testimonial.quote", v)} /></Field>
        <Grid2>
          <Field label="Name"><Input value={data.testimonial.name} onChange={(v) => update("testimonial.name", v)} /></Field>
          <Field label="Role"><Input value={data.testimonial.role} onChange={(v) => update("testimonial.role", v)} /></Field>
        </Grid2>
        <ImageField label="Avatar URL" value={data.testimonial.img} onChange={(v) => update("testimonial.img", v)} />
      </Section>

      <Section title="Quote Form">
        <Grid2>
          <Field label="Heading"><Input value={data.form.heading} onChange={(v) => update("form.heading", v)} /></Field>
          <Field label="Submit Button"><Input value={data.form.submitBtn} onChange={(v) => update("form.submitBtn", v)} /></Field>
        </Grid2>
        <Field label="Subheading"><Textarea value={data.form.subheading} onChange={(v) => update("form.subheading", v)} rows={2} /></Field>
        <StringList label="Service Options" items={data.form.serviceOptions} onChange={(v) => update("form.serviceOptions", v)} />
        <StringList label="Budget Options" items={data.form.budgetOptions} onChange={(v) => update("form.budgetOptions", v)} />
        <StringList label="Timeline Options" items={data.form.timelineOptions} onChange={(v) => update("form.timelineOptions", v)} />
        <StringList label="Process Steps" items={data.form.steps} onChange={(v) => update("form.steps", v)} />
        <Grid2>
          <Field label="Success Title"><Input value={data.form.successTitle} onChange={(v) => update("form.successTitle", v)} /></Field>
          <Field label="Success Message"><Input value={data.form.successMsg} onChange={(v) => update("form.successMsg", v)} /></Field>
        </Grid2>
      </Section>
    </div>
  );
}
