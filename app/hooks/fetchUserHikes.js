"use client"
import { fetchHikesByParticipant, fetchHikeById } from "../api/data/data";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

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
};