import { useMemo, useState } from "react";
import { CalcShell } from "../../components/CalcShell";
import { BreakupTable, Donut, Field, ResultCard } from "../../components/ui";
import { formatINR, compactINR } from "../../utils/format";
import { CALCULATORS } from "../../data/site";

const META = CALCULATORS.find((c) => c.slug === "eligibility")!;
const FAQS = [
  { q: "How do banks calculate home loan eligibility?", a: "Banks allow total EMIs up to 40–50% of net monthly income (FOIR), then convert that max EMI into a loan amount using the rate and tenure. They also check CIBIL (750+ preferred), age, job stability and property value (LTV up to 75–90%)." },
  { q: "What loan can I get on ₹50,000 salary?", a: "At 50% FOIR with no existing EMIs, max EMI = ₹25,000. At 8.5% for 20 years that's roughly a ₹28.8 lakh loan. With a ₹5,000 existing EMI, eligibility drops to ~₹23 lakh." },
  { q: "What is FOIR?", a: "Fixed Obligation to Income Ratio = (all EMIs ÷ net monthly income) × 100. Banks cap it at 40% (lower salaries) to 50–65% (high salaries). Lower FOIR = higher eligibility + easier approval." },
  { q: "Does CIBIL score affect eligibility amount?", a: "Yes — 750+ gets full eligibility and best rates (~8.4–8.8%); 650–750 may cut eligibility 10–20% and add 0.5–1% rate; below 650 often means rejection or a co-applicant requirement." },
  { q: "How can I increase my loan eligibility?", a: "Add a co-applicant (spouse income), close small loans/credit-card EMIs, choose longer tenure, show bonuses/rental income with proof, and raise CIBIL above 750 six months before applying." },
];

