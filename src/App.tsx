import { ErrorBoundary } from "react-error-boundary";
import { LogTable } from "@/components/LogTable";
import { ErrorFallback } from "@/components/ui/ErrorFallback";
import { useLogStream } from "@/hooks";
import styles from "./App.module.css";

function App() {
  const { logs, isLoading } = useLogStream(import.meta.env.VITE_LOG_FILE_URL);

  return (
    <main className={styles.root}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <LogTable logs={logs} isLoading={isLoading} width="80%" height="66dvh" />
      </ErrorBoundary>
    </main>
  );
}

export default App;
