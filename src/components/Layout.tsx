import React, { useState } from "react";
import {
  Calculator, Menu, X, Search, ChevronRight, ShieldCheck,
  Zap, IndianRupee, Mail, MapPin, ArrowRight,
} from "lucide-react";
import { BRAND, CALCULATORS } from "../data/site";

export function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function Link({
  to, children, className = "", onClick,
}: { to: string; children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

export function Header({ onSearch, onToggleMenu, isMenuOpen }: { onSearch?: (q: string) => void; onToggleMenu?: () => void; isMenuOpen?: boolean }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isMenuOpen !== undefined ? isMenuOpen : internalOpen;
  const setOpen = (val: boolean) => {
    if (onToggleMenu) onToggleMenu();
    else setInternalOpen(val);
  };
  const [q, setQ] = useState("");
  return (
    <header className="sticky top-0 z-50 border-b border-sky-100 bg-white/92 shadow-[0_1px_12px_rgba(6,111,209,0.08)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#066fd1] to-[#0a3f75] text-white shadow-md shadow-sky-200">
            <IndianRupee className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="leading-none">
            <span className="block text-[17px] font-extrabold tracking-tight text-slate-900">
              Calc<span className="text-[#066fd1]">Karo</span><span className="text-xs font-bold text-slate-400">.in</span>
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Paisa ka hisaab, easy</span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          <Link to="/" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-sky-50 hover:text-sky-800">Home</Link>
          <div className="group relative">
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-sky-50 hover:text-sky-800">
              <Calculator className="h-4 w-4" /> Calculators
            </button>
            <div className="invisible absolute left-0 top-full w-[420px] translate-y-1 rounded-2xl border border-sky-100 bg-white p-3 opacity-0 shadow-xl shadow-sky-100 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="grid grid-cols-2 gap-1">
                {CALCULATORS.map((c) => (
                  <Link key={c.path} to={c.path} className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium text-slate-600 hover:bg-sky-50 hover:text-sky-800">
                    <ChevronRight className="h-3.5 w-3.5 text-sky-400" /> {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link to="/seo-keywords" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-sky-50 hover:text-sky-800">Keywords</Link>
          <Link to="/setup-guide" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-sky-50 hover:text-sky-800">Setup Guide</Link>
          <Link to="/content-plan" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-sky-50 hover:text-sky-800">Content Plan</Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); onSearch?.(e.target.value); }}
              onKeyDown={(e) => { if (e.key === "Enter") { navigate("/"); onSearch?.(q); } }}
              placeholder="Search calculators…"
              className="w-44 lg:w-48 rounded-full border border-sky-200 bg-sky-50/60 py-2 pl-9 pr-3 text-sm outline-none transition focus:w-56 lg:focus:w-60 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </div>
          <Link to="/emi-calculator" className="hidden rounded-full bg-[#066fd1] px-4 py-2 text-sm font-bold text-white shadow-md shadow-sky-200 hover:bg-[#0a5cab] sm:inline-flex sm:items-center sm:gap-1">
            EMI Calc <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl p-2 text-slate-700 hover:bg-sky-50 lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[calc(100vh-4.5rem)] overflow-y-auto overscroll-contain border-t border-sky-100 bg-white px-4 pb-8 pt-3 shadow-2xl lg:hidden">
          <div className="relative mb-3 sm:hidden">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); onSearch?.(e.target.value); }}
              placeholder="Search calculators…"
              className="w-full rounded-xl border border-sky-200 bg-sky-50/60 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-500"
            />
          </div>
          <div className="grid grid-cols-1 gap-1">
            <Link to="/" onClick={() => setOpen(false)} className="flex min-h-[44px] items-center rounded-xl bg-sky-50 px-3.5 py-2.5 text-sm font-bold text-sky-900">
              🏠 Home & All Calculators
            </Link>
            <p className="px-3.5 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Calculators</p>
            {CALCULATORS.map((c) => (
              <Link key={c.path} to={c.path} onClick={() => setOpen(false)} className="flex min-h-[44px] items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50 active:bg-sky-100">
                <span>{c.name}</span> <ChevronRight className="h-4 w-4 text-slate-300" />
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-3 gap-2 border-t border-sky-100 pt-3">
              <Link to="/seo-keywords" onClick={() => setOpen(false)} className="flex min-h-[44px] items-center justify-center rounded-xl border border-sky-100 px-2 py-2 text-center text-xs font-bold text-sky-800 hover:bg-sky-50">Keywords</Link>
              <Link to="/setup-guide" onClick={() => setOpen(false)} className="flex min-h-[44px] items-center justify-center rounded-xl border border-sky-100 px-2 py-2 text-center text-xs font-bold text-sky-800 hover:bg-sky-50">Setup Guide</Link>
              <Link to="/content-plan" onClick={() => setOpen(false)} className="flex min-h-[44px] items-center justify-center rounded-xl border border-sky-100 px-2 py-2 text-center text-xs font-bold text-sky-800 hover:bg-sky-50">Content Plan</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function MobileBottomNav({ currentPath, onOpenCalculators }: { currentPath: string; onOpenCalculators: () => void }) {
  return (
    <nav aria-label="Mobile Navigation" className="fixed bottom-0 left-0 right-0 z-40 border-t border-sky-200/80 bg-white/95 backdrop-blur-md shadow-[0_-4px_16px_rgba(6,111,209,0.08)] lg:hidden">
      <div className="mx-auto grid h-14 max-w-md grid-cols-5 items-center px-1">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 text-center transition ${
            currentPath === "/" ? "text-[#066fd1]" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <IndianRupee className="h-5 w-5" strokeWidth={currentPath === "/" ? 2.5 : 2} />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Home</span>
        </Link>
        <Link
          to="/emi-calculator"
          className={`flex flex-col items-center justify-center py-1 text-center transition ${
            currentPath === "/emi-calculator" ? "text-[#066fd1]" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Calculator className="h-5 w-5" strokeWidth={currentPath === "/emi-calculator" ? 2.5 : 2} />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">EMI</span>
        </Link>
        <Link
          to="/sip-calculator"
          className={`flex flex-col items-center justify-center py-1 text-center transition ${
            currentPath === "/sip-calculator" ? "text-[#066fd1]" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Zap className="h-5 w-5" strokeWidth={currentPath === "/sip-calculator" ? 2.5 : 2} />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">SIP</span>
        </Link>
        <Link
          to="/income-tax-calculator"
          className={`flex flex-col items-center justify-center py-1 text-center transition ${
            currentPath === "/income-tax-calculator" ? "text-[#066fd1]" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <ShieldCheck className="h-5 w-5" strokeWidth={currentPath === "/income-tax-calculator" ? 2.5 : 2} />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Tax</span>
        </Link>
        <button
          onClick={onOpenCalculators}
          className="flex flex-col items-center justify-center py-1 text-center text-slate-500 hover:text-sky-700 transition"
          aria-label="Open all calculators"
        >
          <Menu className="h-5 w-5" strokeWidth={2} />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">All Tools</span>
        </button>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="mt-14 border-t border-sky-100 bg-[#0b2f52] text-sky-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#066fd1]">
              <IndianRupee className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="text-lg font-extrabold text-white">CalcKaro<span className="text-sky-300">.in</span></span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-sky-200/90">
            {BRAND.tagline}. Free, fast & private — all calculations happen in your browser. Made for India, in ₹.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1"><Zap className="h-3 w-3" /> 90+ PageSpeed</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1"><ShieldCheck className="h-3 w-3" /> No signup</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">Calculators</p>
          <ul className="mt-3 space-y-2 text-sm">
            {CALCULATORS.slice(0, 6).map((c) => (
              <li key={c.path}><Link to={c.path} className="hover:text-white transition py-0.5 inline-block">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">More Tools</p>
          <ul className="mt-3 space-y-2 text-sm">
            {CALCULATORS.slice(6).map((c) => (
              <li key={c.path}><Link to={c.path} className="hover:text-white transition py-0.5 inline-block">{c.name}</Link></li>
            ))}
            <li><Link to="/content-plan" className="text-sky-300 hover:text-white transition py-0.5 inline-block">+ 30-day content plan →</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">Company & Legal</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white transition py-0.5 inline-block">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition py-0.5 inline-block">Contact Us</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-white transition py-0.5 inline-block">Privacy Policy</Link></li>
            <li><Link to="/disclaimer" className="hover:text-white transition py-0.5 inline-block">Disclaimer</Link></li>
            <li><Link to="/terms" className="hover:text-white transition py-0.5 inline-block">Terms & Conditions</Link></li>
            <li><Link to="/seo-keywords" className="hover:text-white transition py-0.5 inline-block">SEO Keywords</Link></li>
            <li><Link to="/setup-guide" className="hover:text-white transition py-0.5 inline-block">Hosting & AdSense Guide</Link></li>
          </ul>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-sky-200/80"><Mail className="h-3.5 w-3.5" /> {BRAND.email}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-sky-200/80"><MapPin className="h-3.5 w-3.5" /> Mumbai, Maharashtra, India</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-sky-200/70 sm:flex-row">
          <p className="text-center sm:text-left">© 2026 {BRAND.full} · All rights reserved. Calculations are estimates, not financial advice.</p>
          <p className="flex gap-4">
            <Link to="/sitemap.xml" className="hover:text-white transition">Sitemap</Link>
            <Link to="/privacy-policy" className="hover:text-white transition">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-[12px] sm:text-[13px] font-medium text-slate-500">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-300" />}
          {it.to ? <Link to={it.to} className="hover:text-sky-700 hover:underline">{it.label}</Link> : <span className="text-slate-800">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}
