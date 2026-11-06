export const BRAND = {
  name: "CalcKaro",
  domain: "calckaro.in",
  full: "CalcKaro.in",
  tagline: "Simple Indian Finance Calculators in ₹",
  url: "https://calckaro.in",
  email: "hello@calckaro.in",
};

export const DOMAIN_IDEAS = [
  { name: "CalcKaro.in", why: "WINNER — Short, Hinglish CTA ('calculate now'), easy to remember, brandable. Used as this site's brand." },
  { name: "HisaabKitaab.in", why: "Desi trust word for accounts; great for older + Hindi-belt audience, high recall." },
  { name: "PaisaGuru.in", why: "'Guru' builds authority for finance; good for blog + YouTube expansion." },
  { name: "GintiMitra.in", why: "Friendly + Marathi/Hindi friendly ('ginti' = counting); unique, low competition." },
  { name: "RupaiyaCalc.in", why: "Keyword-rich ('rupaiya' = money); helps CTR on Indian finance SERPs." },
];

export interface CalcMeta {
  slug: string;
  path: string;
  name: string;
  short: string;
  desc: string;
  icon: string;
  color: string;
  keywords: string;
  title: string;
  meta: string;
  related: string[];
}

export const CALCULATORS: CalcMeta[] = [
  {
    slug: "emi",
    path: "/emi-calculator",
    name: "EMI Calculator",
    short: "Home, car & personal loan EMI",
    desc: "Calculate monthly EMI, total interest & amortisation for any loan.",
    icon: "landmark",
    color: "blue",
    keywords: "emi calculator",
    title: "EMI Calculator India – Loan EMI with Breakup (2026)",
    meta: "Free EMI calculator for home, car & personal loans. Instant EMI in ₹, interest breakup, chart & amortisation table.",
    related: ["/sip-calculator", "/loan-eligibility-calculator", "/fd-calculator"],
  },
  {
    slug: "sip",
    path: "/sip-calculator",
    name: "SIP Calculator",
    short: "Mutual fund SIP growth",
    desc: "Project SIP wealth with step-up, inflation-adjusted value & charts.",
    icon: "trendingUp",
    color: "emerald",
    keywords: "sip calculator with inflation",
    title: "SIP Calculator – Mutual Fund Returns with Step-Up (2026)",
    meta: "Free SIP calculator with step-up & inflation view. See invested vs gains in ₹ with yearly growth chart.",
    related: ["/emi-calculator", "/fd-calculator", "/percentage-calculator"],
  },
  {
    slug: "gst",
    path: "/gst-calculator",
    name: "GST Calculator",
    short: "Add or remove GST 5–28%",
    desc: "Add/remove GST, split CGST + SGST for bills & invoices.",
    icon: "receipt",
    color: "amber",
    keywords: "gst calculator india",
    title: "GST Calculator India – Add/Remove GST, CGST+SGST (2026)",
    meta: "Free GST calculator: add or remove 5%, 12%, 18%, 28% GST. Instant CGST/SGST split for invoices.",
    related: ["/percentage-calculator", "/emi-calculator", "/in-hand-salary-calculator"],
  },
  {
    slug: "age",
    path: "/age-calculator",
    name: "Age Calculator",
    short: "Exact age in Y-M-D",
    desc: "Find exact age, total days lived & next birthday countdown.",
    icon: "cake",
    color: "pink",
    keywords: "age calculator date of birth",
    title: "Age Calculator – Exact Age from Date of Birth (2026)",
    meta: "Free age calculator: exact years, months, days from DOB. Total days lived & next birthday countdown.",
    related: ["/bmi-calculator", "/percentage-calculator", "/in-hand-salary-calculator"],
  },
  {
    slug: "bmi",
    path: "/bmi-calculator",
    name: "BMI Calculator",
    short: "Body mass index + category",
    desc: "Check BMI, health category & ideal weight range for Indians.",
    icon: "heart",
    color: "rose",
    keywords: "bmi calculator india",
    title: "BMI Calculator India – Check Body Mass Index & Ideal Wt",
    meta: "Free BMI calculator for Indian men & women. Instant BMI, health category & ideal weight range.",
    related: ["/age-calculator", "/percentage-calculator", "/in-hand-salary-calculator"],
  },
  {
    slug: "tax",
    path: "/income-tax-calculator",
    name: "Income Tax Calculator",
    short: "New regime FY 2025-26",
    desc: "New-regime tax with slabs, rebate u/s 87A & 4% cess.",
    icon: "fileText",
    color: "indigo",
    keywords: "income tax calculator new regime",
    title: "Income Tax Calculator FY 2025-26 – New Regime Slabs",
    meta: "Free income tax calculator for new regime FY 2025-26. Slab breakup, 87A rebate & cess in ₹.",
    related: ["/in-hand-salary-calculator", "/emi-calculator", "/fd-calculator"],
  },
  {
    slug: "fd",
    path: "/fd-calculator",
    name: "FD / RD Calculator",
    short: "Fixed & recurring deposits",
    desc: "FD maturity & RD corpus with quarterly compounding.",
    icon: "piggy",
    color: "teal",
    keywords: "fd calculator, rd calculator",
    title: "FD & RD Calculator – Maturity Value with Interest (2026)",
    meta: "Free FD & RD calculator with quarterly compounding. Maturity value, interest earned & yearly table in ₹.",
    related: ["/sip-calculator", "/emi-calculator", "/income-tax-calculator"],
  },
  {
    slug: "percentage",
    path: "/percentage-calculator",
    name: "Percentage Calculator",
    short: "%, increase, decrease",
    desc: "X% of Y, reverse %, discount & marks percentage.",
    icon: "percent",
    color: "violet",
    keywords: "percentage calculator",
    title: "Percentage Calculator – % Of, Increase & Discount (2026)",
    meta: "Free percentage calculator: X% of Y, reverse %, increase/decrease & discount. Ideal for marks & bills.",
    related: ["/gst-calculator", "/sip-calculator", "/age-calculator"],
  },
  {
    slug: "eligibility",
    path: "/loan-eligibility-calculator",
    name: "Loan Eligibility Calculator",
    short: "How much loan can you get?",
    desc: "Max loan from salary, existing EMIs & FOIR rule.",
    icon: "badgeCheck",
    color: "cyan",
    keywords: "home loan eligibility calculator",
    title: "Loan Eligibility Calculator – Home Loan by Salary (2026)",
    meta: "Free loan eligibility calculator: max home/personal loan by salary, FOIR & tenure. Instant ₹ result.",
    related: ["/emi-calculator", "/in-hand-salary-calculator", "/income-tax-calculator"],
  },
  {
    slug: "salary",
    path: "/in-hand-salary-calculator",
    name: "In-Hand Salary Calculator",
    short: "CTC to take-home pay",
    desc: "CTC breakup: PF, gratuity, PT & TDS to monthly in-hand.",
    icon: "wallet",
    color: "orange",
    keywords: "in hand salary calculator ctc",
    title: "In-Hand Salary Calculator – CTC to Take-Home Pay (2026)",
    meta: "Free in-hand salary calculator: CTC to monthly take-home with PF, gratuity, PT & TDS breakup.",
    related: ["/income-tax-calculator", "/loan-eligibility-calculator", "/emi-calculator"],
  },
];

