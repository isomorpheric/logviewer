import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useWorkerSearch } from "@/hooks/useWorkerSearch";
import type { LogEntry } from "@/types";
import styles from "./LogSearch.module.css";

interface LogSearchProps {
  /** The complete dataset to be indexed by the worker. */
  allLogs: LogEntry[];
  /** Callback triggered when the worker returns search results. */
  onSearchResultsChange: (searchResults: LogEntry[]) => void;
}

/**
 * LogSearch handles client-side filtering of logs using a Web Worker.
 *
 * It offloads the heavy operation to a background thread to keep the UI responsive.
 */
export default function LogSearch({ allLogs, onSearchResultsChange }: LogSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { searchResults, isSearching } = useWorkerSearch(allLogs, debouncedSearch);

  // Sync results back to parent
  useEffect(() => {
    onSearchResultsChange(searchResults);
  }, [searchResults, onSearchResultsChange]);

  return (
    <div className={styles.searchWrapper}>
      <input
        className={styles.searchInput}
        disabled={isSearching}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={isSearching ? "Indexing logs..." : "Search logs (regex)..."}
      />
      {isSearching && <span className={styles.spinner} />}
    </div>
  );
}
