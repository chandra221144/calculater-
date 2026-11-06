import { useState } from "react";
import { Target, Server, Search, BadgeDollarSign, CalendarDays, CheckCircle2, Circle, ExternalLink, Lightbulb, Rocket } from "lucide-react";
import { Breadcrumb, Link } from "../components/Layout";
import { AdSlot } from "../components/ui";
import { KEYWORDS, CONTENT_PLAN, BRAND } from "../data/site";
import { useSEO } from "../hooks/useSEO";

function Shell({ h1, sub, children, title, desc, canon }: { h1: string; sub: string; children: React.ReactNode; title: string; desc: string; canon: string }) {
  useSEO({ title, description: desc, canonical: canon });
  return (
    <main className="mx-auto max-w-4xl px-4">
      <div className="pt-5"><Breadcrumb items={[{ label: "Home", to: "/" }, { label: h1 }]} /></div>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{h1}</h1>
      <p className="mt-2 text-slate-600">{sub}</p>
      <AdSlot label="Resource top" size="responsive" />
      {children}
      <AdSlot label="Resource bottom" size="responsive" />
    </main>
  );
}

export function Keywords() {
  return (
    <Shell h1="First 10 Target Keywords" sub="The exact SEO hit-list this site is built to rank for — Indian searches with a mix of high-volume head terms and easy long-tail wins." title="10 Target Keywords – CalcKaro.in SEO Strategy" desc="First 10 Indian SEO keywords for a finance calculator site: EMI, SIP, GST, tax & salary terms with volumes and why each wins." canon="https://calckaro.in/seo-keywords">
      <div className="rounded-2xl border border-sky-100 bg-white p-5">
        <p className="flex items-center gap-2 text-sm font-bold text-sky-900"><Target className="h-4 w-4" /> Strategy in 30 seconds</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">Attack <strong>3 easy wins first</strong> (age, BMI, SIP-with-inflation) for traffic in 30–60 days, while <strong>3 money pages</strong> (EMI, tax, loan eligibility) build AdSense RPM. Every keyword maps 1:1 to a calculator page above it — no thin pages.</p>
      </div>
      <div className="mt-4 space-y-3">
        {KEYWORDS.map((k, i) => (
          <div key={k.kw} className="rounded-2xl border border-sky-100 bg-white p-5 transition hover:shadow-lg hover:shadow-sky-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#066fd1] text-sm font-extrabold text-white">{i + 1}</span>
              <p className="font-extrabold text-slate-900">“{k.kw}”</p>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-bold">
              <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-800 ring-1 ring-sky-200">Volume: {k.vol}</span>
              <span className={`rounded-full px-2.5 py-1 ring-1 ${k.diff === "Low" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : k.diff === "Medium" ? "bg-amber-50 text-amber-700 ring-amber-200" : "bg-red-50 text-red-700 ring-red-200"}`}>Difficulty: {k.diff}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600"><strong className="text-slate-800">Why it's good:</strong> {k.why}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-gradient-to-br from-sky-900 to-sky-700 p-6 text-white">
        <p className="flex items-center gap-2 font-extrabold"><Lightbulb className="h-5 w-5 text-amber-300" /> How to use this list</p>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-sky-100">
          <li>One keyword = one page (already done — each calculator targets its row above).</li>
          <li>Add 3–5 long-tails per page in FAQs (e.g. “20 lakh home loan emi 20 years”).</li>
          <li>Interlink: every new blog post links to 2–3 calculators (see Content Plan).</li>
          <li>Track in Search Console weekly; rewrite any page stuck at position 11–20.</li>
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/content-plan" className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-sky-900">See 30-day content plan →</Link>
          <Link to="/setup-guide" className="rounded-xl bg-white/15 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/30">Search Console setup →</Link>
        </div>
      </div>
    </Shell>
  );
}

const GUIDE_STEPS = [
  {
    icon: Server, title: "Step 1 — Hosting (free → cheap, in order)",
    body: [
      "FREE (start here): Cloudflare Pages or Netlify Drop — drag your dist/ folder, get HTTPS + CDN free. Perfect for a static calculator site; handles 1L+ visitors/month free.",
      "CHEAP + Indian support (₹149–199/mo): Hostinger Single Shared — 1-click deploy, free SSL, Mumbai servers. Upgrade only when you cross ~50K/month or want email@domain.",
      "AVOID at start: costly VPS, WordPress managed hosting (slow + overkill for calculators).",
      "Speed rules: single CSS file, no jQuery, lazy-load charts, compress images to WebP <100KB. Target: <1.5s LCP on 4G.",
    ],
  },
  {
    icon: ExternalLink, title: "Step 2 — Connect domain (calckaro.in)",
    body: [
      "Buy .in from Cloudflare Registrar / Porkbun / Hostinger (~₹600–800/yr; avoid ₹2,000+ renewals at some registrars). Enable WHOIS privacy + auto-renew + registrar lock.",
      "Cloudflare Pages/Netlify: add custom domain → copy the CNAME/ANAME they show → paste in registrar DNS → wait 5 min–24 hrs → force HTTPS + HSTS on.",
      "Set up: root (calckaro.in) + www → root redirect. Add SPF/DKIM later only if you send email newsletters.",
      "Verify: https://www.ssllabs.com + view-source check that canonical = https://calckaro.in/ on every page.",
    ],
  },
  {
    icon: Search, title: "Step 3 — Google Search Console (GSC) setup",
    body: [
      "Go to search.google.com/search-console → Add property (URL prefix: https://calckaro.in/) → verify via DNS TXT or HTML file.",
      "Submit sitemap: Sitemaps → Add https://calckaro.in/sitemap.xml → check 'Success' (19 URLs). Also add robots.txt test.",
      "Day 1: Request indexing for / + top 3 calculators (URL Inspection → Request Indexing). Then publish 1 page every 2 days (see Content Plan) and request indexing each time.",
      "Week 2+: watch Performance → Queries; double down on any keyword hitting position 5–25 (add FAQ answering it, add internal links). Fix Coverage errors + Core Web Vitals weekly.",
      "Also add Bing Webmaster Tools (imports from GSC in 1 click) — ~5% extra free traffic.",
    ],
  },
  {
    icon: BadgeDollarSign, title: "Step 4 — AdSense application checklist (approval-first)",
    body: [
      "BEFORE applying (Google rejects thin sites): 15+ indexed pages, About + Contact (with real email/address) + Privacy + Disclaimer + Terms live (this site ships all five), no placeholder text, HTTPS, mobile-friendly, <3s load, original 400+ word content per page.",
      "Traffic: no official minimum, but apply after 5K–10K monthly pageviews + 2–4 weeks of steady publishing for best odds.",
      "Apply: google.com/adsense → sign up with the same Google account as GSC → add the verification script to <head> (slot already reserved in index.html) → place Auto Ads OFF first; use the 3 manual slots per page (top/middle/bottom placeholders in every calculator).",
      "Policy must-dos: no copyrighted text/images, no 'click my ads' requests, no adult/gambling content, no traffic buying. One account per person — never apply twice.",
      "If rejected: fix the EXACT reason in the email (usually 'low value content' → add 5 more calculators/blogs + 500 words each), wait 2–3 weeks, reapply. Most Indian calculator sites pass on attempt 1–2 with this checklist.",
    ],
  },
];

export function SetupGuide() {
  const [done, setDone] = useState<Record<number, boolean>>({});
  const pct = Math.round((Object.values(done).filter(Boolean).length / GUIDE_STEPS.reduce((s, g) => s + g.body.length, 0)) * 100);
  let idx = 0;
  return (
    <Shell h1="Hosting, Domain, Search Console & AdSense Guide" sub="Copy-paste playbook to take this site live on calckaro.in — from free hosting to AdSense approval. Tick boxes as you go." title="Setup Guide: Hosting, Domain, GSC & AdSense – CalcKaro" desc="Step-by-step: free/cheap hosting, connect .in domain, Search Console setup & AdSense approval checklist for Indian calculator sites." canon="https://calckaro.in/setup-guide">
      <div className="rounded-2xl border border-sky-100 bg-white p-5">
        <div className="flex items-center justify-between text-sm font-bold text-slate-700"><span className="flex items-center gap-2"><Rocket className="h-4 w-4 text-sky-600" /> Your progress</span><span>{pct}%</span></div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-sky-100"><div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all" style={{ width: `${pct}%` }} /></div>
      </div>
      <div className="mt-4 space-y-4">
        {GUIDE_STEPS.map((g) => (
          <div key={g.title} className="rounded-2xl border border-sky-100 bg-white p-5 sm:p-6">
            <p className="flex items-center gap-2 font-extrabold text-slate-900"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700"><g.icon className="h-5 w-5" /></span>{g.title}</p>
            <ul className="mt-3 space-y-2.5">
              {g.body.map((b) => {
                const id = idx++;
                return (
                  <li key={id}>
                    <button onClick={() => setDone({ ...done, [id]: !done[id] })} className={`flex w-full items-start gap-2.5 rounded-xl border p-3 text-left text-sm leading-relaxed transition ${done[id] ? "border-emerald-200 bg-emerald-50/60 text-slate-500 line-through" : "border-slate-100 bg-slate-50/50 text-slate-700 hover:border-sky-300"}`}>
                      {done[id] ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" /> : <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" />}
                      {b}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-amber-50 p-5 text-sm leading-relaxed text-amber-900 ring-1 ring-amber-200">
        <p className="font-extrabold">💰 Realistic costs (Year 1, India)</p>
        <p className="mt-1">Domain .in ₹700 + hosting ₹0 (Cloudflare/Netlify) or ₹1,800 (Hostinger) = <strong>₹700–2,500 total</strong>. AdSense typically pays ₹80–₹250 RPM for Indian finance traffic — 30K pageviews/month ≈ ₹2,500–₹7,500/month, scaling with the content plan below.</p>
      </div>
    </Shell>
  );
}

export function ContentPlan() {
  const [done, setDone] = useState<Record<number, boolean>>({});
  return (
    <Shell h1="30-Day Content Plan (15 Posts)" sub="One new calculator or blog post every 2 days. Tools capture keywords; blogs capture links + long-tails. Each row links back to 2–3 existing calculators." title="30-Day Content Plan – 15 Calculators & Blogs | CalcKaro" desc="30-day publishing plan: 15 new calculators & blog posts every 2 days for an Indian finance site, with keyword logic for each." canon="https://calckaro.in/content-plan">
      <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white">
        <div className="flex items-center gap-2 bg-gradient-to-r from-sky-900 to-sky-700 px-5 py-4 text-white">
          <CalendarDays className="h-5 w-5" />
          <p className="font-extrabold">Publish Tue → Thu → Sat… ({Object.values(done).filter(Boolean).length}/15 done)</p>
        </div>
        <div className="divide-y divide-sky-50">
          {CONTENT_PLAN.map((p, i) => (
            <button key={i} onClick={() => setDone({ ...done, [i]: !done[i] })} className={`flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-sky-50/50 ${done[i] ? "opacity-55" : ""}`}>
              {done[i] ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" /> : <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" />}
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">{p.day}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${p.type === "Tool" ? "bg-sky-100 text-sky-800" : p.type === "Blog" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{p.type}</span>
                </span>
                <span className={`mt-0.5 block font-bold text-slate-900 ${done[i] ? "line-through" : ""}`}>{p.title}</span>
                <span className="mt-0.5 block text-[13px] leading-relaxed text-slate-500">{p.why}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[["Format per tool", "Same template as EMI page: tool → chart/table → 450 words → 5 FAQs → schema → 3 related links."], ["Format per blog", "1,000–1,500 words, 1 table, 1 example in ₹, 3+ internal links, 5 FAQs, 1 original image."], ["Promote each post", "Share on X/LinkedIn/WhatsApp, request GSC indexing, add to homepage 'New' badge for 7 days."]].map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-sky-100 bg-white p-4"><p className="font-extrabold text-slate-900">{t}</p><p className="mt-1 text-[13px] leading-relaxed text-slate-600">{d}</p></div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-slate-400">Brand: {BRAND.full} · Questions? <Link to="/contact" className="font-bold text-sky-700 underline">Contact us</Link></p>
    </Shell>
  );
}
