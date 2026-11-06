import { useMemo, useState } from "react";
import { CalcShell } from "../../components/CalcShell";
import { BreakupTable, Field, ResultCard, Segmented } from "../../components/ui";
import { Donut } from "../../components/ui";
import { formatINR, compactINR } from "../../utils/format";
import { CALCULATORS } from "../../data/site";

const META = CALCULATORS.find((c) => c.slug === "tax")!;
const FAQS = [
  { q: "What are new regime slabs for FY 2025-26?", a: "0–₹3L nil, ₹3–7L 5%, ₹7–10L 10%, ₹10–12L 15%, ₹12–15L 20%, above ₹15L 30%, plus 4% cess. Salaried get ₹75,000 standard deduction. Section 87A rebate makes income up to ₹12L (₹12.75L salaried) effectively tax-free." },
  { q: "Is income up to ₹12 lakh really tax-free in the new regime?", a: "Yes, from FY 2025-26 the 87A rebate was raised so net tax is zero up to ₹12 lakh taxable income (₹12.75 lakh gross for salaried after standard deduction). Above that, normal slabs apply — with marginal relief near the threshold." },
  { q: "New vs old regime — which is better?", a: "New regime wins for most people without big 80C/HRA claims. Old regime can win if you claim ₹4L+ deductions (80C, 80D, HRA, home-loan interest). As a thumb rule: deductions above ~₹4.5L at ₹12L income → compare both; else pick new." },
  { q: "Is standard deduction available in the new regime?", a: "Yes — ₹75,000 for salaried employees and ₹25,000 extra for family pensioners. No other deductions (80C, 80D, HRA, LTA) except employer NPS (80CCD(2)) and Agniveer benefits." },
  { q: "How is 4% cess calculated?", a: "Health & education cess = 4% of (base tax minus rebate). Example: base tax ₹80,000 → cess ₹3,200 → total ₹83,200. It applies in both regimes." },
];

// FY 2025-26 new regime slabs (Budget 2025): rebate up to 12L
const SLABS: [number, number, number][] = [
  [0, 300000, 0], [300000, 700000, 0.05], [700000, 1000000, 0.10],
  [1000000, 1200000, 0.15], [1200000, 1500000, 0.20], [1500000, Infinity, 0.30],
];

export default function TaxCalculator() {
  const [gross, setGross] = useState(1200000);
  const [isSalaried, setIsSalaried] = useState<"salaried" | "other">("salaried");

  const calc = useMemo(() => {
    const stdDed = isSalaried === "salaried" ? 75000 : 0;
    const taxable = Math.max(0, gross - stdDed);
    let base = 0;
    const rows: { slab: string; amount: number; rate: string; tax: number }[] = [];
    for (const [lo, hi, r] of SLABS) {
      const amt = Math.max(0, Math.min(taxable, hi) - lo);
      const t = amt * r;
      base += t;
      if (taxable > lo) rows.push({ slab: hi === Infinity ? `Above ${formatINR(lo)}` : `${formatINR(lo)} – ${formatINR(hi)}`, amount: amt, rate: `${r * 100}%`, tax: t });
    }
    // 87A rebate: zero tax up to 12L taxable (FY25-26)
    let rebate = 0;
    if (taxable <= 1200000) rebate = base;
    // marginal relief: extra income above 12L shouldn't make tax jump beyond extra income
    let afterRebate = base - rebate;
    if (taxable > 1200000) {
      const excess = taxable - 1200000;
      const totalWithCess = base * 1.04;
      if (totalWithCess > excess) {
        const reliefTarget = excess / 1.04;
        afterRebate = Math.min(base, reliefTarget);
      }
    }
    const cess = afterRebate * 0.04;
    const total = afterRebate + cess;
    const eff = gross > 0 ? (total / gross) * 100 : 0;
    return { stdDed, taxable, base, rebate, afterRebate, cess, total, eff, rows };
  }, [gross, isSalaried]);

  return (
    <CalcShell path={META.path} title={META.title} meta={META.meta}
      h1="Income Tax Calculator FY 2025-26 (New Regime)"
      intro="Calculate new-regime income tax for FY 2025-26 (AY 2026-27) with latest slabs, ₹75,000 standard deduction, 87A rebate up to ₹12L and 4% cess — with full slab breakup."
      faqs={FAQS} related={META.related} article={<TaxArticle />}>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <Field label="Gross annual income" value={gross} min={0} max={10000000} step={10000} onChange={(v) => setGross(Math.round(Math.min(10000000, Math.max(0, v))))} hint={compactINR(gross)} />
          <Segmented options={[{ label: "Salaried (₹75K std ded)", value: "salaried" }, { label: "Business / Other", value: "other" }]} value={isSalaried} onChange={setIsSalaried} ariaLabel="Taxpayer type" />
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900">
            {calc.total === 0 ? (
              <p><strong>🎉 Zero tax!</strong> Your taxable income of {formatINR(Math.round(calc.taxable))} is covered by the 87A rebate (up to ₹12L).</p>
            ) : (
              <p>Taxable income after standard deduction: <strong>{formatINR(Math.round(calc.taxable))}</strong> · Standard deduction: <strong>{formatINR(calc.stdDed)}</strong></p>
            )}
          </div>
          <BreakupTable head={["Slab", "Taxable in slab", "Rate", "Tax"]} rows={calc.rows.map((r) => [r.slab, formatINR(Math.round(r.amount)), r.rate, formatINR(Math.round(r.tax))])} foot={["Base tax", "", "", formatINR(Math.round(calc.base))]} />
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Total tax + cess" value={formatINR(Math.round(calc.total))} sub={`Effective ${calc.eff.toFixed(2)}%`} highlight />
            <ResultCard label="Monthly TDS (approx)" value={formatINR(Math.round(calc.total / 12))} sub="Spread over 12 months" />
            <ResultCard label="87A rebate" value={formatINR(Math.round(calc.rebate))} sub={calc.rebate > 0 ? "Applied ✓" : "Not applicable"} />
            <ResultCard label="4% health & edu cess" value={formatINR(Math.round(calc.cess))} sub="On tax after rebate" />
          </div>
          <div className="rounded-xl border border-sky-100 bg-white p-4">
            <p className="mb-3 text-sm font-bold text-slate-800">Income vs Tax</p>
            <Donut parts={[{ label: "You keep", value: Math.max(0, gross - calc.total), color: "#10b981" }, { label: "Tax + cess", value: calc.total, color: "#ef4444" }]} centerTop="Gross" centerBottom={compactINR(gross)} />
          </div>
          <div className="rounded-xl border border-sky-100 bg-white p-4 text-sm">
            <p className="font-bold text-slate-800">New vs Old — quick verdict</p>
            <p className="mt-1 leading-relaxed text-slate-600">
              At {formatINR(Math.round(gross))}, the <strong>new regime</strong> ({formatINR(Math.round(calc.total))} tax) usually wins unless you claim
              deductions above ~{formatINR(400000)} (80C + 80D + HRA + home-loan interest). Use our in-hand salary tool to see monthly impact.
            </p>
          </div>
        </div>
      </div>
    </CalcShell>
  );
}

