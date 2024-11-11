import { fetchAllTrails } from "@/app/api/data";

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