import { useMemo, useState } from "react";
import { CalcShell } from "../../components/CalcShell";
import { ResultCard } from "../../components/ui";
import { formatNum } from "../../utils/format";
import { CALCULATORS } from "../../data/site";

const META = CALCULATORS.find((c) => c.slug === "age")!;
const FAQS = [
  { q: "How is exact age calculated?", a: "Age = current date minus birth date, borrowed correctly across months and leap years. Example: born 15 Aug 1998, today 6 Nov 2026 → 28 years, 2 months, 22 days. Our calculator handles month lengths and leap days automatically." },
  { q: "How many days old am I?", a: "Multiply years by 365 plus leap days plus day offsets — the tool above shows total days, weeks, hours and minutes lived instantly from your DOB." },
  { q: "What DOB format should I use?", a: "Use DD-MM-YYYY (e.g. 15-08-1998) as on Aadhaar and school records. The date picker above avoids confusion between US (MM-DD) and Indian (DD-MM) formats." },
  { q: "How is age counted for government jobs and exams?", a: "Most UPSC/SSC/bank notifications count age as on a cut-off date (often 1st August or 1st January of the exam year), not today. Enter that cut-off as 'age at date' to check eligibility." },
  { q: "When is my next birthday and which day of the week?", a: "The calculator shows days remaining to your next birthday and its weekday. Leap-day (29 Feb) birthdays are celebrated on 28 Feb or 1 Mar in non-leap years." },
];

function toISO(d: Date) { return d.toISOString().slice(0, 10); }

