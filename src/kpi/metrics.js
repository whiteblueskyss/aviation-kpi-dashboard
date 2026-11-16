// Metric specifications.
//
// Every KPI is described as   value = (numerator ÷ denominator) × scale
// (or numerator × scale when there is no denominator). The numerator and
// denominator names are "terms" that the engine knows how to total
// (see TERMS in engine.js). This mirrors the lesson rule: SUM first, DIVIDE last.
//
// fullScopeOnly: the KPI needs data that is only allocated at airline level
// (fleet days, crew days, balance sheet, cash flow), so it is unavailable once
// a route or distance filter is applied.

export const GROUPS = [
  { id: 'Commercial', label: 'Commercial' },
  { id: 'Cargo', label: 'Cargo' },
  { id: 'Operations', label: 'Operations' },
  { id: 'Baggage', label: 'Baggage & service' },
  { id: 'Financial', label: 'Financial' },
];

// Labels for the totals used in the "numbers behind this KPI" panel.
export const TERM_LABELS = {
  scheduled: 'Scheduled sectors',
  operated: 'Operated sectors',
  cancelled: 'Cancelled sectors',
  diverted: 'Diverted sectors',
  passengers: 'Revenue passengers',
  rpk: 'Total RPK',
  ask: 'Total ASK',
  ctk: 'Total CTK',
  actk: 'Total ACTK',
  revenue: 'Operating revenue (€)',
  cost: 'Operating cost (€)',
  passengerRevenue: 'Passenger revenue (€)',
  ontime: 'On-time operated sectors',
  gate: 'Operated sectors with a gate change',
  delay: 'Total arrival delay (min, early = 0)',
  turn: 'Total turnaround time (min)',
  turns: 'Observed turnarounds',
  bag: 'Checked baggage (kg)',
  mishandled: 'Mishandled bags',
  delayed: 'Delayed bags',
  lost: 'Lost bags',
  complaints: 'Complaints',
  compliments: 'Compliments',
  profit: 'Operating profit (€)',
  block: 'Sample block hours',
  aircraftDays: 'Aircraft-days (incl. idle days)',
  crewHours: 'Pilot block hours',
  crewDays: 'Pilot-days',
  net: 'Net profit (€)',
  ocf: 'Operating cash flow (€)',
  cashflow: 'Net cash flow (€)',
  shortDebt: 'Short-term debt (€)',
  longDebt: 'Long-term debt (€)',
};

const m = (id, group, label, unit, num, den, scale, decimals, extra) => ({
  id,
  group,
  label,
  unit,
  num,
  den,
  scale,
  decimals,
  kind: 'flow',
  fullScopeOnly: false,
  ...extra,
});

