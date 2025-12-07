# Plan: Log Viewer

Refer to `docs/acceptance_criteria.md` for Acceptance Criteria and Constraints.

## 1. Completed Features

### Core & Architecture
- [x] Vitest + RTL coverage
- [x] `ndjsonParser`: chunked boundaries, bad lines skipped
- [x] `useLogStream`: incremental emission, abort/retry paths
- [x] Date formatting (ISO 8601)
- [x] `src/utils/perf.ts` - centralized Performance API marks
- [x] `PerformanceMetricsProvider` context for cross-cutting metrics
- [x] `usePerformanceMetrics` hook for consuming TTFR

### Log Table & Virtualization
- [x] `LogTable` behaviors: expansion toggles, copy/paste action
- [x] Two-column layout: `Time` and `Event`
- [x] Normalize `_time` to ISO 8601 via shared `dateFormatter`
- [x] Render event column as stable, single-line JSON (`JSON.stringify(event)`)
- [x] Track `isExpanded` per row; toggle via click or Enter/Space
- [x] Pretty-print expanded view with `JSON.stringify(event, null, 2)`
- [x] "Copy" Button for single-line and full pretty JSON
- [x] Virtualization using @tanstack/react-virtual
- [x] Variable row heights via height map and ResizeObserver
- [x] Overscan for smooth scrolling

### Streaming & UX
- [x] Use `useLogStream(url)` to consume response body stream
- [x] Parse NDJSON incrementally; push events to state immediately
- [x] Render rows without waiting for full download
- [x] Show status for bytes loaded and errors; keep retry/abort controls responsive
- [x] StatusBar: Display TTFR, bytes loaded, progress, log count, loading/error status
- [x] Abort/Retry action buttons

### UI Components
- [x] Reusable Card component with theme variables
- [x] Configurable padding (none, sm, md, lg)

### Documentation & Cleanup
- [x] **README.md**: Setup, Testing, Architecture, and Wishlist links.
- [x] **Testing Docs**: Updated `docs/testing.md`.
- [x] **Code Documentation**: READMEs in component/hook directories.

## 2. Architecture & Setup (Reference)

Lightweight, performance-focused React application using Vite. Rely on custom hooks for streaming data fetching and TanStack Virtual for rendering.

### Tech Stack
- **Core**: React 19, TypeScript
- **Build**: Vite
- **Styling**: CSS Modules (scoped, zero-runtime cost styles)
- **Testing**: Vitest + React Testing Library
- **State/Logic**: Custom Hooks (no external state libs)

### Directory Structure
- `src/components/`: UI components (`LogTable`, `Timeline`, `StatusBar`)
- `src/hooks/`: Logic (`useLogStream`)
- `src/utils/`: Helpers (`formatTime`, `perf`)

## 3. Wishlist (Future)


### High Impact
- **Client-Side Search & Facets (via Web Worker)**:
  - **Why**: Offloading parsing and filtering to a worker prevents the main thread from blocking (jank) during high-throughput updates or heavy regex searches.
  - **What**: Fuzzy search, facet discovery (auto-detecting fields like `level` or `status`), and time-range filtering.
- **Export Functionality**:
  - Download currently filtered logs as `.json` or `.ndjson`.


### UX & Enhancements
- **Keyboard Navigation**: `j`/`k` or Arrow keys to navigate and expand rows.
- **Interactive Timeline**: Brush selection to filter logs by time range.
- **Raw JSON Copy Dialog**: Dedicated modal for easy copying of large JSON objects.
