import { supabase } from "@/app/api/supabase/initSupabase";

export async function checkStatus() {
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

export async function retrieveUser() {
  const { data: { user } } = await supabase.auth.getUser()
  if (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to retrieve user.");
  }
  return user; 
};

export async function createUser(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  if (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add user.");
  }
  return data; 
};

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })
  if (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to sign in with e-mail.");
  }
  return data; 
};

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

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to sign out.");
  }
};

export async function resetPassword(email, link) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: link, //example: 'https://example.com/update-password'
  })  
  if (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to reset password.");
  }
  return data; 
};

export async function updatePassword(password) {
  const { data, error } = await supabase.auth.updateUser({
    password: password
  })   
  if (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update password.");
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

