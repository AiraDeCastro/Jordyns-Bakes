import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Resend's sandbox sender (no verified domain yet) can only deliver to
// the account owner's own inbox — see PLANNING.md. Swap this once a
// real domain is verified with Resend.
const FROM_ADDRESS = "Jordyn's Bakes <onboarding@resend.dev>";

type OrderEmailDetails = {
  customerName: string;
  email: string;
  occasion: string;
  eventDate: string;
};

export async function sendCustomerConfirmationEmail(details: OrderEmailDetails) {
  await resend.emails.send({
    from: FROM_ADDRESS,
    to: details.email,
    subject: "We got your order request — Jordyn's Bakes",
    text: `Hi ${details.customerName},\n\nThanks for your order request for your ${details.occasion.toLowerCase()} on ${details.eventDate}. Jordyn will follow up soon to confirm details and provide a quote.\n\n— Jordyn's Bakes`,
  });
}

export async function sendAdminNotificationEmail(details: OrderEmailDetails) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: adminEmail,
    subject: `New order request — ${details.occasion} on ${details.eventDate}`,
    text: `New order request from ${details.customerName} (${details.email}) for a ${details.occasion.toLowerCase()} on ${details.eventDate}.`,
  });
}
