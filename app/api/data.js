import { supabase } from "@/app/lib/initSupabase";

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
      name: trailInfo.name,
      area: trailInfo.area,
      difficulty: trailInfo.difficulty,
      length: trailInfo.length,
      elevation: trailInfo.elevation,
      type: trailInfo.type,
      link: trailInfo.link
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

export async function filterTrailList(area, difficulty, length) {
  let newList = await fetchAllTrails();
  if (area !== "Anywhere in WNC") {
    newList = newList.filter(trail => trail.area == area)
  }
  if (difficulty !== "Any") {
    newList = newList.filter(trail => trail.difficulty == difficulty)
  }
  if (length !== "Any length") {
    newList = newList.filter(trail => 
      (length == "Short" && Number(trail.length) < 3) ||
      (length == "Long" && Number(trail.length > 6)) ||
        (length == "Medium" && Number(trail.length) >=3 && Number(trail.length) <= 6))
  }
  return newList;
};

