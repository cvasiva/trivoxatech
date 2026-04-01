import aboutData from "../../data/aboutData.json";
import { PageHeader, Section, Field, Input, Textarea, ImageField, ObjectCard, AddButton, Grid2, SeoSection, useSave } from "../AdminComponents";

export default function AdminAbout() {
  const { data, setData, update, save, saved, saveError } = useSave("aboutData", aboutData);

  return (
    <div className="w-full space-y-4">
      <PageHeader title="About Page" subtitle="Edit mission, stats, journey, team and recognized brands" onSave={save} saved={saved} saveError={saveError} />

      <SeoSection data={data} update={update} altTagFields={[
        { key: "heroImg", label: "Hero Image", hint: "e.g. Trivoxa team collaboration photo" },
        { key: "milestone1", label: "Milestone 1 Image", hint: "Describe the first journey milestone image" },
        { key: "milestone2", label: "Milestone 2 Image", hint: "Describe the second journey milestone image" },
      ]} />

      {/* HERO */}
      <Section title="Hero Section">
        <Grid2>
          <Field label="Eyebrow"><Input value={data.hero.eyebrow} onChange={(v) => update("hero.eyebrow", v)} /></Field>
          <Field label="Title"><Input value={data.hero.title} onChange={(v) => update("hero.title", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Highlight 1 (Indigo)"><Input value={data.hero.highlight1} onChange={(v) => update("hero.highlight1", v)} /></Field>
          <Field label="Highlight 2 (Cyan)"><Input value={data.hero.highlight2} onChange={(v) => update("hero.highlight2", v)} /></Field>
        </Grid2>
        <Field label="Paragraph"><Textarea value={data.hero.paragraph} onChange={(v) => update("hero.paragraph", v)} /></Field>
        <Grid2>
          <Field label="Primary Button"><Input value={data.hero.primaryBtn} onChange={(v) => update("hero.primaryBtn", v)} /></Field>
          <Field label="Secondary Button"><Input value={data.hero.secondaryBtn} onChange={(v) => update("hero.secondaryBtn", v)} /></Field>
        </Grid2>
        <ImageField label="Hero Image URL" value={data.hero.img} onChange={(v) => update("hero.img", v)} />
      </Section>

      {/* STATS */}
      <Section title="Stats Cards">
        <div className="space-y-3">
          {data.stats.map((s, i) => (
            <ObjectCard key={i} index={i} label="Stat" onRemove={() => setData((p) => ({ ...p, stats: p.stats.filter((_, idx) => idx !== i) }))}>
              <Grid2>
                <Field label="Value"><Input value={s.value} onChange={(v) => { const stats = [...data.stats]; stats[i] = { ...stats[i], value: v }; setData((p) => ({ ...p, stats })); }} /></Field>
                <Field label="Label"><Input value={s.label} onChange={(v) => { const stats = [...data.stats]; stats[i] = { ...stats[i], label: v }; setData((p) => ({ ...p, stats })); }} /></Field>
              </Grid2>
              <Field label="Icon">
                <select value={s.icon} onChange={(e) => { const stats = [...data.stats]; stats[i] = { ...stats[i], icon: e.target.value }; setData((p) => ({ ...p, stats })); }} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                  {["FaUsers","FaGlobe","FaChartLine","FaAward"].map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </Field>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, stats: [...p.stats, { icon: "FaUsers", value: "", label: "" }] }))} label="Add Stat" />
        </div>
      </Section>

      {/* JOURNEY */}
      <Section title="Journey Section">
        <Field label="Section Heading"><Input value={data.journey.heading} onChange={(v) => update("journey.heading", v)} /></Field>
        <div className="space-y-4">
          {data.journey.milestones.map((m, i) => (
            <ObjectCard key={i} index={i} label="Milestone" onRemove={() => {
              const milestones = data.journey.milestones.filter((_, idx) => idx !== i);
              setData((p) => ({ ...p, journey: { ...p.journey, milestones } }));
            }}>
              <Field label="Year / Title"><Input value={m.year} onChange={(v) => { const milestones = [...data.journey.milestones]; milestones[i] = { ...milestones[i], year: v }; setData((p) => ({ ...p, journey: { ...p.journey, milestones } })); }} /></Field>
              <Field label="Paragraph"><Textarea value={m.paragraph} onChange={(v) => { const milestones = [...data.journey.milestones]; milestones[i] = { ...milestones[i], paragraph: v }; setData((p) => ({ ...p, journey: { ...p.journey, milestones } })); }} /></Field>
              <ImageField label="Image URL" value={m.img} onChange={(v) => { const milestones = [...data.journey.milestones]; milestones[i] = { ...milestones[i], img: v }; setData((p) => ({ ...p, journey: { ...p.journey, milestones } })); }} />
              <Field label="Image Alt Tag" hint="Describe this milestone image for SEO"><Input value={m.alt || ""} onChange={(v) => { const milestones = [...data.journey.milestones]; milestones[i] = { ...milestones[i], alt: v }; setData((p) => ({ ...p, journey: { ...p.journey, milestones } })); }} placeholder="e.g. Trivoxa founding team 2018" /></Field>
              <Field label="Bullet Points (one per line)" hint="Each line becomes a bullet">
                <textarea
                  value={m.bullets.join("\n")}
                  onChange={(e) => { const milestones = [...data.journey.milestones]; milestones[i] = { ...milestones[i], bullets: e.target.value.split("\n") }; setData((p) => ({ ...p, journey: { ...p.journey, milestones } })); }}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none bg-gray-50 focus:bg-white"
                />
              </Field>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, journey: { ...p.journey, milestones: [...p.journey.milestones, { year: "", paragraph: "", bullets: [], img: "" }] } }))} label="Add Milestone" />
        </div>
      </Section>

      {/* TEAM */}
      <Section title="Team Members">
        <Grid2>
          <Field label="Section Heading"><Input value={data.team.heading} onChange={(v) => update("team.heading", v)} /></Field>
          <Field label="Subheading"><Input value={data.team.subheading} onChange={(v) => update("team.subheading", v)} /></Field>
        </Grid2>
        <div className="space-y-3">
          {data.team.members.map((m, i) => (
            <ObjectCard key={i} index={i} label="Member" onRemove={() => {
              const members = data.team.members.filter((_, idx) => idx !== i);
              setData((p) => ({ ...p, team: { ...p.team, members } }));
            }}>
              <Grid2>
                <Field label="Name"><Input value={m.name} onChange={(v) => { const members = [...data.team.members]; members[i] = { ...members[i], name: v }; setData((p) => ({ ...p, team: { ...p.team, members } })); }} /></Field>
                <Field label="Role"><Input value={m.role} onChange={(v) => { const members = [...data.team.members]; members[i] = { ...members[i], role: v }; setData((p) => ({ ...p, team: { ...p.team, members } })); }} /></Field>
              </Grid2>
              <Field label="Bio"><Textarea value={m.bio} onChange={(v) => { const members = [...data.team.members]; members[i] = { ...members[i], bio: v }; setData((p) => ({ ...p, team: { ...p.team, members } })); }} rows={2} /></Field>
              <ImageField label="Photo URL" value={m.img} onChange={(v) => { const members = [...data.team.members]; members[i] = { ...members[i], img: v }; setData((p) => ({ ...p, team: { ...p.team, members } })); }} />
              <Field label="Photo Alt Tag" hint="Describe this team member photo"><Input value={m.alt || ""} onChange={(v) => { const members = [...data.team.members]; members[i] = { ...members[i], alt: v }; setData((p) => ({ ...p, team: { ...p.team, members } })); }} placeholder="e.g. Dr. Sarah Jenkins Founder and CEO of Trivoxa" /></Field>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, team: { ...p.team, members: [...p.team.members, { name: "", role: "", bio: "", img: "" }] } }))} label="Add Member" />
        </div>
      </Section>

      {/* RECOGNIZED */}
      <Section title="Recognized By">
        <Field label="Label"><Input value={data.recognized.label} onChange={(v) => update("recognized.label", v)} /></Field>
        <div className="space-y-3">
          {data.recognized.logos.map((logo, i) => (
            <ObjectCard key={i} index={i} label="Logo" onRemove={() => {
              const logos = data.recognized.logos.filter((_, idx) => idx !== i);
              setData((p) => ({ ...p, recognized: { ...p.recognized, logos } }));
            }}>
              <Grid2>
                <Field label="Name"><Input value={logo.name} onChange={(v) => { const logos = [...data.recognized.logos]; logos[i] = { ...logos[i], name: v }; setData((p) => ({ ...p, recognized: { ...p.recognized, logos } })); }} /></Field>
                <Field label="SVG URL"><Input value={logo.src} onChange={(v) => { const logos = [...data.recognized.logos]; logos[i] = { ...logos[i], src: v }; setData((p) => ({ ...p, recognized: { ...p.recognized, logos } })); }} /></Field>
              </Grid2>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, recognized: { ...p.recognized, logos: [...p.recognized.logos, { name: "", src: "" }] } }))} label="Add Logo" />
        </div>
      </Section>

      {/* CTA */}
      <Section title="CTA Section">
        <Grid2>
          <Field label="Badge"><Input value={data.cta.badge} onChange={(v) => update("cta.badge", v)} /></Field>
          <Field label="Heading"><Input value={data.cta.heading} onChange={(v) => update("cta.heading", v)} /></Field>
        </Grid2>
        <Field label="Paragraph"><Textarea value={data.cta.paragraph} onChange={(v) => update("cta.paragraph", v)} /></Field>
        <Grid2>
          <Field label="Primary Button"><Input value={data.cta.primaryBtn} onChange={(v) => update("cta.primaryBtn", v)} /></Field>
          <Field label="Secondary Button"><Input value={data.cta.secondaryBtn} onChange={(v) => update("cta.secondaryBtn", v)} /></Field>
        </Grid2>
      </Section>
    </div>
  );
}
