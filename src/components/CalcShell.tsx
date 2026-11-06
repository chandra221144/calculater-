import React from "react";
import { ArrowRight, BadgeCheck, Clock3, Info } from "lucide-react";
import { AdSlot } from "./ui";
import { Breadcrumb, Link } from "./Layout";
import { CALCULATORS } from "../data/site";
import { useSEO } from "../hooks/useSEO";

export function CalcShell({
  path,
  title,
  meta,
  h1,
  intro,
  updated = "Updated Feb 2026",
  children,
  faqs,
  related,
  article,
}: {
  path: string;
  title: string;
  meta: string;
  h1: string;
  intro: string;
  updated?: string;
  children: React.ReactNode;
  faqs: { q: string; a: string }[];
  related: string[];
  article: React.ReactNode;
}) {
  useSEO({ title, description: meta, canonical: `https://calckaro.in${path}`, faqs });
  const rel = CALCULATORS.filter((c) => related.includes(c.path));

  return (
    <main className="mx-auto max-w-6xl px-4">
      <div className="pt-5">
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Calculators", to: "/" }, { label: h1 }]} />
      </div>

      {/* H1 + intro */}
      <div className="fade-up">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 ring-1 ring-emerald-200">
            <BadgeCheck className="h-3.5 w-3.5" /> Free · No signup
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-sky-700 ring-1 ring-sky-200">
            <Clock3 className="h-3.5 w-3.5" /> {updated}
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[2rem] sm:leading-[1.15]">{h1}</h1>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-slate-600">{intro}</p>
      </div>

      {/* TOP ad */}
      <AdSlot label="Top leaderboard" size="728×90 / responsive" />

      {/* Calculator tool */}
      <section aria-label="Calculator tool" className="fade-up overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-b from-sky-50/80 to-white p-3.5 sm:p-6 shadow-[0_10px_40px_-18px_rgba(6,111,209,0.35)]">
        {children}
      </section>

      {/* MIDDLE ad */}
      <AdSlot label="In-content rectangle" size="336×280 / responsive" />

      {/* SEO article */}
      <article className="seo-article mx-auto max-w-3xl rounded-2xl border border-sky-100 bg-white p-4 sm:p-8">
        {article}

        <h2>Frequently asked questions</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details key={i} className="faq" {...(i === 0 ? { open: true } : {})}>
              <summary>{f.q}<span className="ml-2 shrink-0 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-700">+</span></summary>
              <div className="faq-body">{f.a}</div>
            </details>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p><strong>Disclaimer:</strong> Results are estimates for education only and may differ slightly from bank statements due to rounding, processing fees and exact disbursal dates. Always confirm with your bank or advisor.</p>
        </div>
      </article>

      {/* Related */}
      <section className="mt-8">
        <h2 className="text-lg font-extrabold text-slate-900">Try related calculators</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {rel.map((c) => (
            <Link key={c.path} to={c.path} className="group rounded-2xl border border-sky-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-100">
              <p className="font-bold text-slate-900 group-hover:text-sky-700">{c.name}</p>
              <p className="mt-1 text-sm text-slate-500">{c.short}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-sky-700">Calculate now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></p>
            </Link>
          ))}
        </div>
      </section>

      {/* BOTTOM ad */}
      <AdSlot label="Bottom anchor" size="responsive" />
    </main>
  );
}
