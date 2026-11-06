import React from "react";
import { formatINR } from "../utils/format";

/* ---------- Ad Slot (AdSense placeholder) ---------- */
export function AdSlot({ label, size = "Responsive" }: { label: string; size?: string }) {
  return (
    <div className="my-6">
      {/* Google AdSense Ad Slot: {label} — paste your ad-slot units below after approval */}
      {/* <ins className="adsbygoogle" style={{display:'block'}} data-ad-client="ca-pub-5080814168192090" data-ad-slot="XXXXXXXXXX" data-ad-format="auto" data-full-width-responsive="true"></ins> */}
      <div className="ad-slot rounded-xl px-4 py-6 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-700/70">Advertisement</p>
        <p className="mt-1 text-xs text-slate-500">
          {label} · {size} · Reserved for Google AdSense
        </p>
      </div>
    </div>
  );
}

/* ---------- Slider + Number input row ---------- */
export function Field({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  prefix = "₹",
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  prefix?: string;
  hint?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="rounded-xl border border-sky-100 bg-white p-3.5 sm:p-4 shadow-[0_1px_0_#e0eefc]">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <label className="text-xs sm:text-sm font-semibold text-slate-700 min-w-0 flex-1 truncate">{label}</label>
        <div className="flex items-center overflow-hidden rounded-lg border border-sky-200 bg-sky-50/50 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 shrink-0">
          <span className="pl-2 sm:pl-2.5 text-xs sm:text-sm font-bold text-sky-700">{prefix}</span>
          <input
            type="number"
            inputMode="decimal"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const n = parseFloat(e.target.value);
              onChange(isNaN(n) ? min : n);
            }}
            className="w-20 sm:w-28 bg-transparent px-1 sm:px-1.5 py-1.5 sm:py-2 text-right text-xs sm:text-sm font-bold text-slate-900 outline-none"
            aria-label={label}
          />
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, value))}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-2.5 sm:mt-3"
        style={{ ["--fill" as string]: `${Math.min(100, Math.max(0, pct))}%` }}
        aria-label={`${label} slider`}
      />
      <div className="mt-1 flex justify-between text-[10px] sm:text-[11px] font-medium text-slate-400">
        <span className="truncate">{prefix === "₹" ? formatINR(min) : `${min}${prefix}`}</span>
        {hint && <span className="text-sky-700/90 font-semibold px-1 truncate">{hint}</span>}
        <span className="truncate">{prefix === "₹" ? formatINR(max) : `${max}${prefix}`}</span>
      </div>
    </div>
  );
}

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel?: string;
}) {
  return (
    <div className="flex overflow-x-auto no-scrollbar rounded-xl bg-sky-100/70 p-1" role="tablist" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 min-w-[70px] rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-bold transition whitespace-nowrap ${
            value === o.value
              ? "bg-white text-sky-800 shadow"
              : "text-slate-500 hover:text-sky-700"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function ResultCard({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 sm:p-4 transition ${
        highlight
          ? "border-sky-600 bg-gradient-to-br from-[#066fd1] to-[#0a5cab] text-white shadow-lg shadow-sky-200"
          : "border-sky-100 bg-white"
      }`}
    >
      <p className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wide truncate ${highlight ? "text-sky-100" : "text-slate-500"}`}>{label}</p>
      <p className={`mt-1 text-base sm:text-xl lg:text-2xl font-extrabold tracking-tight tabular-nums break-words ${highlight ? "text-white" : "text-slate-900"}`}>{value}</p>
      {sub && <p className={`mt-0.5 text-[10px] sm:text-xs truncate ${highlight ? "text-sky-100/90" : "text-slate-500"}`}>{sub}</p>}
    </div>
  );
}

/* ---------- Donut chart (pure SVG, zero deps) ---------- */
export function Donut({
  parts,
  centerTop,
  centerBottom,
}: {
  parts: { label: string; value: number; color: string }[];
  centerTop: string;
  centerBottom: string;
}) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  const R = 54;
  const C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
      <div className="relative h-32 w-32 sm:h-36 sm:w-36 shrink-0">
        <svg viewBox="0 0 130 130" className="h-full w-full -rotate-90">
          <circle cx="65" cy="65" r={R} fill="none" stroke="#e8f1fc" strokeWidth="18" />
          {parts.map((p, i) => {
            const frac = p.value / total;
            const dash = frac * C;
            const el = (
              <circle
                key={i}
                cx="65"
                cy="65"
                r={R}
                fill="none"
                stroke={p.color}
                strokeWidth="18"
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += dash;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{centerTop}</span>
          <span className="text-xs sm:text-sm font-extrabold text-slate-900">{centerBottom}</span>
        </div>
      </div>
      <div className="w-full sm:min-w-0 sm:flex-1 space-y-2">
        {parts.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 rounded-full" style={{ background: p.color }} />
            <span className="truncate font-medium text-slate-600">{p.label}</span>
            <span className="ml-auto font-bold tabular-nums text-slate-900">{formatINR(Math.round(p.value))}</span>
          </div>
        ))}
        <p className="text-[11px] sm:text-xs text-slate-500 pt-1">
          {parts.map((p) => `${((p.value / total) * 100).toFixed(1)}%`).join(" · ")}
        </p>
      </div>
    </div>
  );
}

/* ---------- Year bars (pure divs) ---------- */
export function YearBars({
  rows,
  max,
  colorA = "#066fd1",
  colorB = "#34d399",
  labelA = "Invested",
  labelB = "Growth",
}: {
  rows: { year: string; a: number; b: number }[];
  max: number;
  colorA?: string;
  colorB?: string;
  labelA?: string;
  labelB?: string;
}) {
  const show = rows.length > 12 ? rows.filter((_, i) => i % Math.ceil(rows.length / 12) === 0 || i === rows.length - 1) : rows;
  return (
    <div>
      <div className="flex items-end gap-1 sm:gap-1.5 overflow-x-auto pb-1 no-scrollbar" style={{ minHeight: 120 }}>
        {show.map((r, i) => {
          const h = Math.max(6, (Math.max(r.a + r.b, 1) / max) * 110);
          const bH = ((r.b / Math.max(r.a + r.b, 1)) * h);
          return (
            <div key={i} className="flex min-w-[20px] sm:min-w-[26px] flex-1 flex-col items-center gap-1" title={`${r.year}: ${formatINR(Math.round(r.a + r.b))}`}>
              <div className="flex w-full max-w-[26px] sm:max-w-[30px] flex-col justify-end overflow-hidden rounded-t-md bg-sky-100" style={{ height: h }}>
                <div style={{ height: bH, background: colorB }} />
                <div style={{ height: h - bH, background: colorA }} className="opacity-90" />
              </div>
              <span className="text-[9px] font-semibold text-slate-400">{r.year}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-3 sm:gap-4 text-xs font-medium text-slate-600">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded" style={{ background: colorA }} />{labelA}</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded" style={{ background: colorB }} />{labelB}</span>
      </div>
    </div>
  );
}

export function BreakupTable({
  head,
  rows,
  foot,
}: {
  head: string[];
  rows: React.ReactNode[][];
  foot?: React.ReactNode[];
}) {
  return (
    <div className="relative overflow-x-auto rounded-xl border border-sky-100 shadow-sm -mx-1 sm:mx-0">
      <table className="w-full min-w-[420px] sm:min-w-[500px] text-xs sm:text-sm">
        <thead>
          <tr className="bg-sky-50 text-left">
            {head.map((h, i) => (
              <th key={i} className="px-2.5 sm:px-3 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide text-sky-900 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-sky-50 bg-white">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-sky-50/40">
              {r.map((c, j) => (
                <td key={j} className={`px-2.5 sm:px-3 py-1.5 sm:py-2 ${j === 0 ? "font-semibold text-slate-700" : "text-slate-600 tabular-nums"}`}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
        {foot && (
          <tfoot>
            <tr className="bg-sky-900 text-white">
              {foot.map((f, i) => (
                <td key={i} className="px-2.5 sm:px-3 py-2 sm:py-2.5 font-bold tabular-nums whitespace-nowrap">{f}</td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
