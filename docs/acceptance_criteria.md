# Acceptance Criteria

1. Your submission should include **Unit Tests** to show your ability to test your code. Full coverage is not required, but you should have some working tests and a short write-up of what else you would test given additional time.

2. The component should render the list of log entries as a **table with two columns**:

   - The first column should display the time (the value of the `_time` property), formatted as **ISO 8601**.
   - The second column should present the entire event formatted as **single-line JSON**.  
     Each log entry should be rendered as a separate row.

3. It should be possible to **expand/collapse rows**. When expanded, the row should display the entire event formatted as **multiline JSON**, with each property on a new line.

4. The component should **pull data from the given URL** and update the view while individual log entries are being downloaded from the server.
   - The data is provided in **NDJSON** format (newline-delimited JSON).
   - The UX should be optimized for **time to first byte (TTFB)**, i.e. the component should render the events as soon as they are downloaded from the server, without waiting for the entire file to download.

## Constraints

- Limit external dependencies to a bare minimum.
- Avoid UI frameworks (e.g. Material UI, Ant Design, Tailwind), but feel free to use the CSS you know:
  - CSS Preprocessors
  - CSS Modules
  - Styled Components
  - etc.
- For state management, stick with what React provides:
  - No Redux, Zustand, etc.
