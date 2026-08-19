import { getHotel } from "./RoomData.js";

export async function renderHotelMap(container) {
  if (!container) return;

  const hotel = await getHotel();
  const { latitude, longitude } = hotel;

  // This iframe requires no Google Maps JavaScript key and is useful for
  // a course prototype. A production app can replace it with Maps JS API.
  container.innerHTML = `
    <iframe
      title="Rexona Hotel & Suite map"
      loading="lazy"
      allowfullscreen
      referrerpolicy="no-referrer-when-downgrade"
      src="https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed">
    </iframe>
  `;
}

export async function setupDirectionsLink() {
  const link = document.querySelector("#directions-link");
  if (!link) return;
  const hotel = await getHotel();
  link.href = `https://www.google.com/maps/dir/?api=1&destination=${hotel.latitude},${hotel.longitude}`;
}
