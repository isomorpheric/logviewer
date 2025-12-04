## Overview

The objective of this take-home exercise is to demonstrate your design and implementation techniques for a real-world type of development problem. Please note that we are looking for solutions that demonstrate your **unique** development skills with React and JavaScript or TypeScript.

**Summary:**  
You’re building a small but realistic React app to showcase your front-end and general engineering skills, not just to “get it working,” but to show how _you_ design and implement things.

---

## Constraints

- Limit external dependencies to a bare minimum.
- Avoid UI frameworks (e.g. Material UI, Ant Design, Tailwind), but feel free to use the CSS you know:
  - CSS Preprocessors
  - CSS Modules
  - Styled Components
  - etc.
- For state management, stick with what React provides:
  - No Redux, Zustand, etc.

**Summary:**  
Keep dependencies lean, no big UI kits or state libraries. Use plain React (hooks, context if needed) and your own CSS approach to show your HTML/CSS and component design skills.

---

## Time Expectations

We know that taking on a code submission assignment like this one is not a trivial request, and we really appreciate the time you put into this — it helps us get to know you and how you work! We don’t want you spending an inordinate amount of your time on it, though, so if you find that it’s taking more than ~4 hours to complete, please reach out to us and we can help make sure you’re pointed in the right direction.

**Summary:**  
Aim for ~4 hours of effort. If it’s getting significantly longer, you’re encouraged to reach out instead of overbuilding.

---

## Submission Instructions

You should develop and submit code to Cribl via a GitHub project.

- Commit and push code changes as you normally would; your thinking and working style is important for us to understand.
- In your submission, include:
  - A link to the **public GitHub repo** containing your code.

**Summary:**  
Use a public GitHub repo, commit like you normally do, and share that repo link as your final deliverable.

---

## Documentation & Testing Expectations

Of course, no great product is complete without clear documentation and testing. As part of your solution, please provide any design, usage, and testing documentation that you feel would be helpful to someone using your solution for the first time.

**Summary:**  
Include basic docs (e.g. README with setup/usage/design notes) and some tests showing how you think about correctness and maintainability.

---

## Problem Statement

A customer has asked you to provide a UI for viewing the contents of a log file downloaded from a URL. They would like:

- To quickly **scroll through the log entries**.
- To **expand an entry** to see the full log event.

Because log files can be large, they also want:

- To see log events **as soon as they are transmitted** to the browser over the wire.
- **Not** to wait for the entire file to download.

Sample URL to download the log file:

- `https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log`

**Summary:**  
Build a log viewer that streams an NDJSON log file from a URL, shows entries as they arrive, and allows quick scanning plus expandable details per log line.

---

## Acceptance Criteria

### 1. Unit Tests

Your submission should include **Unit Tests** to show your ability to test your code.

- Full coverage is **not required**, but:
  - You should have some **working tests**.
  - Include a **short write-up** of what else you would test given additional time.

**Summary:**  
Provide at least a minimal but meaningful test suite (e.g. components/hooks/parsers) plus a brief note describing your broader test strategy if you had more time.

---

### 2. Log Table Rendering

The component should render the list of log entries as a **table with two columns**:

1. **Time**

   - Display the value of the `_time` property.
   - Format as **ISO 8601**.

2. **Event**
   - Present the entire event formatted as **single-line JSON**.

Each log entry should be a **separate row**.

**Summary:**  
Display logs in a two-column table: ISO timestamp in col 1, single-line JSON in col 2, one row per log event.

---

### 3. Expand/Collapse Rows

- It should be possible to **expand/collapse** rows.
- When expanded, the row should display:
  - The entire event formatted as **multiline JSON**.
  - Each property on a **new line**.

**Summary:**  
Each row is expandable; collapsed shows one-liner JSON, expanded shows nicely formatted multi-line JSON for that event.

---

### 4. Streaming NDJSON from URL

- The component should pull data from the given URL.
- The view should **update while log entries are being downloaded**.
- Data is provided in **NDJSON** (newline-delimited JSON).
- UX should be optimized for **time to first byte**:
  - Render events as soon as they are downloaded.
  - Do **not** wait for the entire file to finish downloading.

**Summary:**  
Implement streaming NDJSON consumption: parse chunks as they arrive and append new rows immediately to minimize perceived latency/TTFB.

---

## Bonus Points: Timeline Component

> Implement a simple timeline component, similar to the one presented on the mockup below, that will show the distribution of log events over time. For this portion of the exercise, feel free to use whatever charting library you want (or even better, no charting library at all).

![[TimelineComponentBonus.png|850]]
