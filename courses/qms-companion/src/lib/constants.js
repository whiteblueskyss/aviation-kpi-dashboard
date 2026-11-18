export const NOTICE =
  '© 2026 Dr. Bahtiyar Eren, Estonian Aviation Academy. For CAM.104 students only. Do not copy or distribute.';

// [public path, number of slides]
export const SLIDES = [
  ['slides/CAM104_Module1_Introduction_to_Aviation_QM.pdf', 13],
  ['slides/CAM104_Module2_QM_Principles_and_Methodologies.pdf', 12],
  ['slides/CAM104_Module3_Compliance_Monitoring_and_Auditing.pdf', 13],
  ['slides/CAM104_Module4_Just_Culture_and_Learning.pdf', 14],
];

// [stage label, minutes]
export const STAGES = [
  ['Start', 3],
  ['Read', 12],
  ['Practise', 5],
  ['Source', 8],
  ['Apply', 10],
  ['Check', 7],
];

export const minsLeft = (si) => STAGES.slice(si).reduce((a, s) => a + s[1], 0);

export const PROGRESS_KEY = 'cam104-progress-v1';
export const DRAFTS_KEY = 'cam104-drafts';
export const QUIZ_KEY = 'cam104-quiz-v3';
