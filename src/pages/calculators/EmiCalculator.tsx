import { useMemo, useState } from "react";
import { CalcShell } from "../../components/CalcShell";
import { BreakupTable, Donut, Field, ResultCard, Segmented, YearBars } from "../../components/ui";
import { formatINR, compactINR } from "../../utils/format";
import { CALCULATORS } from "../../data/site";

const META = CALCULATORS.find((c) => c.slug === "emi")!;

const FAQS = [
  { q: "What is EMI and how is it calculated?", a: "EMI (Equated Monthly Instalment) is a fixed monthly payment towards your loan. It is calculated with the formula E = P × r × (1+r)^n / ((1+r)^n − 1), where P is loan amount, r is monthly interest rate and n is number of months. Early EMIs pay more interest; later EMIs repay more principal." },
  { q: "What is the EMI for a ₹20 lakh home loan for 20 years at 8.5%?", a: "At 8.5% for 20 years (240 months), the EMI is about ₹19,675 per month. You repay roughly ₹47.2 lakh in total, of which about ₹27.2 lakh is interest. Increase tenure to lower EMI, or shorten it to save interest." },
  { q: "Does prepayment reduce EMI or tenure?", a: "Most Indian banks let you choose. Reducing tenure saves far more interest than reducing EMI. Example: a ₹2 lakh prepayment in year 3 of a ₹40 lakh loan can save 12–18 months and ₹3–5 lakh interest." },
  { q: "Why is my bank EMI slightly different from online calculators?", a: "Small differences (₹10–₹100) come from rounding, exact disbursal date, daily vs monthly reducing balance, and processing fees or insurance added to principal. This calculator uses monthly reducing balance, the standard for Indian home and personal loans." },
  { q: "What is a good EMI-to-salary ratio?", a: "Banks usually allow total EMIs up to 40–50% of net monthly income (FOIR). For comfort, keep home-loan EMI under 30–35% of take-home pay so SIPs, emergency fund and lifestyle costs still fit." },
];

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState(2500000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const [tenureMode, setTenureMode] = useState<"Y" | "M">("Y");
  const [monthsOnly, setMonthsOnly] = useState(24);

  const n = tenureMode === "Y" ? Math.round(years * 12) : Math.round(monthsOnly);
  const r = rate / 12 / 100;

  const calc = useMemo(() => {
    const P = Math.max(0, principal);
    let emi = 0;
    if (r > 0 && n > 0) emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    else if (n > 0) emi = P / n;
    const totalPay = emi * n;
    const interest = totalPay - P;
    // amortisation yearly
    let bal = P;
    const yearly: { year: string; a: number; b: number; principal: number; interest: number; balance: number }[] = [];
    let yP = 0, yI = 0;
    for (let m = 1; m <= n; m++) {
      const intM = bal * r;
      const prinM = Math.min(bal, emi - intM);
      yP += prinM; yI += intM; bal -= prinM;
      if (m % 12 === 0 || m === n) {
        const y = Math.ceil(m / 12);
        yearly.push({ year: `Y${y}`, a: yP, b: yI, principal: yP, interest: yI, balance: Math.max(0, bal) });
        yP = 0; yI = 0;
      }
    }
    // first 12 months schedule
    let b2 = P;
    const sched: { m: number; emi: number; prin: number; int: number; bal: number }[] = [];
    for (let m = 1; m <= Math.min(12, n); m++) {
      const intM = b2 * r;
      const prinM = Math.min(b2, emi - intM);
      b2 -= prinM;
      sched.push({ m, emi, prin: prinM, int: intM, bal: Math.max(0, b2) });
    }
    return { emi, totalPay, interest, yearly, sched, maxYear: Math.max(...yearly.map((y) => y.principal + y.interest), 1) };
  }, [principal, r, n]);

  return (
    <CalcShell
      path={META.path} title={META.title} meta={META.meta}
      h1="EMI Calculator – Home, Car & Personal Loan"
      intro="Enter loan amount, interest rate and tenure to get instant monthly EMI, total interest and a year-wise breakup table. Uses monthly reducing-balance method like Indian banks."
      faqs={FAQS} related={META.related}
      article={<EmiArticle />}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <Field label="Loan amount" value={principal} min={10000} max={20000000} step={10000} onChange={(v) => setPrincipal(Math.min(20000000, Math.max(0, Math.round(v))))} hint={compactINR(principal)} />
          <Field label="Interest rate (p.a.)" value={rate} min={1} max={30} step={0.05} onChange={(v) => setRate(Math.min(30, Math.max(0, v)))} prefix="%" />
          <div className="rounded-xl border border-sky-100 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-semibold text-slate-700">Loan tenure</label>
              <Segmented options={[{ label: "Years", value: "Y" }, { label: "Months", value: "M" }]} value={tenureMode} onChange={setTenureMode} ariaLabel="Tenure mode" />
            </div>
            <div className="mt-3">
              {tenureMode === "Y" ? (
                <Field label="Years" value={years} min={1} max={30} step={1} onChange={(v) => setYears(Math.min(30, Math.max(1, Math.round(v))))} prefix=" yrs" />
              ) : (
                <Field label="Months" value={monthsOnly} min={6} max={360} step={1} onChange={(v) => setMonthsOnly(Math.min(360, Math.max(1, Math.round(v))))} prefix=" mo" />
              )}
            </div>
          </div>
          <p className="rounded-xl bg-sky-900/5 px-4 py-2.5 text-xs leading-relaxed text-slate-500">
            {tenureMode === "Y" ? `${years} years = ${n} monthly payments` : `${n} monthly payments`} · Monthly rate {(r * 100).toFixed(4)}% · Reducing balance
          </p>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Monthly EMI" value={formatINR(Math.round(calc.emi))} sub={`${n} payments`} highlight />
            <ResultCard label="Total interest" value={formatINR(Math.round(calc.interest))} sub={`${((calc.interest / Math.max(calc.totalPay, 1)) * 100).toFixed(1)}% of payout`} />
            <ResultCard label="Principal" value={formatINR(Math.round(principal))} />
            <ResultCard label="Total payable" value={formatINR(Math.round(calc.totalPay))} sub="Principal + interest" />
          </div>
          <div className="rounded-xl border border-sky-100 bg-white p-4">
            <p className="mb-3 text-sm font-bold text-slate-800">Principal vs Interest</p>
            <Donut parts={[{ label: "Principal", value: principal, color: "#066fd1" }, { label: "Interest", value: calc.interest, color: "#f59e0b" }]} centerTop="EMI" centerBottom={compactINR(calc.emi) + "/mo"} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-sky-100 bg-white p-4">
          <p className="mb-1 text-sm font-bold text-slate-800">Year-wise breakup</p>
          <p className="mb-3 text-xs text-slate-500">Blue = principal repaid · Green = interest paid each year</p>
          <YearBars rows={calc.yearly} max={calc.maxYear} labelA="Principal" labelB="Interest" colorA="#066fd1" colorB="#f59e0b" />
        </div>
        <div>
          <p className="mb-2 text-sm font-bold text-slate-800">First 12 months amortisation</p>
          <BreakupTable head={["Month", "EMI", "Principal", "Interest", "Balance"]} rows={calc.sched.map((s) => [s.m, formatINR(Math.round(s.emi)), formatINR(Math.round(s.prin)), formatINR(Math.round(s.int)), formatINR(Math.round(s.bal))])} />
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm font-bold text-slate-800">Yearly summary table</p>
        <BreakupTable head={["Year", "Principal paid", "Interest paid", "Balance"]} rows={calc.yearly.map((y, i) => [`Year ${i + 1}`, formatINR(Math.round(y.principal)), formatINR(Math.round(y.interest)), formatINR(Math.round(y.balance))])} foot={["Total", formatINR(Math.round(principal)), formatINR(Math.round(calc.interest)), formatINR(Math.round(calc.totalPay))]} />
      </div>
    </CalcShell>
  );
}

