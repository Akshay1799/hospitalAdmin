"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { OperatingMode } from "./types";

interface ModeContextValue {
  mode: OperatingMode;
  setMode: (m: OperatingMode) => void;
}

const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<OperatingMode>("clinic");
  const value = useMemo(() => ({ mode, setMode }), [mode]);
  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used within ModeProvider");
  return ctx;
}
