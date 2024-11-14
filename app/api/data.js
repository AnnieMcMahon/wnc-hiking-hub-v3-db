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

export async function fetchUserById(id) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id);
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
      user_hikes: userInfo.user_hikes
     })
     .eq("id", userInfo.id);
    if (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to update user.");
    }
};

export async function updateUserHikes(userId, hikes) {
  const { error } = await supabase
  .from("users")
  .update({ 
    user_hikes: hikes
   })
   .eq("id", userId);
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

export async function addHike(hikeInfo) {
  try {
    const { data, error } = await supabase
    .from('hikes')
    .insert({ 
      creator_id: hikeInfo.creator_id,
      trail_id: hikeInfo.trail_id,
      title: hikeInfo.title,
      date: hikeInfo.date,
      time: hikeInfo.time,
      location: hikeInfo.location,
      comments: hikeInfo.comments,
      status: hikeInfo.status
     })
     .select();
    if (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to add new hike.");
    }
    return data; 
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch new hike data.");
  }
};

export async function fetchHikeById(id) {
  try {
    const { data, error } = await supabase
      .from("hikes")
      .select("*")
      .eq("id", id);
      ;
    if (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch hike data.");
    }
    return data; 
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch hike data.");
  }
};

export async function fetchUserHikes(hikeIdList, userId) {
  const upcomingHikes = [];
  const pastHikes = [];
  const createdHikes = [];
  const currentDate = new Date().setHours(0, 0, 0, 0);
  if (hikeIdList) {
    hikeIdList.forEach(async (hikeId) => {
      const hikeArray = await fetchHikeById(hikeId);
      const hike = hikeArray[0];
      if (hike) {
        const hikeDate = new Date(hike.date).setHours(0, 0, 0, 0);
        if (hikeDate < currentDate) {
          pastHikes.push(hike);
        } else {
          upcomingHikes.push(hike);
        }
        if (hike.creator_id == userId) {
          createdHikes.push(hike.id);
        }
      } else {
        console.log("Hike not found: ", hikeId);
      }
    }
  );
  if (pastHikes.length > 1) pastHikes.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (upcomingHikes.length > 1) upcomingHikes.sort((a, b) => new Date(a.date) - new Date(b.date));
};
return { upcomingHikes, pastHikes, createdHikes };
};

 export async function fetchHikesToJoin(user) {
  const currentDate = new Date().toISOString();
  const userHikes = user.user_hikes;
  let hikeIds = "(";
  userHikes.map((hikeId) => {
    hikeIds = hikeIds + hikeId;
    userHikes.indexOf(hikeId) < userHikes.length - 1 ?
      hikeIds = hikeIds + ", " : hikeIds = hikeIds + ")"
    });
  try {
    const { data, error } = await supabase
      .from("hikes")
      .select("*")
      .neq("creator_id", user.id)
      .neq("status", "CANCELLED")
      .gte("date", currentDate)
      .not('id', 'in', hikeIds)
      .order("date", { ascending: true });
    if (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch hikes to join.");
    }
    return data; 
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch hikes to join.");
  }
};

export async function updateHike(hikeInfo) {
  const { error } = await supabase
  .from("hikes")
  .update({ 
    creator_id: hikeInfo.creator_id,
    trail_id: hikeInfo.trail_id,
    title: hikeInfo.title,
    date: hikeInfo.date,
    time: hikeInfo.time,
    location: hikeInfo.location,
    comments: hikeInfo.comments,
    status: hikeInfo.status
   })
   .eq("id", hikeInfo.id);
  if (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update hike.");
  }
};