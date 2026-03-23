import { useEffect } from "react";

export default function useSchema(schemas) {
  useEffect(() => {
    const tags = (Array.isArray(schemas) ? schemas : [schemas]).map((schema) => {
      const el = document.createElement("script");
      el.type = "application/ld+json";
      el.text = JSON.stringify(schema);
      el.setAttribute("data-schema", "trivoxa");
      document.head.appendChild(el);
      return el;
    });
    return () => tags.forEach((el) => el.remove());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
