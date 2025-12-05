import { describe, expect, it } from "vitest";
import { parseNDJSONChunk } from "./ndjsonParser";

describe("ndjsonParser", () => {
  it("parses complete lines", () => {
    const chunk = '{"id":1}\n{"id":2}\n';
    const result = parseNDJSONChunk(chunk, "");

    expect(result.results).toEqual([{ id: 1 }, { id: 2 }]);
    expect(result.newBuffer).toBe("");
  });

  it("handles chunk split across lines", () => {
    const chunk1 = '{"id":1}\n{"id":';
    const result1 = parseNDJSONChunk(chunk1, "");

    expect(result1.results).toEqual([{ id: 1 }]);
    expect(result1.newBuffer).toBe('{"id":');

    const chunk2 = "2}\n";
    const result2 = parseNDJSONChunk(chunk2, result1.newBuffer);

    expect(result2.results).toEqual([{ id: 2 }]);
    expect(result2.newBuffer).toBe("");
  });

  it("skips bad JSON lines", () => {
    const chunk = '{"id":1}\nbadjson\n{"id":2}\n';
    const result = parseNDJSONChunk(chunk, "");

    expect(result.results).toEqual([{ id: 1 }, { id: 2 }]);
    expect(result.newBuffer).toBe("");
  });

  it("handles empty lines gracefully", () => {
    const chunk = '{"id":1}\n\n{"id":2}\n';
    const result = parseNDJSONChunk(chunk, "");
    expect(result.results).toEqual([{ id: 1 }, { id: 2 }]);
    expect(result.newBuffer).toBe("");
  });
});
