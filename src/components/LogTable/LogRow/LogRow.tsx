import { clsx } from "clsx";
import { memo, type SVGProps, useState } from "react";
import type { LogEntry } from "@/types";
import { formatTime } from "@/utils/formatTime";
import styles from "./LogRow.module.css";

interface Props {
  log: LogEntry;
  index?: number;
}

/**
 * LogRow displays a single log entry.
 *
 * Features:
 * - Expandable detail view showing pretty-printed JSON.
 * - "Copy JSON" functionality.
 * - Memoized to prevent unnecessary re-renders during streaming updates.
 */
export const LogRow = memo(({ log, index = 0 }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isEven = index % 2 === 0;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
  };

  // Format timestamp lazily only for visible rows
  const formattedTime = formatTime(log._time);

  return (
    <div className={clsx(styles.row, isEven && styles.rowEven)}>
      <button
        type="button"
        className={styles.summary}
        onClick={toggleExpand}
        aria-expanded={isExpanded}
      >
        <div className={styles.time}>
          <ChevronIcon className={clsx(styles.chevron, isExpanded && styles.chevronExpanded)} />
          {formattedTime}
        </div>
        <div className={styles.message}>{JSON.stringify(log)}</div>
      </button>
      {isExpanded && (
        <div className={styles.details}>
          <div className={styles.actions}>
            <button type="button" onClick={handleCopy} className={styles.copyButton}>
              Copy JSON
            </button>
          </div>
          <pre>{JSON.stringify(log, null, 2)}</pre>
        </div>
      )}
    </div>
  );
});

const ChevronIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);
