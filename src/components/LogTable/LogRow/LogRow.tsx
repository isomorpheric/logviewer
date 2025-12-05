import { useState } from "react";
import type { LogEntry } from "@/types";
import styles from "./LogRow.module.css";

interface Props {
  log: LogEntry;
}

export const LogRow = ({ log }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
  };

  return (
    <div className={styles.row}>
      <button
        type="button"
        className={styles.summary}
        onClick={toggleExpand}
        aria-expanded={isExpanded}
      >
        <div className={styles.time}>{log._time}</div>
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
