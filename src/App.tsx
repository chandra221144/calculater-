import { useEffect, useState } from "react";
import { Header, Footer, MobileBottomNav, Link } from "./components/Layout";
import Home from "./pages/Home";
import EmiCalculator from "./pages/calculators/EmiCalculator";
import SipCalculator from "./pages/calculators/SipCalculator";
import GstCalculator from "./pages/calculators/GstCalculator";
import AgeCalculator from "./pages/calculators/AgeCalculator";
import BmiCalculator from "./pages/calculators/BmiCalculator";
import TaxCalculator from "./pages/calculators/TaxCalculator";
import FdCalculator from "./pages/calculators/FdCalculator";
import PercentageCalculator from "./pages/calculators/PercentageCalculator";
import LoanEligibilityCalculator from "./pages/calculators/LoanEligibilityCalculator";
import SalaryCalculator from "./pages/calculators/SalaryCalculator";
import { About, Contact, Privacy, Disclaimer, Terms } from "./pages/Static";
import { Keywords, SetupGuide, ContentPlan } from "./pages/Resources";
import { CALCULATORS } from "./data/site";
import { SearchX } from "lucide-react";

function getPath(): string {
  const p = window.location.pathname.replace(/\/+$/, "") || "/";
  // support hash fallback (file:// preview): #/emi-calculator
  if ((p === "/" || p === "/index.html") && window.location.hash.startsWith("#/")) {
    return window.location.hash.slice(1) || "/";
  }
  if (p === "/index.html") return "/";
  return p;
}

export default function App() {
  const [path, setPath] = useState(getPath());
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onPop = () => {
      setPath(getPath());
      setMenuOpen(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", onPop);
    const onHero = (e: Event) => setQuery((e as CustomEvent).detail ?? "");
    window.addEventListener("hero-search", onHero);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("hero-search", onHero);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setMenuOpen(false);
    // keep hash in sync for static-file preview support
    if (window.location.protocol === "file:") {
      window.location.hash = `#${path}`;
    }
  }, [path]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f8fd]">
      <Header
        isMenuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen(!menuOpen)}
        onSearch={(q) => {
          setQuery(q);
          if (path !== "/") {
            window.history.pushState({}, "", "/");
            setPath("/");
          }
        }}
      />
      <div className="flex-1 pb-20 lg:pb-6">
        {path === "/" && <Home query={query} />}
        {path === "/emi-calculator" && <EmiCalculator />}
        {path === "/sip-calculator" && <SipCalculator />}
        {path === "/gst-calculator" && <GstCalculator />}
        {path === "/age-calculator" && <AgeCalculator />}
        {path === "/bmi-calculator" && <BmiCalculator />}
        {path === "/income-tax-calculator" && <TaxCalculator />}
        {path === "/fd-calculator" && <FdCalculator />}
        {path === "/rd-calculator" && <FdCalculator />}
        {path === "/percentage-calculator" && <PercentageCalculator />}
        {path === "/loan-eligibility-calculator" && <LoanEligibilityCalculator />}
        {path === "/in-hand-salary-calculator" && <SalaryCalculator />}
        {path === "/about" && <About />}
        {path === "/contact" && <Contact />}
        {path === "/privacy-policy" && <Privacy />}
        {path === "/disclaimer" && <Disclaimer />}
        {path === "/terms" && <Terms />}
        {path === "/seo-keywords" && <Keywords />}
        {path === "/setup-guide" && <SetupGuide />}
        {path === "/content-plan" && <ContentPlan />}
        {path === "/sitemap.xml" && <SitemapPage />}
        {!ROUTES.includes(path) && path !== "/sitemap.xml" && <NotFound />}
      </div>
      <Footer />
      <MobileBottomNav currentPath={path} onOpenCalculators={() => setMenuOpen(!menuOpen)} />
    </div>
  );
}

const ROUTES = [
  "/", "/emi-calculator", "/sip-calculator", "/gst-calculator", "/age-calculator",
  "/bmi-calculator", "/income-tax-calculator", "/fd-calculator", "/rd-calculator",
  "/percentage-calculator", "/loan-eligibility-calculator", "/in-hand-salary-calculator",
  "/about", "/contact", "/privacy-policy", "/disclaimer", "/terms",
  "/seo-keywords", "/setup-guide", "/content-plan",
];

function NotFound() {
  useEffect(() => { document.title = "404 – Page Not Found | CalcKaro.in"; window.scrollTo(0, 0); }, []);
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <SearchX className="mx-auto h-14 w-14 text-sky-300" />
      <h1 className="mt-4 text-3xl font-extrabold text-slate-900">404 — Hisaab nahi mila!</h1>
      <p className="mt-2 text-slate-500">That page doesn't exist (or moved). Try one of our popular calculators:</p>
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {CALCULATORS.slice(0, 4).map((c) => (
          <Link key={c.path} to={c.path} className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm font-bold text-sky-800 hover:bg-sky-50">{c.name}</Link>
        ))}
      </div>
      <Link to="/" className="mt-6 inline-block rounded-full bg-[#066fd1] px-6 py-3 text-sm font-bold text-white">← Back to Home</Link>
    </main>
  );
}

function SitemapPage() {
  useEffect(() => { document.title = "Sitemap – CalcKaro.in"; window.scrollTo(0, 0); }, []);
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-extrabold text-slate-900">HTML Sitemap</h1>
      <p className="mt-1 text-sm text-slate-500">XML version: <code className="rounded bg-sky-100 px-1.5 py-0.5 text-xs">/sitemap.xml</code> · robots: <code className="rounded bg-sky-100 px-1.5 py-0.5 text-xs">/robots.txt</code></p>
      <div className="mt-5 grid gap-2">
        {ROUTES.filter((r) => r !== "/rd-calculator").map((r) => (
          <Link key={r} to={r} className="rounded-xl border border-sky-100 bg-white px-4 py-2.5 text-sm font-semibold text-sky-800 hover:bg-sky-50">https://calckaro.in{r}</Link>
        ))}
      </div>
    </main>
  );
}
