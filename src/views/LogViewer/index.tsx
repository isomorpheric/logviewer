import { lazy, Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { LogTable } from "@/components/LogTable";
import { StatusBar } from "@/components/StatusBar";
import { Timeline } from "@/components/Timeline";
import { ErrorFallback } from "@/components/ui/ErrorFallback";
import { useLogStream } from "@/hooks";
import type { LogEntry } from "@/types";
import styles from "./LogViewer.module.css";

interface LogViewerProps {
  fileUrl?: string;
}

const DEFAULT_FILE_URL = import.meta.env.VITE_LOG_FILE_URL;

// Lazy load the search component
const LogSearch = lazy(() => import("@/components/LogSearch"));

/**
 * LogViewer is the main container view for the application.
 *
 * It orchestrates the data fetching via `useLogStream` and composes the
 * main visualization components:
 * - Timeline (Bar chart of log distribution)
 * - LogTable (Virtualized list of logs)
 * - StatusBar (Performance metrics and controls)
 */
export function LogViewer({ fileUrl = DEFAULT_FILE_URL }: LogViewerProps) {
  const { logs, isLoading, error, loadedBytes, totalBytes, abort, retry, isComplete } =
    useLogStream(fileUrl);

  // State for what we actually display (either full logs or filtered result)
  const [displayLogs, setDisplayLogs] = useState<LogEntry[]>(logs);

  // Reset display logs when new stream data comes in (during streaming)
  useEffect(() => {
    // While streaming (not complete), we always show the latest logs
    if (!isComplete) {
      setDisplayLogs(logs);
    }
  }, [logs, isComplete]);

  const handleSearchResultsChange = (results: LogEntry[]) => {
    setDisplayLogs(results);
  };

  return (
    <main className={styles.root}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className={styles.toolbar}>
          {isComplete ? (
            <Suspense fallback={<div className={styles.searchPlaceholder}>Loading Search...</div>}>
              <LogSearch allLogs={logs} onSearchResultsChange={handleSearchResultsChange} />
            </Suspense>
          ) : (
            <div className={styles.statusMessage}>Streaming logs...</div>
          )}
        </div>

        <Timeline logs={displayLogs} bucketCount={5} isLoading={!isComplete} />
        <LogTable logs={displayLogs} isLoading={isLoading} />
        <StatusBar
          loadedBytes={loadedBytes}
          totalBytes={totalBytes}
          logCount={displayLogs.length}
          isLoading={isLoading}
          isComplete={isComplete}
          error={error}
          onAbort={abort}
          onRetry={retry}
        />
      </ErrorBoundary>
    </main>
  );
}
