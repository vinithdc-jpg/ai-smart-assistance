export const formatCurrency = (amount: number, digits = 0): string => {
  const numericAmount = Number(amount);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number.isFinite(numericAmount) ? numericAmount : 0);
};

export const formatMoney = (amount: number): string =>
  formatCurrency(amount, amount % 1 === 0 ? 0 : 2);

export function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function formatTransactionDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function toIndiaDateValue(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";

  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function calcGst(baseAmount: number, gstRate: number) {
  const amountExcludingGst =
    Number.isFinite(baseAmount) && baseAmount > 0 ? baseAmount : 0;
  const cgstAmount =
    gstRate > 0 && amountExcludingGst > 0
      ? roundMoney((amountExcludingGst * (gstRate / 2)) / 100)
      : 0;
  const sgstAmount =
    gstRate > 0 && amountExcludingGst > 0
      ? roundMoney((amountExcludingGst * (gstRate / 2)) / 100)
      : 0;
  const totalGstAmount = roundMoney(cgstAmount + sgstAmount);
  const totalAmountWithGst = roundMoney(amountExcludingGst + totalGstAmount);
  return {
    amountExcludingGst,
    cgstAmount,
    sgstAmount,
    totalGstAmount,
    totalAmountWithGst,
  };
}

export function memberInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatMemberSince(value?: string) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
