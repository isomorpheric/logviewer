import { ErrorBoundary } from "react-error-boundary";
import { LogTable } from "@/components/LogTable";
import { StatusBar } from "@/components/StatusBar";
import { Timeline } from "@/components/Timeline";
import { ErrorFallback } from "@/components/ui/ErrorFallback";
import { useLogStream } from "@/hooks";
import styles from "./LogViewer.module.css";

interface LogViewerProps {
  fileUrl?: string;
}

const DEFAULT_FILE_URL = import.meta.env.VITE_LOG_FILE_URL;

export function LogViewer({ fileUrl = DEFAULT_FILE_URL }: LogViewerProps) {
  const { logs, isLoading, error, loadedBytes, totalBytes, abort, retry, isComplete } =
    useLogStream(fileUrl);

  return (
    <main className={styles.root}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Timeline logs={logs} bucketCount={5} isLoading={!isComplete} />
        <LogTable logs={logs} isLoading={isLoading} />
        <StatusBar
          loadedBytes={loadedBytes}
          totalBytes={totalBytes}
          logCount={logs.length}
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
