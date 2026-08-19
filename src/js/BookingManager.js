import { getBookings } from "./Storage.js";
import { formatCurrency, escapeHtml } from "./utils.js";

export function renderBookings(container) {
  const bookings = getBookings();

  if (!bookings.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>No bookings yet</h2>
        <p>Your completed reservations will appear here.</p>
        <a class="btn btn-primary" href="rooms.html">Find a Room</a>
      </div>`;
    return;
  }

  container.innerHTML = bookings.map((booking) => `
    <article class="booking-card">
      <div>
        <p class="eyebrow">${escapeHtml(booking.reference)}</p>
        <h2>${escapeHtml(booking.roomName)}</h2>
        <p>${escapeHtml(booking.checkIn)} → ${escapeHtml(booking.checkOut)} · ${booking.nights} night(s)</p>
        <p>${booking.guests} guest(s) · ${escapeHtml(booking.guestName)}</p>
      </div>
      <div class="booking-status">
        <span class="status">${escapeHtml(booking.paymentStatus)}</span>
        <strong>${formatCurrency(booking.total)}</strong>
      </div>
    </article>
  `).join("");
}
