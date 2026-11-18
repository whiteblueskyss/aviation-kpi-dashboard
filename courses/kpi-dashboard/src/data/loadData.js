import { indexData } from '../kpi/engine.js';

// The dataset ships with the app (public/courses/kpi-dashboard/data) and is fetched once in the browser.
export const DATA_URL = `${import.meta.env.BASE_URL}courses/kpi-dashboard/data/CAM145_SYNTHETIC_all_data_2025.json`;
export const DATA_FILENAME = 'CAM145_SYNTHETIC_all_data_2025.json';

export async function loadData() {
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error(`Could not load ${DATA_FILENAME} (HTTP ${res.status})`);
  const raw = await res.json();
  return indexData(raw);
}
