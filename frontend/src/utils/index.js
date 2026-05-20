export function formatCurrency(price) {
  if (typeof price === "string") {
    return price;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function isObjectEmpty(value) {
  return value && typeof value === "object" && Object.keys(value).length === 0;
}
