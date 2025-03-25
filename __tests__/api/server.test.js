import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@/app/api/authentication/server";

jest.mock("@supabase/ssr", () => ({
  createServerClient: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("createClient", () => {
  let mockCookies;

  beforeEach(() => {
    mockCookies = {
      getAll: jest.fn().mockReturnValue([{ name: "auth_token", value: "12345" }]),
      set: jest.fn(),
    };

    cookies.mockReturnValue(mockCookies);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("calls createServerClient with correct parameters", async () => {
    await createClient();

    expect(createServerClient).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        },
      }
    );
  });

  it("calls getAll on the cookie store when getAll is triggered", async () => {
    await createClient();
    const cookieFns = createServerClient.mock.calls[0][2].cookies;
    await cookieFns.getAll();
    expect(mockCookies.getAll).toHaveBeenCalled();
  });

  it("calls set on the cookie store when setAll is triggered", async () => {
    await createClient();
    const cookieFns = createServerClient.mock.calls[0][2].cookies;
    await cookieFns.setAll([
      { name: "test_cookie", value: "abc123", options: { path: "/" } },
    ]);
    expect(mockCookies.set).toHaveBeenCalledWith("test_cookie", "abc123", { path: "/" });
  });
});
