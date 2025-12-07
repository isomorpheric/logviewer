import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/App";
import type { LogEntry } from "@/types";

describe("App integration - Acceptance Criteria", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    // Clean up global mocks after each test
    vi.unstubAllGlobals();
  });

  it("renders the application with main components", async () => {
    mockStreamingResponse([{ _time: 1234567890, message: "Test log" }]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByRole("grid", { name: "Log Table" })).toBeInTheDocument();
    });
  });

  it("AC #2: renders log table with two columns (Time and Event)", async () => {
    const mockLog = {
      _time: 1609459200000, // 2021-01-01T00:00:00.000Z
      level: "INFO",
      message: "Test message",
    };

    mockStreamingResponse([mockLog]);

    render(<App />);

    await waitFor(() => {
      // Verify table has correct headers
      expect(screen.getByText("Time")).toBeInTheDocument();
      expect(screen.getByText("Event")).toBeInTheDocument();

      // Verify ISO 8601 formatted time is displayed
      expect(screen.getByText(/2021-01-01T00:00:00/)).toBeInTheDocument();

      // Verify single-line JSON is displayed
      const eventCell = screen.getByText(/"level":"INFO"/);
      expect(eventCell).toBeInTheDocument();
    });
  });

  it("AC #3: expands and collapses rows to show multiline JSON", async () => {
    const user = userEvent.setup();
    const mockLog = {
      _time: 1609459200000,
      level: "INFO",
      message: "Test message",
      nested: { key: "value" },
    };

    mockStreamingResponse([mockLog]);

    render(<App />);

    // Wait for log to appear
    const rowButton = await waitFor(() => {
      const singleLineJson = screen.getByText(/"level":"INFO"/);
      expect(singleLineJson).toBeInTheDocument();

      // Find the row button containing the log data
      const btn = singleLineJson.closest("button") as HTMLElement;
      expect(btn).toBeInTheDocument();
      expect(btn).toHaveAttribute("aria-expanded", "false");
      return btn;
    });

    // Click to expand
    await user.click(rowButton);

    // Verify row is now expanded - multiline JSON with proper formatting
    await waitFor(() => {
      expect(rowButton).toHaveAttribute("aria-expanded", "true");

      // Should show formatted multiline JSON in a <pre> tag
      const preElement = screen.getByText(/"level": "INFO"/);
      expect(preElement.tagName).toBe("PRE");

      // Copy button should be visible
      expect(screen.getByText("Copy JSON")).toBeInTheDocument();
    });

    // Collapse the row
    await user.click(rowButton);

    // Verify it's collapsed again
    await waitFor(() => {
      expect(rowButton).toHaveAttribute("aria-expanded", "false");
      expect(screen.queryByText("Copy JSON")).not.toBeInTheDocument();
    });
  });

  it("AC #4: renders logs progressively as they stream in (TTFB optimization)", async () => {
    const firstBatch = [{ _time: 1609459200000, message: "First log" }];
    const secondBatch = [{ _time: 1609459201000, message: "Second log" }];

    // Simulate streaming: first batch arrives immediately, second batch arrives later
    mockStreamingResponseInBatches([firstBatch, secondBatch]);

    render(<App />);

    // Verify first log appears quickly (TTFB optimization)
    await waitFor(() => {
      expect(screen.getByText(/First log/)).toBeInTheDocument();
    });

    // Verify second log hasn't appeared yet
    expect(screen.queryByText(/Second log/)).not.toBeInTheDocument();

    // Wait for second batch to arrive
    await waitFor(
      () => {
        expect(screen.getByText(/Second log/)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("displays loading state while fetching logs", async () => {
    mockStreamingResponse([], { delay: 100 });

    render(<App />);

    // Should show skeleton during loading
    expect(screen.getByTestId("statusbar-skeleton")).toBeInTheDocument();

    // Wait for loading to complete - skeleton should be replaced by full status bar
    await waitFor(() => {
      expect(screen.queryByTestId("statusbar-skeleton")).not.toBeInTheDocument();
      expect(screen.getByTestId("statusbar")).toBeInTheDocument();
    });
  });

  it("handles streaming errors gracefully", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByText(/retry/i)).toBeInTheDocument();
    });
  });
});

// Helper functions for mocking fetch with streaming behavior
function mockStreamingResponse(logs: LogEntry[], options?: { delay?: number }) {
  const ndjson = logs.map((log) => JSON.stringify(log)).join("\n");
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      if (options?.delay) {
        setTimeout(() => {
          controller.enqueue(encoder.encode(ndjson));
          controller.close();
        }, options.delay);
      } else {
        controller.enqueue(encoder.encode(ndjson));
        controller.close();
      }
    },
  });

  const mockFetch = vi.fn().mockResolvedValue({
    ok: true,
    body: stream,
    headers: new Headers({ "content-type": "application/x-ndjson" }),
  });

  vi.stubGlobal("fetch", mockFetch);
}

function mockStreamingResponseInBatches(batches: LogEntry[][]) {
  const encoder = new TextEncoder();
  let batchIndex = 0;

  const stream = new ReadableStream({
    start(controller) {
      const sendNextBatch = () => {
        if (batchIndex < batches.length) {
          const ndjson = batches[batchIndex].map((log) => JSON.stringify(log)).join("\n");
          controller.enqueue(encoder.encode(`${ndjson}\n`));
          batchIndex++;
          setTimeout(sendNextBatch, 100);
        } else {
          controller.close();
        }
      };
      sendNextBatch();
    },
  });

  const mockFetch = vi.fn().mockResolvedValue({
    ok: true,
    body: stream,
    headers: new Headers({ "content-type": "application/x-ndjson" }),
  });

  vi.stubGlobal("fetch", mockFetch);
}
