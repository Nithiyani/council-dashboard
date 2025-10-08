'use client';
import { useState } from "react";
import { ChairmanData } from "@/types/chairman";

export const useChairmanForm = (initialData: ChairmanData) => {
  const [chairmanData, setChairmanData] = useState<ChairmanData>(initialData);
  return { chairmanData, updateChairmanData: setChairmanData };
};