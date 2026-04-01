import contactData from "../../data/contactData.json";
import { PageHeader, Section, Field, Input, Textarea, ImageField, StringList, ObjectCard, AddButton, Grid2, SeoSection, useSave } from "../AdminComponents";

export default function AdminContact() {
  const { data, setData, update, save, saved, saveError } = useSave("contactData", contactData);

  const updateOffice = (i, key, val) => {
    const items = [...data.offices.items];
    items[i] = { ...items[i], [key]: val };
    setData((p) => ({ ...p, offices: { ...p.offices, items } }));
  };

  const updateSchedule = (i, key, val) => {
    const schedule = [...data.hours.schedule];
    schedule[i] = { ...schedule[i], [key]: val };
    setData((p) => ({ ...p, hours: { ...p.hours, schedule } }));
  };

  const updateOption = (i, key, val) => {
    const interestOptions = [...data.form.interestOptions];
    interestOptions[i] = { ...interestOptions[i], [key]: val };
    setData((p) => ({ ...p, form: { ...p.form, interestOptions } }));
  };

  return (
    <div className="w-full space-y-4">
      <PageHeader title="Contact Page" subtitle="Edit hero, form options, offices, hours, trusted brands and bottom CTA" onSave={save} saved={saved} saveError={saveError} />

      <SeoSection data={data} update={update} altTagFields={[
        { key: "heroImg", label: "Hero Image", hint: "e.g. Trivoxa contact page experts ready to assist" },
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
          <Field label="Experts Text"><Input value={data.hero.expertsText} onChange={(v) => update("hero.expertsText", v)} /></Field>
          <Field label="Experts Subtext"><Input value={data.hero.expertsSubtext} onChange={(v) => update("hero.expertsSubtext", v)} /></Field>
        </Grid2>
        <ImageField label="Hero Image URL" value={data.hero.img} onChange={(v) => update("hero.img", v)} />
      </Section>

      <Section title="Contact Form Labels">
        <Grid2>
          <Field label="Heading"><Input value={data.form.heading} onChange={(v) => update("form.heading", v)} /></Field>
          <Field label="Submit Button"><Input value={data.form.submitBtn} onChange={(v) => update("form.submitBtn", v)} /></Field>
        </Grid2>
        <Field label="Subheading"><Textarea value={data.form.subheading} onChange={(v) => update("form.subheading", v)} rows={2} /></Field>
        <Grid2>
          <Field label="Success Title"><Input value={data.form.successTitle} onChange={(v) => update("form.successTitle", v)} /></Field>
          <Field label="Success Message"><Input value={data.form.successMsg} onChange={(v) => update("form.successMsg", v)} /></Field>
        </Grid2>
        <Field label="Privacy Note"><Input value={data.form.privacyNote} onChange={(v) => update("form.privacyNote", v)} /></Field>
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Interest Dropdown Options</p>
          {data.form.interestOptions.map((opt, i) => (
            <ObjectCard key={i} index={i} label="Option" onRemove={() => setData((p) => ({ ...p, form: { ...p.form, interestOptions: p.form.interestOptions.filter((_, idx) => idx !== i) } }))}>
              <Grid2>
                <Field label="Value (slug)"><Input value={opt.value} onChange={(v) => updateOption(i, "value", v)} /></Field>
                <Field label="Label (display)"><Input value={opt.label} onChange={(v) => updateOption(i, "label", v)} /></Field>
              </Grid2>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, form: { ...p.form, interestOptions: [...p.form.interestOptions, { value: "", label: "" }] } }))} label="Add Option" />
        </div>
      </Section>

      <Section title="Direct Access">
        <Field label="Section Label"><Input value={data.directAccess.label} onChange={(v) => update("directAccess.label", v)} /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase">Sales</p>
            <Field label="Title"><Input value={data.directAccess.sales.title} onChange={(v) => update("directAccess.sales.title", v)} /></Field>
            <Field label="Description"><Input value={data.directAccess.sales.desc} onChange={(v) => update("directAccess.sales.desc", v)} /></Field>
            <Field label="Email"><Input value={data.directAccess.sales.email} onChange={(v) => update("directAccess.sales.email", v)} type="email" /></Field>
          </div>
          <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase">Support</p>
            <Field label="Title"><Input value={data.directAccess.support.title} onChange={(v) => update("directAccess.support.title", v)} /></Field>
            <Field label="Description"><Input value={data.directAccess.support.desc} onChange={(v) => update("directAccess.support.desc", v)} /></Field>
            <Field label="Phone"><Input value={data.directAccess.support.phone} onChange={(v) => update("directAccess.support.phone", v)} /></Field>
          </div>
        </div>
      </Section>

      <Section title="Global Offices">
        <Field label="Section Label"><Input value={data.offices.label} onChange={(v) => update("offices.label", v)} /></Field>
        <div className="space-y-3">
          {data.offices.items.map((office, i) => (
            <ObjectCard key={i} index={i} label="Office" onRemove={() => setData((p) => ({ ...p, offices: { ...p.offices, items: p.offices.items.filter((_, idx) => idx !== i) } }))}>
              <Grid2>
                <Field label="City"><Input value={office.city} onChange={(v) => updateOffice(i, "city", v)} /></Field>
                <Field label="Phone"><Input value={office.phone} onChange={(v) => updateOffice(i, "phone", v)} /></Field>
              </Grid2>
              <Field label="Address"><Input value={office.address} onChange={(v) => updateOffice(i, "address", v)} /></Field>
              <ImageField label="Office Image URL" value={office.img} onChange={(v) => updateOffice(i, "img", v)} />
              <Field label="Office Image Alt Tag"><Input value={office.alt || ""} onChange={(v) => updateOffice(i, "alt", v)} placeholder="e.g. Trivoxa Silicon Valley office building" /></Field>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, offices: { ...p.offices, items: [...p.offices.items, { city: "", address: "", phone: "", img: "" }] } }))} label="Add Office" />
        </div>
      </Section>

      <Section title="Business Hours">
        <Field label="Section Title"><Input value={data.hours.title} onChange={(v) => update("hours.title", v)} /></Field>
        <div className="space-y-3">
          {data.hours.schedule.map((row, i) => (
            <ObjectCard key={i} index={i} label="Hours Row" onRemove={() => setData((p) => ({ ...p, hours: { ...p.hours, schedule: p.hours.schedule.filter((_, idx) => idx !== i) } }))}>
              <Grid2>
                <Field label="Day"><Input value={row.day} onChange={(v) => updateSchedule(i, "day", v)} /></Field>
                <Field label="Time"><Input value={row.time} onChange={(v) => updateSchedule(i, "time", v)} /></Field>
              </Grid2>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, hours: { ...p.hours, schedule: [...p.hours.schedule, { day: "", time: "" }] } }))} label="Add Row" />
        </div>
      </Section>

      <Section title="Trusted Brands">
        <Field label="Label"><Input value={data.trusted.label} onChange={(v) => update("trusted.label", v)} /></Field>
        <StringList label="Brand Names" items={data.trusted.brands} onChange={(v) => update("trusted.brands", v)} placeholder="Brand name..." />
      </Section>

      <Section title="Bottom CTA">
        <Grid2>
          <Field label="Heading"><Input value={data.bottomCta.heading} onChange={(v) => update("bottomCta.heading", v)} /></Field>
          <Field label="Subheading"><Input value={data.bottomCta.subheading} onChange={(v) => update("bottomCta.subheading", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Primary Button"><Input value={data.bottomCta.primaryBtn} onChange={(v) => update("bottomCta.primaryBtn", v)} /></Field>
          <Field label="Secondary Button"><Input value={data.bottomCta.secondaryBtn} onChange={(v) => update("bottomCta.secondaryBtn", v)} /></Field>
        </Grid2>
      </Section>
    </div>
  );
}
