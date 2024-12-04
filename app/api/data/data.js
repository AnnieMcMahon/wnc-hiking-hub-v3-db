import { supabase } from "@/app/api/data/initSupabase";
import {
  ANY_AREA,
  ANY_DIFFICULTY,
  ANY_LENGTH,
  SHORT,
  MEDIUM,
  LONG,
} from "@/app/lib/constants";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

//Trail functions
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
}

export async function fetchTrailById(id) {
  try {
    const { data, error } = await supabase
      .from("trails")
      .select("*")
      .eq("id", id);

    if (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch trail data.");
    }
    return data;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch trail data.");
  }
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

export async function filterTrailList(area_name, difficulty_rating, length) {
  let newList = await fetchAllTrails();
  if (area_name !== ANY_AREA) {
    newList = newList.filter((trail) => trail.area_name == area_name);
  }
  if (difficulty_rating !== ANY_DIFFICULTY) {
    newList = newList.filter(
      (trail) => trail.difficulty_rating == difficulty_rating
    );
  }
  if (length !== ANY_LENGTH) {
    newList = newList.filter(
      (trail) =>
        (length == SHORT && Number(trail.length) < 3) ||
        (length == LONG && Number(trail.length > 6)) ||
        (length == MEDIUM &&
          Number(trail.length) >= 3 &&
          Number(trail.length) <= 6)
    );
  }
  return newList;
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
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id);

    if (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch user data.");
    }
    return data;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch user data.");
  }
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
    console.error("Database Error:", error);
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
    console.error("Upload Error:", error);
    throw new Error("Failed to upload avatar.");
  }
  const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
  const publicURL = data.publicUrl;
  return publicURL;
}

//Hike functions
export async function addHike(hikeInfo) {
  try {
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
      console.error("Database Error:", error);
      throw new Error("Failed to add new hike.");
    }
    return data;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch new hike data.");
  }
}

export async function fetchHikeById(id) {
  try {
    const { data, error } = await supabase
      .from("hikes")
      .select("*")
      .eq("id", id);
    if (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch hike data.");
    }
    return data;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch hike data.");
  }
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
    console.error("Database Error:", error);
    throw new Error("Failed to update hike.");
  }
}

//Participants functions
export async function fetchParticipantsByHike(hikeId) {
  try {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .eq("hike_id", hikeId);
    if (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch participants by hike.");
    }
    return data;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch participants by hike.");
  }
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
    console.error("Database Error:", error);
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
    console.error("Database Error:", error);
    throw new Error("Failed to remove participant.");
  }
}

//Functions using multiple tables
export async function fetchUserHikes(userId) {
  const upcomingHikes = [];
  const pastHikes = [];
  const createdHikes = [];
  const currentDate = dayjs().tz("America/New_York").startOf("day");
  const hikeList = await fetchHikesByParticipant(userId);
  const hikeIdList = [];
  if (hikeList) hikeList.map((item) => hikeIdList.push(item.hike_id));
  dayjs.extend(utc);
  dayjs.extend(timezone);
  if (hikeIdList) {
    const hikesData = await Promise.all(
      hikeIdList.map(async (hikeId) => {
        const hikeArray = await fetchHikeById(hikeId);
        return hikeArray[0];
      })
    );
    hikesData.forEach((hike) => {
      if (hike) {
        const hikeDate = dayjs(hike.date).tz("America/New_York").startOf("day");
        if (hikeDate.isBefore(currentDate)) {
          pastHikes.push(hike);
        } else {
          upcomingHikes.push(hike);
        }
        if (hike.creator_id == userId) {
          createdHikes.push(hike.id);
        }
      } else {
        console.log("Hike not found in hikesData");
      }
    });
  }
  if (pastHikes.length > 1)
    pastHikes.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));
  if (upcomingHikes.length > 1)
    upcomingHikes.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
  return { upcomingHikes, pastHikes, createdHikes };
}

export async function fetchHikesToJoin(userId) {
  const currentDate = new Date().toISOString();
  const hikes = await fetchHikesByParticipant(userId);
  let hikeIds = "";
  if (hikes) {
    hikeIds = "(";
    hikes.map((item) => {
      hikeIds = hikeIds + item.hike_id;
      if (hikes.indexOf(item) < hikes.length - 1) {
        hikeIds = hikeIds + ", ";
      }
    });
    hikeIds = hikeIds + ")";
  } else {
    hikeIds = "()";
  }
  try {
    const { data, error } = await supabase
      .from("hikes")
      .select("*")
      .neq("creator_id", userId)
      .neq("status", "cancelled")
      .gte("date", currentDate)
      .not("id", "in", hikeIds)
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
}

export async function handleAddHike(hikeInfo) {
  const newHike = await addHike(hikeInfo);
  if (newHike) {
    const newHikeId = newHike[0].id;
    await addParticipant(hikeInfo.creator_id, newHikeId);
  }
}
