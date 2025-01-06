import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@/app/api/authentication/server";

jest.mock("@supabase/ssr", () => ({
  createServerClient: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(async () => ({
    getAll: jest.fn().mockReturnValue([{ name: "auth_token", value: "12345" }]),
  })),
}));

describe("createClient", () => {
  let mockCookies;

  beforeEach(() => {
    mockCookies = {
      getAll: jest.fn().mockReturnValue([{ name: "auth_token", value: "12345" }]),
    };
    cookies.mockReturnValue(Promise.resolve(mockCookies));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("initializes the Supabase client with correct environment variables", async () => {
    await createClient();
    expect(createServerClient).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll: expect.any(Function),
        },
      }
    );
  });

  it("initializes the Supabase client with correct environment variables", async () => {
    await createClient();
    const cookiesConfig = createServerClient.mock.calls[0][2].cookies;
    cookiesConfig.getAll();
    expect(mockCookies.getAll).toHaveBeenCalled();
  });
});
