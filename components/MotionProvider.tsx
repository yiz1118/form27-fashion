"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import { LazyMotion, MotionConfig, domMax } from "motion/react";
import { readChoice, setChoice, subscribe, systemReduced, type MotionChoice } from "@/lib/motion-pref";

interface MotionState { choice: MotionChoice; reduced: boolean; systemPrefersReduced: boolean; choose: (choice: MotionChoice) => void }
const MotionContext = createContext<MotionState>({ choice: "system", reduced: false, systemPrefersReduced: false, choose: () => undefined });

const snapshot = () => `${readChoice()}|${systemReduced() ? 1 : 0}`;

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, snapshot, () => "system|0");
  const [choice, system] = state.split("|") as [MotionChoice, string];
  const reduced = choice === "reduced" || (choice === "system" && system === "1");
  const choose = useCallback((next: MotionChoice) => setChoice(next), []);
  return <MotionContext.Provider value={{ choice, reduced, systemPrefersReduced: system === "1", choose }}>
    <MotionConfig reducedMotion={reduced ? "always" : "never"} transition={{ type: "spring", stiffness: 260, damping: 26 }}>
      <LazyMotion features={domMax} strict>{children}</LazyMotion>
    </MotionConfig>
  </MotionContext.Provider>;
}

export const useMotionPref = () => useContext(MotionContext);
