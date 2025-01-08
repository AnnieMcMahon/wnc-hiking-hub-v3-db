import { supabase } from "@/app/api/data/initSupabase";

//Trail functions
export async function fetchAllTrails() {
  const { data, error } = await supabase.from("trails").select("*");
  if (error) {
    throw new Error("Failed to fetch trail data.");
  }
  return data;
}

export async function fetchTrailById(id) {
  const { data, error } = await supabase
    .from("trails")
    .select("*")
    .eq("id", id);
  if (error) {
    throw new Error("Failed to fetch trail data.");
  }
  return data;
}

export async function addTrail(trailInfo) {
  const { data, error } = await supabase.from("trails").insert({
    trail_name: trailInfo.trail_name,
    area_name: trailInfo.area_name,
    difficulty_rating: trailInfo.difficulty_rating,
    length: trailInfo.length,
    elevation_gain: trailInfo.elevation_gain,
    route_type: trailInfo.route_type,
    trail_link: trailInfo.trail_link,
  });
  if (error) {
    throw new Error("Failed to add new trail.");
  }
  return data;
}

//User functions
export async function fetchUserByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email);
  if (error) {
    throw new Error("Failed to fetch user data.");
  }
  return data;
}

export async function fetchUserById(id) {
  const { data, error } = await supabase.from("users").select("*").eq("id", id);
  if (error) {
    throw new Error("Failed to fetch user data.");
  }
  return data;
}

export async function addUser(email) {
  const { data, error } = await supabase
    .from("users")
    .insert({
      email: email,
    })
    .select();
  if (error) {
    throw new Error("Failed to add user.");
  }
  return data;
}

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
    throw new Error("Failed to update user.");
  }
}

export async function uploadAvatar(file, userId) {
  const fileName = `${userId}-${file.name}`;
  const { error } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });
  if (error) {
    throw new Error("Failed to upload avatar.");
  }
  const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
  const publicURL = data.publicUrl;
  return publicURL;
}

//Hike functions
export async function addHike(hikeInfo) {
  const { data, error } = await supabase
    .from("hikes")
    .insert({
      creator_id: hikeInfo.creator_id,
      trail_id: hikeInfo.trail_id,
      title: hikeInfo.hikeTitle,
      date: hikeInfo.date,
      time: hikeInfo.time,
      location: hikeInfo.location,
      comments: hikeInfo.comments,
      status: hikeInfo.status,
    })
    .select();
  if (error) {
    throw new Error("Failed to add new hike.");
  }
  return data;
}

export async function fetchHikeById(id) {
  const { data, error } = await supabase.from("hikes").select("*").eq("id", id);
  if (error) {
    throw new Error("Failed to fetch hike data.");
  }
  return data;
}

export async function updateHike(hikeInfo) {
  const { error } = await supabase
    .from("hikes")
    .update({
      title: hikeInfo.title,
      date: hikeInfo.date,
      time: hikeInfo.time,
      location: hikeInfo.location,
      comments: hikeInfo.comments,
      status: hikeInfo.status,
    })
    .eq("id", hikeInfo.id);
  if (error) {
    throw new Error("Failed to update hike.");
  }
}

export async function fetchAvailableHikes(userId, currentDate, hikeIds) {
  const { data, error } = await supabase
    .from("hikes")
    .select("*")
    .neq("creator_id", userId)
    .neq("status", "cancelled")
    .gte("date", currentDate)
    .not("id", "in", hikeIds)
    .order("date", { ascending: true });
  if (error) {
    throw new Error("Failed to fetch hikes to join.");
  }
  return data;
}

//Participants functions
export async function fetchParticipantsByHike(hikeId) {
  const { data, error } = await supabase
    .from("participants")
    .select("*")
    .eq("hike_id", hikeId);
  if (error) {
    throw new Error("Failed to fetch participants by hike.");
  }
  return data;
}

export async function fetchHikesByParticipant(userId) {
  const { data, error } = await supabase
    .from("participants")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    return null;
  }
  return data || null;
}

export async function addParticipant(userId, hikeId) {
  const { error } = await supabase.from("participants").insert({
    user_id: userId,
    hike_id: hikeId,
  });
  if (error) {
    throw new Error("Failed to add participant.");
  }
}

export async function removeParticipant(userId, hikeId) {
  const { error } = await supabase
    .from("participants")
    .delete()
    .eq("user_id", userId)
    .eq("hike_id", hikeId);
  if (error) {
    throw new Error("Failed to remove participant.");
  }
}


