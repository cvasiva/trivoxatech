import homeData from "../../data/homeData.json";
import { PageHeader, Section, Field, Input, Textarea, ImageField, StringList, ObjectCard, AddButton, Grid2, SeoSection, useSave } from "../AdminComponents";

const INFO_ICONS = ["FaGraduationCap", "FaLaptopCode", "FaUsers", "FaBriefcase", "FaStar", "FaGrad"];
const STAT_ICONS = ["FaUsers", "FaBriefcase", "FaGraduationCap", "FaStar"];

export default function AdminHome() {
  const { data, setData, update, save, saved } = useSave("homeData", homeData);

  const updateItem = (section, index, key, val) => {
    const items = [...data[section].items];
    items[index] = { ...items[index], [key]: val };
    setData((p) => ({ ...p, [section]: { ...p[section], items } }));
  };

  const removeItem = (section, index) => {
    const items = data[section].items.filter((_, idx) => idx !== index);
    setData((p) => ({ ...p, [section]: { ...p[section], items } }));
  };

  return (
    <div className="w-full space-y-4">
      <PageHeader title="Home Page" subtitle="Edit all sections: hero, trusted, courses, info, stats, testimonials, success stories, CTA, blog" onSave={save} saved={saved} />

      <SeoSection data={data} update={update} altTagFields={[
        { key: "heroImg", label: "Hero Image", hint: "e.g. Trivoxa IT training hero banner" },
        { key: "successStory1", label: "Success Story 1 Image", hint: "Describe the first success story image" },
        { key: "successStory2", label: "Success Story 2 Image", hint: "Describe the second success story image" },
        { key: "blog1", label: "Blog Article 1 Thumbnail", hint: "Describe the first blog thumbnail" },
        { key: "blog2", label: "Blog Article 2 Thumbnail", hint: "Describe the second blog thumbnail" },
        { key: "blog3", label: "Blog Article 3 Thumbnail", hint: "Describe the third blog thumbnail" },
      ]} />

      {/* HERO */}
      <Section title="Hero Section">
        <Grid2>
          <Field label="Eyebrow Badge"><Input value={data.hero.eyebrow} onChange={(v) => update("hero.eyebrow", v)} /></Field>
          <Field label="Title"><Input value={data.hero.title} onChange={(v) => update("hero.title", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Highlight Word"><Input value={data.hero.highlight} onChange={(v) => update("hero.highlight", v)} /></Field>
          <Field label="Stats Text"><Input value={data.hero.statsText} onChange={(v) => update("hero.statsText", v)} /></Field>
        </Grid2>
        <Field label="Subtitle"><Textarea value={data.hero.subtitle} onChange={(v) => update("hero.subtitle", v)} /></Field>
        <Grid2>
          <Field label="Primary Button"><Input value={data.hero.primaryBtn} onChange={(v) => update("hero.primaryBtn", v)} /></Field>
          <Field label="Secondary Button"><Input value={data.hero.secondaryBtn} onChange={(v) => update("hero.secondaryBtn", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Badge Value"><Input value={data.hero.badge.value} onChange={(v) => update("hero.badge.value", v)} /></Field>
          <Field label="Badge Label"><Input value={data.hero.badge.label} onChange={(v) => update("hero.badge.label", v)} /></Field>
        </Grid2>
        <ImageField label="Hero Image URL" value={data.hero.img || ""} onChange={(v) => update("hero.img", v)} hint="Main hero section background/side image" />
      </Section>

      {/* TRUSTED */}
      <Section title="Trusted Section">
        <Field label="Label"><Input value={data.trusted.label} onChange={(v) => update("trusted.label", v)} /></Field>
      </Section>

      {/* COURSES */}
      <Section title="Courses Section">
        <Grid2>
          <Field label="Heading"><Input value={data.courses.heading} onChange={(v) => update("courses.heading", v)} /></Field>
          <Field label="Subheading"><Input value={data.courses.subheading} onChange={(v) => update("courses.subheading", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="View All Button"><Input value={data.courses.viewAllBtn} onChange={(v) => update("courses.viewAllBtn", v)} /></Field>
          <Field label="Enroll Button"><Input value={data.courses.enrollBtn} onChange={(v) => update("courses.enrollBtn", v)} /></Field>
        </Grid2>
        <Field label="Syllabus Button"><Input value={data.courses.syllabusBtn} onChange={(v) => update("courses.syllabusBtn", v)} /></Field>
        <div className="space-y-3">
          {data.courses.items.map((c, i) => (
            <ObjectCard key={i} index={i} label="Course" onRemove={() => removeItem("courses", i)}>
              <Grid2>
                <Field label="Title"><Input value={c.title} onChange={(v) => updateItem("courses", i, "title", v)} /></Field>
                <Field label="Subtitle"><Input value={c.subtitle} onChange={(v) => updateItem("courses", i, "subtitle", v)} /></Field>
              </Grid2>
              <ImageField label="Image URL" value={c.img} onChange={(v) => updateItem("courses", i, "img", v)} hint="Paste a full image URL" />
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, courses: { ...p.courses, items: [...p.courses.items, { id: Date.now(), title: "", subtitle: "", img: "" }] } }))} label="Add Course" />
        </div>
      </Section>

      {/* INFO */}
      <Section title="Info Section">
        <Grid2>
          <Field label="Eyebrow"><Input value={data.info.eyebrow} onChange={(v) => update("info.eyebrow", v)} /></Field>
          <Field label="Heading"><Input value={data.info.heading} onChange={(v) => update("info.heading", v)} /></Field>
        </Grid2>
        <Field label="Paragraph"><Textarea value={data.info.paragraph} onChange={(v) => update("info.paragraph", v)} /></Field>
        <Field label="Button"><Input value={data.info.btn} onChange={(v) => update("info.btn", v)} /></Field>
        <Grid2>
          <ImageField label="Image 1 URL" value={data.info.img1 || ""} onChange={(v) => update("info.img1", v)} hint="Left column top image" />
          <ImageField label="Image 2 URL" value={data.info.img2 || ""} onChange={(v) => update("info.img2", v)} hint="Right column bottom image" />
        </Grid2>
        <div className="space-y-3">
          {data.info.features.map((f, i) => (
            <ObjectCard key={i} index={i} label="Feature" onRemove={() => {
              const features = data.info.features.filter((_, idx) => idx !== i);
              setData((p) => ({ ...p, info: { ...p.info, features } }));
            }}>
              <Grid2>
                <Field label="Title"><Input value={f.title} onChange={(v) => { const features = [...data.info.features]; features[i] = { ...features[i], title: v }; setData((p) => ({ ...p, info: { ...p.info, features } })); }} /></Field>
                <Field label="Description"><Input value={f.desc} onChange={(v) => { const features = [...data.info.features]; features[i] = { ...features[i], desc: v }; setData((p) => ({ ...p, info: { ...p.info, features } })); }} /></Field>
              </Grid2>
              <Field label="Icon">
                <select value={f.icon} onChange={(e) => { const features = [...data.info.features]; features[i] = { ...features[i], icon: e.target.value }; setData((p) => ({ ...p, info: { ...p.info, features } })); }} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                  {INFO_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </Field>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, info: { ...p.info, features: [...p.info.features, { icon: "FaUsers", title: "", desc: "" }] } }))} label="Add Feature" />
        </div>
      </Section>

      {/* STATS */}
      <Section title="Stats Section">
        <div className="space-y-3">
          {data.stats.map((s, i) => (
            <ObjectCard key={i} index={i} label="Stat" onRemove={() => setData((p) => ({ ...p, stats: p.stats.filter((_, idx) => idx !== i) }))}>
              <Grid2>
                <Field label="Value"><Input value={s.value} onChange={(v) => { const stats = [...data.stats]; stats[i] = { ...stats[i], value: v }; setData((p) => ({ ...p, stats })); }} /></Field>
                <Field label="Label"><Input value={s.label} onChange={(v) => { const stats = [...data.stats]; stats[i] = { ...stats[i], label: v }; setData((p) => ({ ...p, stats })); }} /></Field>
              </Grid2>
              <Field label="Icon">
                <select value={s.icon} onChange={(e) => { const stats = [...data.stats]; stats[i] = { ...stats[i], icon: e.target.value }; setData((p) => ({ ...p, stats })); }} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                  {STAT_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </Field>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, stats: [...p.stats, { icon: "FaUsers", value: "", label: "" }] }))} label="Add Stat" />
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section title="Testimonials Section">
        <Grid2>
          <Field label="Heading"><Input value={data.testimonials.heading} onChange={(v) => update("testimonials.heading", v)} /></Field>
          <Field label="Subheading"><Input value={data.testimonials.subheading} onChange={(v) => update("testimonials.subheading", v)} /></Field>
        </Grid2>
        <div className="space-y-3">
          {data.testimonials.items.map((t, i) => (
            <ObjectCard key={i} index={i} label="Testimonial" onRemove={() => removeItem("testimonials", i)}>
              <Field label="Quote"><Textarea value={t.text} onChange={(v) => { const items = [...data.testimonials.items]; items[i] = { ...items[i], text: v }; setData((p) => ({ ...p, testimonials: { ...p.testimonials, items } })); }} /></Field>
              <Grid2>
                <Field label="Name"><Input value={t.name} onChange={(v) => { const items = [...data.testimonials.items]; items[i] = { ...items[i], name: v }; setData((p) => ({ ...p, testimonials: { ...p.testimonials, items } })); }} /></Field>
                <Field label="Role"><Input value={t.role} onChange={(v) => { const items = [...data.testimonials.items]; items[i] = { ...items[i], role: v }; setData((p) => ({ ...p, testimonials: { ...p.testimonials, items } })); }} /></Field>
              </Grid2>
              <ImageField label="Avatar URL" value={t.img} onChange={(v) => { const items = [...data.testimonials.items]; items[i] = { ...items[i], img: v }; setData((p) => ({ ...p, testimonials: { ...p.testimonials, items } })); }} />
              <Field label="Avatar Alt Tag" hint="Describe this person for screen readers"><Input value={t.alt || ""} onChange={(v) => { const items = [...data.testimonials.items]; items[i] = { ...items[i], alt: v }; setData((p) => ({ ...p, testimonials: { ...p.testimonials, items } })); }} placeholder="e.g. Sarah Jenkins Software Engineer at Google" /></Field>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, testimonials: { ...p.testimonials, items: [...p.testimonials.items, { text: "", name: "", role: "", img: "" }] } }))} label="Add Testimonial" />
        </div>
      </Section>

      {/* SUCCESS STORIES */}
      <Section title="Success Stories Section">
        <Grid2>
          <Field label="Heading"><Input value={data.successStories.heading} onChange={(v) => update("successStories.heading", v)} /></Field>
          <Field label="View Button"><Input value={data.successStories.viewBtn} onChange={(v) => update("successStories.viewBtn", v)} /></Field>
        </Grid2>
        <Field label="Subheading"><Textarea value={data.successStories.subheading} onChange={(v) => update("successStories.subheading", v)} /></Field>
        <div className="space-y-3">
          {data.successStories.items.map((s, i) => (
            <ObjectCard key={i} index={i} label="Story" onRemove={() => removeItem("successStories", i)}>
              <Grid2>
                <Field label="Tag"><Input value={s.tag} onChange={(v) => { const items = [...data.successStories.items]; items[i] = { ...items[i], tag: v }; setData((p) => ({ ...p, successStories: { ...p.successStories, items } })); }} /></Field>
                <Field label="Title"><Input value={s.title} onChange={(v) => { const items = [...data.successStories.items]; items[i] = { ...items[i], title: v }; setData((p) => ({ ...p, successStories: { ...p.successStories, items } })); }} /></Field>
              </Grid2>
              <Field label="Description"><Textarea value={s.desc} onChange={(v) => { const items = [...data.successStories.items]; items[i] = { ...items[i], desc: v }; setData((p) => ({ ...p, successStories: { ...p.successStories, items } })); }} /></Field>
              <ImageField label="Image URL" value={s.img} onChange={(v) => { const items = [...data.successStories.items]; items[i] = { ...items[i], img: v }; setData((p) => ({ ...p, successStories: { ...p.successStories, items } })); }} />
              <Field label="Image Alt Tag" hint="Describe this project image for SEO"><Input value={s.alt || ""} onChange={(v) => { const items = [...data.successStories.items]; items[i] = { ...items[i], alt: v }; setData((p) => ({ ...p, successStories: { ...p.successStories, items } })); }} placeholder="e.g. Quantico Data Analytics dashboard" /></Field>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, successStories: { ...p.successStories, items: [...p.successStories.items, { tag: "", title: "", desc: "", img: "" }] } }))} label="Add Story" />
        </div>
      </Section>

      {/* CTA */}
      <Section title="CTA / Demo Booking Section">
        <Grid2>
          <Field label="Heading"><Input value={data.cta.heading} onChange={(v) => update("cta.heading", v)} /></Field>
          <Field label="Heading Highlight"><Input value={data.cta.headingHighlight} onChange={(v) => update("cta.headingHighlight", v)} /></Field>
        </Grid2>
        <Field label="Paragraph"><Textarea value={data.cta.paragraph} onChange={(v) => update("cta.paragraph", v)} /></Field>
        <Grid2>
          <Field label="Form Title"><Input value={data.cta.formTitle} onChange={(v) => update("cta.formTitle", v)} /></Field>
          <Field label="Form Subtitle"><Input value={data.cta.formSubtitle} onChange={(v) => update("cta.formSubtitle", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Submit Button"><Input value={data.cta.submitBtn} onChange={(v) => update("cta.submitBtn", v)} /></Field>
          <Field label="Privacy Note"><Input value={data.cta.privacyNote} onChange={(v) => update("cta.privacyNote", v)} /></Field>
        </Grid2>
        <StringList label="Bullet Points" items={data.cta.bullets} onChange={(v) => update("cta.bullets", v)} />
        <StringList label="Course Options (dropdown)" items={data.cta.courseOptions} onChange={(v) => update("cta.courseOptions", v)} />
      </Section>

      {/* BLOG */}
      <Section title="Blog Section">
        <Grid2>
          <Field label="Heading"><Input value={data.blog.heading} onChange={(v) => update("blog.heading", v)} /></Field>
          <Field label="View All Button"><Input value={data.blog.viewBtn} onChange={(v) => update("blog.viewBtn", v)} /></Field>
        </Grid2>
        <Field label="Subheading"><Textarea value={data.blog.subheading} onChange={(v) => update("blog.subheading", v)} /></Field>
        <div className="space-y-3">
          {data.blog.items.map((b, i) => (
            <ObjectCard key={i} index={i} label="Article" onRemove={() => {
              const items = data.blog.items.filter((_, idx) => idx !== i);
              setData((p) => ({ ...p, blog: { ...p.blog, items } }));
            }}>
              <Grid2>
                <Field label="Date"><Input value={b.date} onChange={(v) => { const items = [...data.blog.items]; items[i] = { ...items[i], date: v }; setData((p) => ({ ...p, blog: { ...p.blog, items } })); }} /></Field>
                <Field label="Title"><Input value={b.title} onChange={(v) => { const items = [...data.blog.items]; items[i] = { ...items[i], title: v }; setData((p) => ({ ...p, blog: { ...p.blog, items } })); }} /></Field>
              </Grid2>
              <Field label="Description"><Textarea value={b.desc} onChange={(v) => { const items = [...data.blog.items]; items[i] = { ...items[i], desc: v }; setData((p) => ({ ...p, blog: { ...p.blog, items } })); }} /></Field>
              <ImageField label="Image URL" value={b.img} onChange={(v) => { const items = [...data.blog.items]; items[i] = { ...items[i], img: v }; setData((p) => ({ ...p, blog: { ...p.blog, items } })); }} />
              <Field label="Image Alt Tag" hint="Describe this article thumbnail for SEO"><Input value={b.alt || ""} onChange={(v) => { const items = [...data.blog.items]; items[i] = { ...items[i], alt: v }; setData((p) => ({ ...p, blog: { ...p.blog, items } })); }} placeholder="e.g. AI in modern web frameworks illustration" /></Field>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, blog: { ...p.blog, items: [...p.blog.items, { date: "", title: "", desc: "", img: "" }] } }))} label="Add Article" />
        </div>
      </Section>
    </div>
  );
}
