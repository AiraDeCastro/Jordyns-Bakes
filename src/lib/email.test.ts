import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

const { sendCustomerConfirmationEmail, sendAdminNotificationEmail } = await import("./email");

const sampleOrder = {
  customerName: "Alex",
  email: "alex@example.com",
  occasion: "Wedding",
  eventDate: "2026-12-01",
};

beforeEach(() => {
  sendMock.mockClear();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("sendCustomerConfirmationEmail", () => {
  it("sends to the customer's email address", async () => {
    await sendCustomerConfirmationEmail(sampleOrder);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: "alex@example.com" }),
    );
  });
});

describe("sendAdminNotificationEmail", () => {
  it("sends to the configured admin email", async () => {
    vi.stubEnv("ADMIN_NOTIFICATION_EMAIL", "admin@example.com");
    await sendAdminNotificationEmail(sampleOrder);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: "admin@example.com" }),
    );
  });

  it("does nothing when no admin email is configured", async () => {
    vi.stubEnv("ADMIN_NOTIFICATION_EMAIL", "");
    await sendAdminNotificationEmail(sampleOrder);
    expect(sendMock).not.toHaveBeenCalled();
  });
});
