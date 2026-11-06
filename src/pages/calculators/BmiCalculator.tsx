import { useMemo, useState } from "react";
import { CalcShell } from "../../components/CalcShell";
import { Field, ResultCard, Segmented, BreakupTable } from "../../components/ui";
import { CALCULATORS } from "../../data/site";

const META = CALCULATORS.find((c) => c.slug === "bmi")!;
const FAQS = [
  { q: "What is a good BMI for Indians?", a: "For Asian-Indian adults, 18.5–22.9 is normal, 23–24.9 overweight, and 25+ obese — stricter than Western cut-offs (25/30) because Indians develop diabetes risk at lower weights. Our gauge above uses Indian cut-offs." },
  { q: "How is BMI calculated? Example for 70 kg, 170 cm.", a: "BMI = weight(kg) ÷ height(m)². For 70 kg and 1.70 m: 70 ÷ 2.89 = 24.2 — normal (Indian) / normal (WHO). Height must be in metres, so 170 cm = 1.70 m." },
  { q: "What should be my ideal weight?", a: "Ideal = 18.5 × h² to 22.9 × h² (Indian range). For 5'6\" (1.676 m): 52–64 kg. The tool shows your personal range instantly as you move the sliders." },
  { q: "Is BMI accurate for athletes and pregnant women?", a: "Not fully — muscular athletes show 'overweight' BMI despite low fat, and BMI doesn't apply in pregnancy, for children (use percentiles), or the elderly (muscle loss). Pair BMI with waist size: under 90 cm (men) / 80 cm (women) is the Indian target." },
  { q: "How can I reduce BMI from 28 to 24?", a: "A 500 kcal/day deficit (diet + 30–45 min brisk walk) loses ~0.5 kg/week. For an 85 kg person at 174 cm (BMI 28), reaching 24 needs ~73 kg, i.e. ~12 kg or roughly 6 months of steady effort — no crash diets needed." },
];

export default function BmiCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(7);
  const [weightLb, setWeightLb] = useState(154);

  const hM = unit === "metric" ? heightCm / 100 : ((feet * 12 + inches) * 2.54) / 100;
  const wKg = unit === "metric" ? weightKg : weightLb * 0.453592;

  const calc = useMemo(() => {
    const bmi = hM > 0 ? wKg / (hM * hM) : 0;
    let cat = "", color = "", advice = "";
    if (bmi < 16) { cat = "Severe thinness"; color = "#2563eb"; advice = "Please consult a doctor — likely under-nutrition."; }
    else if (bmi < 17) { cat = "Moderate thinness"; color = "#0ea5e9"; advice = "Gain weight gradually with protein + strength training."; }
    else if (bmi < 18.5) { cat = "Mild thinness"; color = "#06b6d4"; advice = "Slightly underweight — add 300 kcal/day surplus."; }
    else if (bmi < 23) { cat = "Normal (Indian)"; color = "#10b981"; advice = "Great! Maintain with 150 min/week activity."; }
    else if (bmi < 25) { cat = "Overweight (Indian)"; color = "#f59e0b"; advice = "Caution zone — 30-min daily walk + cut sugar."; }
    else if (bmi < 30) { cat = "Obese Class I"; color = "#f97316"; advice = "Act now — 500 kcal deficit + check sugar/BP."; }
    else { cat = "Obese Class II+"; color = "#ef4444"; advice = "Please see a doctor for a supervised plan."; }
    const idealLow = 18.5 * hM * hM, idealHigh = 22.9 * hM * hM;
    const diff = wKg - idealHigh;
    const pct = Math.min(100, Math.max(0, ((bmi - 14) / (34 - 14)) * 100));
    return { bmi, cat, color, advice, idealLow, idealHigh, diff, pct };
  }, [hM, wKg]);

  return (
    <CalcShell path={META.path} title={META.title} meta={META.meta}
      h1="BMI Calculator – Body Mass Index (Indian Chart)"
      intro="Check your Body Mass Index with Indian cut-offs (normal 18.5–22.9), see your ideal weight range and get a simple action plan. Works in cm/kg or ft/lbs."
      faqs={FAQS} related={META.related} article={<BmiArticle />}>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <Segmented options={[{ label: "Metric (cm/kg)", value: "metric" }, { label: "Imperial (ft/lbs)", value: "imperial" }]} value={unit} onChange={setUnit} ariaLabel="Units" />
          {unit === "metric" ? (
            <>
              <Field label="Height" value={heightCm} min={100} max={220} step={1} onChange={(v) => setHeightCm(Math.round(v))} prefix=" cm" />
              <Field label="Weight" value={weightKg} min={20} max={200} step={0.5} onChange={setWeightKg} prefix=" kg" />
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Feet" value={feet} min={3} max={7} step={1} onChange={(v) => setFeet(Math.round(v))} prefix=" ft" />
                <Field label="Inches" value={inches} min={0} max={11} step={1} onChange={(v) => setInches(Math.round(v))} prefix=" in" />
              </div>
              <Field label="Weight" value={weightLb} min={44} max={440} step={1} onChange={(v) => setWeightLb(Math.round(v))} prefix=" lb" />
            </>
          )}
          <div className="rounded-xl border border-sky-100 bg-white p-4">
            <div className="flex justify-between text-xs font-bold text-slate-500"><span>14</span><span>18.5</span><span>23</span><span>25</span><span>30+</span></div>
            <div className="relative mt-2 h-3.5 overflow-hidden rounded-full" style={{ background: "linear-gradient(to right,#38bdf8 0%,#38bdf8 22%,#10b981 22%,#10b981 45%,#f59e0b 45%,#f59e0b 55%,#f97316 55%,#f97316 80%,#ef4444 80%)" }}>
              <div className="absolute top-0 h-full w-1.5 rounded-full bg-slate-900 shadow" style={{ left: `calc(${calc.pct}% - 3px)` }} />
            </div>
            <p className="mt-2 text-center text-xs text-slate-500">Your marker · Indian cut-offs (stricter than WHO)</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl border p-5 text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${calc.color}, #0b2f52)` }}>
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">Your BMI</p>
            <p className="mt-1 text-4xl font-extrabold">{calc.bmi.toFixed(1)}</p>
            <p className="mt-1 inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-bold">{calc.cat}</p>
            <p className="mt-2 text-sm text-white/90">{calc.advice}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Ideal weight range" value={`${calc.idealLow.toFixed(0)}–${calc.idealHigh.toFixed(0)} kg`} sub={`for ${(hM * 100).toFixed(0)} cm height`} />
            <ResultCard label={calc.diff > 0 ? "To lose" : "Status"} value={calc.diff > 0 ? `${calc.diff.toFixed(1)} kg` : wKg < calc.idealLow ? `${(calc.idealLow - wKg).toFixed(1)} kg to gain` : "In range ✓"} sub="to reach BMI 22.9" />
          </div>
          <BreakupTable head={["Category (Indian)", "BMI", "You"]} rows={[["Underweight", "< 18.5", calc.bmi < 18.5 ? "← You" : ""], ["Normal", "18.5 – 22.9", calc.bmi >= 18.5 && calc.bmi < 23 ? "← You" : ""], ["Overweight", "23 – 24.9", calc.bmi >= 23 && calc.bmi < 25 ? "← You" : ""], ["Obese", "≥ 25", calc.bmi >= 25 ? "← You" : ""]]} />
        </div>
      </div>
    </CalcShell>
  );
}

