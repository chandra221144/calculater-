import { useMemo, useState } from "react";
import { CalcShell } from "../../components/CalcShell";
import { BreakupTable, Donut, Field, ResultCard, Segmented } from "../../components/ui";
import { YearBars } from "../../components/ui";
import { formatINR, compactINR } from "../../utils/format";
import { CALCULATORS } from "../../data/site";

const META = CALCULATORS.find((c) => c.slug === "sip")!;

const FAQS = [
  { q: "What is SIP and how does it work?", a: "A Systematic Investment Plan (SIP) auto-invests a fixed amount every month into a mutual fund. You buy more units when markets fall and fewer when they rise (rupee-cost averaging), which smooths returns over 5–10+ years." },
  { q: "How much will ₹10,000 monthly SIP become in 10 years at 12%?", a: "About ₹23.2 lakh — you invest ₹12 lakh and gains are roughly ₹11.2 lakh. At 10% it would be ~₹20.7 lakh; at 14%, ~₹26.5 lakh. Our chart above shows the year-wise growth." },
  { q: "What is step-up SIP?", a: "A step-up (top-up) SIP increases your monthly amount every year, e.g. 10% yearly to match salary hikes. A ₹10,000 SIP with 10% annual step-up for 15 years at 12% grows to ~₹75 lakh vs ~₹50 lakh without step-up." },
  { q: "Are SIP returns guaranteed?", a: "No. SIPs invest in market-linked mutual funds, so returns fluctuate. Equity SIPs have historically delivered 10–14% XIRR over 10+ years, but short-term (under 3 years) returns can be flat or negative." },
  { q: "How does inflation affect my SIP goal?", a: "At 6% inflation, ₹1 crore in 15 years is worth only ~₹42 lakh in today's money. Toggle 'show inflation-adjusted value' above to see real purchasing power, and increase SIP or step-up to bridge the gap." },
];

export default function SipCalculator() {
  const [monthly, setMonthly] = useState(10000);
  const [returns, setReturns] = useState(12);
  const [years, setYears] = useState(10);
  const [stepUp, setStepUp] = useState(10);
  const [showReal, setShowReal] = useState<"nominal" | "real">("nominal");
  const inflation = 6;

  const calc = useMemo(() => {
    const r = returns / 12 / 100;
    let corpus = 0, invested = 0;
    const yearly: { year: string; a: number; b: number; invested: number; value: number }[] = [];
    let sip = monthly;
    for (let y = 1; y <= years; y++) {
      if (y > 1) sip = sip * (1 + stepUp / 100);
      for (let m = 0; m < 12; m++) {
        corpus = (corpus + sip) * (1 + r);
        invested += sip;
      }
      yearly.push({ year: `Y${y}`, a: invested, b: Math.max(0, corpus - invested), invested, value: corpus });
    }
    const gains = corpus - invested;
    const realValue = corpus / Math.pow(1 + inflation / 100, years);
    return { corpus, invested, gains, yearly, realValue, max: Math.max(corpus, 1) };
  }, [monthly, returns, years, stepUp]);

  const displayCorpus = showReal === "real" ? calc.realValue : calc.corpus;

  return (
    <CalcShell path={META.path} title={META.title} meta={META.meta}
      h1="SIP Calculator – Mutual Fund SIP Returns"
      intro="Estimate your SIP wealth with monthly amount, expected returns, duration and yearly step-up. Includes inflation-adjusted (real) value, growth chart and year-wise table."
      faqs={FAQS} related={META.related} article={<SipArticle />}>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <Field label="Monthly SIP amount" value={monthly} min={500} max={200000} step={500} onChange={(v) => setMonthly(Math.round(Math.min(200000, Math.max(0, v))))} hint={compactINR(monthly) + "/mo"} />
          <Field label="Expected returns (p.a.)" value={returns} min={1} max={30} step={0.5} onChange={setReturns} prefix="%" hint={returns <= 8 ? "Debt-like" : returns <= 12 ? "Equity avg" : "Aggressive"} />
          <Field label="Investment period" value={years} min={1} max={40} step={1} onChange={(v) => setYears(Math.round(Math.min(40, Math.max(1, v))))} prefix=" yrs" />
          <Field label="Yearly step-up (salary hike)" value={stepUp} min={0} max={50} step={1} onChange={(v) => setStepUp(Math.min(50, Math.max(0, v)))} prefix="%" />
          <Segmented options={[{ label: "Future value", value: "nominal" }, { label: `Real value (6% inflation)`, value: "real" }]} value={showReal} onChange={setShowReal} ariaLabel="Value mode" />
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ResultCard label={showReal === "real" ? "Real value (today's ₹)" : "Maturity value"} value={formatINR(Math.round(displayCorpus))} sub={showReal === "real" ? `Nominal ${compactINR(calc.corpus)}` : `XIRR ≈ ${returns}%`} highlight />
            <ResultCard label="Total invested" value={formatINR(Math.round(calc.invested))} sub={`${years * 12} instalments`} />
            <ResultCard label="Est. gains" value={formatINR(Math.round(calc.gains))} sub={`${((calc.gains / Math.max(calc.corpus, 1)) * 100).toFixed(0)}% of corpus`} />
            <ResultCard label="Wealth multiple" value={`${(calc.corpus / Math.max(calc.invested, 1)).toFixed(2)}x`} sub="Corpus ÷ invested" />
          </div>
          <div className="rounded-xl border border-sky-100 bg-white p-4">
            <p className="mb-3 text-sm font-bold text-slate-800">Invested vs Gains</p>
            <Donut parts={[{ label: "Invested", value: calc.invested, color: "#066fd1" }, { label: "Gains", value: Math.max(0, calc.gains), color: "#10b981" }]} centerTop="Corpus" centerBottom={compactINR(calc.corpus)} />
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-sky-100 bg-white p-4">
          <p className="mb-1 text-sm font-bold text-slate-800">Year-wise growth</p>
          <p className="mb-3 text-xs text-slate-500">Watch compounding kick in after year 5–7</p>
          <YearBars rows={calc.yearly} max={calc.max} />
        </div>
        <div>
          <p className="mb-2 text-sm font-bold text-slate-800">Yearly breakup table</p>
          <BreakupTable head={["Year", "Invested", "Gains", "Value"]} rows={calc.yearly.map((y, i) => [`Year ${i + 1}`, formatINR(Math.round(y.invested)), formatINR(Math.round(y.b)), formatINR(Math.round(y.value))])} foot={["Total", formatINR(Math.round(calc.invested)), formatINR(Math.round(calc.gains)), formatINR(Math.round(calc.corpus))]} />
        </div>
      </div>
    </CalcShell>
  );
}

