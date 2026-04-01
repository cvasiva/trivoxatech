import servicesData from "../../data/servicesData.json";
import { PageHeader, Section, Field, Input, Textarea, ImageField, StringList, ObjectCard, AddButton, Grid2, SeoSection, useSave } from "../AdminComponents";

export default function AdminServices() {
  const { data, setData, update, save, saved, saveError } = useSave("servicesData", servicesData);

  const updateService = (i, key, val) => {
    const items = [...data.services.items];
    items[i] = { ...items[i], [key]: val };
    setData((p) => ({ ...p, services: { ...p.services, items } }));
  };

  const updateStep = (i, key, val) => {
    const steps = [...data.lifecycle.steps];
    steps[i] = { ...steps[i], [key]: val };
    setData((p) => ({ ...p, lifecycle: { ...p.lifecycle, steps } }));
  };

  const updateMember = (i, key, val) => {
    const members = [...data.team.members];
    members[i] = { ...members[i], [key]: val };
    setData((p) => ({ ...p, team: { ...p.team, members } }));
  };

  const updateStory = (i, key, val) => {
    const items = [...data.successStories.items];
    items[i] = { ...items[i], [key]: val };
    setData((p) => ({ ...p, successStories: { ...p.successStories, items } }));
  };

  return (
    <div className="w-full space-y-4">
      <PageHeader title="Services Page" subtitle="Edit hero, service cards, lifecycle, team and success stories" onSave={save} saved={saved} saveError={saveError} />

      <SeoSection data={data} update={update} altTagFields={[
        { key: "heroImg", label: "Hero Image", hint: "e.g. Trivoxa enterprise IT services team" },
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
        <div className="space-y-3">
          {data.hero.stats.map((s, i) => (
            <ObjectCard key={i} index={i} label="Stat" onRemove={() => setData((p) => ({ ...p, hero: { ...p.hero, stats: p.hero.stats.filter((_, idx) => idx !== i) } }))}>
              <Grid2>
                <Field label="Value"><Input value={s.value} onChange={(v) => { const stats = [...data.hero.stats]; stats[i] = { ...stats[i], value: v }; setData((p) => ({ ...p, hero: { ...p.hero, stats } })); }} /></Field>
                <Field label="Label"><Input value={s.label} onChange={(v) => { const stats = [...data.hero.stats]; stats[i] = { ...stats[i], label: v }; setData((p) => ({ ...p, hero: { ...p.hero, stats } })); }} /></Field>
              </Grid2>
            </ObjectCard>
          ))}
        </div>
        <ImageField label="Hero Image URL" value={data.hero.img} onChange={(v) => update("hero.img", v)} />
      </Section>

      <Section title="Services Cards">
        <Grid2>
          <Field label="Heading"><Input value={data.services.heading} onChange={(v) => update("services.heading", v)} /></Field>
          <Field label="Subheading"><Input value={data.services.subheading} onChange={(v) => update("services.subheading", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Quote Button"><Input value={data.services.quoteBtn} onChange={(v) => update("services.quoteBtn", v)} /></Field>
          <Field label="Demo Button"><Input value={data.services.demoBtn} onChange={(v) => update("services.demoBtn", v)} /></Field>
        </Grid2>
        <div className="space-y-4">
          {data.services.items.map((svc, i) => (
            <ObjectCard key={i} index={i} label="Service" onRemove={() => setData((p) => ({ ...p, services: { ...p.services, items: p.services.items.filter((_, idx) => idx !== i) } }))}>
              <Grid2>
                <Field label="Title"><Input value={svc.title} onChange={(v) => updateService(i, "title", v)} /></Field>
                <Field label="Description"><Input value={svc.desc} onChange={(v) => updateService(i, "desc", v)} /></Field>
              </Grid2>
              <StringList label="Features" items={svc.features} onChange={(v) => updateService(i, "features", v)} />
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, services: { ...p.services, items: [...p.services.items, { icon: "FaGlobe", title: "", desc: "", features: [] }] } }))} label="Add Service" />
        </div>
      </Section>

      <Section title="Delivery Lifecycle">
        <Grid2>
          <Field label="Eyebrow"><Input value={data.lifecycle.eyebrow} onChange={(v) => update("lifecycle.eyebrow", v)} /></Field>
          <Field label="Heading"><Input value={data.lifecycle.heading} onChange={(v) => update("lifecycle.heading", v)} /></Field>
        </Grid2>
        <Field label="Subheading"><Input value={data.lifecycle.subheading} onChange={(v) => update("lifecycle.subheading", v)} /></Field>
        <div className="space-y-3">
          {data.lifecycle.steps.map((step, i) => (
            <ObjectCard key={i} index={i} label="Step" onRemove={() => setData((p) => ({ ...p, lifecycle: { ...p.lifecycle, steps: p.lifecycle.steps.filter((_, idx) => idx !== i) } }))}>
              <Grid2>
                <Field label="Number"><Input value={step.no} onChange={(v) => updateStep(i, "no", v)} /></Field>
                <Field label="Title"><Input value={step.title} onChange={(v) => updateStep(i, "title", v)} /></Field>
              </Grid2>
              <Field label="Description"><Input value={step.desc} onChange={(v) => updateStep(i, "desc", v)} /></Field>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, lifecycle: { ...p.lifecycle, steps: [...p.lifecycle.steps, { no: "0" + (p.lifecycle.steps.length + 1), title: "", desc: "" }] } }))} label="Add Step" />
        </div>
      </Section>

      <Section title="Team Section">
        <Grid2>
          <Field label="Heading"><Input value={data.team.heading} onChange={(v) => update("team.heading", v)} /></Field>
          <Field label="Subheading"><Input value={data.team.subheading} onChange={(v) => update("team.subheading", v)} /></Field>
        </Grid2>
        <Field label="Button"><Input value={data.team.btn} onChange={(v) => update("team.btn", v)} /></Field>
        <div className="space-y-3">
          {data.team.members.map((m, i) => (
            <ObjectCard key={i} index={i} label="Member" onRemove={() => setData((p) => ({ ...p, team: { ...p.team, members: p.team.members.filter((_, idx) => idx !== i) } }))}>
              <Grid2>
                <Field label="Name"><Input value={m.name} onChange={(v) => updateMember(i, "name", v)} /></Field>
                <Field label="Role"><Input value={m.role} onChange={(v) => updateMember(i, "role", v)} /></Field>
              </Grid2>
              <ImageField label="Photo URL" value={m.img} onChange={(v) => updateMember(i, "img", v)} />
              <Field label="Photo Alt Tag"><Input value={m.alt || ""} onChange={(v) => updateMember(i, "alt", v)} placeholder="e.g. Sarah Chen Head of UI/UX Design" /></Field>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, team: { ...p.team, members: [...p.team.members, { name: "", role: "", img: "" }] } }))} label="Add Member" />
        </div>
      </Section>

      <Section title="Success Stories">
        <Grid2>
          <Field label="Heading"><Input value={data.successStories.heading} onChange={(v) => update("successStories.heading", v)} /></Field>
          <Field label="View Button"><Input value={data.successStories.viewBtn} onChange={(v) => update("successStories.viewBtn", v)} /></Field>
        </Grid2>
        <div className="space-y-3">
          {data.successStories.items.map((s, i) => (
            <ObjectCard key={i} index={i} label="Story" onRemove={() => setData((p) => ({ ...p, successStories: { ...p.successStories, items: p.successStories.items.filter((_, idx) => idx !== i) } }))}>
              <Grid2>
                <Field label="Tag"><Input value={s.tag} onChange={(v) => updateStory(i, "tag", v)} /></Field>
                <Field label="Title"><Input value={s.title} onChange={(v) => updateStory(i, "title", v)} /></Field>
              </Grid2>
              <Field label="Metric"><Input value={s.metric} onChange={(v) => updateStory(i, "metric", v)} /></Field>
              <ImageField label="Image URL" value={s.img} onChange={(v) => updateStory(i, "img", v)} />
              <Field label="Image Alt Tag" hint="Describe this success story image for SEO"><Input value={s.alt || ""} onChange={(v) => updateStory(i, "alt", v)} placeholder="e.g. Mobile banking app scaling to 1M users" /></Field>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, successStories: { ...p.successStories, items: [...p.successStories.items, { tag: "", title: "", metric: "", img: "" }] } }))} label="Add Story" />
        </div>
      </Section>

      <Section title="CTA Banner">
        <Grid2>
          <Field label="Heading"><Input value={data.cta.heading} onChange={(v) => update("cta.heading", v)} /></Field>
          <Field label="Subheading"><Input value={data.cta.subheading} onChange={(v) => update("cta.subheading", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Primary Button"><Input value={data.cta.primaryBtn} onChange={(v) => update("cta.primaryBtn", v)} /></Field>
          <Field label="Secondary Button"><Input value={data.cta.secondaryBtn} onChange={(v) => update("cta.secondaryBtn", v)} /></Field>
        </Grid2>
      </Section>
    </div>
  );
}
