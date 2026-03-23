import coursesData from "../../data/coursesData.json";
import { PageHeader, Section, Field, Input, Textarea, Grid2, SeoSection, useSave } from "../AdminComponents";

export default function AdminCourses() {
  const { data, update, save, saved } = useSave("coursesData", coursesData);
  return (
    <div className="w-full space-y-4">
      <PageHeader title="Courses Page" subtitle="Edit hero, search placeholder, buttons and enterprise CTA" onSave={save} saved={saved} />

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
    </div>
  );
}
