"use client"

import { fetchAllTrails } from "../api/data/data";
import { ANY_AREA, ANY_DIFFICULTY, ANY_LENGTH, SHORT, MEDIUM, LONG } from "../lib/constants";

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