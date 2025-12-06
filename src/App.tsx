import { PerformanceMetricsProvider } from "@/contexts/PerformanceMetrics";
import { LogViewer } from "./views/LogViewer";

function App() {
  return (
    <PerformanceMetricsProvider>
      <LogViewer />
    </PerformanceMetricsProvider>
  );
}

export default App;
