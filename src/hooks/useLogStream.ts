import { useCallback, useEffect, useRef, useState } from "react";
import type { LogEntry } from "../types";
import { parseNDJSONChunk } from "../utils/ndjsonParser";

interface UseLogStreamResult {
  logs: LogEntry[];
  isLoading: boolean;
  error: Error | null;
  loadedBytes: number;
  abort: () => void;
  retry: () => void;
}

export function useLogStream(url: string): UseLogStreamResult {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [loadedBytes, setLoadedBytes] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);
  const bufferRef = useRef<string>("");

  const streamLogs = useCallback(async () => {
    // cleanup previous run
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    setLoadedBytes(0);
    setLogs([]); // Clear logs on new stream or keep them? Usually clear on retry.
    bufferRef.current = "";

    try {
      const response = await fetch(url, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        setLoadedBytes((prev) => prev + value.byteLength);

        const chunk = decoder.decode(value, { stream: true });
        const { results, newBuffer } = parseNDJSONChunk<LogEntry>(chunk, bufferRef.current);

        bufferRef.current = newBuffer;

        if (results.length > 0) {
          // Use functional update to append new logs
          setLogs((prevLogs) => [...prevLogs, ...results]);
        }
      }

      // Process any remaining buffer if needed (though usually NDJSON ends with newline)
      if (bufferRef.current.trim()) {
        const { results } = parseNDJSONChunk<LogEntry>("", bufferRef.current);
        if (results.length > 0) {
          setLogs((prevLogs) => [...prevLogs, ...results]);
        }
      }

      setIsLoading(false);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          console.log("Stream aborted");
          // Do NOT set isLoading(false) here.
          // If manually aborted, abort() function handles it.
          return;
        } else {
          setError(err);
        }
      } else {
        setError(new Error("Unknown error occurred"));
      }
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    streamLogs();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [streamLogs]);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    streamLogs();
  }, [streamLogs]);

  return { logs, isLoading, error, loadedBytes, abort, retry };
}
