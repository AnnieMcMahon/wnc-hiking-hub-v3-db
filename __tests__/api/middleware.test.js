import { updateSession } from "@/app/api/authentication/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

jest.mock("@supabase/ssr", () => ({
  createServerClient: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    next: jest.fn().mockReturnValue({ cookies: { set: jest.fn() } }),
    redirect: jest.fn(),
  },
}));

describe("updateSession middleware", () => {
  let mockRequest;
  let mockSupabaseResponse;
  let mockGetUser;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSupabaseResponse = {
      cookies: jest.fn(async () => ({
        set: jest.fn(),
      })),
    };

    mockGetUser = jest.fn().mockResolvedValue({
      data: {
        user: null, 
      },
    });

    createServerClient.mockReturnValue({
      auth: {
        getUser: mockGetUser,
      },
    });

    mockRequest = {
      cookies: {
        get: jest.fn(),
        set: jest.fn(),
      },
      nextUrl: {
        pathname: "/some/path",
        clone: jest.fn().mockReturnValue({
          pathname: "/login",
        }),
      },
    };
  });

  it("redirects to /login if no user and not on /login or /auth path", async () => {
    mockRequest.nextUrl.pathname = "/some/path";
    NextResponse.redirect.mockReturnValue(mockSupabaseResponse); 
    const result = await updateSession(mockRequest);
    expect(NextResponse.redirect).toHaveBeenCalledWith(expect.objectContaining({
      pathname: "/login",
    }));
    expect(result).toEqual(mockSupabaseResponse);
  });

  it("does not redirect to /login if on /login or /auth path", async () => {
    mockRequest.nextUrl.pathname = "/login";
    NextResponse.redirect.mockReturnValue(mockSupabaseResponse); 
    await updateSession(mockRequest);
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it("proceeds if user exists", async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: { id: "123", email: "test@example.com" },
      },
    });
    await updateSession(mockRequest);
    expect(NextResponse.next).toHaveBeenCalled();
  });
});
