# Dynamic Document Generators — Assignment Submission

**Name:** Roshini M S

**Submission:** Two separate exercises, one for each supplied PDF, built with plain HTML/CSS/JavaScript (no frameworks, no build step).

## Live Demo

**[View the Deployed Project on GitHub Pages](https://ms-roshni.github.io/Diona-Assignment-Roshini-MS/)**

## YouTube Demo Videos

### 1. Worker Progress Report

**[▶ Watch Worker Progress Report Demo on YouTube](https://www.youtube.com/watch?v=TvyC6veEtF8)**

### 2. Medical & Travel Expense Request

**[▶ Watch Medical & Travel Expense Request Demo on YouTube](https://www.youtube.com/watch?v=dPwB7HfJD-E)**

## Website Links

### 1. Worker Progress Report

**[Open Worker Progress Report](https://ms-roshni.github.io/Diona-Assignment-Roshini-MS/worker-progress-report/)**

### 2. Medical & Travel Expense Request

**[Open Medical & Travel Expense Request](https://ms-roshni.github.io/Diona-Assignment-Roshini-MS/medical-travel-expense/)**

## Assignment Exercises

| Exercise | Source PDF | Generator | Demo Video |
| --- | --- | --- | --- |
| 1 | `Medical and Travel Expense Request.pdf` | [Medical & Travel Expense Request](medical-travel-expense/index.html) | [YouTube](https://www.youtube.com/watch?v=dPwB7HfJD-E) |
| 2 | `Worker Progress Report.pdf` | [Worker Progress Report](worker-progress-report/index.html) | [YouTube](https://www.youtube.com/watch?v=TvyC6veEtF8) |

Open [index.html](index.html) for a landing page linking to both generators.

## How to Run

No build tools or server are required — everything is static HTML/CSS/JS.

1. Clone or download this repository.
2. Open `index.html` (or either app's `index.html` directly) in any modern browser.
3. Use the left-hand **panel** to edit the data (worker name, claim number, add/remove table rows, change selections, switch between the preset datasets). The document preview on the right re-renders and re-paginates instantly.
4. Click **Print / Save as PDF** to trigger the browser's print dialog. A print stylesheet renders each on-screen "paper" page as one real page (US Letter), so the printed/PDF output matches the on-screen preview exactly, including page numbers.

## Repository Structure

```text
/
├── index.html                     landing page linking to both generators
├── PROMPTS.md                     AI prompt-history disclosure
├── shared/                        code shared by both apps
│   ├── dom.js                     tiny DOM-building helpers
│   ├── components.js              shared masthead and footer builder
│   ├── editor.js                  generic editor-panel builders
│   ├── paginate.js                pagination engine
│   ├── paper.css                  paper sheet look + print stylesheet
│   ├── common.css                 shared document typography
│   └── editor.css                 shared control-panel/app styling
│
├── medical-travel-expense/
│   ├── index.html
│   ├── styles.css
│   ├── data.js                    3 sample datasets
│   ├── render.js                  builds the document DOM
│   └── app.js                     builds the editor panel
│
├── worker-progress-report/
│   ├── index.html
│   ├── styles.css
│   ├── data.js                    3 sample datasets
│   ├── render.js                  builds the document DOM
│   └── app.js                     builds the editor panel
│
└── videos/
    ├── Medical and Travel Expense Form Demo.mp4
    ├── Worker Progress Report Demo.mp4
    ├── medical-travel-youtube.txt
    └── worker-progress-report-youtube-link.txt