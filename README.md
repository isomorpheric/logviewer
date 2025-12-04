# Log Viewer

A minimal log viewer, focused on streaming NDJSON and fast time-to-first-byte rendering.

## Acceptance Criteria & Constraints

See [docs/acceptance_criteria.md](docs/acceptance_criteria.md) for the full acceptance criteria and constraints.

## Features

- Streaming hook `useLogStream` with incremental NDJSON parsing, abort/retry, and progress.
- Virtualized `LogTable` with variable row heights, keyboard navigation, and copy actions.
- ISO 8601 formatting via a shared `dateFormatter`; JSON output uses `JSON.stringify`.
- Optional timeline view to visualize log volume over time (SVG, no chart libs).
- Accessibility: grid semantics, focusable rows, `aria-live` status updates.

## Tech Stack

- Build: Vite
- Language: TypeScript
- UI: React 19
- Styling: CSS Modules
- Tests: Vitest + React Testing Library

## Getting Started

```bash
npm install
npm run dev       # start dev server
npm run test      # run unit tests
npm run build     # production build
npm run preview   # preview production build
```

## Notes

- Event column stays single-line for scanning; expanded view uses `JSON.stringify(event, null, 2)` for readability.
- Bad NDJSON lines are skipped; status surface tracks bytes loaded and errors.
