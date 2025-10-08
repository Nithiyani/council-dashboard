'use client';
import { useState } from "react";
import { InfoCardItem } from "@/types/chairman";

export const useInfoCards = (initialItems: InfoCardItem[] = []) => {
  const [items, setItems] = useState<InfoCardItem[]>(initialItems);
  
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addItem = (item: Omit<InfoCardItem, "id">) => {
    const newItem: InfoCardItem = { ...item, id: generateId() };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: string, updates: Partial<InfoCardItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return { items, addItem, updateItem, deleteItem };
};