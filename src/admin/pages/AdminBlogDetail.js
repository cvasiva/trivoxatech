import blogDetailData from "../../data/blogDetailData.json";
import { PageHeader, Section, Field, Input, Textarea, ImageField, ObjectCard, AddButton, Grid2, SeoSection, useSave } from "../AdminComponents";

export default function AdminBlogDetail() {
  const { data, setData, update, save, saved, saveError } = useSave("blogDetailData", blogDetailData);

  const updatePost = (i, key, val) => {
    const posts = [...data.posts];
    posts[i] = { ...posts[i], [key]: val };
    setData((p) => ({ ...p, posts }));
  };

  return (
    <div className="w-full space-y-4">
      <PageHeader title="Blog Detail Page" subtitle="Edit individual blog posts — title, content, author, images" onSave={save} saved={saved} saveError={saveError} />

      <SeoSection data={data} update={update} altTagFields={[]} />

      <Section title="Page Labels">
        <Grid2>
          <Field label="Author Label"><Input value={data.authorLabel} onChange={(v) => update("authorLabel", v)} /></Field>
          <Field label="Related Articles Heading"><Input value={data.relatedHeading} onChange={(v) => update("relatedHeading", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Not Found Heading"><Input value={data.notFound.heading} onChange={(v) => update("notFound.heading", v)} /></Field>
          <Field label="Not Found Back Button"><Input value={data.notFound.backBtn} onChange={(v) => update("notFound.backBtn", v)} /></Field>
        </Grid2>
      </Section>

      <Section title="Blog Posts" defaultOpen={true}>
        <div className="space-y-4">
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
              <Field label="Post Image Alt Tag" hint="Describe this post image for SEO & accessibility"><Input value={post.alt || ""} onChange={(v) => updatePost(i, "alt", v)} placeholder="e.g. UI/UX design principles article cover" /></Field>
              <ImageField label="Author Avatar URL" value={post.avatar} onChange={(v) => updatePost(i, "avatar", v)} />
              <Field label="Author Avatar Alt Tag"><Input value={post.avatarAlt || ""} onChange={(v) => updatePost(i, "avatarAlt", v)} placeholder="e.g. Marcus Thorne author photo" /></Field>
              <Field label="Full Content" hint="Use **bold** for headings, *italic* for emphasis, blank line between paragraphs">
                <textarea
                  value={post.content}
                  onChange={(e) => updatePost(i, "content", e.target.value)}
                  rows={12}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-y bg-gray-50 focus:bg-white font-mono"
                />
              </Field>
            </ObjectCard>
          ))}
          <AddButton
            onClick={() => setData((p) => ({
              ...p,
              posts: [...p.posts, { id: p.posts.length, tag: "", read: "", title: "", desc: "", author: "", date: "", img: "", avatar: "", content: "" }]
            }))}
            label="Add New Post"
          />
        </div>
      </Section>
    </div>
  );
}
