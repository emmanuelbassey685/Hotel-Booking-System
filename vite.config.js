import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  server: {
    port: 5173,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        home: "index.html",
        rooms: "rooms.html",
        details: "room-details.html",
        booking: "booking.html",
        payment: "payment.html",
        bookings: "bookings.html",
        location: "location.html"
      }
    }
  }
});
