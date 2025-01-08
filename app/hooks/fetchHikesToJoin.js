"use client"
import { fetchHikesByParticipant, fetchAvailableHikes } from "../api/data/data";

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
  const availableHikes = fetchAvailableHikes(userId, currentDate, hikeIds);
  return availableHikes;
};