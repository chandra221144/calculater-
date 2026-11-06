import { useMemo, useState } from "react";
import { CalcShell } from "../../components/CalcShell";
import { BreakupTable, Donut, Field, ResultCard, Segmented } from "../../components/ui";
import { formatINR, compactINR } from "../../utils/format";
import { CALCULATORS } from "../../data/site";

const META = CALCULATORS.find((c) => c.slug === "salary")!;
const FAQS = [
  { q: "What is CTC vs in-hand salary?", a: "CTC (Cost to Company) includes everything the employer spends: basic + allowances + employer PF + gratuity + insurance + bonus. In-hand = CTC minus employer PF, gratuity, professional tax, TDS and employee PF. Roughly, in-hand monthly ≈ 75–85% of CTC ÷ 12." },
  { q: "What is the in-hand salary for ₹10 LPA CTC?", a: "Roughly ₹70,000–₹73,000/month in the new regime: CTC ₹10L minus employer PF ~₹43,200, gratuity ~₹23,000, employee PF ~₹43,200, PT ₹2,400 and TDS ~₹50,000–₹60,000 = ~₹8.5L in-hand yearly." },
  { q: "How are PF and gratuity calculated?", a: "Employee PF = 12% of (Basic + DA), matched by employer (8.33% of it, up to ₹15,000 wage cap, goes to EPS pension). Gratuity = (Basic + DA) × 15/26 × years of service, payable after 4y10m+ service." },
  { q: "What is professional tax?", a: "A state tax on salaried income — ₹200/month (₹2,400/year) in Maharashtra/Karnataka/MP and similar; zero in Delhi, UP, Haryana and Rajasthan. It is deducted by the employer." },
  { q: "How can I increase in-hand without a hike?", a: "Choose the new regime if you claim few deductions, restructure CTC (more basic = more PF locked; more allowances = more in-hand now), and check for wrong TDS (submit correct regime choice + rent proofs in January)." },
];

const SLABS: [number, number, number][] = [[0, 300000, 0], [300000, 700000, 0.05], [700000, 1000000, 0.10], [1000000, 1200000, 0.15], [1200000, 1500000, 0.20], [1500000, Infinity, 0.30]];
function newRegimeTax(gross: number): number {
  const taxable = Math.max(0, gross - 75000);
  let base = 0;
  for (const [lo, hi, r] of SLABS) base += Math.max(0, Math.min(taxable, hi) - lo) * r;
  if (taxable <= 1200000) return 0;
  const excess = taxable - 1200000;
  let after = base;
  if (base * 1.04 > excess) after = Math.min(base, excess / 1.04);
  return after * 1.04;
}

export default function SalaryCalculator() {
  const [ctc, setCtc] = useState(1000000);
  const [basicPct, setBasicPct] = useState(40);
  const [state, setState] = useState<"pt" | "nopt">("pt");

  const calc = useMemo(() => {
    const basic = (ctc * basicPct) / 100;
    const empPF = Math.min(basic, 180000) * 0.12; // wage cap 15k/mo
    const empyPF = empPF;
    const gratuity = (basic * 15) / 26 / 12 * 12 / 12; // yearly accrual approx: basic*15/26/ (12/12)... use yearly:
    const gratYear = basic * 0.0481; // ~4.81% of basic
    const pt = state === "pt" ? 2400 : 0;
    const grossSalary = ctc - empPF - gratYear; // approx gross for tax (excl employer pf + gratuity)
    const tds = newRegimeTax(grossSalary);
    const inHandYear = ctc - empPF - gratYear - empyPF - pt - tds;
    const inHandMonth = inHandYear / 12;
    void gratuity;
    return { basic, empPF, empyPF, gratYear, pt, grossSalary, tds, inHandYear, inHandMonth };
  }, [ctc, basicPct, state]);

  return (
    <CalcShell path={META.path} title={META.title} meta={META.meta}
      h1="In-Hand Salary Calculator – CTC to Take-Home"
      intro="Convert CTC to monthly in-hand salary with Basic, employer + employee PF, gratuity, professional tax and new-regime TDS — the real breakup Indian payslips hide."
      faqs={FAQS} related={META.related} article={<SalArticle />}>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <Field label="Annual CTC" value={ctc} min={100000} max={10000000} step={10000} onChange={(v) => setCtc(Math.round(v))} hint={compactINR(ctc)} />
          <Field label="Basic + DA (% of CTC)" value={basicPct} min={30} max={60} step={1} onChange={(v) => setBasicPct(v)} prefix="%" hint="Usually 40–50%" />
          <Segmented options={[{ label: "PT state (₹2,400/yr)", value: "pt" }, { label: "No PT (Delhi/UP/HR)", value: "nopt" }]} value={state} onChange={setState} ariaLabel="Professional tax" />
          <BreakupTable head={["Component (yearly)", "Amount", "Note"]} rows={[
            ["Basic + DA", formatINR(Math.round(calc.basic)), `${basicPct}% of CTC`],
            ["Allowances (HRA + other)", formatINR(Math.round(ctc - calc.basic - calc.empPF - calc.gratYear)), "Balancing figure"],
            ["Employer PF", "− " + formatINR(Math.round(calc.empPF)), "12% of basic, capped"],
            ["Gratuity accrual", "− " + formatINR(Math.round(calc.gratYear)), "~4.81% of basic"],
            ["Employee PF", "− " + formatINR(Math.round(calc.empyPF)), "Your retirement saving"],
            ["Professional tax", "− " + formatINR(Math.round(calc.pt)), state === "pt" ? "₹200/mo" : "Nil in your state"],
            ["TDS (new regime)", "− " + formatINR(Math.round(calc.tds)), "Approx on gross"],
          ]} foot={["In-hand (yearly)", formatINR(Math.round(calc.inHandYear)), ""]} />
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Monthly in-hand" value={formatINR(Math.round(calc.inHandMonth))} sub={`${((calc.inHandMonth * 12 / Math.max(ctc, 1)) * 100).toFixed(0)}% of CTC`} highlight />
            <ResultCard label="Yearly in-hand" value={formatINR(Math.round(calc.inHandYear))} sub={`CTC ${compactINR(ctc)}`} />
            <ResultCard label="Monthly TDS" value={formatINR(Math.round(calc.tds / 12))} sub="New regime FY 25-26" />
            <ResultCard label="Total PF (E+E)" value={formatINR(Math.round(calc.empPF + calc.empyPF))} sub="Yearly retirement saving" />
          </div>
          <div className="rounded-xl border border-sky-100 bg-white p-4">
            <p className="mb-3 text-sm font-bold text-slate-800">Where your CTC goes</p>
            <Donut parts={[{ label: "In-hand", value: Math.max(0, calc.inHandYear), color: "#10b981" }, { label: "PF (both)", value: calc.empPF + calc.empyPF, color: "#066fd1" }, { label: "TDS", value: calc.tds, color: "#ef4444" }, { label: "Gratuity+PT", value: calc.gratYear + calc.pt, color: "#f59e0b" }]} centerTop="CTC" centerBottom={compactINR(ctc)} />
          </div>
          <div className="rounded-xl border border-sky-100 bg-white p-4 text-sm leading-relaxed text-slate-600">
            <p className="font-bold text-slate-800">💡 Offer-letter decoder</p>
            <p className="mt-1">A “{compactINR(ctc)} package” really means <strong>{formatINR(Math.round(calc.inHandMonth))}/month in-hand</strong> + {formatINR(Math.round((calc.empPF + calc.empyPF) / 12))}/month locked in PF + gratuity paid only after ~5 years. Always compare offers on <strong>in-hand + PF</strong>, not CTC.</p>
          </div>
        </div>
      </div>
    </CalcShell>
  );
}