function SipArticle() {
  return (
    <>
      <h2>What is SIP?</h2>
      <p>A <strong>Systematic Investment Plan (SIP)</strong> invests a fixed amount — say ₹5,000 — from your bank account into a mutual fund every month. It builds discipline, averages your purchase price across market ups and downs (<strong>rupee-cost averaging</strong>), and lets <strong>compounding</strong> do the heavy lifting. SIPs are the most popular way young Indians invest: AMFI data shows monthly SIP inflows crossing ₹26,000 crore in 2025.</p>
      <p>The golden rule: <strong>start early, step up yearly, stay 7+ years</strong>. A 25-year-old investing ₹10,000/month till 60 at 12% builds ~₹10 crore; starting at 35 builds only ~₹2.8 crore with the same monthly amount. Time matters more than timing.</p>
      <h2>SIP formula</h2>
      <p>Future value uses the annuity formula with monthly compounding:</p>
      <span className="formula">FV = M × ((1+r)^n − 1) / r × (1+r)</span>
      <p>Where <strong>M</strong> = monthly SIP, <strong>r</strong> = monthly return (annual ÷ 12 ÷ 100), <strong>n</strong> = total months. With a yearly step-up of s%, each year's SIP = previous × (1 + s). Our calculator above applies the step-up every 12th instalment.</p>
      <h2>Solved example</h2>
      <p>Priya starts a <strong>₹10,000/month SIP for 15 years at 12%</strong> with a <strong>10% yearly step-up</strong> (matching her hikes). She invests about ₹38.1 lakh total. At 12% XIRR the corpus grows to <strong>~₹75 lakh</strong> — nearly double the ₹50 lakh she would get without step-up. Adjusting for 6% inflation, that is ~₹31 lakh in today's purchasing power — still 8x her first-year investment.</p>
      <h3>How much SIP for ₹1 crore?</h3>
      <table><thead><tr><th>Time</th><th>At 10%</th><th>At 12%</th><th>At 14%</th></tr></thead>
      <tbody>
        <tr><td>10 years</td><td>₹48,400</td><td>₹43,000</td><td>₹38,000</td></tr>
        <tr><td>15 years</td><td>₹24,000</td><td>₹20,000</td><td>₹16,300</td></tr>
        <tr><td>20 years</td><td>₹13,200</td><td>₹10,000</td><td>₹7,300</td></tr>
      </tbody></table>
      <h2>Tips for better SIP returns</h2>
      <ul>
        <li><strong>Match fund to horizon</strong> — 7+ years: flexi/large-cap equity; 3–5 years: hybrid; under 3 years: debt/liquid, not equity.</li>
        <li><strong>Never stop in crashes</strong> — 2020's fall gave SIPs their cheapest units; pausing then locked in losses.</li>
        <li><strong>Step up, don't just start</strong> — raising SIP 10% yearly adds ~50% more corpus over 15 years.</li>
        <li><strong>Review yearly, churn rarely</strong> — check XIRR vs benchmark once a year; switching funds often costs exit loads + taxes.</li>
      </ul>
    </>
  );
}
