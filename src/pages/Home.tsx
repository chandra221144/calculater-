import { useMemo } from "react";
import {
  Landmark, TrendingUp, Receipt, Cake, HeartPulse, FileText,
  PiggyBank, Percent, BadgeCheck, Wallet, Search, ShieldCheck,
  Zap, IndianRupee, ArrowRight, Calculator, BookOpen, Rocket, Target,
} from "lucide-react";
import { CALCULATORS, BRAND, DOMAIN_IDEAS } from "../data/site";
import { Link } from "../components/Layout";
import { AdSlot } from "../components/ui";
import { useSEO } from "../hooks/useSEO";

const ICONS: Record<string, typeof Landmark> = {
  landmark: Landmark, trendingUp: TrendingUp, receipt: Receipt, cake: Cake,
  heart: HeartPulse, fileText: FileText, piggy: PiggyBank, percent: Percent,
  badgeCheck: BadgeCheck, wallet: Wallet,
};
const COLORS: Record<string, string> = {
  blue: "from-blue-500 to-sky-600", emerald: "from-emerald-500 to-teal-600",
  amber: "from-amber-500 to-orange-500", pink: "from-pink-500 to-rose-500",
  rose: "from-rose-500 to-red-500", indigo: "from-indigo-500 to-violet-600",
  teal: "from-teal-500 to-cyan-600", violet: "from-violet-500 to-purple-600",
  cyan: "from-cyan-500 to-sky-600", orange: "from-orange-500 to-amber-600",
};

