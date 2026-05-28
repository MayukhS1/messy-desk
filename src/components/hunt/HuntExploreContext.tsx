"use client";

import { createContext, useContext, useState, useCallback } from "react";

type HuntExploreContextValue = {
  activeItemId: string | null;
  openItem: (id: string) => void;
  closeItem: () => void;
};

const HuntExploreContext = createContext<HuntExploreContextValue | null>(null);

export function HuntExploreProvider({ children }: { children: React.ReactNode }) {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const openItem = useCallback((id: string) => {
    setActiveItemId(id);
  }, []);

  const closeItem = useCallback(() => {
    setActiveItemId(null);
  }, []);

  return (
    <HuntExploreContext.Provider value={{ activeItemId, openItem, closeItem }}>
      {children}
    </HuntExploreContext.Provider>
  );
}

export function useHuntExplore() {
  return useContext(HuntExploreContext);
}
