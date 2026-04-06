import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Footer from "../components/Footer";
import EnrollForm from "../components/EnrollForm";
import ContactForm from "../components/ContactForm";
import staticBlogDetail from "../data/blogDetailData.json";
import useSchema from "../hooks/useSchema";
import usePageData from "../hooks/usePageData";
import usePageMeta from "../hooks/usePageMeta";

const blogs = staticBlogDetail.posts;
export { blogs };

/* ================= STICKY BACK ================= */
function StickyBack() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      onClick={() => navigate("/blogs")}
      className={`fixed top-24 left-4 sm:left-6 lg:left-8 z-50 flex items-center gap-2 bg-white border border-gray-200 shadow-md px-3 sm:px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <FaArrowLeft className="text-xs" />
      <span className="hidden sm:inline">Back to Blogs</span>
      <span className="sm:hidden">Back</span>
    </button>
  );
}

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const blogDetailData = usePageData("blogDetailData", staticBlogDetail);
  const blogs = blogDetailData?.posts || staticBlogDetail.posts;
  const blog = blogs.find((b) => b.id === parseInt(id));
  const d = blogDetailData;
  const postSeo = blog?.seo || {};
  usePageMeta({
    title:          postSeo.title       || (blog ? blog.title : ""),
    description:    postSeo.description || (blog ? blog.desc  : ""),
    keywords:       postSeo.keywords    || (blog ? blog.tag   : ""),
    canonical:      postSeo.canonical   || (blog ? `https://trivoxatech.com/blogs/${blog.id}` : ""),
    ogTitle:        postSeo.ogTitle     || (blog ? blog.title : ""),
    ogDescription:  postSeo.ogDescription || (blog ? blog.desc : ""),
    ogImage:        postSeo.ogImage     || (blog ? blog.img   : ""),
  });
  useSchema(blog ? [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": postSeo.description || blog.desc,
      "image": postSeo.ogImage || blog.img,
      "datePublished": blog.date,
      "author": { "@type": "Person", "name": blog.author, "image": blog.avatar },
      "publisher": { "@type": "Organization", "name": "Trivoxa Technologies", "url": "https://trivoxatech.com" },
      "url": postSeo.canonical || `https://trivoxatech.com/blogs/${blog.id}`,
      "articleBody": blog.content,
      "keywords": postSeo.keywords || blog.tag,
      "timeRequired": blog.read
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trivoxatech.com" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://trivoxatech.com/blogs" },
        { "@type": "ListItem", "position": 3, "name": blog.title, "item": postSeo.canonical || `https://trivoxatech.com/blogs/${blog.id}` }
      ]
    }
  ] : []);

  const [showEnroll, setShowEnroll] = useState(false);

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-2xl font-bold text-gray-700">{d.notFound.heading}</p>
        <button onClick={() => navigate("/blogs")} className="mt-4 text-indigo-600 font-semibold hover:underline">
          {d.notFound.backBtn}
        </button>
      </div>
    );
  }

  const related = blogs.filter((b) => b.id !== blog.id).slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen">
      <StickyBack />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT - MAIN CONTENT */}
          <div className="lg:col-span-2">

            {/* HEADER */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold">{blog.tag}</span>
                <span className="text-gray-400 text-xs">⏱ {blog.read}</span>
                <span className="text-gray-400 text-xs">{blog.date}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">{blog.title}</h1>
              <p className="text-gray-500 mt-3 text-base leading-relaxed">{blog.desc}</p>
            </div>

            {/* AUTHOR */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b">
              <img src={blog.avatar} alt={blog.author} className="w-11 h-11 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold text-gray-800">{blog.author}</p>
                <p className="text-xs text-gray-400">{d.authorLabel}</p>
              </div>
            </div>

            {/* HERO IMAGE */}
            <img src={blog.img} alt={blog.title} className="w-full h-72 md:h-96 object-cover rounded-2xl mb-10" />

            {/* CONTENT */}
            <div className="prose prose-indigo max-w-none text-gray-700 leading-relaxed space-y-4">
              {blog.content.split("\n\n").map((para, i) => {
                if (para.startsWith("**") && para.endsWith("**")) {
                  return <h3 key={i} className="text-lg font-bold text-gray-900 mt-6">{para.replace(/\*\*/g, "")}</h3>;
                }
                if (para.startsWith("**")) {
                  const parts = para.split(/\*\*(.*?)\*\*/g);
                  return (
                    <p key={i} className="text-gray-700">
                      {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
                    </p>
                  );
                }
                if (para.startsWith("*") && para.includes("*")) {
                  return <p key={i} className="text-gray-700 italic">{para.replace(/\*/g, "")}</p>;
                }
                return <p key={i} className="text-gray-600 text-base leading-relaxed">{para}</p>;
              })}
            </div>

            {/* ENROLL CTA BANNER */}
            <div className="my-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold">Ready to master {blog.tag}?</h3>
                <p className="text-indigo-100 text-sm mt-1">Join thousands of students learning in-demand tech skills at Trivoxa Technologies.</p>
              </div>
              <button onClick={() => setShowEnroll(true)} className="shrink-0 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition text-sm">
                Enroll Now →
              </button>
            </div>

            {/* RELATED */}
            <div className="mt-14 pt-8 border-t">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{d.relatedHeading}</h2>
              <div className="grid sm:grid-cols-3 gap-5">
                {related.map((b) => (
                  <div key={b.id} onClick={() => navigate(`/blogs/${b.id}`)}
                    className="bg-white border rounded-2xl overflow-hidden hover:shadow-md transition cursor-pointer">
                    <img src={b.img} alt={b.title} className="w-full h-36 object-cover" />
                    <div className="p-4">
                      <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs font-semibold">{b.tag}</span>
                      <p className="font-semibold text-sm text-gray-900 mt-2 leading-snug line-clamp-2">{b.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{b.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT - SEND MESSAGE FORM */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Send us a Message</h3>
              <p className="text-sm text-gray-500 mb-6">Have a question or want to know more? We'll get back to you within 24 hours.</p>
              <ContactForm />
            </div>
          </div>

        </div>
      </div>
      <Footer />
      {showEnroll && <EnrollForm courseName={blog.tag} onClose={() => setShowEnroll(false)} />}
    </div>
  );
}
