import { useState } from "react";
import { Mail, MapPin, Send, ShieldCheck, FileText, AlertTriangle, Scale, Users, CheckCircle2 } from "lucide-react";
import { Breadcrumb, Link } from "../components/Layout";
import { AdSlot } from "../components/ui";
import { BRAND } from "../data/site";
import { useSEO } from "../hooks/useSEO";

function PageShell({ title, desc, h1, children }: { title: string; desc: string; h1: string; children: React.ReactNode }) {
  useSEO({ title, description: desc, canonical: `https://calckaro.in/${title.toLowerCase()}` });
  return (
    <main className="mx-auto max-w-3xl px-4">
      <div className="pt-5"><Breadcrumb items={[{ label: "Home", to: "/" }, { label: h1 }]} /></div>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{h1}</h1>
      <AdSlot label="Static page top" size="responsive" />
      <article className="seo-article rounded-2xl border border-sky-100 bg-white p-5 sm:p-8">{children}</article>
      <AdSlot label="Static page bottom" size="responsive" />
    </main>
  );
}

export function About() {
  return (
    <PageShell title="About Us – CalcKaro.in | Free Indian Calculators" desc="About CalcKaro.in — our mission to make Indian money maths simple with free EMI, SIP, tax & salary calculators." h1="About Us">
      <p><strong>CalcKaro.in</strong> (“just calculate it!”) started in 2026 with one frustration: Indian finance calculators were either slow bank pages full of pop-ups, or foreign tools showing $ instead of ₹. We built the toolkit we wished existed — <strong>fast, free, private calculators that speak Indian money</strong>: lakhs and crores, FY 2025-26 tax slabs, CGST+SGST splits, and examples like “₹50 lakh home loan” instead of “$60,000 mortgage”.</p>
      <h2>What we offer</h2>
      <ul>
        <li><strong>10 calculators at launch</strong> — EMI, SIP, GST, Age, BMI, Income Tax (new regime), FD/RD, Percentage, Loan Eligibility and In-Hand Salary — with more (PPF, NPS, Gratuity, SSY) every week.</li>
        <li><strong>Plain-English learning</strong> — every tool has its formula, a solved Indian example and 5 FAQs, so students and first-time earners actually understand the maths.</li>
        <li><strong>Privacy by design</strong> — all calculations run in your browser via JavaScript. We never ask for your name, salary or PAN to use a calculator, and we never sell data.</li>
      </ul>
      <h2>How we make money</h2>
      <p>CalcKaro.in is free forever. We plan to cover hosting costs with <strong>Google AdSense ads</strong> and clearly-labelled affiliate links (e.g. to mutual-fund platforms) — never by selling your data or charging for calculators. Ads never influence our maths: formulas are standard (reducing-balance EMI, quarterly FD compounding, CBIC GST slabs) and verifiable.</p>
      <h2>Editorial standards</h2>
      <p>Tax slabs, FD rates and GST lists are <strong>reviewed every budget and quarter</strong>; each page shows an “Updated” date. Found an error? Email <strong>{BRAND.email}</strong> — we fix verified mistakes within 48 hours and credit reporters on the page.</p>
      <h2>Contact</h2>
      <p>CalcKaro.in · Mumbai, Maharashtra, India · <strong>{BRAND.email}</strong> · Use our <Link to="/contact" className="font-bold text-sky-700 underline">contact page</Link> for feedback, corrections or partnership queries.</p>
    </PageShell>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", topic: "Feedback", message: "" });
  useSEO({ title: "Contact Us – CalcKaro.in | Feedback & Support", description: "Contact CalcKaro.in for feedback, corrections or partnerships. We reply within 2 working days.", canonical: "https://calckaro.in/contact" });
  return (
    <main className="mx-auto max-w-3xl px-4">
      <div className="pt-5"><Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Contact Us" }]} /></div>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Contact Us</h1>
      <p className="mt-2 text-slate-600">Feedback, calculation doubts, error reports or partnerships — we reply within <strong>2 working days</strong>.</p>
      <AdSlot label="Contact top" size="responsive" />
      <div className="grid gap-4 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-3">
          <div className="rounded-2xl border border-sky-100 bg-white p-5">
            <p className="flex items-center gap-2 font-bold text-slate-900"><Mail className="h-4 w-4 text-sky-600" /> Email</p>
            <p className="mt-1 text-sm text-slate-600">{BRAND.email}<br />support@{BRAND.domain}</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-white p-5">
            <p className="flex items-center gap-2 font-bold text-slate-900"><MapPin className="h-4 w-4 text-sky-600" /> Address</p>
            <p className="mt-1 text-sm text-slate-600">CalcKaro.in<br />Andheri East, Mumbai 400069<br />Maharashtra, India</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-white p-5">
            <p className="flex items-center gap-2 font-bold text-slate-900"><Users className="h-4 w-4 text-sky-600" /> Response time</p>
            <p className="mt-1 text-sm text-slate-600">Mon–Sat, 10am–6pm IST.<br />Ad queries: 5 working days.</p>
          </div>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-white p-5 sm:p-6">
          {sent ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
              <p className="mt-3 text-lg font-extrabold text-slate-900">Message received! 🙏</p>
              <p className="mt-1 text-sm text-slate-500">Thanks {form.name || "friend"} — we'll reply to {form.email || "your email"} within 2 working days.</p>
              <button onClick={() => { setSent(false); setForm({ name: "", email: "", topic: "Feedback", message: "" }); }} className="mt-4 rounded-xl bg-sky-100 px-4 py-2 text-sm font-bold text-sky-800">Send another</button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">Your name *</span>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Rahul Sharma" className="mt-1 w-full rounded-xl border border-sky-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label>
                <label className="block"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">Email *</span>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@gmail.com" className="mt-1 w-full rounded-xl border border-sky-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label>
              </div>
              <label className="block"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">Topic</span>
                <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="mt-1 w-full rounded-xl border border-sky-200 bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-sky-500">
                  {["Feedback", "Calculation error", "New calculator request", "Advertising", "Partnership", "Other"].map((t) => <option key={t}>{t}</option>)}
                </select></label>
              <label className="block"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">Message *</span>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Which calculator? What did you enter? What did you expect? Screenshots help!" className="mt-1 w-full rounded-xl border border-sky-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#066fd1] px-4 py-3 text-sm font-bold text-white hover:bg-[#0a5cab]"><Send className="h-4 w-4" /> Send message</button>
              <p className="text-center text-xs text-slate-400">By sending, you agree to our <Link to="/privacy-policy" className="underline">Privacy Policy</Link>. Never share OTPs, PAN or bank passwords.</p>
            </form>
          )}
        </div>
      </div>
      <AdSlot label="Contact bottom" size="responsive" />
    </main>
  );
}

