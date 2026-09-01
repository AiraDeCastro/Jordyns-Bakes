import { beforeEach, describe, expect, it, vi } from "vitest";

const insertMock = vi.fn();
const uploadMock = vi.fn();
const sendCustomerMock = vi.fn();
const sendAdminMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createPublicSupabaseClient: () => ({
    from: () => ({ insert: insertMock }),
    storage: { from: () => ({ upload: uploadMock }) },
  }),
}));

vi.mock("@/lib/email", () => ({
  sendCustomerConfirmationEmail: sendCustomerMock,
  sendAdminNotificationEmail: sendAdminMock,
}));

const { submitOrder } = await import("./actions");

function buildFormData(overrides: Record<string, string> = {}) {
  const fd = new FormData();
  const base: Record<string, string> = {
    occasion: "Wedding",
    eventDate: "2027-01-01",
    cakeType: "Cake",
    servings: "21–35",
    flavors: "Vanilla",
    designDescription: "Simple design",
    deliveryType: "Pickup",
    customerName: "Alex Smith",
    email: "alex@example.com",
    ...overrides,
  };
  for (const [key, value] of Object.entries(base)) {
    fd.set(key, value);
  }
  return fd;
}

beforeEach(() => {
  insertMock.mockReset().mockResolvedValue({ error: null });
  uploadMock.mockReset().mockResolvedValue({ error: null });
  sendCustomerMock.mockReset().mockResolvedValue(undefined);
  sendAdminMock.mockReset().mockResolvedValue(undefined);
});

describe("submitOrder", () => {
  it("inserts the order and sends emails on a valid submission", async () => {
    const result = await submitOrder({ status: "idle" }, buildFormData());

    expect(result.status).toBe("success");
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(sendCustomerMock).toHaveBeenCalledTimes(1);
    expect(sendAdminMock).toHaveBeenCalledTimes(1);
  });

  it("returns field errors for missing required fields, without inserting", async () => {
    const fd = buildFormData();
    fd.delete("designDescription");

    const result = await submitOrder({ status: "idle" }, fd);

    expect(result.status).toBe("error");
    expect(result.fieldErrors?.designDescription).toBeDefined();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("returns an error if the database insert fails", async () => {
    insertMock.mockResolvedValueOnce({ error: new Error("db down") });

    const result = await submitOrder({ status: "idle" }, buildFormData());

    expect(result.status).toBe("error");
    expect(sendCustomerMock).not.toHaveBeenCalled();
  });

  it("still succeeds for the customer even if sending emails fails", async () => {
    sendCustomerMock.mockRejectedValueOnce(new Error("email down"));

    const result = await submitOrder({ status: "idle" }, buildFormData());

    expect(result.status).toBe("success");
  });

  it("rejects an oversized reference image before uploading", async () => {
    const fd = buildFormData();
    const bigFile = new File([new Uint8Array(6 * 1024 * 1024)], "big.jpg", {
      type: "image/jpeg",
    });
    fd.append("referenceImages", bigFile);

    const result = await submitOrder({ status: "idle" }, fd);

    expect(result.status).toBe("error");
    expect(uploadMock).not.toHaveBeenCalled();
    expect(insertMock).not.toHaveBeenCalled();
  });
});
