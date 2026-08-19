import { getRoomById } from "./RoomData.js";
import { calculateNights, formatCurrency, generateReference, escapeHtml } from "./utils.js";
import { savePendingBooking } from "./Storage.js";

export async function setupBookingPage() {
  const form = document.querySelector("#booking-form");
  const summary = document.querySelector("#booking-summary");
  if (!form || !summary) return;

  const roomId = new URLSearchParams(window.location.search).get("room");
  const room = await getRoomById(roomId);
  const error = document.querySelector("#booking-error");

  if (!room) {
    form.innerHTML = `<div class="empty-state"><h2>Select a room first</h2><a class="btn btn-primary" href="rooms.html">Browse Rooms</a></div>`;
    return;
  }

  document.querySelector("#booking-room-id").value = room.id;
  document.querySelector("#booking-guests").max = room.maxGuests;

  const updateSummary = () => {
    const checkIn = document.querySelector("#booking-checkin").value;
    const checkOut = document.querySelector("#booking-checkout").value;

    let nights = 0;
    let total = 0;
    if (checkIn && checkOut) {
      nights = calculateNights(checkIn, checkOut);
      if (nights > 0) total = nights * room.pricePerNight;
    }

    summary.innerHTML = `
      <p class="eyebrow">BOOKING SUMMARY</p>
      <h2>${escapeHtml(room.name)}</h2>
      <p>${escapeHtml(room.type)} · ${room.maxGuests} guests maximum</p>
      <hr>
      <div class="summary-row"><span>Price/night</span><strong>${formatCurrency(room.pricePerNight)}</strong></div>
      <div class="summary-row"><span>Nights</span><strong>${nights || "—"}</strong></div>
      <div class="summary-row total"><span>Total</span><strong>${formatCurrency(total)}</strong></div>
    `;
  };

  form.addEventListener("input", updateSummary);
  updateSummary();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.textContent = "";

    const checkIn = document.querySelector("#booking-checkin").value;
    const checkOut = document.querySelector("#booking-checkout").value;
    const guests = Number(document.querySelector("#booking-guests").value);
    const nights = calculateNights(checkIn, checkOut);

    if (!checkIn || !checkOut || nights <= 0) {
      error.textContent = "Please select valid check-in and check-out dates.";
      return;
    }

    if (guests > room.maxGuests) {
      error.textContent = `This room allows a maximum of ${room.maxGuests} guests.`;
      return;
    }

    const booking = {
      reference: generateReference(),
      hotelName: "Rexona Hotel & Suite",
      roomId: room.id,
      roomName: room.name,
      roomType: room.type,
      guestName: document.querySelector("#guest-name").value.trim(),
      email: document.querySelector("#guest-email").value.trim(),
      phone: document.querySelector("#guest-phone").value.trim(),
      checkIn,
      checkOut,
      guests,
      specialRequest: document.querySelector("#special-request").value.trim(),
      nights,
      pricePerNight: room.pricePerNight,
      total: nights * room.pricePerNight,
      paymentStatus: "Pending",
      bookingStatus: "Reserved",
      createdAt: new Date().toISOString()
    };

    savePendingBooking(booking);
    window.location.href = "payment.html";
  });
}