export function Privacy() {
  return (
    <PageShell title="Privacy Policy – CalcKaro.in | How We Handle Data" desc="Privacy Policy of CalcKaro.in: what data we collect (minimal), cookies, AdSense, and your rights under Indian law." h1="Privacy Policy">
      <p className="text-sm text-slate-500">Last updated: 6 February 2026 · CalcKaro.in (“we”, “our”) respects your privacy. This policy explains what we collect and why, in plain English.</p>
      <h2><span className="mr-1 inline-flex items-center gap-1"><ShieldCheck className="h-5 w-5 text-emerald-600" /></span>1. Data we collect</h2>
      <p><strong>Calculator inputs stay with you.</strong> EMI, salary and SIP numbers you type are processed in your browser's JavaScript and are <strong>never sent to our servers</strong>. We collect only: (a) <strong>contact-form details</strong> (name, email, message) when you write to us; (b) <strong>anonymous analytics</strong> (pages visited, device type, approximate city) via privacy-friendly tools; (c) <strong>cookies</strong> for preferences and advertising (see §3).</p>
      <h2>2. How we use data</h2>
      <ul>
        <li>Reply to your messages and fix reported errors.</li>
        <li>Understand which calculators are popular so we can improve them.</li>
        <li>Show relevant ads via Google AdSense (after approval) to keep the site free.</li>
      </ul>
      <p>We <strong>never sell, rent or share</strong> personal data with third parties for their marketing. We do not ask for PAN, Aadhaar, OTPs or bank passwords — anyone asking for these in our name is a fraud.</p>
      <h2>3. Cookies & Google AdSense</h2>
      <p>We use essential cookies (site function) and, after consent where required, <strong>Google AdSense/Analytics cookies</strong>. Google may use the <strong>DoubleClick cookie</strong> to show interest-based ads. You can opt out via <strong>Google Ads Settings</strong> or <strong>aboutads.info/choices</strong>. Blocking cookies may make ads less relevant but the calculators will still work fully.</p>
      <h2>4. Data retention & security</h2>
      <p>Contact emails are kept up to <strong>2 years</strong>, then deleted. Analytics is aggregated and anonymised. The site is served over <strong>HTTPS</strong>; however no internet transmission is 100% secure, so please don't send sensitive financial documents via the contact form.</p>
      <h2>5. Children's privacy</h2>
      <p>Our calculators are general-audience tools suitable for students 13+, but we do not knowingly collect data from children under 13. Parents may contact us to delete any such data.</p>
      <h2>6. Your rights (India – DPDP Act 2023)</h2>
      <p>You may request <strong>access, correction or deletion</strong> of your personal data, withdraw consent, and raise grievances by emailing <strong>{BRAND.email}</strong> with subject “Privacy Request”. Our Grievance Officer (Mumbai, India) responds within <strong>30 days</strong>.</p>
      <h2>7. Third-party links</h2>
      <p>We link to official sources (incometax.gov.in, CBIC, bank sites). Their privacy practices are their own; please read their policies.</p>
      <h2>8. Changes</h2>
      <p>Material changes will be announced on this page with a new “Last updated” date. Continued use after changes means acceptance.</p>
    </PageShell>
  );
}

