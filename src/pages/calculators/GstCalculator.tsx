import { useMemo, useState } from "react";
import { CalcShell } from "../../components/CalcShell";
import { Field, ResultCard, Segmented, BreakupTable } from "../../components/ui";
import { formatINR } from "../../utils/format";
import { CALCULATORS } from "../../data/site";

const META = CALCULATORS.find((c) => c.slug === "gst")!;
const FAQS = [
  { q: "How do I add 18% GST to ₹1,000?", a: "GST = 1000 × 18% = ₹180. Total invoice = ₹1,180, split as ₹90 CGST + ₹90 SGST for intra-state sales. Our calculator above does this instantly for any rate." },
  { q: "How do I remove GST from a GST-inclusive price?", a: "Base = Inclusive ÷ (1 + rate). Example: ₹1,180 inclusive of 18% → base = 1180 ÷ 1.18 = ₹1,000, GST = ₹180. Use the 'Remove GST' mode above." },
  { q: "What is CGST, SGST and IGST?", a: "CGST + SGST apply to sales within a state (each gets half the rate). IGST applies to inter-state sales (full rate goes to Centre, then shared). Example: 18% intra-state = 9% CGST + 9% SGST." },
  { q: "Which items fall under 5%, 12%, 18% and 28% GST?", a: "Broadly: 5% essentials & transport; 12% processed food & computers; 18% most goods/services (soap, phones, restaurants); 28% luxury & sin goods (cars, tobacco). Always check the latest CBIC rate list for your HSN code." },
  { q: "Do I need GST registration as a freelancer?", a: "For services, registration is mandatory beyond ₹20 lakh turnover (₹10 lakh in special-category states). Below that you can invoice without GST, but you also cannot claim input tax credit." },
];

