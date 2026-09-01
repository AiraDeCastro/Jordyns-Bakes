import { beforeEach, describe, expect, it, vi } from "vitest";

const signInMock = vi.fn();
const redirectMock = vi.fn();

vi.mock("@/lib/supabase/server-session", () => ({
  createSessionSupabaseClient: async () => ({
    auth: { signInWithPassword: signInMock },
  }),
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

const { login } = await import("./actions");

function buildFormData(email: string, password: string) {
  const fd = new FormData();
  fd.set("email", email);
  fd.set("password", password);
  return fd;
}

beforeEach(() => {
  signInMock.mockReset();
  redirectMock.mockReset();
});

describe("login", () => {
  it("redirects to /admin on success", async () => {
    signInMock.mockResolvedValueOnce({ error: null });

    await login({ status: "idle" }, buildFormData("jordyn@example.com", "correct-password"));

    expect(signInMock).toHaveBeenCalledWith({
      email: "jordyn@example.com",
      password: "correct-password",
    });
    expect(redirectMock).toHaveBeenCalledWith("/admin");
  });

  it("returns an error for invalid credentials, without redirecting", async () => {
    signInMock.mockResolvedValueOnce({ error: new Error("bad creds") });

    const result = await login(
      { status: "idle" },
      buildFormData("jordyn@example.com", "wrong-password"),
    );

    expect(result.status).toBe("error");
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid email without calling Supabase at all", async () => {
    const result = await login({ status: "idle" }, buildFormData("not-an-email", "x"));

    expect(result.status).toBe("error");
    expect(signInMock).not.toHaveBeenCalled();
  });
});
