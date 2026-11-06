import { useMemo, useState } from "react";
import { CalcShell } from "../../components/CalcShell";
import { BreakupTable, Donut, Field, ResultCard, Segmented, YearBars } from "../../components/ui";
import { formatINR, compactINR } from "../../utils/format";
import { CALCULATORS } from "../../data/site";

const META = CALCULATORS.find((c) => c.slug === "fd")!;
const FAQS = [
  { q: "How is FD maturity calculated?", a: "FDs in India compound quarterly: A = P × (1 + r/4)^(4×t). Example: ₹1,00,000 at 7% for 3 years = 100000 × (1.0175)^12 ≈ ₹1,23,144. Our calculator uses this exact method." },
  { q: "FD vs RD — which is better?", a: "FD suits lump sums (bonus, maturity proceeds); RD suits monthly savers. At the same 7% for 5 years, ₹5 lakh FD → ~₹7.08 lakh, while ₹8,333/month RD (same ₹5L invested) → ~₹5.99 lakh, because RD money enters gradually." },
  { q: "Is FD interest taxable?", a: "Yes, fully taxable at your slab rate. Banks deduct 10% TDS if interest exceeds ₹40,000/year (₹50,000 for senior citizens). Submit Form 15G/15H if your total income is below taxable limit." },
  { q: "What are current FD rates in India (2026)?", a: "Roughly: SBI 7.0–7.25%, HDFC/ICICI 7.0–7.4%, Post Office 6.9–7.5%, small finance banks up to 8.5–9% for seniors. Rates change monthly — check the bank's site before investing." },
  { q: "Can I break an FD early?", a: "Yes, premature withdrawal is allowed (except 5-yr tax-saver FDs) with a 0.5–1% penalty on the applicable rate. Example: 7% FD broken after 1 year may earn only ~6–6.5%." },
];

export default function FdCalculator() {
  const [tab, setTab] = useState<"FD" | "RD">("FD");
  const [fdAmt, setFdAmt] = useState(500000);
  const [fdRate, setFdRate] = useState(7.1);
  const [fdYears, setFdYears] = useState(5);
  const [rdAmt, setRdAmt] = useState(10000);
  const [rdRate, setRdRate] = useState(7.0);
  const [rdYears, setRdYears] = useState(5);

  const fd = useMemo(() => {
    const r = fdRate / 100, q = r / 4, n = fdYears * 4;
    const mat = fdAmt * Math.pow(1 + q, n);
    const yearly: { year: string; a: number; b: number; value: number }[] = [];
    for (let y = 1; y <= fdYears; y++) {
      const v = fdAmt * Math.pow(1 + q, y * 4);
      yearly.push({ year: `Y${y}`, a: fdAmt, b: v - fdAmt, value: v });
    }
    return { mat, interest: mat - fdAmt, yearly, max: mat };
  }, [fdAmt, fdRate, fdYears]);

  const rd = useMemo(() => {
    const r = rdRate / 100, q = r / 4;
    const months = rdYears * 12;
    let mat = 0;
    for (let m = 1; m <= months; m++) {
      const quartersLeft = Math.ceil((months - m + 1) / 3);
      mat += rdAmt * Math.pow(1 + q, quartersLeft);
    }
    const invested = rdAmt * months;
    const yearly: { year: string; a: number; b: number; value: number }[] = [];
    for (let y = 1; y <= rdYears; y++) {
      let v = 0;
      const mm = y * 12;
      for (let m = 1; m <= mm; m++) {
        const quartersLeft = Math.ceil((mm - m + 1) / 3);
        v += rdAmt * Math.pow(1 + q, quartersLeft);
      }
      yearly.push({ year: `Y${y}`, a: rdAmt * mm, b: v - rdAmt * mm, value: v });
    }
    return { mat, invested, interest: mat - invested, yearly, max: mat };
  }, [rdAmt, rdRate, rdYears]);

  const isFD = tab === "FD";

  return (
    <CalcShell path={META.path} title={META.title} meta={META.meta}
      h1="FD & RD Calculator – Maturity Value in ₹"
      intro="Calculate Fixed Deposit maturity (lump sum, quarterly compounding) and Recurring Deposit corpus (monthly deposits) with interest earned and year-wise growth table."
      faqs={FAQS} related={META.related} article={<FdArticle />}>
      <Segmented options={[{ label: "🏦 Fixed Deposit (FD)", value: "FD" }, { label: "📆 Recurring Deposit (RD)", value: "RD" }]} value={tab} onChange={setTab} ariaLabel="Deposit type" />
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          {isFD ? (
            <>
              <Field label="Deposit amount" value={fdAmt} min={1000} max={10000000} step={5000} onChange={(v) => setFdAmt(Math.round(v))} hint={compactINR(fdAmt)} />
              <Field label="Interest rate (p.a.)" value={fdRate} min={1} max={12} step={0.05} onChange={setFdRate} prefix="%" />
              <Field label="Duration" value={fdYears} min={1} max={10} step={1} onChange={(v) => setFdYears(Math.round(v))} prefix=" yrs" />
            </>
          ) : (
            <>
              <Field label="Monthly deposit" value={rdAmt} min={500} max={200000} step={500} onChange={(v) => setRdAmt(Math.round(v))} hint={compactINR(rdAmt) + "/mo"} />
              <Field label="Interest rate (p.a.)" value={rdRate} min={1} max={12} step={0.05} onChange={setRdRate} prefix="%" />
              <Field label="Duration" value={rdYears} min={1} max={10} step={1} onChange={(v) => setRdYears(Math.round(v))} prefix=" yrs" />
            </>
          )}
          <p className="rounded-xl bg-sky-900/5 px-4 py-2.5 text-xs leading-relaxed text-slate-500">Quarterly compounding (Indian bank method) · TDS extra: 10% if annual interest &gt; ₹40,000 (₹50,000 seniors)</p>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Maturity value" value={formatINR(Math.round(isFD ? fd.mat : rd.mat))} sub={isFD ? `on ${compactINR(fdAmt)} FD` : `${rdYears * 12} deposits`} highlight />
            <ResultCard label="Interest earned" value={formatINR(Math.round(isFD ? fd.interest : rd.interest))} sub={`@ ${isFD ? fdRate : rdRate}% p.a.`} />
            <ResultCard label="Total invested" value={formatINR(Math.round(isFD ? fdAmt : rd.invested))} />
            <ResultCard label="Growth" value={`+${(((isFD ? fd.interest : rd.interest) / Math.max(isFD ? fdAmt : rd.invested, 1)) * 100).toFixed(1)}%`} sub="over invested" />
          </div>
          <div className="rounded-xl border border-sky-100 bg-white p-4">
            <p className="mb-3 text-sm font-bold text-slate-800">Invested vs Interest</p>
            <Donut parts={isFD ? [{ label: "Deposit", value: fdAmt, color: "#066fd1" }, { label: "Interest", value: fd.interest, color: "#14b8a6" }] : [{ label: "Deposits", value: rd.invested, color: "#066fd1" }, { label: "Interest", value: rd.interest, color: "#14b8a6" }]} centerTop="Maturity" centerBottom={compactINR(isFD ? fd.mat : rd.mat)} />
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-sky-100 bg-white p-4">
          <p className="mb-1 text-sm font-bold text-slate-800">Year-wise growth</p>
          <p className="mb-3 text-xs text-slate-500">Blue = invested · Teal = interest so far</p>
          <YearBars rows={isFD ? fd.yearly : rd.yearly} max={isFD ? fd.max : rd.max} colorA="#066fd1" colorB="#14b8a6" labelA="Invested" labelB="Interest" />
        </div>
        <div>
          <p className="mb-2 text-sm font-bold text-slate-800">Yearly table</p>
          <BreakupTable head={["Year", "Invested", "Interest", "Value"]} rows={(isFD ? fd.yearly : rd.yearly).map((y, i) => [`Year ${i + 1}`, formatINR(Math.round(y.a)), formatINR(Math.round(y.b)), formatINR(Math.round(y.value))])} />
        </div>
      </div>
    </CalcShell>
  );
}

