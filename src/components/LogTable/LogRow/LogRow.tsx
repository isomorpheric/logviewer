import { useLayoutEffect, useRef, useState } from "react";
import type { LogEntry } from "@/types";
import { formatTime } from "@/utils/formatTime";
import styles from "./LogRow.module.css";

interface Props {
  log: LogEntry;
  onHeightChange?: (height: number) => void;
}

export const LogRow = ({ log, onHeightChange }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
  };

  // Report height changes for virtualization
  useLayoutEffect(() => {
    if (!rowRef.current || !onHeightChange) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        onHeightChange(entry.contentRect.height);
      }
    });

    observer.observe(rowRef.current);
    // Report initial height
    onHeightChange(rowRef.current.offsetHeight);

    return () => observer.disconnect();
  }, [onHeightChange]);

  // Format timestamp lazily only for visible rows
  const formattedTime = formatTime(log._time);

  return (
    <div ref={rowRef} className={styles.row}>
      <button
        type="button"
        className={styles.summary}
        onClick={toggleExpand}
        aria-expanded={isExpanded}
      >
        <div className={styles.time}>{formattedTime}</div>
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
};