export default function AgeCalculator() {
  const today = new Date();
  const def = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
  const [dob, setDob] = useState(toISO(def));
  const [atDate, setAtDate] = useState(toISO(today));

  const calc = useMemo(() => {
    const b = new Date(dob + "T00:00:00");
    const t = new Date(atDate + "T00:00:00");
    if (isNaN(b.getTime()) || isNaN(t.getTime()) || b > t) return null;
    let y = t.getFullYear() - b.getFullYear();
    let m = t.getMonth() - b.getMonth();
    let d = t.getDate() - b.getDate();
    if (d < 0) { m--; const prev = new Date(t.getFullYear(), t.getMonth(), 0).getDate(); d += prev; }
    if (m < 0) { y--; m += 12; }
    const ms = t.getTime() - b.getTime();
    const totalDays = Math.floor(ms / 86400000);
    const weeks = Math.floor(totalDays / 7);
    // next birthday
    const thisYearB = new Date(t.getFullYear(), b.getMonth(), b.getDate());
    let next = thisYearB >= new Date(t.getFullYear(), t.getMonth(), t.getDate()) ? thisYearB : new Date(t.getFullYear() + 1, b.getMonth(), b.getDate());
    if (toISO(t) === toISO(thisYearB)) next = thisYearB;
    const daysTo = Math.round((next.getTime() - new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime()) / 86400000);
    const weekday = next.toLocaleDateString("en-IN", { weekday: "long" });
    const birthDay = b.toLocaleDateString("en-IN", { weekday: "long" });
    const zodiac = zodiacSign(b.getMonth() + 1, b.getDate());
    return { y, m, d, totalDays, weeks, hours: totalDays * 24, minutes: totalDays * 24 * 60, daysTo, weekday, birthDay, zodiac, nextStr: next.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }), turning: next.getFullYear() - b.getFullYear() };
  }, [dob, atDate]);

  return (
    <CalcShell path={META.path} title={META.title} meta={META.meta}
      h1="Age Calculator – Exact Age from Date of Birth"
      intro="Enter your date of birth to get exact age in years, months and days — plus total days lived, next birthday countdown and weekday of birth."
      faqs={FAQS} related={META.related} article={<AgeArticle />}>
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3">
          <div className="rounded-xl border border-sky-100 bg-white p-4">
            <label className="text-sm font-semibold text-slate-700" htmlFor="dob">Date of birth</label>
            <input id="dob" type="date" value={dob} max={atDate} onChange={(e) => setDob(e.target.value)} className="mt-2 w-full rounded-xl border border-sky-200 bg-sky-50/40 px-3 py-3 text-base font-bold text-slate-900 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" />
            <p className="mt-1.5 text-xs text-slate-500">As on Aadhaar / birth certificate (DD-MM-YYYY)</p>
          </div>
          <div className="rounded-xl border border-sky-100 bg-white p-4">
            <label className="text-sm font-semibold text-slate-700" htmlFor="at">Calculate age as on (for exams/jobs)</label>
            <input id="at" type="date" value={atDate} onChange={(e) => setAtDate(e.target.value)} className="mt-2 w-full rounded-xl border border-sky-200 bg-sky-50/40 px-3 py-3 text-base font-bold text-slate-900 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" />
            <div className="mt-2 flex flex-wrap gap-2">
              <button onClick={() => setAtDate(toISO(new Date()))} className="rounded-lg bg-sky-100 px-3 py-2 text-xs font-bold text-sky-800 hover:bg-sky-200 transition">Today</button>
              <button onClick={() => setAtDate(`${new Date().getFullYear()}-08-01`)} className="rounded-lg bg-sky-100 px-3 py-2 text-xs font-bold text-sky-800 hover:bg-sky-200 transition">1 Aug (UPSC cut-off)</button>
            </div>
          </div>
          {calc && (
            <div className="rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 p-5 text-white shadow-lg">
              <p className="text-xs font-bold uppercase tracking-widest text-white/80">Your exact age</p>
              <p className="mt-1 text-3xl font-extrabold">{calc.y} <span className="text-base font-semibold">yrs</span> {calc.m} <span className="text-base font-semibold">mo</span> {calc.d} <span className="text-base font-semibold">days</span></p>
              <p className="mt-1 text-sm text-white/85">Born on a {calc.birthDay} · {calc.zodiac}</p>
            </div>
          )}
        </div>
        <div className="space-y-3">
          {!calc ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">⚠️ Date of birth cannot be after “age as on” date. Please fix the dates.</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <ResultCard label="Total days" value={formatNum(calc.totalDays)} />
                <ResultCard label="Total weeks" value={formatNum(calc.weeks)} />
                <ResultCard label="Total hours" value={formatNum(calc.hours)} />
                <ResultCard label="Next birthday" value={calc.daysTo === 0 ? "Today! 🎉" : `${calc.daysTo} days`} sub={calc.nextStr} highlight />
                <ResultCard label="Turning" value={`${calc.turning}`} sub={`on ${calc.weekday}`} />
                <ResultCard label="Total minutes" value={formatNum(calc.minutes)} />
              </div>
              <div className="rounded-xl border border-sky-100 bg-white p-4">
                <p className="text-sm font-bold text-slate-800">Life timeline</p>
                <div className="mt-3 space-y-3">
                  {[
                    { t: "Birth", d: new Date(dob + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }), c: "bg-pink-500" },
                    { t: `10,000 days old`, d: addDays(dob, 10000), c: "bg-sky-500" },
                    { t: "Today", d: new Date(atDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }), c: "bg-emerald-500" },
                    { t: `Next birthday (${calc.weekday})`, d: calc.nextStr, c: "bg-amber-500" },
                  ].map((e, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className={`h-3 w-3 shrink-0 rounded-full ${e.c}`} />
                      <p className="text-sm font-bold text-slate-800">{e.t}</p>
                      <p className="ml-auto text-sm text-slate-500">{e.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </CalcShell>
  );
}

function addDays(iso: string, n: number) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function zodiacSign(m: number, d: number) {
  const z: [number, number, string][] = [[1, 19, "Capricorn ♑"], [2, 18, "Aquarius ♒"], [3, 20, "Pisces ♓"], [4, 19, "Aries ♈"], [5, 20, "Taurus ♉"], [6, 20, "Gemini ♊"], [7, 22, "Cancer ♋"], [8, 22, "Leo ♌"], [9, 22, "Virgo ♍"], [10, 22, "Libra ♎"], [11, 21, "Scorpio ♏"], [12, 21, "Sagittarius ♐"], [12, 31, "Capricorn ♑"]];
  for (const [mm, dd, name] of z) { if (m < mm || (m === mm && d <= dd)) return name; }
  return "Capricorn ♑";
}

function AgeArticle() {
  return (
    <>
      <h2>What is an age calculator?</h2>
      <p>An <strong>age calculator</strong> finds the exact time between your birth date and today (or any cut-off date) — expressed as <strong>years, months and days</strong>, plus totals in days, weeks, hours and minutes. It correctly handles tricky calendar maths: months of 28–31 days and <strong>leap years</strong> (29 Feb). Doing this by hand for, say, 15-08-1998 to 06-11-2026 is error-prone; the tool above does it instantly.</p>
      <h2>How age is calculated (borrowing method)</h2>
      <p>Subtract birth date from current date component-wise. If days go negative, <strong>borrow</strong> the previous month's days; if months go negative, borrow 12 months (1 year).</p>
      <span className="formula">Age = Today − DOB (borrow days → months → years)</span>
      <p>Example: born <strong>15-08-1998</strong>, today <strong>06-11-2026</strong>. Days: 6 − 15 → borrow 31 (Oct) = 22 days, months drop to 10. Months: 10 − 8 = 2. Years: 2026 − 1998 = 28. Answer: <strong>28 years, 2 months, 22 days</strong>.</p>
      <h2>Where exact age matters in India</h2>
      <ul>
        <li><strong>Govt exams</strong> — UPSC (21–32 yrs as on 1 Aug), SSC, banking, teaching all use a cut-off date. Enter that date in “age as on”.</li>
        <li><strong>School admission</strong> — most states need 6+ years as on 31 March for Class 1.</li>
        <li><strong>Driving licence</strong> — 16 (gearless), 18 (car), 20 (transport) as on application date.</li>
        <li><strong>Senior-citizen benefits</strong> — 60+ for higher FD rates, railway and tax benefits.</li>
      </ul>
      <h2>Fun facts about your age</h2>
      <p>By 25 you have lived ~9,125 days (~13 million minutes) and slept roughly 8 years of it. Your <strong>10,000-day birthday</strong> falls at about 27 years 5 months — a fun milestone Indians now celebrate like a “second 25th”. Check yours in the timeline above.</p>
    </>
  );
}