function TaxArticle() {
  return (
    <>
      <h2>What is the new tax regime?</h2>
      <p>India has two income-tax systems since FY 2020-21. The <strong>old regime</strong> has higher slabs but 70+ deductions (80C, HRA, 80D…). The <strong>new regime (115BAC)</strong> — default since FY 2023-24 — has lower slabs, almost zero deductions, and from <strong>FY 2025-26 zero tax up to ₹12 lakh</strong> via the 87A rebate (₹12.75 lakh for salaried after the ₹75,000 standard deduction). About 75% of filers now use the new regime.</p>
      <h2>New regime slabs FY 2025-26</h2>
      <table><thead><tr><th>Taxable income</th><th>Rate</th><th>Tax on full slab</th></tr></thead><tbody>
        <tr><td>₹0 – ₹3,00,000</td><td>Nil</td><td>₹0</td></tr>
        <tr><td>₹3 – ₹7 lakh</td><td>5%</td><td>₹20,000</td></tr>
        <tr><td>₹7 – ₹10 lakh</td><td>10%</td><td>₹30,000</td></tr>
        <tr><td>₹10 – ₹12 lakh</td><td>15%</td><td>₹30,000</td></tr>
        <tr><td>₹12 – ₹15 lakh</td><td>20%</td><td>₹60,000</td></tr>
        <tr><td>Above ₹15 lakh</td><td>30%</td><td>—</td></tr>
      </tbody></table>
      <p>Add <strong>4% health & education cess</strong> on tax after rebate. Surcharge applies only above ₹50 lakh (max 25% in new regime).</p>
      <h2>Solved example</h2>
      <p>Anjali earns <strong>₹13,00,000</strong> (salaried). Less ₹75,000 standard deduction = taxable <strong>₹12,25,000</strong>. Slab tax: 5% of ₹4L (₹20,000) + 10% of ₹3L (₹30,000) + 15% of ₹2L (₹30,000) + 20% of ₹25,000 (₹5,000) = <strong>₹85,000</strong>. But marginal relief caps it near the excess over ₹12L (₹25,000), so she pays roughly <strong>~₹26,000 incl. cess</strong> instead of ₹88,400 — a saving of ~₹62,000.</p>
      <h2>Tips to pay zero/less tax legally</h2>
      <ul>
        <li><strong>Salaried under ₹12.75L gross</strong> — you owe nothing new-regime; still file ITR for visa/loan proof.</li>
        <li><strong>Employer NPS (80CCD(2))</strong> — the only big deduction allowed in new regime; up to 14% of basic is tax-free.</li>
        <li><strong>Choose regime yearly</strong> — salaried can switch every year; compare in March with actual proofs.</li>
        <li><strong>Don't skip filing</strong> — even zero-tax filers need ITR for refunds, carry-forward losses and high-value transactions.</li>
      </ul>
    </>
  );
}
