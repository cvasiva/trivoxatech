import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const sections = [
  {
    heading: "Main Pages",
    links: [
      { label: "Home", to: "/" },
      { label: "About Us", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    heading: "Courses",
    links: [
      { label: "All Courses", to: "/courses" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Services", to: "/services" },
      { label: "Get a Quote", to: "/servicesquote" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog", to: "/blogs" },
      { label: "Portfolio", to: "/portfolio" },
      { label: "Careers", to: "/careers" },
    ],
  },
];

export default function Sitemap() {
  return (
    <div>
      <section className="bg-indigo-50 py-10 px-4 text-center">
        <p className="text-xs sm:text-sm text-gray-500 mb-2">Home › Sitemap</p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Sitemap</h1>
        <p className="text-gray-500 mt-3 text-sm sm:text-base">A complete overview of all pages on Trivoxa Technologies.</p>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                {section.heading}
              </h2>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
