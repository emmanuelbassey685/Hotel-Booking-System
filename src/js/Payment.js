import { getPendingBooking, saveBooking, clearPendingBooking } from "./Storage.js";
import { formatCurrency, escapeHtml } from "./utils.js";
import { sendBookingConfirmation } from "./EmailService.js";

export function setupPaymentPage() {
  const form = document.querySelector("#payment-form");
  const summary = document.querySelector("#payment-summary");
  if (!form || !summary) return;

  const booking = getPendingBooking();

  if (!booking) {
    summary.innerHTML = `<div class="empty-state"><h2>No pending booking</h2><a class="btn btn-primary" href="rooms.html">Browse Rooms</a></div>`;
    form.hidden = true;
    return;
  }

  summary.innerHTML = `
    <p class="eyebrow">RESERVATION ${escapeHtml(booking.reference)}</p>
    <h2>${escapeHtml(booking.roomName)}</h2>
    <div class="summary-row"><span>Guest</span><strong>${escapeHtml(booking.guestName)}</strong></div>
    <div class="summary-row"><span>Dates</span><strong>${escapeHtml(booking.checkIn)} → ${escapeHtml(booking.checkOut)}</strong></div>
    <div class="summary-row"><span>Nights</span><strong>${booking.nights}</strong></div>
    <div class="summary-row total"><span>Total</span><strong>${formatCurrency(booking.total)}</strong></div>
  `;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const error = document.querySelector("#payment-error");
    error.textContent = "";

    const cardholder = document.querySelector("#cardholder-name").value.trim();
    if (!cardholder) {
      error.textContent = "Enter the payment name.";
      return;
    }

    const completed = {
      ...booking,
      paymentStatus: "Paid",
      paymentReference: `PAY-${Date.now()}`,
      paidAt: new Date().toISOString()
    };

    saveBooking(completed);
    clearPendingBooking();

    // EmailJS-ready. If credentials are configured, this attempts to send.
    await sendBookingConfirmation(completed);

    window.location.href = `bookings.html?confirmed=${encodeURIComponent(completed.reference)}`;
  });
}