export default function Home({ query }: { query: string }) {
  useSEO({
    title: "CalcKaro.in – Free Indian Finance Calculators | EMI, SIP, GST, Tax",
    description: "10+ free Indian finance calculators – EMI, SIP, GST, Income Tax, FD, RD, BMI, Age & more. Instant results in ₹ with charts. No signup.",
    canonical: "https://calckaro.in/",
  });

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CALCULATORS;
    return CALCULATORS.filter((c) => (c.name + c.short + c.desc + c.keywords).toLowerCase().includes(q));
  }, [query]);

  return (
    <main className="mx-auto max-w-6xl px-4">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b2f52] via-[#0a5cab] to-[#066fd1] px-6 py-10 text-white sm:px-10 sm:py-14 mt-4">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="relative max-w-2xl">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide backdrop-blur">
            <IndianRupee className="h-3.5 w-3.5" /> MADE FOR INDIA · 100% FREE
          </p>
          <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
            Paisa ka hisaab,<br />ab <span className="text-amber-300">30 second</span> me.
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-sky-100 sm:text-base">
            10 free calculators for EMI, SIP, GST, Income Tax, FD, Salary & more — with instant ₹ results,
            charts and simple Indian examples. No signup. Works on any phone.
          </p>
          <HeroSearch />
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-3 py-1.5 ring-1 ring-white/20"><Zap className="h-3.5 w-3.5" /> Instant results</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-3 py-1.5 ring-1 ring-white/20"><ShieldCheck className="h-3.5 w-3.5" /> Private — runs offline</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-3 py-1.5 ring-1 ring-white/20"><Calculator className="h-3.5 w-3.5" /> 10 calculators</span>
          </div>
        </div>
        {/* floating cards desktop */}
        <div className="pointer-events-none absolute right-8 top-8 hidden w-64 space-y-3 lg:block">
          <div className="rounded-2xl bg-white/95 p-4 text-slate-900 shadow-xl backdrop-blur">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Home loan EMI</p>
            <p className="text-xl font-extrabold">₹43,532<span className="text-xs font-semibold text-slate-500">/mo</span></p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[68%] rounded-full bg-gradient-to-r from-sky-500 to-blue-600" /></div>
            <p className="mt-1 text-[11px] text-slate-500">₹50L · 8.5% · 15 yrs</p>
          </div>
          <div className="ml-8 rounded-2xl bg-white/95 p-4 text-slate-900 shadow-xl backdrop-blur">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">₹10K SIP → 10 yrs</p>
            <p className="text-xl font-extrabold text-emerald-600">₹23.23 L</p>
            <p className="text-[11px] text-slate-500">at 12% · invested ₹12L</p>
          </div>
        </div>
      </section>

      <AdSlot label="Homepage top" size="responsive" />

      {/* GRID */}
      <section id="calculators" className="mt-2">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              {query ? `Results for “${query}” (${list.length})` : "All calculators"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">Tap any card — answer appears instantly, no page reload.</p>
          </div>
        </div>
        {list.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-sky-300 bg-white p-8 text-center">
            <p className="font-bold text-slate-800">No calculator found for “{query}”</p>
            <p className="mt-1 text-sm text-slate-500">Try “emi”, “sip”, “gst”, “tax” or “salary”.</p>
          </div>
        )}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => {
            const Icon = ICONS[c.icon] ?? Calculator;
            return (
              <Link key={c.path} to={c.path} className="group rounded-2xl border border-sky-100 bg-white p-5 shadow-[0_2px_10px_-4px_rgba(6,111,209,0.15)] transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100">
                <div className="flex items-start gap-3.5">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${COLORS[c.color]} text-white shadow-md`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-slate-900 group-hover:text-sky-700">{c.name}</h3>
                    <p className="text-[13px] font-medium text-sky-700">{c.short}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{c.desc}</p>
                <p className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-sky-700">
                  Open calculator <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* WHY + HOW */}
      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-sky-100 bg-white p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700"><Zap className="h-5 w-5" /></span>
          <h2 className="mt-3 font-extrabold text-slate-900">Why CalcKaro.in?</h2>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-slate-600">
            <li>✓ <strong>Indian formats first</strong> — ₹1,25,000 lakh/crore style, FY 2025-26 tax slabs, CGST+SGST split.</li>
            <li>✓ <strong>Instant + private</strong> — maths runs in your browser; we never see your salary or loan.</li>
            <li>✓ <strong>Simple English</strong> — every tool has formula, solved example & FAQs a first-time earner can follow.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-white p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><Target className="h-5 w-5" /></span>
          <h2 className="mt-3 font-extrabold text-slate-900">Popular right now</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {["emi calculator", "sip calculator with inflation", "income tax calculator new regime", "gst calculator india", "fd calculator", "in hand salary calculator ctc"].map((k) => (
              <span key={k} className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-800 ring-1 ring-sky-100">{k}</span>
            ))}
          </div>
          <Link to="/seo-keywords" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-sky-700">See all 10 target keywords <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 ring-1 ring-amber-200">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white"><Rocket className="h-5 w-5" /></span>
          <h2 className="mt-3 font-extrabold text-slate-900">Starting a finance blog?</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">Copy our exact playbook: hosting for ₹149/mo, Search Console setup, AdSense checklist + 30-day content plan.</p>
          <div className="mt-3 space-y-2">
            <Link to="/setup-guide" className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 text-sm font-bold text-slate-800 shadow-sm hover:text-sky-700">Setup & AdSense guide <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/content-plan" className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 text-sm font-bold text-slate-800 shadow-sm hover:text-sky-700">30-day content plan <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* BRAND ideas */}
      <section className="mt-10 rounded-2xl border border-sky-100 bg-white p-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-sky-700" />
          <h2 className="font-extrabold text-slate-900">Brand story: 5 domain ideas we considered</h2>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {DOMAIN_IDEAS.map((d, i) => (
            <div key={d.name} className={`rounded-xl border p-4 ${i === 0 ? "border-sky-500 bg-sky-50/60 ring-2 ring-sky-100" : "border-slate-100 bg-slate-50/50"}`}>
              <p className="font-extrabold text-slate-900">{i + 1}. {d.name} {i === 0 && <span className="ml-1 rounded-full bg-sky-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">Chosen</span>}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{d.why}</p>
            </div>
          ))}
          <div className="rounded-xl border border-dashed border-sky-300 bg-sky-50/40 p-4">
            <p className="font-extrabold text-sky-900">Why {BRAND.full} won</p>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-600">6 letters + action verb, passes the “radio test” (spell it after hearing once), .in builds India trust, and it works as a verb — “EMI CalcKaro!”.</p>
          </div>
        </div>
      </section>

      {/* Intro SEO text */}
      <section className="seo-article mx-auto mt-10 max-w-3xl rounded-2xl border border-sky-100 bg-white p-6 sm:p-8">
        <h2>Free Indian finance calculators — simple, fast & accurate</h2>
        <p>
          <strong>CalcKaro.in</strong> is a free toolkit of Indian money calculators. Whether you are taking your first
          <strong> home loan</strong>, starting a <strong>₹500 SIP</strong>, filing tax under the <strong>new regime</strong>,
          or splitting a restaurant bill with <strong>GST</strong> — you get the answer in seconds, in Indian rupees (₹),
          with a clear breakup you can trust.
        </p>
        <p>
          Every calculator follows three rules: <strong>(1)</strong> Indian defaults (FY 2025-26 slabs, 5/12/18/28% GST,
          quarterly FD compounding), <strong>(2)</strong> instant results as you type — no “submit” button wait, and
          <strong> (3)</strong> a plain-English explanation with formula, solved example and FAQs below the tool so you
          actually understand the number, not just copy it.
        </p>
        <h3>How to use this site</h3>
        <ol>
          <li>Pick a calculator above (EMI and SIP are the most popular).</li>
          <li>Move the sliders or type your numbers — results update instantly.</li>
          <li>Read the chart + table to see where your money goes.</li>
          <li>Scroll down for the formula, example and FAQs before you decide.</li>
        </ol>
        <p>Bookmark this page — new tools (PPF, NPS, Gratuity, SSY) are added every week as per our public <strong>30-day content plan</strong>.</p>
      </section>

      <AdSlot label="Homepage bottom" size="responsive" />
    </main>
  );
}

function HeroSearch() {
  return (
    <form
      className="mt-5 flex max-w-md items-center gap-1.5 sm:gap-2 rounded-2xl bg-white p-1.5 sm:p-2 shadow-xl"
      onSubmit={(e) => {
        e.preventDefault();
        document.getElementById("calculators")?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <Search className="ml-2 h-4 sm:h-5 w-4 sm:w-5 shrink-0 text-slate-400" />
      <input
        placeholder="Try “sip”, “emi”, “gst”…"
        className="w-full min-w-0 bg-transparent text-xs sm:text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
        onChange={(e) => {
          const ev = new CustomEvent("hero-search", { detail: e.target.value });
          window.dispatchEvent(ev);
        }}
        aria-label="Search calculators"
      />
      <button className="shrink-0 rounded-xl bg-[#066fd1] px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#0a5cab] transition active:scale-95">Search</button>
    </form>
  );
}
