# Aviation KPI Learning Dashboard

> Course 2 of [Aviation Study](../../README.md), served at `/courses/kpi-dashboard/`.

A React + JavaScript learning dashboard for aviation KPIs (PLF, OTP, CASK, RASK, yield, utilisation, baggage and financial measures) built on a **synthetic 2025 airline dataset**. There is no backend and no database: the JSON file ships with the app and all filtering and calculation happens in the browser.

> Educational simulation. Airline, airport and aircraft identities are real; every performance and financial figure is synthetic. Nothing here represents actual airline results.

## Quick start

Requires Node.js 18 or newer. Run the commands from the **repository root** (the course is built together with the rest of Aviation Study).

```bash
npm install
npm run dev        # then open http://localhost:5173/courses/kpi-dashboard/
npm test           # 26 tests for the KPI engine
npm run build      # production build of the whole site into dist/
npm run preview    # serve the production build locally
```

## What is in the app

- Single-airline and compare-airlines views, with filters for month range, route (both directions merged), aircraft type and sector distance.
- 35 KPIs grouped as Commercial, Cargo, Operations, Baggage & service and Financial, each with a definition, formula, "careful" note and a worked example that shows the numbers behind the result.
- A monthly trend chart (accessible SVG, hover or keyboard focus for values, plus a table of exact figures).
- A comparison table, a data viewer with CSV download, the data dictionary, notes and sources.
- A print-friendly layout.

## Project structure

```
public/courses/kpi-dashboard/data/CAM145_SYNTHETIC_all_data_2025.json   the dataset (repository root; fetched by the app)
src/kpi/metrics.js      KPI specs: numerator, denominator, scale, unit, definition text
src/kpi/engine.js       filters, totals and the evaluate() function
src/kpi/format.js       number and unit formatting
src/kpi/exportCsv.js    CSV export
src/components/         FilterBar, KpiCard, CompareTable, Explainer, TrendChart, DataPage
src/App.jsx             state and page layout
tests/engine.test.js    reference-value and lesson-example tests
```

## How the KPIs are calculated

Every KPI is `(numerator ÷ denominator) × scale`, and the engine always **adds the totals first and divides last**. It never averages percentages, because flights of different lengths and sizes carry different weight. Key conventions come from the dataset's own notes:

- **PLF** = total RPK ÷ total ASK. **CLF** = total CTK ÷ total ACTK (n/a when ACTK is zero, as for Ryanair).
- **OTP** = operated sectors arriving under 15 minutes late and not diverted ÷ operated sectors. Early arrivals are on time.
- **Mean arrival delay** uses `max(delay, 0)`, so early arrivals count as zero.
- **Cancellation rate** uses scheduled sectors as its base. **Diversion rate** uses operated sectors.
- **CASK** = operating cost ÷ ASK, and **RASK** = operating revenue ÷ ASK (passenger + ancillary + cargo). **Yield** = passenger revenue ÷ RPK.
- **Mishandled bags** = delayed + lost + damaged (mutually exclusive), per 1,000 passengers.
- **Profit and cash flows are flows** (added over the selected months). **Debt is a stock**: the last selected month is used, never a sum of months.
- Aircraft and pilot utilisation, net profit, cash flows and debt are only defined for whole airlines, so they show "n/a" when a route or distance filter is applied.

The tests check these rules against the reference dashboard's values (for example Turkish Airlines: 150,915 passengers, PLF 84.33%, OTP 85.67%, CLF 48.35%, CASK €0.0728, operating profit €9,020,454; all five airlines: 706,563 passengers, PLF 83.06%) and against the worked examples from the lessons.

## Deploying

The course is deployed as part of Aviation Study. See "Deploying" in the [root README](../../README.md).

## Changing the data

Replace the file in `public/courses/kpi-dashboard/data/` (repository root) with a file of the same structure (tables: `airlines`, `airports`, `routes`, `flights`, `aircraftDays`, `crewDays`, `finance`, plus `notes`, `sources`, `dictionary` and `seed`). If your file name differs, update `DATA_URL` and `DATA_FILENAME` in `src/data/loadData.js`. The data is about 6 MB; if it grows much larger, consider splitting it by airline or moving to a small API.

## Credits

The dataset (`CAM145_SYNTHETIC_all_data_2025.json`) was prepared by Dr. Bahtiyar Eren for the CAM.145 course, as stated in its notes, with AI assistance. This application is an independent learning project that reads the same data; it does not reuse the original dashboard's code, text or branding. Check the dataset's terms before publishing it publicly.