export const KEYWORDS = [
  { kw: "emi calculator", vol: "High (~1M+)", diff: "High", why: "Evergreen + huge volume; bank pages rank but are slow — a fast, simple page can win long-tail (e.g. '20 lakh home loan emi')." },
  { kw: "sip calculator", vol: "High (~800K)", diff: "High", why: "Mutual-fund boom keyword; add step-up + inflation toggles to beat generic tools on depth." },
  { kw: "sip calculator with inflation", vol: "Medium", diff: "Low", why: "Long-tail with clear intent and weak competition — easy first-page win + featured snippet chance." },
  { kw: "gst calculator india", vol: "Medium", diff: "Low", why: "Business + student intent, low-quality competitors; CGST/SGST split + examples rank fast." },
  { kw: "income tax calculator new regime", vol: "High (seasonal)", diff: "Medium", why: "Spikes Jan–Jul every year; fresh FY 2025-26 slabs + rebate table = fast traffic burst." },
  { kw: "fd calculator", vol: "High", diff: "Medium", why: "Mass 40+ audience, low bounce if maturity table is clear; great for AdSense RPM (finance ads)." },
  { kw: "age calculator date of birth", vol: "High", diff: "Low", why: "Very easy to rank, huge student/parent traffic; perfect entry page to funnel users to finance tools." },
  { kw: "bmi calculator india", vol: "Medium", diff: "Low", why: "Health + finance combo keeps site 'multi-utility'; Indian ideal-weight table differentiates you." },
  { kw: "home loan eligibility calculator", vol: "Medium", diff: "Medium", why: "High-intent pre-purchase keyword; banks bid high CPC → excellent AdSense earnings per click." },
  { kw: "in hand salary calculator ctc", vol: "Medium", diff: "Low", why: "Fresher/job-switch intent, highly shareable on WhatsApp/LinkedIn; low competition for accurate CTC breakup." },
];

