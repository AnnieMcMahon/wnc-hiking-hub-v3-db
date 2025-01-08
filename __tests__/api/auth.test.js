import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/app/api/authentication/server";
import { login, signup, retrieveUser, logout, resetPassword, updatePassword } from "@/app/api/authentication/auth";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/app/api/authentication/server", () => ({
  createClient: jest.fn(),
}));

describe("auth - login", () => {
  it("calls signInWithPassword with correct data", async () => {
    const mockSignInWithPassword = jest.fn().mockResolvedValue({ error: null });
    const mockSupabase = {auth: { signInWithPassword: mockSignInWithPassword },};
    createClient.mockResolvedValue(mockSupabase);

    const newLogin = { email: "test@example.com", password: "Password123!" };
    await expect(login(newLogin)).resolves.not.toThrow();
    expect(mockSignInWithPassword).toHaveBeenCalledWith(newLogin);
  });

  it("throws an error when signInWithPassword fails", async () => {
    const mockSignInWithPassword = jest.fn().mockResolvedValue({ error: { message: "Invalid password." } });
    const mockSupabase = {auth: { signInWithPassword: mockSignInWithPassword },};
    createClient.mockResolvedValue(mockSupabase);

    const newLogin = { email: "test@example.com", password: "wrongpassword" };
    await expect(login(newLogin)).rejects.toThrow("Invalid password.");
  });
});

describe("auth - signup", () => {
  it("calls signUp with correct data", async () => {
    const mockSignUp = jest.fn().mockResolvedValue({ error: null });
    const mockSupabase = {auth: { signUp: mockSignUp },};
    createClient.mockResolvedValue(mockSupabase);

    const loginInfo = { email: "test@example.com", password: "Password123!" };
    const result = await signup(loginInfo);
    expect(mockSignUp).toHaveBeenCalledWith(loginInfo);
    expect(result).toBeNull();
  });

  it("throws an error when signUp fails", async () => {
    const mockSignUp = jest.fn().mockResolvedValue({ error: { message: "Auth error" } });
    const mockSupabase = {
      auth: { signUp: mockSignUp },
    };
    createClient.mockResolvedValue(mockSupabase);
    
    const loginInfo = { email: "existing@example.com", password: "password123" };
    const result = await signup(loginInfo);
    expect(mockSignUp).toHaveBeenCalledWith(loginInfo);
    expect(result).toEqual({ message: "Auth error" });
  });
});

describe("auth - retrieveUser", () => {
  it("calls getUser correctly", async () => {
    const mockGetUser = jest.fn().mockResolvedValue({
      data: { user: { email: "test@example.com" } },
      error: null,
    });
    const mockSupabase = {auth: { getUser: mockGetUser },};
    createClient.mockResolvedValue(mockSupabase);

    const user = await retrieveUser();
    expect(mockGetUser).toHaveBeenCalled();
    expect(user).toEqual({ email: "test@example.com" });
  });

  it("handles errors gracefully", async () => {
    const mockGetUser = jest.fn().mockResolvedValue({
      data: { user: null },
      error: { message: "Error retrieving user" },
    });
    const mockSupabase = { auth: { getUser: mockGetUser } };
    createClient.mockResolvedValue(mockSupabase);
    const user = await retrieveUser();
    expect(mockGetUser).toHaveBeenCalled();
    expect(user).toBeNull();
  });
});

describe("auth - logout", () => {
  it("calls signOut and redirects on success", async () => {
    const mockSignOut = jest.fn().mockResolvedValue({ error: null });
    const mockSupabase = { auth: { signOut: mockSignOut } };
    createClient.mockResolvedValue(mockSupabase);

    await logout();
    expect(mockSignOut).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("throws an error when signOut fails", async () => {
    const mockSignOut = jest.fn().mockResolvedValue({ error: { message: "Sign out failed" } });
    const mockSupabase = { auth: { signOut: mockSignOut } };
    createClient.mockResolvedValue(mockSupabase);

    await expect(logout()).rejects.toThrow("Failed to log out.");
  });
});

describe("auth - resetPassword", () => {
  it("calls resetPasswordForEmail with correct data", async () => {
    const mockResetPasswordForEmail = jest.fn().mockResolvedValue({  data: { success: true },
      error: null, });
    const mockSupabase = {auth: { resetPasswordForEmail: mockResetPasswordForEmail },};
    createClient.mockResolvedValue(mockSupabase);

    const email = "test@example.com";
    const link = "testing.com";
    const result = await resetPassword(email, link);
    expect(mockResetPasswordForEmail).toHaveBeenCalledWith("test@example.com", {"redirectTo": "testing.com"});
    expect(result).toEqual({ success: true });
  });

  it("throws an error when resetPasswordForEmail fails", async () => {
    const mockResetPasswordForEmail = jest.fn().mockResolvedValue({ error: { message: "Failed to reset password." } });
    const mockSupabase = {
      auth: { resetPasswordForEmail: mockResetPasswordForEmail },
    };
    createClient.mockResolvedValue(mockSupabase);
    
    const email = "wrong-email";
    const link = "wrong-link";
    await expect(resetPassword(email, link)).rejects.toThrow("Failed to reset password.");

    expect(mockResetPasswordForEmail).toHaveBeenCalledWith("wrong-email", {
      redirectTo: "wrong-link",
    });
  });
});

describe("auth - updatePassword", () => {
  it("calls updateUser with correct data", async () => {
    const mockUpdateUser = jest.fn().mockResolvedValue({       
      data: { success: true },
      error: null, });
    const mockSupabase = {auth: { updateUser: mockUpdateUser },};
    createClient.mockResolvedValue(mockSupabase);

    const password = "password123";
    const result = await updatePassword(password);
    expect(mockUpdateUser).toHaveBeenCalledWith({"password": "password123"});
    expect(result).toEqual({ success: true });
  });

  it("throws an error when updateUser fails", async () => {
    const mockUpdateUser = jest.fn().mockResolvedValue({ error: { message: "Failed to update password." } });
    const mockSupabase = {
      auth: { updateUser: mockUpdateUser },
    };
    createClient.mockResolvedValue(mockSupabase);
    
    const password = "bad-password";
    await expect(updatePassword(password)).rejects.toThrow("Failed to update password.");

    expect(mockUpdateUser).toHaveBeenCalledWith({password: "bad-password"});
  });
});







