import courseDetailsData from "../../data/courseDetailsData.json";
import { PageHeader, Section, Field, Input, ImageField, StringList, Grid2, SeoSection, useSave } from "../AdminComponents";

export default function AdminCourseDetails() {
  const { data, update, save, saved, saveError } = useSave("courseDetailsData", courseDetailsData);
  return (
    <div className="w-full space-y-4">
      <PageHeader title="Course Details Page" subtitle="Edit enrollment labels, syllabus, certificate, career, FAQ and CTA text" onSave={save} saved={saved} saveError={saveError} />

      <SeoSection data={data} update={update} altTagFields={[
        { key: "certificateImg", label: "Certificate Image", hint: "e.g. Trivoxa professional course completion certificate" },
      ]} />

      <Section title="Hero Labels">
        <Grid2>
          <Field label="Enroll Button"><Input value={data.hero.enrollBtn} onChange={(v) => update("hero.enrollBtn", v)} /></Field>
          <Field label="Demo Button"><Input value={data.hero.demoBtn} onChange={(v) => update("hero.demoBtn", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Badge Text"><Input value={data.hero.badge} onChange={(v) => update("hero.badge", v)} /></Field>
          <Field label="Reviews Label"><Input value={data.hero.reviewsLabel} onChange={(v) => update("hero.reviewsLabel", v)} /></Field>
        </Grid2>
      </Section>

      <Section title="Why This Course">
        <Grid2>
          <Field label="Heading"><Input value={data.whyCourse.heading} onChange={(v) => update("whyCourse.heading", v)} /></Field>
          <Field label="Subheading"><Input value={data.whyCourse.subheading} onChange={(v) => update("whyCourse.subheading", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Syllabus Heading"><Input value={data.whyCourse.syllabusHeading} onChange={(v) => update("whyCourse.syllabusHeading", v)} /></Field>
          <Field label="Syllabus Placeholder"><Input value={data.whyCourse.syllabusPlaceholder} onChange={(v) => update("whyCourse.syllabusPlaceholder", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Early Bird Label"><Input value={data.whyCourse.earlyBirdLabel} onChange={(v) => update("whyCourse.earlyBirdLabel", v)} /></Field>
          <Field label="EMI Label"><Input value={data.whyCourse.emiLabel} onChange={(v) => update("whyCourse.emiLabel", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Enroll Button"><Input value={data.whyCourse.enrollBtn} onChange={(v) => update("whyCourse.enrollBtn", v)} /></Field>
          <Field label="Demo Button"><Input value={data.whyCourse.demoBtn} onChange={(v) => update("whyCourse.demoBtn", v)} /></Field>
        </Grid2>
      </Section>

      <Section title="Tools Section">
        <Field label="Heading"><Input value={data.tools.heading} onChange={(v) => update("tools.heading", v)} /></Field>
      </Section>

      <Section title="Certificate Section">
        <Grid2>
          <Field label="Heading"><Input value={data.certificate.heading} onChange={(v) => update("certificate.heading", v)} /></Field>
          <Field label="Paragraph"><Input value={data.certificate.paragraph} onChange={(v) => update("certificate.paragraph", v)} /></Field>
        </Grid2>
        <StringList label="Certificate Points" items={data.certificate.points} onChange={(v) => update("certificate.points", v)} />
        <ImageField label="Certificate Image URL" value={data.certificate.img} onChange={(v) => update("certificate.img", v)} />
      </Section>

      <Section title="Career Section">
        <Grid2>
          <Field label="Heading"><Input value={data.career.heading} onChange={(v) => update("career.heading", v)} /></Field>
          <Field label="Subheading"><Input value={data.career.subheading} onChange={(v) => update("career.subheading", v)} /></Field>
        </Grid2>
      </Section>

      <Section title="Testimonials">
        <Field label="Heading"><Input value={data.testimonials.heading} onChange={(v) => update("testimonials.heading", v)} /></Field>
      </Section>

      <Section title="FAQ">
        <Field label="Heading"><Input value={data.faq.heading} onChange={(v) => update("faq.heading", v)} /></Field>
      </Section>

      <Section title="Related Courses">
        <Grid2>
          <Field label="Heading"><Input value={data.related.heading} onChange={(v) => update("related.heading", v)} /></Field>
          <Field label="View Button"><Input value={data.related.viewBtn} onChange={(v) => update("related.viewBtn", v)} /></Field>
        </Grid2>
      </Section>

      <Section title="CTA Banner">
        <Grid2>
          <Field label="Heading"><Input value={data.cta.heading} onChange={(v) => update("cta.heading", v)} /></Field>
          <Field label="Button"><Input value={data.cta.btn} onChange={(v) => update("cta.btn", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Subtext"><Input value={data.cta.subtext} onChange={(v) => update("cta.subtext", v)} /></Field>
          <Field label="Urgency Text"><Input value={data.cta.urgency} onChange={(v) => update("cta.urgency", v)} /></Field>
        </Grid2>
      </Section>

      <Section title="Not Found State">
        <Grid2>
          <Field label="Heading"><Input value={data.notFound.heading} onChange={(v) => update("notFound.heading", v)} /></Field>
          <Field label="Back Button"><Input value={data.notFound.backBtn} onChange={(v) => update("notFound.backBtn", v)} /></Field>
        </Grid2>
      </Section>
    </div>
  );
}