export default function LoanEligibilityCalculator() {
  const [income, setIncome] = useState(80000);
  const [existingEmi, setExistingEmi] = useState(5000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const [foir, setFoir] = useState(50);

  const calc = useMemo(() => {
    const maxEmi = (income * foir) / 100;
    const availEmi = Math.max(0, maxEmi - existingEmi);
    const r = rate / 12 / 100, n = years * 12;
    let eligible = 0;
    if (r > 0 && n > 0 && availEmi > 0) eligible = (availEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
    else eligible = availEmi * n;
    const totalPay = availEmi * n;
    const interest = Math.max(0, totalPay - eligible);
    const combos: { tenure: number; loan: number }[] = [10, 15, 20, 25, 30].map((t) => {
      const nn = t * 12;
      const L = r > 0 ? (availEmi * (Math.pow(1 + r, nn) - 1)) / (r * Math.pow(1 + r, nn)) : availEmi * nn;
      return { tenure: t, loan: availEmi > 0 ? L : 0 };
    });
    return { maxEmi, availEmi, eligible, interest, totalPay, combos };
  }, [income, existingEmi, rate, years, foir]);

  return (
    <CalcShell path={META.path} title={META.title} meta={META.meta}
      h1="Loan Eligibility Calculator – by Salary"
      intro="Find your maximum home/personal loan from net salary, existing EMIs, FOIR rule, rate and tenure — with tenure-wise eligibility table."
      faqs={FAQS} related={META.related} article={<EligArticle />}>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <Field label="Net monthly income (take-home)" value={income} min={10000} max={1000000} step={1000} onChange={(v) => setIncome(Math.round(v))} hint={compactINR(income) + "/mo"} />
          <Field label="Existing EMIs (all loans + cards)" value={existingEmi} min={0} max={300000} step={500} onChange={(v) => setExistingEmi(Math.round(v))} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Interest rate" value={rate} min={5} max={24} step={0.1} onChange={setRate} prefix="%" />
            <Field label="Tenure" value={years} min={5} max={30} step={1} onChange={(v) => setYears(Math.round(v))} prefix=" yrs" />
          </div>
          <Field label="FOIR limit (bank rule)" value={foir} min={30} max={65} step={1} onChange={(v) => setFoir(Math.round(v))} prefix="%" hint="Usually 40–50%" />
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Max loan eligible" value={formatINR(Math.round(calc.eligible))} sub={`${compactINR(calc.eligible)} approx`} highlight />
            <ResultCard label="Available EMI" value={formatINR(Math.round(calc.availEmi))} sub={`Max ${formatINR(Math.round(calc.maxEmi))} − existing`} />
            <ResultCard label="Total interest" value={formatINR(Math.round(calc.interest))} sub={`over ${years} yrs`} />
            <ResultCard label="Current FOIR used" value={`${income > 0 ? ((existingEmi / income) * 100).toFixed(1) : 0}%`} sub={`Limit ${foir}%`} />
          </div>
          <div className="rounded-xl border border-sky-100 bg-white p-4">
            <p className="mb-3 text-sm font-bold text-slate-800">Income split at max eligibility</p>
            <Donut parts={[{ label: "New EMI", value: calc.availEmi, color: "#066fd1" }, { label: "Existing EMIs", value: existingEmi, color: "#f59e0b" }, { label: "Free income", value: Math.max(0, income - calc.maxEmi), color: "#10b981" }]} centerTop="Income" centerBottom={compactINR(income) + "/mo"} />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <p className="mb-2 text-sm font-bold text-slate-800">Eligibility at different tenures (same EMI ₹{calc.availEmi.toLocaleString("en-IN")})</p>
        <BreakupTable head={["Tenure", "Max loan", "Total interest", "Total payout"]} rows={calc.combos.map((c) => [`${c.tenure} years`, formatINR(Math.round(c.loan)), formatINR(Math.round(Math.max(0, calc.availEmi * c.tenure * 12 - c.loan))), formatINR(Math.round(calc.availEmi * c.tenure * 12))])} />
      </div>
    </CalcShell>
  );
}

function EligArticle() {
  return (
    <>
      <h2>How loan eligibility works</h2>
      <p>Banks answer two questions: <strong>(1) How much EMI can you afford?</strong> and <strong>(2) What loan does that EMI buy?</strong> Q1 uses the <strong>FOIR rule</strong> — total EMIs (new + existing) ≤ 40–50% of net monthly income. Q2 converts that EMI into principal with the loan formula. Then they apply filters: <strong>CIBIL 750+</strong>, stable job (2+ years), age (loan ends before 60–65), and property value (LTV 75–90%, so 10–25% down payment is mandatory).</p>
      <h2>Eligibility formula</h2>
      <span className="formula">Max EMI = Income × FOIR − Existing EMIs  |  P = EMI × ((1+r)^n − 1) / (r(1+r)^n)</span>
      <p>Example: ₹80,000 salary, 50% FOIR, ₹5,000 existing EMI → max EMI = ₹40,000, available = <strong>₹35,000</strong>. At 8.5% for 20 years (r = 0.007083, n = 240): P = 35000 × 119.55 ≈ <strong>₹41.8 lakh</strong>. Close the ₹5,000 EMI and eligibility jumps to ~₹47.8 lakh.</p>
      <h2>Eligibility quick table (8.5%, 20 yrs, no existing EMI, 50% FOIR)</h2>
      <table><thead><tr><th>Take-home</th><th>Max EMI</th><th>Max loan</th></tr></thead><tbody>
        <tr><td>₹40,000</td><td>₹20,000</td><td>~₹23.1 lakh</td></tr>
        <tr><td>₹60,000</td><td>₹30,000</td><td>~₹34.6 lakh</td></tr>
        <tr><td>₹1,00,000</td><td>₹50,000</td><td>~₹57.7 lakh</td></tr>
        <tr><td>₹1,50,000</td><td>₹75,000</td><td>~₹86.5 lakh</td></tr>
      </tbody></table>
      <h2>5 ways to boost eligibility</h2>
      <ul>
        <li><strong>Add co-applicant</strong> — spouse's income can nearly double eligibility (and women co-owners get ~0.05% lower rates in some banks).</li>
        <li><strong>Kill small EMIs</strong> — closing a ₹8,000 personal-loan EMI adds ~₹9 lakh eligibility at 8.5%/20y.</li>
        <li><strong>Extend tenure</strong> — 15→20 years adds ~18% eligibility (but more interest — prepay later).</li>
        <li><strong>Fix CIBIL to 750+</strong> — pay cards in full, keep utilisation under 30%, avoid new loans 6 months before applying.</li>
        <li><strong>Show all income</strong> — bonuses (with 2-yr proof), rental income (with agreement + bank credits) count at most banks.</li>
      </ul>
    </>
  );
}
