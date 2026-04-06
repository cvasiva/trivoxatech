import blogDetailData from "../../data/blogDetailData.json";
import { PageHeader, Section, Field, Input, Textarea, ImageField, ObjectCard, AddButton, Grid2, SeoSection, useSave } from "../AdminComponents";

function PostSeoSection({ post, onChange }) {
  const seo = post.seo || {};
  const upd = (key, val) => onChange("seo", { ...seo, [key]: val });

  return (
    <div className="border border-indigo-100 rounded-xl p-4 bg-indigo-50/40 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-indigo-600 text-xs">🔍</span>
        <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest">SEO for this Post</p>
      </div>
      <p className="text-[11px] text-indigo-500 -mt-1">These override the page-level SEO when this post is open. Controls Google title, description, social previews, and URL.</p>

      <Grid2>
        <Field label="Post Slug" hint="URL path, e.g. /blogs/react-19-features">
          <Input value={seo.slug || ""} onChange={(v) => upd("slug", v)} placeholder="/blogs/post-slug" />
        </Field>
        <Field label="Canonical URL" hint="Full canonical URL for this post">
          <Input value={seo.canonical || ""} onChange={(v) => upd("canonical", v)} placeholder="https://trivoxatech.com/blogs/0" />
        </Field>
      </Grid2>

      <Field label="SEO Title" hint="Browser tab & Google result title (50–60 chars)">
        <Input value={seo.title || ""} onChange={(v) => upd("title", v)} placeholder="Post title for search engines" />
      </Field>
      <Field label="Meta Description" hint="Shown under title in Google results (150–160 chars)">
        <Textarea value={seo.description || ""} onChange={(v) => upd("description", v)} placeholder="Brief description for search engines..." rows={2} />
      </Field>
      <Field label="Keywords" hint="Comma-separated keywords for this post">
        <Input value={seo.keywords || ""} onChange={(v) => upd("keywords", v)} placeholder="react, web development, frontend" />
      </Field>

      <div className="border-t border-indigo-100 pt-3">
        <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-3">Open Graph (Social Sharing)</p>
        <Grid2>
          <Field label="OG Title" hint="Title shown on Facebook / LinkedIn previews">
            <Input value={seo.ogTitle || ""} onChange={(v) => upd("ogTitle", v)} placeholder="Social share title" />
          </Field>
          <Field label="OG Description">
            <Input value={seo.ogDescription || ""} onChange={(v) => upd("ogDescription", v)} placeholder="Social share description" />
          </Field>
        </Grid2>
        <ImageField label="OG Image URL" value={seo.ogImage || ""} onChange={(v) => upd("ogImage", v)} hint="Recommended: 1200×630px" />
      </div>
    </div>
  );
}

export default function AdminBlogDetail() {
  const { data, setData, update, save, saved, saveError } = useSave("blogDetailData", blogDetailData);

  const updatePost = (i, key, val) => {
    const posts = [...data.posts];
    posts[i] = { ...posts[i], [key]: val };
    setData((p) => ({ ...p, posts }));
  };

  return (
    <div className="w-full space-y-4">
      <PageHeader title="Blog Detail Page" subtitle="Edit individual blog posts — title, content, author, images, and per-post SEO" onSave={save} saved={saved} saveError={saveError} />

      <SeoSection data={data} update={update} altTagFields={[]} />

      <Section title="Page Labels">
        <Grid2>
          <Field label="Author Label"><Input value={data.authorLabel} onChange={(v) => update("authorLabel", v)} /></Field>
          <Field label="Related Articles Heading"><Input value={data.relatedHeading} onChange={(v) => update("relatedHeading", v)} /></Field>
        </Grid2>
        <Grid2>
          <Field label="Not Found Heading"><Input value={data.notFound.heading || ""} onChange={(v) => update("notFound.heading", v)} /></Field>
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
              <Field label="Post Image Alt Tag" hint="Describe this post image for SEO & accessibility">
                <Input value={post.alt || ""} onChange={(v) => updatePost(i, "alt", v)} placeholder="e.g. UI/UX design principles article cover" />
              </Field>
              <ImageField label="Author Avatar URL" value={post.avatar} onChange={(v) => updatePost(i, "avatar", v)} />
              <Field label="Author Avatar Alt Tag">
                <Input value={post.avatarAlt || ""} onChange={(v) => updatePost(i, "avatarAlt", v)} placeholder="e.g. Marcus Thorne author photo" />
              </Field>
              <Field label="Full Content" hint="Use **bold** for headings, *italic* for emphasis, blank line between paragraphs">
                <textarea
                  value={post.content}
                  onChange={(e) => updatePost(i, "content", e.target.value)}
                  rows={12}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-y bg-gray-50 focus:bg-white font-mono"
                />
              </Field>

              {/* Per-post SEO */}
              <PostSeoSection post={post} onChange={(key, val) => updatePost(i, key, val)} />
            </ObjectCard>
          ))}
          <AddButton
            onClick={() => setData((p) => ({
              ...p,
              posts: [...p.posts, {
                id: p.posts.length, tag: "", read: "", title: "", desc: "",
                author: "", date: "", img: "", avatar: "", content: "",
                seo: { slug: "", title: "", description: "", keywords: "", canonical: "", ogTitle: "", ogDescription: "", ogImage: "" }
              }]
            }))}
            label="Add New Post"
          />
        </div>
      </Section>
    </div>
  );
}
