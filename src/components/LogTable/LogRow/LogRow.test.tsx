import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { LogEntry } from "@/types";
import { LogRow } from "./LogRow";

const mockLog: LogEntry = {
  _time: 1627890000000,
  message: "Test log message",
  level: "info",
};

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe("LogRow", () => {
  it("renders log summary correctly", () => {
    render(<LogRow log={mockLog} />);
    expect(screen.getByText(/Test log message/)).toBeInTheDocument();
    expect(screen.getByText(/2021-08-02T07:40:00.000Z/)).toBeInTheDocument();
  });

  it("expands and collapses details on click", () => {
    render(<LogRow log={mockLog} />);

    // Details should not be visible initially
    expect(screen.queryByText(/"level": "info"/)).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(screen.getByRole("button", { expanded: false }));
    expect(screen.getByText(/"level": "info"/)).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(screen.getByRole("button", { expanded: true }));
    expect(screen.queryByText(/"level": "info"/)).not.toBeInTheDocument();
  });

  it("copies JSON to clipboard", () => {
    render(<LogRow log={mockLog} />);

    // Expand to see the copy button
    fireEvent.click(screen.getByRole("button"));

    const copyButton = screen.getByText("Copy JSON");
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(JSON.stringify(mockLog, null, 2));
  });
});
