// Flagship demo venue. Departments, categories, locations, and routing rules
// are data — the routing engine and UI are venue-agnostic.
const hospital = {
  id: 'hospital',
  nameKey: 'venue.hospital',
  icon: '🏥',

  departments: [
    { id: 'triage', nameKey: 'dept.triage', icon: '🩺' },
    { id: 'security', nameKey: 'dept.security', icon: '🛡️' },
    { id: 'facilities', nameKey: 'dept.facilities', icon: '🔧' },
    { id: 'patientservices', nameKey: 'dept.patientservices', icon: '💁' },
    // External targets can't be notified by the prototype; the dashboard
    // shows a "call them now" banner instead.
    { id: 'code-team', nameKey: 'dept.codeteam', icon: '🚨', external: true },
    { id: 'dispatch-911', nameKey: 'dept.dispatch911', icon: '📞', external: true },
  ],

  categories: [
    {
      id: 'medical-concern',
      icon: '🏥',
      labelKey: 'cat.medical',
      subcategories: [
        { id: 'chest-pain', labelKey: 'cat.medical.chestPain', minSeverityFloor: 'critical' },
        { id: 'person-collapsed', labelKey: 'cat.medical.collapsed', minSeverityFloor: 'critical' },
        { id: 'injury', labelKey: 'cat.medical.injury' },
        { id: 'worsening-symptoms', labelKey: 'cat.medical.worsening' },
      ],
    },
    {
      id: 'safety-security',
      icon: '🛡️',
      labelKey: 'cat.safety',
      subcategories: [
        { id: 'aggressive-behavior', labelKey: 'cat.safety.aggressive' },
        { id: 'theft', labelKey: 'cat.safety.theft' },
        { id: 'suspicious-item', labelKey: 'cat.safety.suspicious', minSeverityFloor: 'high' },
      ],
    },
    {
      id: 'facility-issue',
      icon: '🔧',
      labelKey: 'cat.facility',
      subcategories: [
        { id: 'spill-hazard', labelKey: 'cat.facility.spill' },
        { id: 'broken-equipment', labelKey: 'cat.facility.equipment' },
        { id: 'restroom', labelKey: 'cat.facility.restroom' },
        { id: 'elevator-stuck', labelKey: 'cat.facility.elevator', minSeverityFloor: 'high' },
      ],
    },
    {
      id: 'assistance',
      icon: '💁',
      labelKey: 'cat.assistance',
      subcategories: [
        { id: 'wayfinding', labelKey: 'cat.assistance.wayfinding' },
        { id: 'wheelchair-help', labelKey: 'cat.assistance.wheelchair' },
        { id: 'interpreter-needed', labelKey: 'cat.assistance.interpreter' },
        { id: 'billing-records', labelKey: 'cat.assistance.billing' },
        { id: 'lost-item', labelKey: 'cat.assistance.lostItem' },
      ],
    },
  ],

  locations: [
    { id: 'main-lobby', labelKey: 'loc.mainLobby' },
    { id: 'emergency-waiting', labelKey: 'loc.erWaiting' },
    { id: 'outpatient', labelKey: 'loc.outpatient' },
    { id: 'pharmacy', labelKey: 'loc.pharmacy' },
    { id: 'parking', labelKey: 'loc.parking' },
    { id: 'restrooms', labelKey: 'loc.restrooms' },
    { id: 'other', labelKey: 'loc.other' },
  ],

  // Ordered: first match wins. The final empty-match rule is the mandatory
  // catch-all the routing engine asserts on.
  routingRules: [
    {
      id: 'medical-critical',
      match: { categoryId: 'medical-concern', minSeverity: 'critical' },
      route: { department: 'triage', priority: 1, slaMinutes: 2, escalateTo: 'code-team' },
    },
    {
      id: 'medical-high',
      match: { categoryId: 'medical-concern', minSeverity: 'high' },
      route: { department: 'triage', priority: 1, slaMinutes: 3, escalateTo: 'code-team' },
    },
    {
      id: 'medical-any',
      match: { categoryId: 'medical-concern' },
      route: { department: 'triage', priority: 2, slaMinutes: 10, escalateTo: null },
    },
    {
      id: 'security-high',
      match: { categoryId: 'safety-security', minSeverity: 'high' },
      route: { department: 'security', priority: 1, slaMinutes: 3, escalateTo: 'dispatch-911' },
    },
    {
      id: 'security-any',
      match: { categoryId: 'safety-security' },
      route: { department: 'security', priority: 2, slaMinutes: 10, escalateTo: null },
    },
    {
      id: 'facility-spill',
      match: { categoryId: 'facility-issue', subcategoryId: 'spill-hazard' },
      route: { department: 'facilities', priority: 2, slaMinutes: 15, escalateTo: null },
    },
    {
      id: 'facility-urgent',
      match: { categoryId: 'facility-issue', minSeverity: 'high' },
      route: { department: 'facilities', priority: 2, slaMinutes: 15, escalateTo: null },
    },
    {
      id: 'facility-any',
      match: { categoryId: 'facility-issue' },
      route: { department: 'facilities', priority: 3, slaMinutes: 60, escalateTo: null },
    },
    {
      id: 'assistance-any',
      match: { categoryId: 'assistance' },
      route: { department: 'patientservices', priority: 3, slaMinutes: 20, escalateTo: null },
    },
    {
      id: 'fallback',
      match: {},
      route: { department: 'patientservices', priority: 3, slaMinutes: 30, escalateTo: null },
    },
  ],
}

export default hospital
