export function formatINR(n: number, decimals = 0): string {
  if (!isFinite(n)) return "₹0";
  const negative = n < 0;
  n = Math.abs(Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals));
  const [intPart, decPart] = n.toFixed(decimals).split(".");
  // Indian numbering: last 3 digits, then groups of 2
  let last3 = intPart.slice(-3);
  let rest = intPart.slice(0, -3);
  if (rest !== "") {
    last3 = "," + last3;
    rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  }
  const out = rest + last3 + (decimals > 0 ? "." + decPart : "");
  return (negative ? "-₹" : "₹") + out;
}

export function formatNum(n: number, decimals = 0): string {
  if (!isFinite(n)) return "0";
  return n.toLocaleString("en-IN", { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
}

export function clamp(n: number, min: number, max: number): number {
  if (isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export function parseNum(v: string | number, fallback = 0): number {
  if (typeof v === "number") return isNaN(v) ? fallback : v;
  const cleaned = v.replace(/[^0-9.\-]/g, "");
  const n = parseFloat(cleaned);
  return isNaN(n) ? fallback : n;
}

export function compactINR(n: number): string {
  if (!isFinite(n)) return "₹0";
  const abs = Math.abs(n);
  if (abs >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  if (abs >= 1e3) return `₹${(n / 1e3).toFixed(1)}K`;
  return formatINR(Math.round(n));
}