function FdArticle() {
  return (
    <>
      <h2>What are FD and RD?</h2>
      <p>A <strong>Fixed Deposit (FD)</strong> invests a lump sum (e.g. ₹5 lakh) for a fixed period (7 days–10 years) at a guaranteed rate. A <strong>Recurring Deposit (RD)</strong> invests a fixed amount every month (e.g. ₹10,000) — ideal for salaried savers. Both are <strong>DICGC-insured up to ₹5 lakh per bank</strong>, making them India's safest investment after PPF/SSY.</p>
      <h2>FD & RD formulas</h2>
      <p>Indian banks compound FDs <strong>quarterly</strong>:</p>
      <span className="formula">FD: A = P × (1 + r/4)^(4×t)  |  RD: sum of each deposit compounded quarterly</span>
      <p>Example: ₹5,00,000 FD at 7.1% for 5 years → A = 500000 × (1.01775)^20 = <strong>₹7,11,000 approx</strong> (interest ~₹2.11 lakh). An RD of ₹10,000/month at 7% for 5 years → invested ₹6L, maturity <strong>~₹7.14 lakh</strong>.</p>
      <h2>FD rates comparison (indicative, 2026)</h2>
      <table><thead><tr><th>Bank</th><th>General</th><th>Senior citizen</th></tr></thead><tbody>
        <tr><td>SBI</td><td>7.10%</td><td>7.60%</td></tr>
        <tr><td>HDFC / ICICI</td><td>7.25%</td><td>7.75%</td></tr>
        <tr><td>Post Office (5-yr)</td><td>7.50%</td><td>7.50%</td></tr>
        <tr><td>Small finance banks</td><td>8.00–8.50%</td><td>8.50–9.00%</td></tr>
      </tbody></table>
      <h2>Tips to earn more, safely</h2>
      <ul>
        <li><strong>Ladder FDs</strong> — split ₹10L into 1/2/3/5-yr FDs; you get liquidity yearly plus higher average rates.</li>
        <li><strong>Seniors: +0.50%</strong> — parents above 60 earn extra; consider splitting deposits in their name (within gift-tax care).</li>
        <li><strong>Watch TDS</strong> — interest above ₹40K/yr faces 10% TDS; submit 15G/15H if below taxable limit.</li>
        <li><strong>5-yr tax-saver FD</strong> — 80C benefit (old regime) but 5-yr lock-in and fully taxable interest; ELSS often beats it post-tax.</li>
      </ul>
    </>
  );
}
