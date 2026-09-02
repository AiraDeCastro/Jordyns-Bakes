import { beforeEach, describe, expect, it, vi } from "vitest";

const signOutMock = vi.fn();
const eqMock = vi.fn();
const deleteEqMock = vi.fn();
const updateMock = vi.fn(() => ({ eq: eqMock }));
const deleteMock = vi.fn(() => ({ eq: deleteEqMock }));
const redirectMock = vi.fn();
const revalidatePathMock = vi.fn();

vi.mock("@/lib/supabase/server-session", () => ({
  createSessionSupabaseClient: async () => ({
    auth: { signOut: signOutMock },
    from: () => ({ update: updateMock, delete: deleteMock }),
  }),
}));

vi.mock("next/navigation", () => ({ redirect: redirectMock }));
vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));

const { signOut, toggleAccepting, updateOrderStatus, deleteOrder } = await import("./actions");

beforeEach(() => {
  signOutMock.mockReset().mockResolvedValue({});
  eqMock.mockReset().mockResolvedValue({ error: null });
  deleteEqMock.mockReset().mockResolvedValue({ error: null });
  updateMock.mockClear();
  deleteMock.mockClear();
  redirectMock.mockReset();
  revalidatePathMock.mockReset();
});

describe("signOut", () => {
  it("signs out and redirects to the login page", async () => {
    await signOut();

    expect(signOutMock).toHaveBeenCalled();
    expect(redirectMock).toHaveBeenCalledWith("/admin/login");
  });
});

describe("toggleAccepting", () => {
  it("updates accepting_orders and revalidates the pages that show it", async () => {
    const fd = new FormData();
    fd.set("next", "false");

    await toggleAccepting(fd);

    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({ accepting_orders: false }),
    );
    expect(eqMock).toHaveBeenCalledWith("id", 1);
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin");
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
    expect(revalidatePathMock).toHaveBeenCalledWith("/order");
  });
});

describe("updateOrderStatus", () => {
  it("updates the order status for a valid status", async () => {
    const fd = new FormData();
    fd.set("status", "Quoted");

    await updateOrderStatus("order-123", fd);

    expect(updateMock).toHaveBeenCalledWith({ status: "Quoted" });
    expect(eqMock).toHaveBeenCalledWith("id", "order-123");
  });

  it("does nothing for a status that isn't in the allowed list", async () => {
    const fd = new FormData();
    fd.set("status", "NotARealStatus");

    await updateOrderStatus("order-123", fd);

    expect(updateMock).not.toHaveBeenCalled();
  });
});

describe("deleteOrder", () => {
  it("deletes the order and redirects to the dashboard", async () => {
    await deleteOrder("order-123");

    expect(deleteMock).toHaveBeenCalled();
    expect(deleteEqMock).toHaveBeenCalledWith("id", "order-123");
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin");
    expect(redirectMock).toHaveBeenCalledWith("/admin");
  });
});