export const METRICS = [
  // ---------------------------------------------------------------- Commercial
  m('passengers', 'Commercial', 'Passengers', 'passengers', 'passengers', null, 1, 0, {
    kind: 'count',
    short: 'Revenue passengers carried on operated sectors.',
    formula: 'Sum of revenue passengers',
    meaning: 'The volume of demand actually served. It is a count, so it grows with the size of the airline and the length of the period.',
    caution: 'A bigger count is not automatically better: compare it with capacity (ASK) and with the route mix.',
  }),
  m('rpk', 'Commercial', 'Revenue passenger kilometres (RPK)', 'passenger-km', 'rpk', null, 1, 0, {
    kind: 'count',
    short: 'Paying passengers multiplied by the distance they flew.',
    formula: 'Σ (revenue passengers × sector km)',
    meaning: 'The standard measure of passenger demand (sold travel). One passenger flown one kilometre is one RPK.',
    caution: 'Cancelled sectors carry nobody, so they add nothing to RPK.',
  }),
  m('ask', 'Commercial', 'Available seat kilometres (ASK)', 'seat-km', 'ask', null, 1, 0, {
    kind: 'count',
    short: 'Seats offered multiplied by the distance flown.',
    formula: 'Σ (available seats × sector km)',
    meaning: 'The standard measure of passenger capacity (offered travel). One seat flown one kilometre is one ASK.',
    caution: 'Capacity is counted for operated sectors only; a cancelled sector offers no ASK.',
  }),
  m('plf', 'Commercial', 'Passenger load factor (PLF)', '%', 'rpk', 'ask', 100, 2, {
    short: 'The share of available seat-kilometres used by revenue passengers.',
    formula: '(Total RPK ÷ Total ASK) × 100',
    meaning: 'How full the aircraft were, weighted by distance. Always add RPK and ASK first, then divide.',
    caution: 'A high load factor shows efficient use of seats. It does not prove profit, because the seats may have been sold cheaply.',
  }),
  m('rask', 'Commercial', 'Revenue per ASK (RASK)', '€/ASK', 'revenue', 'ask', 1, 4, {
    short: 'Operating revenue earned for every seat-kilometre offered.',
    formula: 'Operating revenue ÷ ASK',
    meaning: 'Combines price and fullness. With passenger revenue only, RASK = yield × load factor. Here it includes passenger, ancillary and cargo revenue.',
    caution: 'Compare RASK with CASK: RASK above CASK means each offered seat-kilometre made money.',
  }),
  m('cask', 'Commercial', 'Cost per ASK (CASK)', '€/ASK', 'cost', 'ask', 1, 4, {
    short: 'Operating cost for every seat-kilometre offered.',
    formula: 'Operating cost ÷ ASK',
    meaning: 'The standard unit-cost measure. Cost is spread over offered capacity because the airline pays to fly a seat whether or not it is sold.',
    caution: 'Short sectors cost more per ASK than long ones, so route mix can explain differences between airlines.',
  }),
  m('yield', 'Commercial', 'Passenger yield', '€/RPK', 'passengerRevenue', 'rpk', 1, 4, {
    short: 'Passenger revenue earned per revenue passenger-kilometre.',
    formula: 'Passenger revenue ÷ RPK',
    meaning: 'The average price of sold travel. It falls when seats are sold at lower fares.',
    caution: 'Yield uses sold travel (RPK) as its base, while RASK uses offered travel (ASK). The two answer different questions.',
  }),

  // --------------------------------------------------------------------- Cargo
  m('ctk', 'Cargo', 'Cargo tonne kilometres (CTK)', 'tonne-km', 'ctk', null, 1, 1, {
    kind: 'count',
    short: 'Tonnes of belly freight carried multiplied by the distance flown.',
    formula: 'Σ (cargo kg ÷ 1,000 × sector km)',
    meaning: 'Cargo demand actually carried. Belly freight only; passenger baggage is excluded.',
    caution: 'No cargo service is modelled for Ryanair, so its CTK is zero.',
  }),
  m('actk', 'Cargo', 'Available cargo tonne kilometres (ACTK)', 'tonne-km', 'actk', null, 1, 1, {
    kind: 'count',
    short: 'Tonnes of cargo capacity offered multiplied by the distance flown.',
    formula: 'Σ (available cargo kg ÷ 1,000 × sector km)',
    meaning: 'Cargo capacity offered. The synthetic allocation here is a teaching assumption, not certified payload.',
    caution: 'Capacity is zero on cancelled sectors and on airlines with no cargo service.',
  }),
  m('clf', 'Cargo', 'Cargo load factor (CLF)', '%', 'ctk', 'actk', 100, 2, {
    short: 'The share of available cargo tonne-kilometres that was used.',
    formula: '(CTK ÷ ACTK) × 100',
    meaning: 'The cargo version of load factor. Belly capacity is harder to fill than seats, so values are usually lower than PLF.',
    caution: 'Not applicable (n/a) when ACTK is zero, for example for Ryanair in this dataset.',
  }),

  // ---------------------------------------------------------------- Operations
  m('scheduled', 'Operations', 'Scheduled flights', 'sectors', 'scheduled', null, 1, 0, {
    kind: 'count',
    short: 'Sectors in the timetable, whether or not they flew.',
    formula: 'Count of scheduled sectors',
    meaning: 'The starting base for cancellation rates. Operated = scheduled − cancelled.',
    caution: 'Diverted sectors are operated, so they are already inside the operated count.',
  }),
  m('aircraftUtil', 'Operations', 'Sample aircraft utilisation', 'h/aircraft-day', 'block', 'aircraftDays', 1, 2, {
    fullScopeOnly: true,
    short: 'Average block hours flown per aircraft per calendar day.',
    formula: 'Sample block hours ÷ aircraft-days',
    meaning: 'How hard the aircraft are worked. Idle days stay in the denominator.',
    caution: 'This measures sampled flying only, not whole-fleet utilisation. Unavailable under route or distance filters.',
  }),
  m('crewUtil', 'Operations', 'Sample pilot utilisation', 'h/pilot-day', 'crewHours', 'crewDays', 1, 2, {
    fullScopeOnly: true,
    short: 'Average pilot block hours per rostered pilot-day.',
    formula: 'Pilot block hours ÷ pilot-days',
    meaning: 'How intensively the crew are used. Real crew hours are limited by flight-time rules.',
    caution: 'This is a simplified roster model, not a crew-legality model. Unavailable under route or distance filters.',
  }),
  m('turn', 'Operations', 'Average turnaround time', 'min', 'turn', 'turns', 1, 1, {
    short: 'Average time on stand between an arrival and the next departure.',
    formula: 'Total turnaround minutes ÷ observed turnarounds',
    meaning: 'Shorter turnarounds allow more flights per day, but leave less buffer against delay.',
    caution: 'Turnaround is observed only on the second sector of each simulated pair, so the base is observed turnarounds, not all flights.',
  }),
  m('delay', 'Operations', 'Mean arrival delay', 'min', 'delay', 'operated', 1, 2, {
    short: 'Average arrival delay per operated sector, with early arrivals counted as zero.',
    formula: 'Σ max(arrival delay, 0) ÷ operated sectors',
    meaning: 'Shows the typical size of delay. Because early arrivals count as zero they cannot cancel out late ones.',
    caution: 'A few very late flights can lift the mean. Read it together with OTP.',
  }),
  m('otp', 'Operations', 'On-time performance (OTP)', '%', 'ontime', 'operated', 100, 2, {
    short: 'Share of operated sectors arriving less than 15 minutes late.',
    formula: 'On-time operated sectors ÷ operated sectors × 100',
    meaning: 'A sector is on time if it arrives under 15 minutes after schedule and was not diverted. Early arrivals are on time.',
    caution: 'Cancelled sectors are outside the base. Diversions count as operated and not on time.',
  }),
  m('gate', 'Operations', 'Gate change rate', '%', 'gate', 'operated', 100, 2, {
    short: 'Share of operated sectors whose departure was affected by a gate change.',
    formula: 'Operated sectors with a gate change ÷ operated sectors × 100',
    meaning: 'A passenger-experience and ground-operations indicator.',
    caution: 'It is a yes or no flag per sector, so a sector with two changes still counts once.',
  }),
  m('cancel', 'Operations', 'Cancellation rate', '%', 'cancelled', 'scheduled', 100, 2, {
    short: 'Share of scheduled sectors that did not operate.',
    formula: 'Cancelled sectors ÷ scheduled sectors × 100',
    meaning: 'Uses the timetable (scheduled) as its base because every scheduled flight could have been cancelled.',
    caution: 'Cancelled sectors carry zero traffic but still carry cancellation costs in this dataset.',
  }),
  m('diversion', 'Operations', 'Diversion rate', '%', 'diverted', 'operated', 100, 2, {
    short: 'Share of operated sectors that landed at a different airport than planned.',
    formula: 'Diverted sectors ÷ operated sectors × 100',
    meaning: 'Uses operated sectors as its base because only a flight that flew can divert.',
    caution: 'Diversions count as operated and not on time. The planned sector distance is kept for traffic.',
  }),

  // ------------------------------------------------------------------- Baggage
  m('bagPax', 'Baggage', 'Checked baggage per passenger', 'kg/passenger', 'bag', 'passengers', 1, 2, {
    short: 'Checked baggage weight per revenue passenger.',
    formula: 'Checked baggage kg ÷ passengers',
    meaning: 'Includes passengers with no checked bag, so it is an average across all passengers.',
    caution: 'Depends on baggage fees and the passenger mix. Weight is checked baggage only, not cabin baggage.',
  }),
  m('bagFlight', 'Baggage', 'Checked baggage per flight', 'kg/flight', 'bag', 'operated', 1, 1, {
    short: 'Checked baggage weight per operated sector.',
    formula: 'Checked baggage kg ÷ operated sectors',
    meaning: 'The average baggage load handled on each flight.',
    caution: 'Larger aircraft and fuller flights carry more, so compare with the aircraft type and load factor.',
  }),
  m('bagAsk', 'Baggage', 'Baggage weight per ASK', 'kg/ASK', 'bag', 'ask', 1, 5, {
    short: 'Checked baggage weight against the seat-kilometres offered.',
    formula: 'Checked baggage kg ÷ ASK',
    meaning: 'Baggage weight normalised by capacity. It equals baggage per RPK multiplied by load factor.',
    caution: 'Rises with load factor, so read it together with PLF.',
  }),
  m('bagRpk', 'Baggage', 'Baggage weight per RPK', 'kg/RPK', 'bag', 'rpk', 1, 5, {
    short: 'Checked baggage weight against the passenger-kilometres sold.',
    formula: 'Checked baggage kg ÷ RPK',
    meaning: 'Baggage weight per kilometre travelled by paying passengers.',
    caution: 'Short sectors tend to show a higher value because distance is small in the denominator.',
  }),
  m('mishandled', 'Baggage', 'Mishandled baggage rate', 'bags/1,000 pax', 'mishandled', 'passengers', 1000, 2, {
    short: 'Delayed, lost and damaged bags per 1,000 passengers.',
    formula: 'Mishandled bags ÷ passengers × 1,000',
    meaning: 'The three categories are mutually exclusive here, so they add up to the total.',
    caution: 'The base is passengers, not bags. A rate per checked bag would give a different number for the same performance.',
  }),
  m('delayed', 'Baggage', 'Delayed baggage rate', 'bags/1,000 pax', 'delayed', 'passengers', 1000, 2, {
    short: 'Bags delivered late, per 1,000 passengers.',
    formula: 'Delayed bags ÷ passengers × 1,000',
    meaning: 'Delay is the most common form of mishandling. Bags finally classified as lost are not counted here.',
    caution: 'Measures how often bags are late, not for how long.',
  }),
  m('lost', 'Baggage', 'Lost baggage rate', 'bags/1,000 pax', 'lost', 'passengers', 1000, 2, {
    short: 'Bags never delivered, per 1,000 passengers.',
    formula: 'Lost bags ÷ passengers × 1,000',
    meaning: 'A rare but costly event. The count is small, so the rate moves a lot from month to month.',
    caution: 'A bag later declared lost is not also counted as delayed.',
  }),
  m('complaints', 'Baggage', 'Passenger complaint rate', 'per 100,000 pax', 'complaints', 'passengers', 100000, 1, {
    short: 'Complaint submissions per 100,000 passengers.',
    formula: 'Complaints ÷ passengers × 100,000',
    meaning: 'A standard way to compare service quality across airlines of different sizes.',
    caution: 'Counts submissions, not unique people, and many unhappy passengers never complain.',
  }),
  m('compliments', 'Baggage', 'Passenger compliment rate', 'per 100,000 pax', 'compliments', 'passengers', 100000, 1, {
    short: 'Compliment submissions per 100,000 passengers.',
    formula: 'Compliments ÷ passengers × 100,000',
    meaning: 'The positive counterpart of the complaint rate.',
    caution: 'Counts submissions, not unique people. Compare with the complaint rate, not on its own.',
  }),

  // ----------------------------------------------------------------- Financial
  m('profit', 'Financial', 'Operating profit', '€', 'profit', null, 1, 0, {
    short: 'Operating revenue minus operating cost, before interest and tax.',
    formula: 'Operating revenue − operating cost',
    meaning: 'Shows how well the flying business itself is run, whatever the financing.',
    caution: 'A flow: add it up over the period. Size depends on the airline, so also check the margin.',
  }),
  m('margin', 'Financial', 'Operating profit margin', '%', 'profit', 'revenue', 100, 2, {
    short: 'Operating profit as a share of operating revenue.',
    formula: 'Operating profit ÷ operating revenue × 100',
    meaning: 'Lets you compare airlines of different sizes on the same scale.',
    caution: 'A ratio of totals: never average monthly margins.',
  }),
  m('net', 'Financial', 'Net profit', '€', 'net', null, 1, 0, {
    fullScopeOnly: true,
    short: 'Operating profit after interest and tax.',
    formula: 'Operating profit − interest − tax',
    meaning: 'What is left for the owners. Two airlines with the same operating profit can differ here because of how they are financed.',
    caution: 'Profit is not cash. Unavailable under route or distance filters.',
  }),
  m('ocf', 'Financial', 'Operating cash flow', '€', 'ocf', null, 1, 0, {
    fullScopeOnly: true,
    kind: 'flow',
    short: 'Cash generated by running the airline day to day.',
    formula: 'Net profit + depreciation − working-capital increase',
    meaning: 'Adds back non-cash depreciation and subtracts cash tied up in working capital.',
    caution: 'A flow: add it up over the period. Unavailable under route or distance filters.',
  }),
  m('cashflow', 'Financial', 'Net cash flow', '€', 'cashflow', null, 1, 0, {
    fullScopeOnly: true,
    short: 'The change in the cash balance over the period.',
    formula: 'Operating cash flow − capex + new borrowing − repayments',
    meaning: 'Can be negative in a profitable year, for example when the airline pays for new aircraft.',
    caution: 'A flow: add it up over the period. Unavailable under route or distance filters.',
  }),
  m('shortDebt', 'Financial', 'Short-term debt', '€', 'shortDebt', null, 1, 0, {
    fullScopeOnly: true,
    kind: 'stock',
    short: 'Debt due within the next 12 months, at the end of the last selected month.',
    formula: 'Closing current debt (last selected month)',
    meaning: 'The pressure point for liquidity. Compare it with cash on hand.',
    caution: 'A stock (balance): use the last selected month and never add months together.',
  }),
  m('longDebt', 'Financial', 'Long-term debt', '€', 'longDebt', null, 1, 0, {
    fullScopeOnly: true,
    kind: 'stock',
    short: 'Debt due later than 12 months, at the end of the last selected month.',
    formula: 'Closing non-current debt (last selected month)',
    meaning: 'Mostly the financing behind aircraft. Part of it moves to short-term debt as it comes due.',
    caution: 'A stock (balance): use the last selected month and never add months together.',
  }),
];

export const METRIC_BY_ID = Object.fromEntries(METRICS.map((x) => [x.id, x]));

// KPIs shown as cards on the Overview page.
export const OVERVIEW_IDS = ['passengers', 'plf', 'otp', 'clf', 'cask', 'profit'];
