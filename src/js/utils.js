export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(amount);
}

export function calculateNights(checkIn, checkOut) {
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const milliseconds = end - start;
  return Math.ceil(milliseconds / 86400000);
}

export function generateReference() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `RXS-${Date.now().toString().slice(-6)}-${random}`;
}

export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

export function setMinDate(input, min = todayISO()) {
  if (input) input.min = min;
}
