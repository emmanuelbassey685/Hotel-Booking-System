const BOOKING_KEY = "rexonaBookings";
const PENDING_BOOKING_KEY = "rexonaPendingBooking";

export function getBookings() {
  try {
    return JSON.parse(localStorage.getItem(BOOKING_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveBooking(booking) {
  const bookings = getBookings();
  bookings.unshift(booking);
  localStorage.setItem(BOOKING_KEY, JSON.stringify(bookings));
  return booking;
}

export function getBookingByReference(reference) {
  return getBookings().find((booking) => booking.reference === reference);
}

export function savePendingBooking(booking) {
  localStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(booking));
}

export function getPendingBooking() {
  try {
    return JSON.parse(localStorage.getItem(PENDING_BOOKING_KEY));
  } catch {
    return null;
  }
}

export function clearPendingBooking() {
  localStorage.removeItem(PENDING_BOOKING_KEY);
}
