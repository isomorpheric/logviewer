import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Mock @tanstack/react-virtual for testing
// jsdom doesn't support layout/ResizeObserver, so we mock the hook to return all items as visible
vi.mock("@tanstack/react-virtual", () => ({
  useVirtualizer: ({ count }: { count: number }) => ({
    getVirtualItems: () =>
      Array.from({ length: count }, (_, i) => ({
        key: i,
        index: i,
        start: i * 28,
      })),
    getTotalSize: () => count * 28,
    measureElement: () => {},
  }),
}));

// Ensure cleanup after each test
afterEach(() => {
  cleanup();
});
