import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const mockEmptyStreamResponse = () =>
  vi.fn().mockResolvedValue({
    ok: true,
    body: new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(""));
        controller.close();
      },
    }),
    headers: new Headers(),
  });

describe("App - Smoke Tests", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", mockEmptyStreamResponse());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders main layout structure", async () => {
    const { container } = render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(container.firstChild).toBeTruthy();
    });
  });

  it("initializes with proper document structure", async () => {
    render(<App />);

    await waitFor(() => {
      // Verify semantic HTML structure
      const main = screen.getByRole("main");
      expect(main).toHaveAttribute("class");
    });
  });

  it("handles initial render without network calls gracefully", async () => {
    const { container } = render(<App />);

    await waitFor(() => {
      // Should render without errors
      expect(container).toBeTruthy();
      expect(screen.getByRole("main")).toBeInTheDocument();
    });
  });
});
