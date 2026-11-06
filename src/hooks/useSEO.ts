import { useEffect } from "react";

export interface SEOMeta {
  title: string;
  description: string;
  canonical?: string;
  faqs?: { q: string; a: string }[];
}

export function useSEO({ title, description, canonical, faqs }: SEOMeta) {
  useEffect(() => {
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);

    let canon = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      if (!canon) {
        canon = document.createElement("link");
        canon.setAttribute("rel", "canonical");
        document.head.appendChild(canon);
      }
      canon.setAttribute("href", canonical);
    }

    // FAQ schema
    const prev = document.getElementById("faq-schema");
    if (prev) prev.remove();
    if (faqs && faqs.length > 0) {
      const script = document.createElement("script");
      script.id = "faq-schema";
      script.type = "application/ld+json";
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      });
      document.head.appendChild(script);
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [title, description, canonical, JSON.stringify(faqs)]);
}
