import { supabase } from "@/app/lib/initSupabase";

export async function fetchAllTrails() {
  try {
    const { data, error } = await supabase.from("allTrails").select("*");
    if (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch trail data.");
    }
    return data; 
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch trail data.");
  }
};

