# Testing Strategy

## Overview

The test suite uses **Vitest** as the test runner and **React Testing Library** for component interaction. The strategy focuses on both unit logic (parsing, formatting) and component behavior (rendering, user interaction).

## Test Files by Type

### Component Tests
- [`LogRow.test.tsx`](../src/components/LogTable/LogRow/LogRow.test.tsx) - Row expansion, formatting, and copy functionality
- [`LogTable.test.tsx`](../src/components/LogTable/LogTable.test.tsx) - Table rendering, headers, virtualization, and accessibility
- [`Timeline.test.tsx`](../src/components/Timeline/Timeline.test.tsx) - Timeline aggregation, SVG rendering, and empty states

### Unit Tests
- [`ndjsonParser.test.ts`](../src/hooks/useLogStream/ndjsonParser.test.ts) - NDJSON parsing logic, chunk boundaries, and error handling
- [`useLogStream.test.tsx`](../src/hooks/useLogStream/useLogStream.test.tsx) - Streaming hook logic, abort/retry, and state management

### Integration Tests
- [`app.integration.test.tsx`](../src/tests/integration/app.integration.test.tsx) - Full app rendering and user flow verification
- [`App.test.tsx`](../src/App.test.tsx) - Basic smoke tests for main application layout

## Current Coverage

### 1. Unit Tests (`src/**/*.test.ts`)

- **`ndjsonParser`**:
  - Handles chunked data boundaries correctly.
  - Skips malformed or empty lines.
  - Returns valid `LogEntry` objects.

### 2. Hook Logic Tests (`src/hooks/**/*.test.tsx`)

- **`useLogStream`**:
  - Simulates streaming `fetch` responses.
  - Verifies state updates for `logs`, `loading`, and `progress`.
  - Tests `abort` and `retry` functionality.
  - Verifies error handling states.

### 3. Component Tests (`src/components/**/*.test.tsx`)

- **`LogRow`**:
  - Toggles expansion state.
  - Renders formatted time and JSON code blocks.
  - Verifies "Copy" button interaction.
- **`LogTable`**:
  - Renders headers and row content.
  - Integrates virtualization (mocked or shallow).
  - Verifies ARIA roles and accessibility attributes.
- **`Timeline`**:
  - Verifies aggregation of logs into time buckets.
  - Renders correct number of SVG bars.
  - Handles empty states.

### 4. Integration Tests (`src/tests/integration/`)

- **`app.integration.test.tsx`**:
  - Renders the full `App` with providers.
  - Verifies critical user flows (loading -> rendering -> interaction).
- **`App.test.tsx`**:
  - Basic smoke tests for main layout and role presence.

## Running Tests

```bash
npm run test        # Run all tests (watch mode)
npm run test:run    # Run all tests once
npm run test:ui     # Open the Vitest UI
```

## Future Coverage Goals

- **E2E Tests**: Add Playwright tests to verify full browser behavior and scrolling performance.
- **Accessibility**: Automated audits using `axe-core` during test runs.
- **Visual Regression**: Snapshot testing for `LogTable` and `Timeline` states.
- **Fuzz Testing**: Test `ndjsonParser` with random/corrupted input streams.
