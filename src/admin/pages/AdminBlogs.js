import blogsData from "../../data/blogsData.json";
import { PageHeader, Section, Field, Input, Textarea, ImageField, StringList, ObjectCard, AddButton, Grid2, SeoSection, useSave } from "../AdminComponents";

export default function AdminBlogs() {
  const { data, setData, update, save, saved } = useSave("blogsData", blogsData);

  const updatePost = (i, key, val) => {
    const posts = [...data.posts];
    posts[i] = { ...posts[i], [key]: val };
    setData((p) => ({ ...p, posts }));
  };

  const updateCategory = (i, key, val) => {
    const categories = [...data.categories];
    categories[i] = { ...categories[i], [key]: val };
    setData((p) => ({ ...p, categories }));
  };

  return (
    <div className="w-full space-y-4">
      <PageHeader title="Blogs Page" subtitle="Edit hero, categories, tags, sidebar text, CTA and post listings" onSave={save} saved={saved} />

      <SeoSection data={data} update={update} altTagFields={[
        { key: "ctaImg", label: "CTA Banner Image", hint: "e.g. Students learning IT skills at Trivoxa" },
      ]} />

      <Section title="Hero Section">
        <Grid2>
          <Field label="Eyebrow"><Input value={data.hero.eyebrow} onChange={(v) => update("hero.eyebrow", v)} /></Field>
          <Field label="Title"><Input value={data.hero.title} onChange={(v) => update("hero.title", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Highlight Word"><Input value={data.hero.highlight} onChange={(v) => update("hero.highlight", v)} /></Field>
          <Field label="Stats Value"><Input value={data.hero.statsValue} onChange={(v) => update("hero.statsValue", v)} /></Field>
        </Grid2>
        <Field label="Stats Label"><Input value={data.hero.statsLabel} onChange={(v) => update("hero.statsLabel", v)} /></Field>
        <Field label="Paragraph"><Textarea value={data.hero.paragraph} onChange={(v) => update("hero.paragraph", v)} /></Field>
      </Section>

      <Section title="Categories">
        <div className="space-y-3">
          {data.categories.map((cat, i) => (
            <ObjectCard key={i} index={i} label="Category" onRemove={() => setData((p) => ({ ...p, categories: p.categories.filter((_, idx) => idx !== i) }))}>
              <Grid2>
                <Field label="Name"><Input value={cat.name} onChange={(v) => updateCategory(i, "name", v)} /></Field>
                <Field label="Count"><Input value={String(cat.count)} onChange={(v) => updateCategory(i, "count", Number(v))} type="number" /></Field>
              </Grid2>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, categories: [...p.categories, { name: "", count: 0 }] }))} label="Add Category" />
        </div>
      </Section>

      <Section title="Tags">
        <StringList label="Popular Tags" items={data.tags} onChange={(v) => update("tags", v)} placeholder="Tag name..." />
      </Section>

      <Section title="Sidebar Text">
        <Grid2>
          <Field label="Search Placeholder"><Input value={data.sidebar.searchPlaceholder} onChange={(v) => update("sidebar.searchPlaceholder", v)} /></Field>
          <Field label="Search Button"><Input value={data.sidebar.searchBtn} onChange={(v) => update("sidebar.searchBtn", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Newsletter Title"><Input value={data.sidebar.newsletterTitle} onChange={(v) => update("sidebar.newsletterTitle", v)} /></Field>
          <Field label="Subscribe Button"><Input value={data.sidebar.subscribeBtn} onChange={(v) => update("sidebar.subscribeBtn", v)} /></Field>
        </Grid2>
        <Field label="Newsletter Description"><Textarea value={data.sidebar.newsletterDesc} onChange={(v) => update("sidebar.newsletterDesc", v)} rows={2} /></Field>
        <Field label="Privacy Note"><Input value={data.sidebar.subscribePrivacy} onChange={(v) => update("sidebar.subscribePrivacy", v)} /></Field>
        <Grid2>
          <Field label="Careers Title"><Input value={data.sidebar.careersTitle} onChange={(v) => update("sidebar.careersTitle", v)} /></Field>
          <Field label="Careers Button"><Input value={data.sidebar.careersBtn} onChange={(v) => update("sidebar.careersBtn", v)} /></Field>
        </Grid2>
        <Field label="Careers Description"><Input value={data.sidebar.careersDesc} onChange={(v) => update("sidebar.careersDesc", v)} /></Field>
      </Section>

      <Section title="CTA Banner">
        <Grid2>
          <Field label="Heading"><Input value={data.cta.heading} onChange={(v) => update("cta.heading", v)} /></Field>
          <Field label="Primary Button"><Input value={data.cta.primaryBtn} onChange={(v) => update("cta.primaryBtn", v)} /></Field>
        </Grid2>
        <Field label="Paragraph"><Textarea value={data.cta.paragraph} onChange={(v) => update("cta.paragraph", v)} /></Field>
        <Grid2>
          <Field label="Secondary Button"><Input value={data.cta.secondaryBtn} onChange={(v) => update("cta.secondaryBtn", v)} /></Field>
          <ImageField label="CTA Image URL" value={data.cta.img} onChange={(v) => update("cta.img", v)} />
        </Grid2>
      </Section>

      <Section title="Blog Posts" defaultOpen={false}>
        <p className="text-xs text-gray-500 mb-3">These are the post cards shown in the listing. Edit full content in Blog Detail editor.</p>
        <div className="space-y-3">
          {data.posts.map((post, i) => (
            <ObjectCard key={i} index={i} label="Post" onRemove={() => setData((p) => ({ ...p, posts: p.posts.filter((_, idx) => idx !== i) }))}>
              <Grid2>
                <Field label="Tag"><Input value={post.tag} onChange={(v) => updatePost(i, "tag", v)} /></Field>
                <Field label="Read Time"><Input value={post.read} onChange={(v) => updatePost(i, "read", v)} /></Field>
              </Grid2>
              <Field label="Title"><Input value={post.title} onChange={(v) => updatePost(i, "title", v)} /></Field>
              <Field label="Description"><Textarea value={post.desc} onChange={(v) => updatePost(i, "desc", v)} rows={2} /></Field>
              <Grid2>
                <Field label="Author"><Input value={post.author} onChange={(v) => updatePost(i, "author", v)} /></Field>
                <Field label="Date"><Input value={post.date} onChange={(v) => updatePost(i, "date", v)} /></Field>
              </Grid2>
              <ImageField label="Post Image URL" value={post.img} onChange={(v) => updatePost(i, "img", v)} />
              <Field label="Post Image Alt Tag" hint="Describe this post thumbnail for SEO"><Input value={post.alt || ""} onChange={(v) => updatePost(i, "alt", v)} placeholder="e.g. UI/UX design principles illustration" /></Field>
              <ImageField label="Author Avatar URL" value={post.avatar} onChange={(v) => updatePost(i, "avatar", v)} />
              <Field label="Author Avatar Alt Tag"><Input value={post.avatarAlt || ""} onChange={(v) => updatePost(i, "avatarAlt", v)} placeholder="e.g. Marcus Thorne author photo" /></Field>
            </ObjectCard>
          ))}
          <AddButton onClick={() => setData((p) => ({ ...p, posts: [...p.posts, { id: p.posts.length, tag: "", read: "", title: "", desc: "", author: "", date: "", img: "", avatar: "" }] }))} label="Add Post" />
        </div>
      </Section>
    </div>
  );
}
