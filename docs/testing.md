# Testing Strategy

## Overview

The test suite uses **Vitest** as the test runner and **React Testing Library** for component interaction. It includes:

- **Unit Tests**: to test pure functions and utils
- **Component Tests**: to test individual components with mocked deps
- **Integration Tests**: to test for acceptance criteria and user flows

## Running Tests

```bash
npm run test        # Run all tests (watch mode)
npm run test:run    # Run all tests once
npm run test:ui     # Open the Vitest UI
```

## Test Files by Type

### Component Tests
- [`LogRow.test.tsx`](../src/components/LogTable/LogRow/LogRow.test.tsx)
- [`LogTable.test.tsx`](../src/components/LogTable/LogTable.test.tsx)
- [`Timeline.test.tsx`](../src/components/Timeline/Timeline.test.tsx)

### Unit Tests
- [`ndjsonParser.test.ts`](../src/hooks/useLogStream/ndjsonParser.test.ts)
- [`useLogStream.test.tsx`](../src/hooks/useLogStream/useLogStream.test.tsx)

### Integration Tests
- [`app.integration.test.tsx`](../src/tests/integration/app.integration.test.tsx)
- [`App.test.tsx`](../src/App.test.tsx)



## Future Coverage Goals

- **E2E Tests**: Add Playwright or Cypress tests to verify full browser behavior
- **Accessibility**: Automated audits using `axe-core` during test runs
- **Visual Regression**: Snapshot testing for `LogTable` and `Timeline` states