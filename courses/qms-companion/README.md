# CAM.104 · QMS Study Companion (React)

> Course 3 of [Aviation Study](../../README.md), served at `/courses/qms-companion/`.

A React (Vite, plain JavaScript) port of the CAM.104 QMS Study Companion.
Fully client-side: no database or API. Progress, quiz attempts and written
drafts live in `localStorage`. The feedback form posts to Netlify Forms.

## Run

This course is part of [Aviation Study](../../README.md) and is built together with the landing page and the
other courses. Run the commands from the **repository root**:

    npm install
    npm run dev       # then open http://localhost:5173/courses/qms-companion/
    npm run build     # builds the whole site into dist/
    npm run preview

## Layout

    src/
      App.jsx                 app shell: navigation, progress, quiz state, confirm dialog
      data/                   modules.js (lessons), bank.js (question bank), sources.js (references)
      lib/                    constants, quiz engine (selection, scoring), localStorage, HTML helpers
      pages/                  StudyModules, ModulePage (6 stages), QuizPage, PracticePage, SourcesPage, FeedbackPage
      components/             Header, Sidebar, ConfirmDialog, SlidesCard, LearningCheck, common (RawHtml, DraftField, Chip)
      styles/                 original CSS, split into base / reading / header / header-author / feedback
      assets/                 logo.png, Space Grotesk fonts
    ../../public/courses/qms-companion/slides/   the four module slide PDFs (repository root)

## localStorage keys (same as the original)

    cam104-progress-v1   module stage progress + "continue where you left off"
    cam104-quiz-v3       attempts used, best score, passed, questions already seen
    cam104-drafts        written answers (open-*, lc-*, w-*, and the Apply fields)

## Notes

- Lesson text in `data/modules.js` is author-written HTML (links, tables, form fields) and is rendered with `dangerouslySetInnerHTML` on purpose.
- Deploy on Netlify: `index.html` contains a hidden static copy of the form so Netlify detects it. Outside Netlify the form shows an error on submit, as in the original.
- The four slide PDFs live in `public/courses/qms-companion/slides/` (repository root) and are served at `/courses/qms-companion/slides/...` (download links on each module).
