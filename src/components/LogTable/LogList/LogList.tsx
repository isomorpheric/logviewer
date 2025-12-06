import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";
import { usePerformanceMetrics } from "@/contexts/PerformanceMetrics";
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
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: logs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 28,
    overscan: 5,
  });

  useEffect(() => {
    if (logs.length > 0 && !hasRecordedMetrics.current) {
      hasRecordedMetrics.current = true;
      recordFirstByte();
      recordFirstRender();
    }
  }, [logs.length, recordFirstByte, recordFirstRender]);

  const showSkeleton = isLoading && logs.length === 0;

  return (
    <div ref={parentRef} role="rowgroup" className={styles.scrollContainer}>
      {showSkeleton ? (
        <LogListSkeleton />
      ) : (
        <div
          className={styles.innerContainer}
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const log = logs[virtualItem.index];
            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={rowVirtualizer.measureElement}
                className={styles.virtualRow}
                style={{
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <LogRow log={log} index={virtualItem.index} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
