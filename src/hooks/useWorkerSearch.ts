import { useEffect, useRef, useState } from "react";
import type { LogEntry } from "@/types";

type WorkerStatus = "idle" | "loading" | "ready" | "error";

export function useWorkerSearch(allLogs: LogEntry[], searchTerm: string) {
  const [searchResults, setSearchResults] = useState<LogEntry[]>(allLogs);
  const [status, setStatus] = useState<WorkerStatus>("idle");

  const workerRef = useRef<Worker | null>(null);

  // 1. Initialize Worker & Load Data (Run once when `allLogs` is ready)
  useEffect(() => {
    // If we are already ready/loading and logs haven't changed substantially, skip.
    // In this app, `allLogs` is stable after streaming completes.

    workerRef.current = new Worker(new URL("../workers/search.worker.ts", import.meta.url), {
      type: "module",
    });

    workerRef.current.onmessage = (e) => {
      const { type, logs } = e.data;

      if (type === "READY") {
        setStatus("ready");
        // The worker is ready. If we have a search term (e.g. from previous state),
        // the next effect will pick it up.
      } else if (type === "RESULTS") {
        setSearchResults(logs);
      }
    };

    setStatus("loading");
    // Transfer the big dataset
    workerRef.current.postMessage({ type: "LOAD_DATA", payload: allLogs });

    return () => {
      workerRef.current?.terminate();
    };
  }, [allLogs]);

  // 2. Handle Search
  useEffect(() => {
    if (status !== "ready" || !workerRef.current) return;

    workerRef.current.postMessage({
      type: "SEARCH",
      payload: { query: searchTerm },
    });
  }, [searchTerm, status]);

  return { searchResults, isSearching: status !== "ready" };
}
