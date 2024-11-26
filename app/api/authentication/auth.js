"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/app/api/authentication/server";

export async function login(newLogin) {
  const supabase = await createClient();
  const data = newLogin;
  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    console.error("Auth Error:", error);
  }
  return error;
}

export async function signup(loginInfo) {
  const supabase = await createClient();
  const data = loginInfo;
  const { error } = await supabase.auth.signUp(data);
  if (error) {
    console.error("Auth Error:", error);
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
    console.error("Auth Error:", error);
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
    console.error("Database Error:", error);
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
    console.error("Database Error:", error);
    throw new Error("Failed to update password.");
  }
  return data; 
};

export async function checkStatus() {
  const supabase = await createClient();
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    console.log(event, session)
    if (event === 'INITIAL_SESSION') {

    } else if (event === 'SIGNED_IN') {

    } else if (event === 'SIGNED_OUT') {

    } else if (event === 'PASSWORD_RECOVERY') {

    } else if (event === 'TOKEN_REFRESHED') {

    } else if (event === 'USER_UPDATED') {

    }
  })
  data.subscription.unsubscribe()
};

// Sample Code from Supabase docs




export async function signInWithProvider(provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider
  })
  if (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to sign in with provider.");
  }
  return data; 
};



export async function updateEmail(email) {
  const { data, error } = await supabase.auth.updateUser({
    email: email
  })   
  if (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update email.");
  }
  return data; 
};