function EmiArticle() {
  return (
    <>
      <h2>What is EMI?</h2>
      <p>EMI stands for <strong>Equated Monthly Instalment</strong> — the fixed amount you pay your bank every month until the loan is closed. Each EMI has two parts: <strong>interest</strong> (bank's charge) and <strong>principal</strong> (actual loan repayment). In the early years, most of your EMI goes towards interest; in later years, most of it repays principal. This split is called the <strong>amortisation schedule</strong>, and our table above shows it month-by-month.</p>
      <p>Indian banks use the <strong>monthly reducing-balance method</strong>: interest is charged only on the outstanding balance after each EMI. So any prepayment immediately reduces future interest — which is why even a small extra payment early in the tenure saves lakhs.</p>
      <h2>EMI formula</h2>
      <p>The standard formula used by all banks and NBFCs is:</p>
      <span className="formula">E = P × r × (1+r)^n / ((1+r)^n − 1)</span>
      <p>Here <strong>P</strong> = loan amount, <strong>r</strong> = monthly interest rate (annual rate ÷ 12 ÷ 100), and <strong>n</strong> = number of monthly instalments. For example, a 20-year loan means n = 240. If the rate is 0%, EMI is simply P ÷ n.</p>
      <h2>Solved example (Indian)</h2>
      <p>Rahul takes a <strong>₹25,00,000 home loan at 8.5% for 20 years</strong>. Monthly rate r = 0.085 ÷ 12 = 0.007083, n = 240. Plugging into the formula gives an EMI of <strong>≈ ₹21,704/month</strong>. Over 20 years he pays about ₹52.1 lakh total — ₹27.1 lakh principal + interest of roughly ₹27.1 lakh. If he prepays just ₹2,000 extra every month, he closes the loan ~3 years early and saves over ₹6 lakh in interest.</p>
      <h3>Quick reference — EMI per ₹1 lakh loan</h3>
      <table><thead><tr><th>Rate → Tenure ↓</th><th>8.5%</th><th>9.5%</th><th>11%</th></tr></thead>
      <tbody>
        <tr><td>10 years</td><td>₹1,240</td><td>₹1,294</td><td>₹1,378</td></tr>
        <tr><td>15 years</td><td>₹984</td><td>₹1,044</td><td>₹1,136</td></tr>
        <tr><td>20 years</td><td>₹868</td><td>₹935</td><td>₹1,032</td></tr>
      </tbody></table>
      <p>Multiply by your loan in lakhs. A ₹30 lakh loan at 8.5% for 20 years ≈ 30 × ₹868 = <strong>₹26,040/month</strong>.</p>
      <h2>Tips to lower your EMI burden</h2>
      <ul>
        <li><strong>Compare 3+ lenders</strong> — even 0.25% less rate saves ~₹35,000 per ₹10 lakh over 20 years.</li>
        <li><strong>Choose tenure wisely</strong> — longer tenure = lower EMI but much higher total interest. Keep EMI under 35% of take-home.</li>
        <li><strong>Prepay early</strong> — bonuses and tax refunds paid in years 1–5 cut interest the most.</li>
        <li><strong>Protect with insurance</strong> — a term plan covering the loan protects your family, and is cheaper than bank-bundled loan insurance.</li>
      </ul>
    </>
  );
}
