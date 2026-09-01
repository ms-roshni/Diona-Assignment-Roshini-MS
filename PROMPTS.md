# AI Prompt History

This assignment was built with the help of an AI coding agent (GitHub Copilot, Claude Sonnet model) inside VS Code. This file discloses the prompts used, as required by the assignment instructions. Wording below is a faithful summary of the actual conversation, condensed for readability.

## 1. Initial request

> "use both the pdf in the folder and achieve this: maybe we need 2 separate websites for each pdf requirements: here's what the instructions I received: [assignment instructions pasted in full — write code to generate content similar to two attached PDFs, complete with image/header/footer/page numbers/dynamic data, HTML/CSS/JS only, no frameworks]"

Two PDFs were present in the workspace: `Medical and Travel Expense Request.pdf` and `Worker Progress Report.pdf`.

## 2. Agent's approach (autonomous, guided by the prompt above)

Given the single high-level prompt above, the agent:

1. Rendered both PDFs to images (via a local Python/PyMuPDF script) and visually inspected every page to understand layout, fields, tables, header/footer/logo/page-number placement.
2. Decided on an architecture: two independent static sites (`medical-travel-expense/` and `worker-progress-report/`) sharing a small `shared/` library (DOM helpers, a masthead/footer component, a generic editor-panel builder, and — the key piece — a JavaScript pagination engine that measures rendered block heights and distributes them across US-Letter "paper" pages so that "Page X of Y" is always accurate for whatever data is loaded).
3. Built a data-driven renderer for each PDF: a plain JS state object → DOM-building functions → the shared pagination engine → an editable panel bound to the same state object, so editing data (adding/removing table rows, changing selections, typing longer answers, switching between preset datasets) live-updates the document and its page count.
4. Created three sample datasets per app (e.g. empty / one-entry / many-entries for the expense form; empty / matches the sample PDF / long free-text answers for the progress report) specifically to demonstrate the "1 element vs 10 elements" dynamic-data requirement from the assignment.
5. Verified both apps in a real browser (via automated Playwright checks) — confirmed the editor panel updates the preview, confirmed the pagination engine correctly recalculates the page count and footer text for every preset, and fixed a couple of bugs found this way (a null-child `appendChild` crash in one of the select-box builders, and a CSS grid sizing issue that caused unwanted horizontal scrolling).
6. Wrote the root `README.md`, `index.html` landing page, and this file.

## 3. Notable follow-up/self-correction prompts issued by the agent to itself during implementation

- "Check the rendered pages for a `TypeError: appendChild` — trace it to `selectBox()` receiving `null` entries from conditional fields and filter them out."
- "The two-column app layout overflows and produces a page-level horizontal scrollbar at typical viewport widths — diagnose with computed `scrollWidth`, discover CSS grid's default `min-width: auto` on grid items is the cause, and add `min-width: 0` to the grid children instead of shrinking the paper width."
- "Increase the row count in the 'multiple entries' preset until the pagination engine produces 3+ pages, to make the dynamic-pagination behaviour obvious in a demo."

## 4. What was not AI-generated

- The actual content/wording taken from the source PDFs (labels, section names, boilerplate legal text) was read directly from the provided PDF files, not invented by the AI.
- Final review, video recording, and any narration explaining the code are the author's own work — the AI did not narrate or record the required demonstration videos.
