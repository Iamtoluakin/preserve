export const maintenanceFrequencyOptions = [
  'Monthly',
  'Every 2 months',
  'Quarterly',
  'Twice a year',
  'Annually',
  'As needed',
] as const;

export type MaintenanceFrequency = (typeof maintenanceFrequencyOptions)[number];

export type HomeMaintenanceTask = {
  id: string;
  category: string;
  name: string;
  description: string;
  firstDueMonth: number;
  firstYearFrequency: MaintenanceFrequency;
  ongoingFrequency: MaintenanceFrequency;
};

export type CustomerMaintenanceTask = Pick<
  HomeMaintenanceTask,
  'id' | 'category' | 'name' | 'firstDueMonth' | 'firstYearFrequency' | 'ongoingFrequency'
>;

// Starter cadence adapted from the homeowner checklist supplied by the user.
// Preserve should confirm the schedule against each home's condition, equipment,
// local climate, and applicable manufacturer or warranty guidance.
export const homeMaintenanceTasks: HomeMaintenanceTask[] = [
  { id: 'washer-hoses', category: 'Appliances', name: 'Check washing-machine hoses and connections', description: 'Look for cracks, drips, dry rot, and loose connections.', firstDueMonth: 6, firstYearFrequency: 'Twice a year', ongoingFrequency: 'Twice a year' },
  { id: 'dryer-vent', category: 'Appliances', name: 'Check dryer exhaust vent', description: 'Check the connection and clear blockage or lint buildup.', firstDueMonth: 6, firstYearFrequency: 'Twice a year', ongoingFrequency: 'Twice a year' },
  { id: 'crawlspace-lines', category: 'Plumbing & structure', name: 'Check crawlspace for standing water and exposed lines', description: 'Check insulation and confirm heating and air-conditioning lines are secure.', firstDueMonth: 6, firstYearFrequency: 'Twice a year', ongoingFrequency: 'Twice a year' },
  { id: 'exterior-wash', category: 'Exterior', name: 'Wash exterior siding and brick weep holes', description: 'Pressure-wash suitable siding and clear brick veneer weep holes.', firstDueMonth: 12, firstYearFrequency: 'Annually', ongoingFrequency: 'Annually' },
  { id: 'countertop-caulk', category: 'Interior', name: 'Check countertop caulk and seams', description: 'Inspect seams between counters and backsplashes for gaps or damage.', firstDueMonth: 3, firstYearFrequency: 'Quarterly', ongoingFrequency: 'Quarterly' },
  { id: 'tile-shower-seals', category: 'Interior', name: 'Check tile, grout, and shower seals', description: 'Inspect ceramic tile, marble, grout, caulk joints, and shower seals.', firstDueMonth: 1, firstYearFrequency: 'Monthly', ongoingFrequency: 'Monthly' },
  { id: 'wood-water-seal', category: 'Exterior', name: 'Seal exposed treated wood', description: 'Apply water-seal treatment where appropriate.', firstDueMonth: 12, firstYearFrequency: 'Annually', ongoingFrequency: 'Annually' },
  { id: 'smoke-alarms', category: 'Safety', name: 'Test and clean smoke alarms', description: 'Test alarms and clean dust from units.', firstDueMonth: 1, firstYearFrequency: 'Monthly', ongoingFrequency: 'Monthly' },
  { id: 'gfi-outlets', category: 'Safety', name: 'Test GFCI outlets and breakers', description: 'Test ground-fault protection using the device test controls.', firstDueMonth: 1, firstYearFrequency: 'Monthly', ongoingFrequency: 'Monthly' },
  { id: 'door-thresholds', category: 'Exterior', name: 'Check exterior door thresholds', description: 'Check for air infiltration and adjust as needed.', firstDueMonth: 3, firstYearFrequency: 'Quarterly', ongoingFrequency: 'Quarterly' },
  { id: 'window-tracks', category: 'Windows & doors', name: 'Clean and lubricate window tracks', description: 'Keep tracks clean and confirm windows operate easily.', firstDueMonth: 6, firstYearFrequency: 'Twice a year', ongoingFrequency: 'Twice a year' },
  { id: 'garage-door', category: 'Windows & doors', name: 'Maintain garage door moving parts', description: 'Lubricate moving parts and check hardware and fasteners.', firstDueMonth: 12, firstYearFrequency: 'Annually', ongoingFrequency: 'Annually' },
  { id: 'carpet-cleaning', category: 'Interior', name: 'Steam-clean carpets', description: 'Minimum annual schedule; adjust timing to household use and need.', firstDueMonth: 12, firstYearFrequency: 'Annually', ongoingFrequency: 'As needed' },
  { id: 'air-filters', category: 'HVAC', name: 'Replace HVAC return-air filters', description: 'Check filter size and system guidance; replace on schedule.', firstDueMonth: 1, firstYearFrequency: 'Monthly', ongoingFrequency: 'Every 2 months' },
  { id: 'hvac-service', category: 'HVAC', name: 'Arrange professional HVAC inspection', description: 'Coordinate a qualified professional to inspect heating and cooling equipment.', firstDueMonth: 6, firstYearFrequency: 'Twice a year', ongoingFrequency: 'Twice a year' },
  { id: 'exterior-caulk', category: 'Exterior', name: 'Inspect exterior caulk and reseal', description: 'Check exterior caulk seals and reseal damaged areas where appropriate.', firstDueMonth: 6, firstYearFrequency: 'Twice a year', ongoingFrequency: 'Twice a year' },
  { id: 'steps-rails', category: 'Exterior', name: 'Inspect paint and caulk on steps and rails', description: 'Check front steps, rails, pickets, and posts; arrange repairs as needed.', firstDueMonth: 6, firstYearFrequency: 'Twice a year', ongoingFrequency: 'Twice a year' },
  { id: 'gutters-roof', category: 'Roof & drainage', name: 'Clean gutters, downspouts, and roof valleys', description: 'Remove leaves, pine straw, and other buildup; inspect drainage flow.', firstDueMonth: 6, firstYearFrequency: 'Quarterly', ongoingFrequency: 'Quarterly' },
  { id: 'exterior-paint', category: 'Exterior', name: 'Inspect exterior paint and caulk', description: 'Check exterior surfaces and arrange recaulking or repainting as needed.', firstDueMonth: 12, firstYearFrequency: 'Annually', ongoingFrequency: 'Annually' },
  { id: 'foundation-drains', category: 'Roof & drainage', name: 'Check foundation drains', description: 'Confirm foundation drains are clear and daylighting properly.', firstDueMonth: 3, firstYearFrequency: 'Quarterly', ongoingFrequency: 'Quarterly' },
  { id: 'termite-plan', category: 'Pest protection', name: 'Renew termite inspection and treatment plan', description: 'Coordinate the annual inspection and maintenance with a pest professional.', firstDueMonth: 12, firstYearFrequency: 'Annually', ongoingFrequency: 'Annually' },
  { id: 'water-heater', category: 'Plumbing & structure', name: 'Drain and flush water heater', description: 'Coordinate service and check the pressure-relief valve.', firstDueMonth: 12, firstYearFrequency: 'Annually', ongoingFrequency: 'Annually' },
  { id: 'main-water-valve', category: 'Plumbing & structure', name: 'Check main water shutoff valve', description: 'Confirm the valve is accessible and operates properly.', firstDueMonth: 12, firstYearFrequency: 'Annually', ongoingFrequency: 'Annually' },
  { id: 'swales-culverts', category: 'Roof & drainage', name: 'Inspect swales, culverts, and drainage inlets', description: 'Clear obstructions and confirm water can flow through drainage paths.', firstDueMonth: 6, firstYearFrequency: 'Twice a year', ongoingFrequency: 'Twice a year' },
];
