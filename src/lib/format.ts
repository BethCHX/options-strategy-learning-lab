export function money(value: number): string {
  const abs = Math.abs(value);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: abs >= 1000 ? 0 : 2
  }).format(abs);
  return value < 0 ? `-${formatted}` : formatted;
}

export function compactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}
