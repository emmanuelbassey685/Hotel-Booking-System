import { formatCurrency, escapeHtml } from "./utils.js";

export function roomCard(room) {
  return `
    <article class="room-card">
      <img src="${room.image}" alt="${escapeHtml(room.name)}" loading="lazy">
      <div class="room-card-content">
        <div class="room-meta"><span>${escapeHtml(room.type)}</span><span>★ ${room.rating}</span></div>
        <h3>${escapeHtml(room.name)}</h3>
        <p>${escapeHtml(room.description)}</p>
        <div class="room-specs">
          <span>👤 ${room.maxGuests} guests</span>
          <span>🛏 ${room.beds} bed${room.beds > 1 ? "s" : ""}</span>
          <span>▣ ${escapeHtml(room.size)}</span>
        </div>
        <div class="room-card-footer">
          <strong>${formatCurrency(room.pricePerNight)} <small>/ night</small></strong>
          <a class="btn btn-small btn-primary" href="room-details.html?id=${encodeURIComponent(room.id)}">View Room</a>
        </div>
      </div>
    </article>
  `;
}

export function renderRooms(container, rooms) {
  if (!container) return;
  container.innerHTML = rooms.length
    ? rooms.map(roomCard).join("")
    : `<div class="empty-state"><h3>No rooms found</h3><p>Try changing your search or filter criteria.</p></div>`;
}
