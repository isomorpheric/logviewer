import { useCallback, useEffect, useRef } from "react";
import { usePerformanceMetrics } from "@/contexts/PerformanceMetrics";
import { useVirtualization } from "@/hooks";
import type { LogEntry } from "@/types";
import { LogRow } from "../LogRow";
import styles from "./LogList.module.css";
import { LogListSkeleton } from "./LogListSkeleton";

interface Props {
  logs: LogEntry[];
  isLoading?: boolean;
}

export const LogList = ({ logs, isLoading = false }: Props) => {
  const { recordFirstByte, recordFirstRender } = usePerformanceMetrics();
  const hasRecordedMetrics = useRef(false);

  const { containerRef, startIndex, endIndex, totalHeight, offsetY, setRowHeight } =
    useVirtualization({
      itemCount: logs.length,
      estimatedRowHeight: 28,
      overscan: 5,
    });

  useEffect(() => {
    if (logs.length > 0 && !hasRecordedMetrics.current) {
      hasRecordedMetrics.current = true;
      recordFirstByte();
      recordFirstRender();
    }
  }, [logs.length, recordFirstByte, recordFirstRender]);

  const handleRowHeightChange = useCallback(
    (index: number) => (height: number) => {
      setRowHeight(index, height);
    },
    [setRowHeight]
  );

  const showSkeleton = isLoading && logs.length === 0;
  const visibleLogs = logs.slice(startIndex, endIndex);

  return (
    <div ref={containerRef} role="rowgroup" className={styles.scrollContainer}>
      {showSkeleton ? (
        <LogListSkeleton />
      ) : (
        <div className={styles.innerContainer} style={{ height: totalHeight }}>
          <div className={styles.visibleWindow} style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleLogs.map((log, localIndex) => {
              const actualIndex = startIndex + localIndex;
              return (
                <LogRow
                  key={`${log._time}-${actualIndex}`}
                  log={log}
                  index={actualIndex}
                  onHeightChange={handleRowHeightChange(actualIndex)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
