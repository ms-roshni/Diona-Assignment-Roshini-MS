# Dynamic Document Generators — Assignment Submission

**Name:** _<fill in your name>_
**Submission:** Two separate exercises, one for each supplied PDF, built with plain HTML/CSS/JavaScript (no frameworks, no build step).

| Exercise | Source PDF | Generator | Narrated video |
| --- | --- | --- | --- |
| 1 | `Medical and Travel Expense Request.pdf` | [medical-travel-expense/index.html](medical-travel-expense/index.html) | _<add link here>_ |
| 2 | `Worker Progress Report.pdf` | [worker-progress-report/index.html](worker-progress-report/index.html) | _<add link here>_ |

Open [index.html](index.html) for a landing page linking to both generators.

## How to run

No build tools or server are required — everything is static HTML/CSS/JS.

1. Clone/download this repository.
2. Open `index.html` (or either app's `index.html` directly) in any modern browser.
3. Use the left-hand **panel** to edit the data (worker name, claim number, add/remove table rows, change selections, switch between the preset datasets). The document preview on the right re-renders and re-paginates instantly.
4. Click **Print / Save as PDF** to trigger the browser's print dialog; a print stylesheet renders each on-screen "paper" page as one real page (US Letter), so the printed/PDF output matches the on-screen preview exactly, including page numbers.

## Repository structure

```
/
├── index.html                     landing page linking to both generators
├── PROMPTS.md                     AI prompt-history disclosure
├── shared/                        code shared by both apps
│   ├── dom.js                     tiny DOM-building helpers (el, dataTable, section, checkOption...)
│   ├── components.js              shared masthead (logo/address/title/claim box) + footer builder
│   ├── editor.js                  generic editor-panel builders (text/select/textarea/radio/repeatable rows)
│   ├── paginate.js                the pagination engine (see below)
│   ├── paper.css                  "paper sheet" look + print stylesheet
│   ├── common.css                 shared document typography (tables, checkboxes, sections)
│   └── editor.css                 shared control-panel/app chrome styling
├── medical-travel-expense/
│   ├── index.html, styles.css
│   ├── data.js                    3 sample datasets (empty / one-entry / multiple-entries)
│   ├── render.js                  builds the document's DOM blocks from state
│   └── app.js                     builds the editor panel and wires it to render.js
└── worker-progress-report/
    ├── index.html, styles.css
    ├── data.js                    3 sample datasets (empty / matches sample PDF / long answers)
    ├── render.js
    └── app.js
```

## How pagination & page numbers work (the tricky part)

Both PDFs need to "flow" onto multiple pages with a running **Page X of Y** footer, and that page count changes depending on the data (more table rows, longer free-text answers, etc.). Real print CSS can't tell you in advance how many pages your content will need, so `shared/paginate.js` implements a small measurement-based layout engine:

1. The header (only rendered on page 1) and every section are built as normal DOM elements — atomic "blocks" that shouldn't be split mid-way.
2. An offscreen, hidden clone of a page-sized container is used to measure the *real* rendered height of each block (this reacts to however many rows/how much text is currently in the data).
3. Blocks are greedily packed onto 816×1056px "paper" pages (US Letter at 96dpi) until the next block would overflow, then a new page starts.
4. Once every block is placed, the total page count is known, so every page's footer can render an accurate "Page X of Y" — and it's recomputed on every edit.
5. `@media print` hides everything except the paginated pages and sets `@page { size: letter }`, so printing/"Save as PDF" produces the same pagination the user already saw on screen.

## Dynamic data elements identified in each PDF

**Medical & Travel Expense Request**
- Worker name, claim number, Worker App ID, submitted date/time (header + footer)
- Six independent, repeatable expense tables (prescription drugs, OTC drugs, supplies, parking, mileage, bus/taxi fare) — each row is add/removable, and a table with 0 rows shows "No entries submitted."
- Privacy-notice acknowledgement checkbox
- Total page count, which grows/shrinks as rows are added/removed

**Worker Progress Report**
- Worker name, claim number, Worker App ID, submitted date/time (header + footer)
- Several mutually-exclusive selections (return-to-work status, work duties, recovery status, treatment status, medication status, home-exercise status) that change which follow-up field is shown
- Free-text answers of arbitrary length (return-to-work narrative, concerns, recovery comments, exercise list, additional information) — longer answers push content onto additional pages
- A 1–10 pain scale
- Certification and privacy-notice checkboxes

## Assumptions made

- The exact organization logo/artwork from the source PDFs is not reproduced (it's a copyrighted trademark); a simple original placeholder mark is used in its place, alongside the same address/phone block layout.
- Address, phone number and other boilerplate header text were taken directly from the sample PDF and are only meant to demonstrate layout fidelity, not real contact details.
- Where the PDF shows a single filled-in example row, the "empty" and "multiple entries" presets are original sample data created to demonstrate the dynamic behaviour requested in the assignment (0 rows, 1 row, many rows).
- Section headings/order follow the visual structure of the PDFs as closely as reasonably possible; if the exact wording of a label couldn't be read with certainty, an equivalent plain-English label was used.

## AI usage disclosure

Code for this assignment was generated with the assistance of an AI coding agent (GitHub Copilot). See [PROMPTS.md](PROMPTS.md) for the prompt history, as required by the assignment instructions.
