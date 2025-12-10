import type { LogEntry } from "@/types";

// Internal structure for the worker to hold data + searchable text
interface IndexedLog {
  data: LogEntry;
  searchableText: string;
}

// Worker State
let cachedLogs: IndexedLog[] = [];

self.onmessage = (e: MessageEvent) => {
  const data = e.data;
  const type = data.type;
  const payload = data.payload;

  if (type === "LOAD_DATA") {
    // 1. Initialize Cache & Index
    // We create a searchable string for each log entry once, upfront.
    // This avoids JSON.stringify() on every single keystroke.
    const rawLogs = payload as LogEntry[];

    cachedLogs = rawLogs.map((log) => ({
      data: log,
      // Create a simple string representation of values for searching
      // We could use JSON.stringify, but joining values is faster and often sufficient.
      // If we want full JSON search (keys included), JSON.stringify is safer.
      searchableText: JSON.stringify(log),
    }));

    self.postMessage({ type: "READY", count: cachedLogs.length });
    return;
  }

  if (type === "SEARCH") {
    // 2. Search Cache
    const query = payload.query;

    if (!query) {
      // Return original data structure
      self.postMessage({
        type: "RESULTS",
        logs: cachedLogs.map((item) => item.data),
      });
      return;
    }

    try {
      const regex = new RegExp(query, "i");

      // Filter using the pre-computed searchableText
      const filtered = cachedLogs
        .filter((item) => regex.test(item.searchableText))
        .map((item) => item.data);

      self.postMessage({ type: "RESULTS", logs: filtered });
    } catch (_error) {
      // Fallback for invalid regex
      self.postMessage({
        type: "RESULTS",
        logs: cachedLogs.map((item) => item.data),
      });
    }
    return;
  }
};
