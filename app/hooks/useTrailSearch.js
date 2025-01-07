"use client";

import { useState, useEffect } from "react";
import { filterTrailList } from "./filterTrailList";
import { ANY_AREA, ANY_LENGTH, ANY_DIFFICULTY } from "@/app/lib/constants";

export function useTrailSearch() {
  const [searchCriteria, setSearchCriteria] = useState({
    area: ANY_AREA,
    difficulty: ANY_DIFFICULTY,
    length: ANY_LENGTH,
  });
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    const fetchTrails = async () => {
      const trails = await filterTrailList(
        searchCriteria.area,
        searchCriteria.difficulty,
        searchCriteria.length
      );
      setFilteredList(trails);
    };
    fetchTrails();
  }, [searchCriteria]);

  const updateSearchCriteria = (key, value) => {
    setSearchCriteria((prev) => ({ ...prev, [key]: value }));
  };

  return { searchCriteria, filteredList, updateSearchCriteria };
}
