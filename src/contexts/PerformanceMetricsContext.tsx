import { createContext, type ReactNode, useCallback, useContext, useState } from "react";
import { measureTTFR } from "@/utils/performanceMarks";

interface PerformanceMetricsContextValue {
  ttfr: number | null;
  recordFirstRender: () => void;
}

const PerformanceMetricsContext = createContext<PerformanceMetricsContextValue | null>(null);

interface PerformanceMetricsProviderProps {
  children: ReactNode;
}

export function PerformanceMetricsProvider({ children }: PerformanceMetricsProviderProps) {
  const [ttfr, setTTFR] = useState<number | null>(null);

  const recordFirstRender = useCallback(() => {
    setTTFR((current) => {
      if (current !== null) return current;
      return measureTTFR();
    });
  }, []);

  return (
    <PerformanceMetricsContext.Provider value={{ ttfr, recordFirstRender }}>
      {children}
    </PerformanceMetricsContext.Provider>
  );
}

export function usePerformanceMetrics(): PerformanceMetricsContextValue {
  const context = useContext(PerformanceMetricsContext);
  if (!context) {
    throw new Error("usePerformanceMetrics must be used within a PerformanceMetricsProvider");
  }
  return context;
}
