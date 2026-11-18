# Passenger Market Lab · July 2025 (React)

> Course 1 of [Aviation Study](../../README.md), served at `/courses/market-lab/`.

React (Vite, plain JavaScript) port of the "Air Passenger Market Analysis | July 2025 — Educational Case Study"
dashboard. Fully client-side: no backend, no storage, no tracking. Workshop answers live in the page only
and are cleared on reload (as in the original).

## Run

This course is part of [Aviation Study](../../README.md) and is built together with the landing page and the
other courses. Run the commands from the **repository root**:

    npm install
    npm run dev       # then open http://localhost:5173/courses/market-lab/
    npm run build     # builds the whole site into dist/
    npm run preview

## Layout

    src/
      App.jsx                 shell: sidebar nav, header, all state (filters, sorting, lab inputs), hash routing
      data/records.json       57 IATA records (global, regions, domestic markets, route areas)
      data/timeIndicators.js  13 time / outlook indicators
      data/tasks.js           5 workshop tasks (question, evidence, hint, model answer, criterion)
      lib/format.js           periods, section list, fmt() / sign()
      lib/data.js             record queries, route groups, flat source table, CSV export
      components/Bars.jsx     SVG bar charts (growth / PLF / route modes)
      components/DataTable.jsx  sortable results table
      pages/                  Start, Overview + Demand, Regions, Domestic, Routes, Time, Lab, Workshop, Sources
      styles/app.css          original stylesheet
      assets/                 EAVA logo, Space Grotesk font

## Notes

- All ten sections stay mounted and are hidden/shown, so filters, lab sliders and workshop answers persist while you navigate.
- The CSV export ("Export visible data as CSV") produces the same file as the original (UTF-8 BOM, CRLF).
- `og:url` was dropped from `index.html` because it pointed at the original site; add your own if you deploy.
