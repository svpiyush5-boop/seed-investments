const INR_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number): string {
  if (isNaN(value) || !isFinite(value)) return "₹ 0";
  return INR_FORMATTER.format(Math.round(value));
}

export function formatCurrencyShort(value: number): string {
  if (isNaN(value) || !isFinite(value)) return "₹ 0";
  const val = Math.round(value);
  if (val >= 10000000) return `₹ ${(val / 10000000).toFixed(2)} Cr`;
  if (val >= 100000) return `₹ ${(val / 100000).toFixed(2)} L`;
  if (val >= 1000) {
    return `₹ ${(val / 1000).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    })} K`;
  }
  return formatCurrency(val);
}

export const formatINR = formatCurrencyShort;
