import { APP_CONFIG } from "./config.js";

export async function sendBookingConfirmation(booking) {
  // Prototype fallback: no network request is made until EmailJS credentials
  // are configured. In production, use EmailJS or a backend email service.
  if (!APP_CONFIG.emailjs.publicKey || !APP_CONFIG.emailjs.serviceId || !APP_CONFIG.emailjs.templateId) {
    console.info("EmailJS is not configured. Booking confirmation:", booking.reference);
    return { success: true, mode: "prototype" };
  }

  try {
    const emailjs = await import("@emailjs/browser");
    emailjs.init({ publicKey: APP_CONFIG.emailjs.publicKey });

    await emailjs.send(
      APP_CONFIG.emailjs.serviceId,
      APP_CONFIG.emailjs.templateId,
      {
        to_email: booking.email,
        customer_name: booking.guestName,
        booking_reference: booking.reference,
        hotel_name: booking.hotelName,
        room_name: booking.roomName,
        check_in: booking.checkIn,
        check_out: booking.checkOut,
        guests: booking.guests,
        total: booking.total,
        payment_status: booking.paymentStatus
      }
    );

    return { success: true, mode: "emailjs" };
  } catch (error) {
    console.error("EmailJS error:", error);
    return { success: false, mode: "emailjs", error };
  }
}
