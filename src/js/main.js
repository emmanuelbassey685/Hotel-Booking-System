import { getRooms } from "./RoomData.js";
import { renderRooms } from "./RoomList.js";
import { searchRooms, sortRooms } from "./RoomSearch.js";
import { renderRoomDetails } from "./RoomDetails.js";
import { setupBookingPage } from "./Booking.js";
import { renderBookings } from "./BookingManager.js";
import { setupPaymentPage } from "./Payment.js";
import { renderHotelMap, setupDirectionsLink } from "./MapService.js";
import { setMinDate, getQueryParam } from "./utils.js";

function renderHeader() {
  const header = document.querySelector("#site-header");
  if (!header) return;

  const page = document.body.dataset.page;
  header.innerHTML = `
    <div class="nav-wrap">
      <a class="brand" href="index.html">
        <span class="brand-mark">R</span>
        <span>REXONA <small>HOTEL & SUITE</small></span>
      </a>
      <button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button>
      <nav class="nav-menu">
        <a class="${page === "home" ? "active" : ""}" href="index.html">Home</a>
        <a class="${page === "rooms" || page === "details" ? "active" : ""}" href="rooms.html">Rooms</a>
        <a class="${page === "bookings" ? "active" : ""}" href="bookings.html">Bookings</a>
        <a class="${page === "location" ? "active" : ""}" href="location.html">Location</a>
        <a href="index.html#contact">Contact</a>
      </nav>
    </div>
  `;

  const toggle = header.querySelector(".menu-toggle");
  const nav = header.querySelector(".nav-menu");
  toggle?.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open");
  });
}

function renderFooter() {
  const footer = document.querySelector("#site-footer");
  if (!footer) return;
  footer.innerHTML = `
    <div class="container footer-grid">
      <div><h3>REXONA HOTEL & SUITE</h3><p>Luxury accommodation with simple, convenient booking.</p></div>
      <div><h4>Quick Links</h4><a href="rooms.html">Rooms</a><a href="bookings.html">My Bookings</a><a href="location.html">Location</a></div>
      <div><h4>Contact</h4><p>15 Rexona Avenue, Uyo, Akwa Ibom</p><p>+234 80 3779 6941</p></div>
    </div>
    <div class="footer-bottom">© ${new Date().getFullYear()} Rexona Hotel & Suite. Academic/project prototype of Bassey, Emmanuel.</div>
  `;
}

function setupHomeSearch() {
  const form = document.querySelector("#home-search");
  if (!form) return;
  const checkin = document.querySelector("#home-checkin");
  const checkout = document.querySelector("#home-checkout");
  setMinDate(checkin);
  setMinDate(checkout);

  checkin?.addEventListener("change", () => {
    if (checkout) checkout.min = checkin.value;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const params = new URLSearchParams({
      guests: document.querySelector("#home-guests").value,
      type: document.querySelector("#home-room-type").value,
      checkin: checkin.value,
      checkout: checkout.value
    });
    window.location.href = `rooms.html?${params}`;
  });
}

async function setupHome() {
  setupHomeSearch();
  const container = document.querySelector("#featured-rooms");
  if (!container) return;
  const rooms = await getRooms();
  renderRooms(container, rooms.slice(0, 3));
}

async function setupRooms() {
  const container = document.querySelector("#rooms-list");
  const form = document.querySelector("#room-search-form");
  if (!container || !form) return;

  const rooms = await getRooms();
  const params = new URLSearchParams(window.location.search);

  const guests = document.querySelector("#search-guests");
  const type = document.querySelector("#search-type");
  const sort = document.querySelector("#sort-rooms");
  const checkin = document.querySelector("#search-checkin");
  const checkout = document.querySelector("#search-checkout");

  guests.value = params.get("guests") || "2";
  type.value = params.get("type") || "all";
  checkin.value = params.get("checkin") || "";
  checkout.value = params.get("checkout") || "";
  setMinDate(checkin);
  setMinDate(checkout);

  const render = () => {
    let results = searchRooms(rooms, {
      guests: guests.value,
      type: type.value
    });
    results = sortRooms(results, sort.value);
    renderRooms(container, results);
    document.querySelector("#room-count").textContent = `${results.length} room${results.length === 1 ? "" : "s"}`;
    document.querySelector("#room-search-message").textContent =
      checkin.value && checkout.value ? `Searching for ${checkin.value} to ${checkout.value}` : "";
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    render();
  });

  sort.addEventListener("change", render);
  render();
}

async function init() {
  renderHeader();
  renderFooter();

  try {
    const page = document.body.dataset.page;

    if (page === "home") await setupHome();
    if (page === "rooms") await setupRooms();

    if (page === "details") {
      await renderRoomDetails(document.querySelector("#room-details"), getQueryParam("id"));
    }

    if (page === "booking") await setupBookingPage();
    if (page === "payment") setupPaymentPage();

    if (page === "bookings") {
      renderBookings(document.querySelector("#bookings-list"));
    }

    if (page === "location") {
      await renderHotelMap(document.querySelector("#map-container"));
      await setupDirectionsLink();
    }
  } catch (error) {
    console.error(error);
    const main = document.querySelector("main");
    if (main) {
      const message = document.createElement("div");
      message.className = "container error-box";
      message.textContent = "Sorry, something went wrong while loading this page. Please refresh and try again.";
      main.prepend(message);
    }
  }
}

init();