export function Disclaimer() {
  return (
    <PageShell title="Disclaimer – CalcKaro.in | Estimates, Not Advice" desc="Disclaimer: CalcKaro.in calculators give estimates for education only, not financial, tax or legal advice." h1="Disclaimer">
      <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        <p><strong>Short version:</strong> our calculators give good estimates for learning and planning — they are <strong>not</strong> financial, tax, legal or medical advice. Always confirm with your bank, CA, doctor or advisor before acting.</p>
      </div>
      <h2>1. Estimates only</h2>
      <p>Results use standard formulas (reducing-balance EMI, quarterly FD compounding, FY 2025-26 new-regime slabs, CBIC GST rates) but <strong>actual bank figures may differ</strong> due to rounding, exact disbursal dates, processing fees, insurance, prepayment rules, TDS, state professional-tax variations and mid-year rate changes. EMI/TDS outputs are typically accurate within ±1% but are not quotes or offers.</p>
      <h2>2. No professional advice</h2>
      <p>Nothing on CalcKaro.in — including tax examples, SIP projections and BMI categories — creates a <strong>CA, financial-advisor, legal or doctor-patient</strong> relationship. Mutual-fund returns are illustrative (markets fluctuate); tax examples assume stated conditions; BMI is a screening tool, not a diagnosis.</p>
      <h2>3. No warranties</h2>
      <p>The site is provided <strong>“as is”</strong> without warranties of accuracy, completeness or fitness for purpose. We update slabs and rates regularly but errors can occur; verified corrections are fixed within 48 hours of reporting to <strong>{BRAND.email}</strong>.</p>
      <h2>4. Limitation of liability</h2>
      <p>To the maximum extent permitted by Indian law, CalcKaro.in and its owners are <strong>not liable</strong> for any loss (loan rejection, tax penalty, investment loss, health decisions) arising from use of this site. Your use of results is at your own risk and judgment.</p>
      <h2>5. External links & ads</h2>
      <p>We link to official and reputable sources for verification, but we don't control their content. <strong>Ads shown via Google AdSense</strong> are by third parties; we don't endorse advertised products — please do your own due diligence.</p>
      <h2>6. Fair use</h2>
      <p>You may share our result screenshots and link to our pages with credit. Scraping or republishing full articles without permission is not allowed (see <Link to="/terms" className="font-bold text-sky-700 underline">Terms</Link>).</p>
    </PageShell>
  );
}

export function Terms() {
  return (
    <PageShell title="Terms & Conditions – CalcKaro.in | Use Policy" desc="Terms of using CalcKaro.in: acceptable use, intellectual property, liability and Indian governing law." h1="Terms & Conditions">
      <p className="text-sm text-slate-500">Last updated: 6 February 2026 · By using CalcKaro.in you agree to these terms. If you disagree, please don't use the site.</p>
      <h2><span className="mr-1 inline-flex items-center gap-1"><Scale className="h-5 w-5 text-sky-700" /></span>1. The service</h2>
      <p>CalcKaro.in provides <strong>free browser-based calculators and educational articles</strong> for Indian users. No account is needed. We may add, modify or remove tools, and show ads (Google AdSense) to keep the service free.</p>
      <h2>2. Acceptable use — you agree NOT to</h2>
      <ul>
        <li>Scrape, bulk-copy or republish our content/tools without written permission.</li>
        <li>Reverse-engineer, overload (DDoS) or attempt to breach the site's security.</li>
        <li>Use results to mislead others (fake salary slips, fake loan quotes, fake tax filings).</li>
        <li>Submit spam, abuse or unlawful content via the contact form.</li>
      </ul>
      <h2>3. Intellectual property</h2>
      <p>All text, design, code and branding (including “CalcKaro.in”) are owned by us and protected under Indian copyright law. You may <strong>link to and quote short excerpts with credit + link</strong>; any other reproduction needs permission at <strong>{BRAND.email}</strong>.</p>
      <h2>4. Accuracy & liability</h2>
      <p>As detailed in our <Link to="/disclaimer" className="font-bold text-sky-700 underline">Disclaimer</Link>, tools are estimates for education only. To the fullest extent allowed by law, our total liability for any claim is limited to <strong>₹1,000</strong>.</p>
      <h2>5. Third-party services & ads</h2>
      <p>We use hosting, analytics and <strong>Google AdSense</strong>; their terms apply to those services. Clicking ads or external links is at your discretion — we aren't responsible for third-party sites or offers.</p>
      <h2>6. Privacy</h2>
      <p>Use of personal data is governed by our <Link to="/privacy-policy" className="font-bold text-sky-700 underline">Privacy Policy</Link>, which forms part of these terms.</p>
      <h2>7. Governing law</h2>
      <p>These terms are governed by the <strong>laws of India</strong>. Courts at <strong>Mumbai, Maharashtra</strong> have exclusive jurisdiction. If any clause is held invalid, the rest remain in force.</p>
      <h2>8. Contact</h2>
      <p className="flex items-center gap-2"><FileText className="h-4 w-4 text-sky-600" /> Questions? Email <strong>{BRAND.email}</strong> or use the <Link to="/contact" className="font-bold text-sky-700 underline">contact page</Link>.</p>
    </PageShell>
  );
}
