import { useMemo, useState } from "react";
import { CalcShell } from "../../components/CalcShell";
import { ResultCard, Segmented } from "../../components/ui";
import { CALCULATORS } from "../../data/site";

const META = CALCULATORS.find((c) => c.slug === "percentage")!;
const FAQS = [
  { q: "How do I calculate X% of Y? Example: 18% of 50,000?", a: "Multiply: (X ÷ 100) × Y. 18% of 50,000 = 0.18 × 50000 = ₹9,000. Use Mode 1 above." },
  { q: "How do I find what percentage X is of Y?", a: "Divide and multiply by 100: (X ÷ Y) × 100. Example: 450 marks out of 600 = (450÷600)×100 = 75%. Use Mode 2 above." },
  { q: "How do I calculate percentage increase? Example: salary ₹40K to ₹48K?", a: "((New − Old) ÷ Old) × 100 = (8000 ÷ 40000) × 100 = 20% hike. Same formula handles discounts (negative = decrease)." },
  { q: "How do I reverse-calculate the original price after discount?", a: "Original = Discounted ÷ (1 − discount%). Example: paid ₹1,700 after 15% off → 1700 ÷ 0.85 = ₹2,000 original. See the discount box in Mode 3." },
  { q: "How do I calculate percentage for board exam marks?", a: "Add all subject marks, divide by maximum total, × 100. Example: 452/500 = 90.4%. For CGPA to %: multiply CGPA by 9.5 (CBSE rule) — 8.6 CGPA ≈ 81.7%." },
];

function Num({ label, value, onChange, suffix }: { label: string; value: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <label className="block rounded-xl border border-sky-100 bg-white p-3">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <span className="mt-1 flex items-center gap-1">
        <input type="number" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} className="w-full bg-transparent text-xl font-extrabold text-slate-900 outline-none" />
        {suffix && <span className="text-sm font-bold text-sky-600">{suffix}</span>}
      </span>
    </label>
  );
}

export default function PercentageCalculator() {
  const [mode, setMode] = useState<"a" | "b" | "c">("a");
  const [p1, setP1] = useState(18); const [p2, setP2] = useState(50000);
  const [q1, setQ1] = useState(450); const [q2, setQ2] = useState(600);
  const [r1, setR1] = useState(40000); const [r2, setR2] = useState(48000);
  const [dPrice, setDPrice] = useState(2000); const [dPct, setDPct] = useState(15);

  const ans = useMemo(() => ({
    a: (p1 / 100) * p2,
    b: q2 !== 0 ? (q1 / q2) * 100 : 0,
    c: r1 !== 0 ? ((r2 - r1) / r1) * 100 : 0,
    dOff: dPrice * (dPct / 100),
    dPay: dPrice * (1 - dPct / 100),
  }), [p1, p2, q1, q2, r1, r2, dPrice, dPct]);

  return (
    <CalcShell path={META.path} title={META.title} meta={META.meta}
      h1="Percentage Calculator – %, Increase, Discount"
      intro="Three instant modes: X% of Y (GST/tips), X is what % of Y (marks), and % increase/decrease (hikes/discounts) — plus a ready discount-price box."
      faqs={FAQS} related={META.related} article={<PctArticle />}>
      <Segmented options={[{ label: "X% of Y", value: "a" }, { label: "X is ?% of Y", value: "b" }, { label: "% Change", value: "c" }]} value={mode} onChange={setMode} ariaLabel="Percentage mode" />
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {mode === "a" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Num label="Percentage (X)" value={p1} onChange={setP1} suffix="%" />
              <Num label="Of value (Y)" value={p2} onChange={setP2} suffix="₹" />
            </div>
            <ResultCard label={`${p1}% of ${p2.toLocaleString("en-IN")}`} value={`₹${ans.a.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`} sub={`Formula: (${p1} ÷ 100) × ${p2.toLocaleString("en-IN")}`} highlight />
          </>
        )}
        {mode === "b" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Num label="Part (X)" value={q1} onChange={setQ1} />
              <Num label="Whole (Y)" value={q2} onChange={setQ2} />
            </div>
            <ResultCard label={`${q1} is what % of ${q2}?`} value={`${ans.b.toFixed(2)}%`} sub={`Formula: (${q1} ÷ ${q2}) × 100`} highlight />
          </>
        )}
        {mode === "c" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Num label="Old value" value={r1} onChange={setR1} suffix="₹" />
              <Num label="New value" value={r2} onChange={setR2} suffix="₹" />
            </div>
            <ResultCard label="Percentage change" value={`${ans.c >= 0 ? "+" : ""}${ans.c.toFixed(2)}%`} sub={ans.c >= 0 ? `▲ Increase of ₹${(r2 - r1).toLocaleString("en-IN")}` : `▼ Decrease of ₹${(r1 - r2).toLocaleString("en-IN")}`} highlight />
          </>
        )}
      </div>
      <div className="mt-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-5">
        <p className="font-extrabold text-slate-900">🏷️ Quick discount box <span className="ml-1 text-xs font-semibold text-slate-500">(always visible)</span></p>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_1fr]">
          <Num label="MRP" value={dPrice} onChange={setDPrice} suffix="₹" />
          <Num label="Discount" value={dPct} onChange={setDPct} suffix="%" />
          <div className="rounded-xl bg-slate-900 p-3 text-white">
            <p className="text-[11px] font-bold uppercase tracking-wide text-white/60">You pay</p>
            <p className="text-2xl font-extrabold">₹{ans.dPay.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
            <p className="text-xs text-emerald-300">You save ₹{ans.dOff.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[["GST check", "18% of ₹12,999 =", `₹${(12999 * 0.18).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`], ["Marks", "487 / 500 =", "97.4%"], ["Hike", "₹60K → ₹72K =", "+20%"]].map(([t, q, a]) => (
          <div key={t} className="rounded-xl border border-sky-100 bg-white p-3.5 text-sm"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{t}</p><p className="mt-1 font-semibold text-slate-600">{q}</p><p className="text-lg font-extrabold text-sky-700">{a}</p></div>
        ))}
      </div>
    </CalcShell>
  );
}

