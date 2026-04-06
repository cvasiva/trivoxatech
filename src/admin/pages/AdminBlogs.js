import { useState, useEffect, useRef } from "react";
import blogsData from "../../data/blogsData.json";
import { PageHeader, Section, Field, Input, Textarea, ImageField, StringList, ObjectCard, AddButton, Grid2, SeoSection, useSave } from "../AdminComponents";

const POSTS_PER_PAGE = 5;

/* ── LIVE PREVIEW ── */
function BlogPreview({ data }) {
  const [activeCategory, setActiveCategory] = useState("All Topics");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const listRef = useRef(null);

  const blogs = (data.posts || []).map((b) => ({ ...b, tag: b.tag.trim() }));

  const counts = blogs.reduce((acc, b) => { acc[b.tag] = (acc[b.tag] || 0) + 1; return acc; }, {});
  const categories = (data.categories || []).map((cat) => ({
    name: cat.name,
    count: cat.name === "All Topics" ? blogs.length : (counts[cat.name] || 0),
  }));

  const filtered = activeCategory === "All Topics" ? blogs : blogs.filter((b) => b.tag === activeCategory);
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "oldest") return a.id - b.id;
    if (sort === "trending") return b.read.localeCompare(a.read);
    return b.id - a.id;
  });

  const totalPages = Math.ceil(sorted.length / POSTS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  // Reset page on category change
  const blogsKey = filtered.map((b) => b.id).join(",");
  useEffect(() => { setPage(1); }, [blogsKey]);

  const handlePage = (p) => {
    setPage(p);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-4">

      {/* Category Filter */}
      <div ref={listRef} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Filter by Topic</p>
        <div className="flex flex-wrap gap-2">
          {categories.map(({ name, count }) => (
            <button key={name} onClick={() => { setActiveCategory(name); setPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                activeCategory === name
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
              }`}>
              {name}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeCategory === name ? "bg-white/25 text-white" : "bg-gray-200 text-gray-500"
              }`}>{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sort + Count */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-700">
          {activeCategory === "All Topics" ? "All Articles" : activeCategory}
          <span className="ml-2 text-xs font-normal text-gray-400">({filtered.length})</span>
        </p>
        <div className="flex gap-3 text-xs">
          {["latest", "trending", "oldest"].map((s) => (
            <button key={s} onClick={() => { setSort(s); setPage(1); }}
              className={`capitalize font-medium transition ${sort === s ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards */}
      {paginated.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-xl border">
          No posts in this category.
        </div>
      ) : (
        paginated.map((blog) => (
          <div key={blog.id} className="flex gap-3 bg-white border border-gray-200 rounded-xl p-3 hover:shadow-sm transition">
            <img src={blog.img} alt={blog.title} className="w-24 h-16 rounded-lg object-cover shrink-0" />
            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-xs font-semibold border border-indigo-100">{blog.tag}</span>
                  <span className="text-gray-400 text-xs">⏱ {blog.read}</span>
                </div>
                <p className="font-semibold text-gray-800 text-xs leading-snug line-clamp-2">{blog.title}</p>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1.5">
                  <img src={blog.avatar} alt={blog.author} className="w-5 h-5 rounded-full object-cover" />
                  <p className="text-xs text-gray-500">{blog.author}</p>
                </div>
                <p className="text-xs text-gray-400">{blog.date}</p>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 flex-wrap pt-2">
          <button onClick={() => handlePage(Math.max(page - 1, 1))} disabled={page === 1}
            className="px-2.5 py-1 rounded-lg border text-xs disabled:opacity-40 hover:bg-gray-100 transition">
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => handlePage(p)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition ${page === p ? "bg-indigo-600 text-white" : "border hover:bg-gray-100 text-gray-600"}`}>
              {p}
            </button>
          ))}
          <button onClick={() => handlePage(Math.min(page + 1, totalPages))} disabled={page === totalPages}
            className="px-2.5 py-1 rounded-lg border text-xs disabled:opacity-40 hover:bg-gray-100 transition">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

/* ── MAIN ADMIN PAGE ── */
export default function AdminBlogs() {
  const { data, setData, update, save, saved, saveError } = useSave("blogsData", blogsData);

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
      <PageHeader title="Blogs Page" subtitle="Edit hero, categories, tags, sidebar text, CTA and post listings" onSave={save} saved={saved} saveError={saveError} />

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

      {/* Live Preview */}
      <Section title="Live Preview — Blog Listing" defaultOpen={false}>
        <p className="text-xs text-gray-500 mb-4">Live preview of the blog listing with category filter and pagination — reflects current unsaved edits.</p>
        <BlogPreview data={data} />
      </Section>

    </div>
  );
}
