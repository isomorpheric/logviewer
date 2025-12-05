/**
 * Parses a chunk of text containing NDJSON (Newline Delimited JSON).
 * Handles partial lines by returning the remaining buffer.
 *
 * @param chunk - The new text chunk received from the stream
 * @param buffer - The leftover text from the previous chunk
 * @returns An object containing the parsed objects and the new buffer
 */
export function parseNDJSONChunk<T>(
  chunk: string,
  buffer: string
): { results: T[]; newBuffer: string } {
  const combined = buffer + chunk;
  const lines = combined.split("\n");

  // The last line might be incomplete, so we save it for the next chunk
  // If the chunk ends with a newline, the last element will be an empty string, which is fine to buffer (it's empty)
  const newBuffer = lines.pop() ?? "";

  const results: T[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    try {
      const parsed = JSON.parse(line);
      results.push(parsed);
    } catch (e) {
      console.warn("Failed to parse NDJSON line:", line, e);
      // We skip bad lines as per requirements
    }
  }

  return { results, newBuffer };
}