function SalArticle() {
  return (
    <>
      <h2>CTC vs in-hand: why the gap?</h2>
      <p><strong>CTC (Cost to Company)</strong> is everything your employer spends on you — not what you receive. From CTC, the company deducts <strong>employer PF</strong> (12% of basic), <strong>gratuity accrual</strong> (~4.81% of basic, paid only after ~5 years), insurance premiums and bonuses paid later. Then from your gross, <strong>employee PF</strong>, <strong>professional tax</strong> (₹2,400/yr in most states) and <strong>TDS</strong> (income tax) are cut. What's left ÷ 12 = <strong>monthly in-hand</strong>, typically 75–85% of CTC ÷ 12.</p>
      <h2>In-hand formula</h2>
      <span className="formula">In-hand/yr = CTC − Employer PF − Gratuity − Employee PF − PT − TDS</span>
      <p>Example: <strong>₹10,00,000 CTC, 40% basic</strong> (₹4L). Employer PF = ₹43,200 (capped), gratuity ≈ ₹19,240, employee PF = ₹43,200, PT = ₹2,400. Gross for tax ≈ ₹9.37L → new-regime TDS ≈ <strong>₹45,000</strong>. In-hand ≈ 10L − 43.2K − 19.2K − 43.2K − 2.4K − 45K = <strong>₹8.47L/yr ≈ ₹70,600/month</strong>.</p>
      <h2>CTC to in-hand table (40% basic, new regime, PT state)</h2>
      <table><thead><tr><th>CTC</th><th>Monthly in-hand</th><th>% of CTC</th></tr></thead><tbody>
        <tr><td>₹4 LPA</td><td>~₹29,500</td><td>89%</td></tr>
        <tr><td>₹6 LPA</td><td>~₹44,000</td><td>88%</td></tr>
        <tr><td>₹10 LPA</td><td>~₹70,600</td><td>85%</td></tr>
        <tr><td>₹15 LPA</td><td>~₹1,01,000</td><td>81%</td></tr>
        <tr><td>₹25 LPA</td><td>~₹1,58,000</td><td>76%</td></tr>
      </tbody></table>
      <h2>Tips for salaried Indians</h2>
      <ul>
        <li><strong>Pick regime smartly</strong> — few deductions → new regime; big HRA + 80C + home loan → compare old.</li>
        <li><strong>Check Form 16 in June</strong> — verify TDS matches your regime choice; wrong regime = refund delay.</li>
        <li><strong>Negotiate on in-hand</strong> — ask HR for the salary annexure split; a “higher CTC” with joining bonus can mean lower monthly pay.</li>
        <li><strong>Track PF in UMANG/EPFO</strong> — employer share + 8.25% interest is real wealth; never withdraw on job change, transfer via UAN.</li>
      </ul>
    </>
  );
}
