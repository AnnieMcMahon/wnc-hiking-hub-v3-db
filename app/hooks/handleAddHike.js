"use client"
import { addHike, addParticipant } from "../api/data/data";

export async function handleAddHike(hikeInfo) {
  const newHike = await addHike(hikeInfo);
  if (newHike) {
    const newHikeId = newHike[0].id;
    await addParticipant(hikeInfo.creator_id, newHikeId);
  }
};