export function formatKES(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("KES", "KSh");
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-KE", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

export function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function slugifyPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  // Accept a leading trunk "0" (e.g. 0712 345 678, how most people dial
  // locally) and drop it — the UI's "+254" prefix already covers it.
  if (digits.startsWith("0") && digits.length > 9) digits = digits.slice(1);
  digits = digits.slice(0, 9);
  return digits.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "));
}
