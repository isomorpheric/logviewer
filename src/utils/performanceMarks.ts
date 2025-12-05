const MARKS = {
  FETCH_START: "log-fetch-start",
  FIRST_RENDER: "log-first-render",
} as const;

/**
 * Mark the start of a log fetch operation.
 * Call this when initiating a new stream fetch.
 */
export function markFetchStart(): void {
  performance.clearMarks(MARKS.FETCH_START);
  performance.clearMarks(MARKS.FIRST_RENDER);
  performance.clearMeasures("ttfr");
  performance.mark(MARKS.FETCH_START);
}

/**
 * Measure Time to First Render (TTFR).
 * Call this when the first log row is rendered.
 * @returns The duration in ms, or null if fetch-start mark doesn't exist.
 */
export function measureTTFR(): number | null {
  try {
    performance.mark(MARKS.FIRST_RENDER);
    const measure = performance.measure("ttfr", MARKS.FETCH_START, MARKS.FIRST_RENDER);
    return Math.round(measure.duration);
  } catch {
    return null;
  }
}
