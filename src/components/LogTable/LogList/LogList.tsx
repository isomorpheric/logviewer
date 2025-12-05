import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import type { LogEntry } from "@/types";
import { LogRow } from "../LogRow";
import styles from "./LogList.module.css";

interface Props {
  logs: LogEntry[];
  isLoading?: boolean;
}

const SKELETON_ROW_COUNT = 10;

export const LogList = ({ logs, isLoading = false }: Props) => {
  const showSkeleton = isLoading && logs.length === 0;

  return (
    <div role="rowgroup" className={styles.listContainer}>
      {showSkeleton
        ? Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton rows never reorder
            <div key={index} className={styles.skeletonRow}>
              <LoadingSkeleton width="var(--col-time-width)" height="1em" />
              <LoadingSkeleton height="1em" className={styles.skeletonEvent} />
            </div>
          ))
        : logs.map((log, index) => <LogRow key={`${log._time}-${index}`} log={log} />)}
    </div>
  );
};
