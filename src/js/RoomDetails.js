import { getRoomById } from "./RoomData.js";
import { formatCurrency, escapeHtml } from "./utils.js";

export async function renderRoomDetails(container, id) {
  const room = await getRoomById(id);

  if (!room) {
    container.innerHTML = `<div class="empty-state"><h2>Room not found</h2><a class="btn btn-primary" href="rooms.html">Back to Rooms</a></div>`;
    return;
  }

  container.innerHTML = `
    <div class="details-grid">
      <div class="details-image"><img src="${room.image}" alt="${escapeHtml(room.name)}"></div>
      <div class="details-content">
        <p class="eyebrow">${escapeHtml(room.type)} ROOM</p>
        <h1>${escapeHtml(room.name)}</h1>
        <div class="rating">★ ${room.rating} rating</div>
        <p class="lead">${escapeHtml(room.description)}</p>
        <div class="detail-price">${formatCurrency(room.pricePerNight)} <small>/ night</small></div>
        <div class="room-specs large">
          <span>👤 Up to ${room.maxGuests} guests</span>
          <span>🛏 ${room.beds} bed${room.beds > 1 ? "s" : ""}</span>
          <span>▣ ${escapeHtml(room.size)}</span>
        </div>
        <h3>Amenities</h3>
        <ul class="amenities">${room.amenities.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <a class="btn btn-primary" href="booking.html?room=${encodeURIComponent(room.id)}">Book This Room</a>
      </div>
    </div>
  `;
}
