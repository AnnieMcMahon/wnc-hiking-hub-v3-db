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
      throw new Error("Failed to add new trail.");
    }
    return data; 
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch new trail data.");
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

export async function fetchUserByEmail(email) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);
      ;
    if (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch user data.");
    }
    return data; 
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch user data.");
  }
};

export async function addUser(userInfo) {
  try {
    const { data, error } = await supabase
    .from('users')
    .insert({ 
      email: userInfo.email,
      password: userInfo.password
     })
     .select();

    if (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to add user.");
    }
    return data; 
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch new user.");
  }
};

export async function updateUser(userInfo) {
    const { error } = await supabase
    .from("users")
    .update({ 
      user_name: userInfo.user_name,
      avatar: userInfo.avatar,
      bio: userInfo.bio,
     })
     .eq("id", userInfo.id);
    if (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to update user.");
    }
};

export async function uploadAvatar(file, userId) {
  const fileName = `${userId}-${file.name}`;
  const { error } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });
  if (error) {
    console.error("Upload Error:", error);
    throw new Error("Failed to upload avatar.");
  }
  const { data } = supabase
  .storage
  .from('avatars')
  .getPublicUrl(fileName);
  const publicURL = data.publicUrl;
  return publicURL;
};