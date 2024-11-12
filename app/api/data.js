import { supabase } from "@/app/api/initSupabase";
import { ANY_AREA, ANY_DIFFICULTY, ANY_LENGTH } from "../lib/constants";

export async function fetchAllTrails() {
  try {
    const { data, error } = await supabase.from("trails").select("*");
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

export async function fetchTrailById(id) {
  try {
    const { data, error } = await supabase
      .from("trails")
      .select("*")
      .eq("id", id);
      ;
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

export async function addTrail(trailInfo) {
  try {
    const { data, error } = await supabase
    .from('trails')
    .insert({ 
      trail_name: trailInfo.trail_name,
      area_name: trailInfo.area_name,
      difficulty_rating: trailInfo.difficulty_rating,
      length: trailInfo.length,
      elevation_gain: trailInfo.elevation_gain,
      route_type: trailInfo.route_type,
      trail_link: trailInfo.trail_link
     })
     .select();

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

export async function filterTrailList(area_name, difficulty_rating, length) {
  let newList = await fetchAllTrails();
  if (area_name !== ANY_AREA) {
    newList = newList.filter(trail => trail.area_name == area_name)
  }
  if (difficulty_rating !== ANY_DIFFICULTY) {
    newList = newList.filter(trail => trail.difficulty_rating == difficulty_rating)
  }
  if (length !== ANY_LENGTH) {
    newList = newList.filter(trail => 
      (length == "short" && Number(trail.length) < 3) ||
      (length == "long" && Number(trail.length > 6)) ||
        (length == "medium" && Number(trail.length) >=3 && Number(trail.length) <= 6))
  }
  return newList;
};