export default function GstCalculator() {
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [saleType, setSaleType] = useState<"intra" | "inter">("intra");

  const calc = useMemo(() => {
    const r = rate / 100;
    let base = 0, gst = 0, total = 0;
    if (mode === "add") { base = amount; gst = base * r; total = base + gst; }
    else { total = amount; base = total / (1 + r); gst = total - base; }
    const cgst = saleType === "intra" ? gst / 2 : 0;
    const sgst = saleType === "intra" ? gst / 2 : 0;
    const igst = saleType === "inter" ? gst : 0;
    return { base, gst, total, cgst, sgst, igst };
  }, [amount, rate, mode, saleType]);

  return (
    <CalcShell path={META.path} title={META.title} meta={META.meta}
      h1="GST Calculator – Add / Remove GST Online"
      intro="Add or remove GST (5%, 12%, 18%, 28%) from any amount with instant CGST + SGST or IGST split — perfect for invoices, bills and online sellers."
      faqs={FAQS} related={META.related} article={<GstArticle />}>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <Segmented options={[{ label: "➕ Add GST", value: "add" }, { label: "➖ Remove GST", value: "remove" }]} value={mode} onChange={setMode} ariaLabel="GST mode" />
          <Field label={mode === "add" ? "Base amount (excl. GST)" : "Total amount (incl. GST)"} value={amount} min={1} max={10000000} step={100} onChange={(v) => setAmount(Math.max(0, Math.round(v)))} />
          <div className="rounded-xl border border-sky-100 bg-white p-4">
            <label className="text-sm font-semibold text-slate-700">GST rate</label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {[5, 12, 18, 28].map((r) => (
                <button key={r} onClick={() => setRate(r)} className={`rounded-xl px-2 py-2.5 text-sm font-extrabold transition ${rate === r ? "bg-[#066fd1] text-white shadow-md" : "bg-sky-50 text-sky-800 hover:bg-sky-100"}`}>{r}%</button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Custom:</span>
              <input type="number" value={rate} min={0} max={40} step={0.1} onChange={(e) => setRate(Math.min(40, Math.max(0, parseFloat(e.target.value) || 0)))} className="w-24 rounded-lg border border-sky-200 px-2 py-1.5 text-sm font-bold outline-none focus:border-sky-500" />
              <span className="text-xs text-slate-500">%</span>
            </div>
          </div>
          <Segmented options={[{ label: "Intra-state (CGST+SGST)", value: "intra" }, { label: "Inter-state (IGST)", value: "inter" }]} value={saleType} onChange={setSaleType} ariaLabel="Sale type" />
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Base amount" value={formatINR(Math.round(calc.base))} />
            <ResultCard label={`GST @ ${rate}%`} value={formatINR(Math.round(calc.gst))} highlight />
            <ResultCard label="Total invoice" value={formatINR(Math.round(calc.total))} sub={mode === "add" ? "Base + GST" : "Entered amount"} />
            <ResultCard label={saleType === "intra" ? "CGST + SGST" : "IGST"} value={saleType === "intra" ? `${formatINR(Math.round(calc.cgst))} + ${formatINR(Math.round(calc.sgst))}` : formatINR(Math.round(calc.igst))} sub={saleType === "intra" ? `${rate / 2}% each` : `${rate}% full`} />
          </div>
          <div className="rounded-xl border border-sky-100 bg-white p-4">
            <p className="mb-2 text-sm font-bold text-slate-800">Invoice breakup</p>
            <BreakupTable head={["Component", "Rate", "Amount"]} rows={saleType === "intra" ? [["Base price", "—", formatINR(Math.round(calc.base))], ["CGST", `${rate / 2}%`, formatINR(Math.round(calc.cgst))], ["SGST", `${rate / 2}%`, formatINR(Math.round(calc.sgst))]] : [["Base price", "—", formatINR(Math.round(calc.base))], ["IGST", `${rate}%`, formatINR(Math.round(calc.igst))]]} foot={["Total", "", formatINR(Math.round(calc.total))]} />
          </div>
        </div>
      </div>
    </CalcShell>
  );
}

function GstArticle() {
  return (
    <>
      <h2>What is GST?</h2>
      <p><strong>Goods and Services Tax (GST)</strong>, launched 1 July 2017, is India's single indirect tax replacing VAT, service tax, excise and octroi. Most goods and services fall into four slabs — <strong>5%, 12%, 18% and 28%</strong> — plus 0% (exempt) and special rates for gold (3%) and diamonds (1.5%). For sales within a state, GST splits equally into <strong>CGST + SGST</strong>; for inter-state sales it is charged as <strong>IGST</strong> at the full rate.</p>
      <h2>GST formulas</h2>
      <p><strong>To add GST:</strong> GST = Base × rate; Total = Base + GST. <strong>To remove GST:</strong> Base = Total ÷ (1 + rate); GST = Total − Base.</p>
      <span className="formula">Add: Total = P + (P × r)  |  Remove: P = Total ÷ (1 + r)</span>
      <p>Example — adding 18% to ₹10,000: GST = ₹1,800, total = <strong>₹11,800</strong> (₹900 CGST + ₹900 SGST). Removing 18% from ₹11,800: base = 11800 ÷ 1.18 = <strong>₹10,000</strong>.</p>
      <h2>Solved Indian examples</h2>
      <table><thead><tr><th>Item</th><th>Base</th><th>Slab</th><th>Total</th></tr></thead><tbody>
        <tr><td>Restaurant bill</td><td>₹2,000</td><td>5%</td><td>₹2,100</td></tr>
        <tr><td>Laptop</td><td>₹55,000</td><td>18%</td><td>₹64,900</td></tr>
        <tr><td>Clothes (over ₹1,000)</td><td>₹3,000</td><td>12%</td><td>₹3,360</td></tr>
        <tr><td>Luxury car</td><td>₹20,00,000</td><td>28% + cess</td><td>~₹25,60,000+</td></tr>
      </tbody></table>
      <h2>Tips for sellers & freelancers</h2>
      <ul>
        <li><strong>Quote clearly</strong> — always write “₹X + GST” or “₹X inclusive of GST” to avoid disputes.</li>
        <li><strong>Claim ITC</strong> — registered businesses can offset GST paid on purchases against GST collected; keep clean invoices with GSTIN.</li>
        <li><strong>Use correct HSN/SAC codes</strong> — wrong codes invite notices; check the CBIC master list for your product.</li>
        <li><strong>File GSTR-1/3B on time</strong> — late fees (₹50/day) and blocked ITC hurt small sellers most.</li>
      </ul>
    </>
  );
}
