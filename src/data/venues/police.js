const police = {
  id: 'police',
  nameKey: 'venue.police',
  icon: '🚓',

  departments: [
    { id: 'dispatch', nameKey: 'dept.dispatch', icon: '📟' },
    { id: 'frontdesk', nameKey: 'dept.frontdesk', icon: '🛎️' },
    { id: 'records', nameKey: 'dept.records', icon: '🗂️' },
    { id: 'victim-services', nameKey: 'dept.victimservices', icon: '🤝' },
    { id: 'facilities', nameKey: 'dept.facilities', icon: '🔧' },
  ],

  categories: [
    {
      id: 'emergency-now',
      icon: '🚨',
      labelKey: 'cat.emergencyNow',
      subcategories: [
        { id: 'crime-in-progress', labelKey: 'cat.emergencyNow.inProgress', minSeverityFloor: 'critical' },
        { id: 'person-in-danger', labelKey: 'cat.emergencyNow.danger', minSeverityFloor: 'critical' },
      ],
    },
    {
      id: 'file-report',
      icon: '📝',
      labelKey: 'cat.fileReport',
      subcategories: [
        { id: 'theft', labelKey: 'cat.fileReport.theft' },
        { id: 'lost-property', labelKey: 'cat.fileReport.lostProperty' },
        { id: 'vandalism', labelKey: 'cat.fileReport.vandalism' },
      ],
    },
    {
      id: 'records-permits',
      icon: '🗂️',
      labelKey: 'cat.recordsPermits',
      subcategories: [
        { id: 'background-check', labelKey: 'cat.recordsPermits.background' },
        { id: 'permit-application', labelKey: 'cat.recordsPermits.permit' },
        { id: 'report-copy', labelKey: 'cat.recordsPermits.copy' },
      ],
    },
    {
      id: 'victim-support',
      icon: '🤝',
      labelKey: 'cat.victimSupport',
      subcategories: [
        { id: 'speak-to-advocate', labelKey: 'cat.victimSupport.advocate' },
        { id: 'protective-order', labelKey: 'cat.victimSupport.protectiveOrder' },
      ],
    },
    {
      id: 'facility-issue',
      icon: '🔧',
      labelKey: 'cat.facility',
      subcategories: [
        { id: 'spill-hazard', labelKey: 'cat.facility.spill' },
        { id: 'broken-equipment', labelKey: 'cat.facility.equipment' },
      ],
    },
  ],

  locations: [
    { id: 'main-lobby', labelKey: 'loc.mainLobby' },
    { id: 'records-window', labelKey: 'loc.recordsWindow' },
    { id: 'parking', labelKey: 'loc.parking' },
    { id: 'other', labelKey: 'loc.other' },
  ],

  routingRules: [
    {
      id: 'emergency',
      match: { categoryId: 'emergency-now' },
      route: { department: 'dispatch', priority: 1, slaMinutes: 2, escalateTo: null },
    },
    {
      id: 'victim-support',
      match: { categoryId: 'victim-support' },
      route: { department: 'victim-services', priority: 2, slaMinutes: 10, escalateTo: null },
    },
    {
      id: 'report-urgent',
      match: { categoryId: 'file-report', minSeverity: 'high' },
      route: { department: 'frontdesk', priority: 2, slaMinutes: 10, escalateTo: null },
    },
    {
      id: 'report-any',
      match: { categoryId: 'file-report' },
      route: { department: 'frontdesk', priority: 3, slaMinutes: 30, escalateTo: null },
    },
    {
      id: 'records',
      match: { categoryId: 'records-permits' },
      route: { department: 'records', priority: 4, slaMinutes: 60, escalateTo: null },
    },
    {
      id: 'facility',
      match: { categoryId: 'facility-issue' },
      route: { department: 'facilities', priority: 3, slaMinutes: 60, escalateTo: null },
    },
    {
      id: 'fallback',
      match: {},
      route: { department: 'frontdesk', priority: 3, slaMinutes: 30, escalateTo: null },
    },
  ],
}

export default police
