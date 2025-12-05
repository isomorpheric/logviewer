import { ErrorBoundary } from "react-error-boundary";
import { LogTable } from "@/components/LogTable";
import { ErrorFallback } from "@/components/ui/ErrorFallback";
import styles from "./App.module.css";
import { mockLogs } from "./tests/fixtures/logEntries";

function App() {
  return (
    <main className={styles.root}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <LogTable logs={mockLogs} width="80%" height="66dvh" />
      </ErrorBoundary>
    </main>
  );
}

export default App;
