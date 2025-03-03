"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/app/api/authentication/server";

export async function login(newLogin) {
  const supabase = await createClient();
  const data = newLogin;
  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    throw new Error("Invalid password.");
  }
}

export async function signup(loginInfo) {
  const supabase = await createClient();
  const data = loginInfo;
  const { error } = await supabase.auth.signUp(data);
  if (error) {
    throw new Error("Failed to sign up.");
  }
  return error;
}

export async function retrieveUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser()
  return user; 
};

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error("Failed to log out.");
  }
  revalidatePath("/", "layout");
  redirect("/");
};

export async function resetPassword(email, link) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: link,
  })  
  if (error) {
    throw new Error("Failed to reset password.");
  }
  return data; 
};

export async function updatePassword(password) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    password: password
  })   
  if (error) {
    throw new Error("Failed to update password.");
  }
  return data; 
};