function PctArticle() {
  return (
    <>
      <h2>What is a percentage?</h2>
      <p><strong>Percent</strong> means “per hundred” — 18% is 18 out of every 100. Percentages are everywhere in Indian money life: <strong>GST slabs</strong> (5/12/18/28%), <strong>salary hikes</strong>, <strong>discounts</strong> (Big Billion Days!), <strong>exam marks</strong>, <strong>interest rates</strong> and <strong>mutual-fund returns</strong>. Mastering three formulas covers 95% of daily needs.</p>
      <h2>The 3 formulas</h2>
      <span className="formula">1) X% of Y = (X÷100)×Y  |  2) X as % of Y = (X÷Y)×100  |  3) % change = ((New−Old)÷Old)×100</span>
      <p>Examples: <strong>18% of ₹12,999</strong> = 0.18 × 12999 = <strong>₹2,340 GST</strong>. <strong>487 of 500 marks</strong> = (487÷500)×100 = <strong>97.4%</strong>. <strong>₹60K → ₹72K hike</strong> = (12000÷60000)×100 = <strong>+20%</strong>.</p>
      <h2>Discount tricks sellers use</h2>
      <ul>
        <li><strong>“50% + 20% extra”</strong> is NOT 70% off — it's 1 − (0.5 × 0.8) = <strong>60% off</strong>. Successive discounts multiply.</li>
        <li><strong>“₹999 only!”</strong> vs ₹1,000 — 0.1% cheaper, but feels much cheaper (charm pricing).</li>
        <li><strong>GST-inclusive confusion</strong> — “15% off + GST extra” on ₹2,000 = 1700 + 18% GST = ₹2,006, not ₹1,700!</li>
      </ul>
      <h2>Marks & CGPA conversions</h2>
      <p>CBSE: <strong>% = CGPA × 9.5</strong> (8.6 → 81.7%). State boards: total ÷ maximum × 100. For competitive cut-offs, even <strong>0.5%</strong> (≈2–3 marks) can shift rank by thousands — so calculate to 2 decimals with Mode 2 above.</p>
    </>
  );
}