export const CONTENT_PLAN = [
  { day: "Day 1–2", type: "Tool", title: "PPF Calculator (15-yr, 7.1%)", why: "High-volume govt scheme keyword; EEE + table = easy rank." },
  { day: "Day 3–4", type: "Blog", title: "SIP vs FD: ₹5,000/month for 10 years — real math", why: "Comparison posts capture 'vs' searches + internal links to both tools." },
  { day: "Day 5–6", type: "Tool", title: "RD Calculator (standalone page)", why: "Split from FD page to target 'rd calculator' keyword separately." },
  { day: "Day 7–8", type: "Blog", title: "How EMI is calculated (formula + 3 examples)", why: "Supports EMI page; targets 'how to calculate emi' featured snippet." },
  { day: "Day 9–10", type: "Tool", title: "Lumpsum / Mutual Fund Returns Calculator", why: "Pairs with SIP; targets 'lumpsum calculator' medium volume." },
  { day: "Day 11–12", type: "Blog", title: "New vs Old Tax Regime: which is better under ₹12 lakh?", why: "Seasonal spike keyword; table + verdict = shares + links." },
  { day: "Day 13–14", type: "Tool", title: "Home Loan Prepayment Calculator", why: "High-intent homeowner keyword; low competition, high CPC." },
  { day: "Day 15–16", type: "Blog", title: "What is CIBIL score? 7 ways to improve it fast", why: "Huge volume, beginners; funnels to loan eligibility tool." },
  { day: "Day 17–18", type: "Tool", title: "Gratuity Calculator (as per Payment of Gratuity Act)", why: "Salaried + HR searches; simple formula, quick build." },
  { day: "Day 19–20", type: "Blog", title: "GST rates list 2026: 5%, 12%, 18%, 28% items explained", why: "Reference post = backlinks; supports GST calculator." },
  { day: "Day 21–22", type: "Tool", title: "NPS Calculator (Tier-1, annuity split)", why: "Retirement keyword growing; anchors 'pension' topic cluster." },
  { day: "Day 23–24", type: "Blog", title: "CTC vs In-hand: ₹6 LPA, ₹10 LPA, ₹15 LPA real breakup", why: "Targets 3 salary long-tails in one post; very shareable." },
  { day: "Day 25–26", type: "Tool", title: "Compound Interest Calculator", why: "Student + investor keyword; simple tool, fast build." },
  { day: "Day 27–28", type: "Blog", title: "Top 5 FD rates compared (SBI, HDFC, ICICI, Post Office)", why: "Fresh-rate posts get clicks; update monthly for return visits." },
  { day: "Day 29–30", type: "Tool + Roundup", title: "SSY Calculator + '10 calculators' roundup post", why: "Parent-focused SSY keyword + internal-link powerhouse post." },
];