function BmiArticle() {
  return (
    <>
      <h2>What is BMI?</h2>
      <p><strong>Body Mass Index (BMI)</strong> is weight in kg divided by height in metres squared. It is the world's most-used screening tool for underweight, normal weight, overweight and obesity — used by doctors, insurers and the Indian Army alike. It takes 10 seconds and needs no lab test, which is why every health check-up starts with it.</p>
      <p><strong>Important for Indians:</strong> global (WHO) cut-offs say normal is 18.5–24.9, but Indian bodies carry more fat at the same BMI. The <strong>Indian consensus (2015)</strong> sets normal at <strong>18.5–22.9</strong>, overweight 23–24.9, obese ≥25. Our calculator uses these stricter Indian cut-offs.</p>
      <h2>BMI formula</h2>
      <span className="formula">BMI = weight (kg) ÷ height (m)²</span>
      <p>Example: 70 kg, 170 cm → height = 1.70 m, squared = 2.89. BMI = 70 ÷ 2.89 = <strong>24.2</strong> → overweight by Indian standards (though “normal” by WHO). Ideal Indian-range weight for 170 cm = 18.5×2.89 to 22.9×2.89 = <strong>53–66 kg</strong>.</p>
      <h2>BMI chart for Indian adults</h2>
      <table><thead><tr><th>Category</th><th>Indian BMI</th><th>Action</th></tr></thead><tbody>
        <tr><td>Underweight</td><td>Below 18.5</td><td>Protein + surplus diet</td></tr>
        <tr><td>Normal</td><td>18.5 – 22.9</td><td>Maintain, 150 min/week exercise</td></tr>
        <tr><td>Overweight</td><td>23 – 24.9</td><td>Walk 30 min + cut sugar</td></tr>
        <tr><td>Obese</td><td>25 and above</td><td>Doctor + structured plan</td></tr>
      </tbody></table>
      <h2>Limits of BMI</h2>
      <ul>
        <li><strong>Athletes</strong> — muscle weighs more than fat; a kabaddi player may read “obese” at 12% body fat.</li>
        <li><strong>Belly fat matters more</strong> — Indians get heart risk from waist size: keep under 90 cm (men) / 80 cm (women) even if BMI is normal (“skinny-fat”).</li>
        <li><strong>Not for kids/pregnancy</strong> — use growth percentiles and doctor guidance instead.</li>
      </ul>
    </>
  );
}
