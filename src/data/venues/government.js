const government = {
  id: 'government',
  nameKey: 'venue.government',
  icon: '🏛️',

  departments: [
    { id: 'service-counter', nameKey: 'dept.serviceCounter', icon: '🛎️' },
    { id: 'case-officers', nameKey: 'dept.caseOfficers', icon: '🗃️' },
    { id: 'security', nameKey: 'dept.security', icon: '🛡️' },
    { id: 'facilities', nameKey: 'dept.facilities', icon: '🔧' },
  ],

  categories: [
    {
      id: 'service-request',
      icon: '🛎️',
      labelKey: 'cat.serviceRequest',
      subcategories: [
        { id: 'new-application', labelKey: 'cat.serviceRequest.new' },
        { id: 'application-status', labelKey: 'cat.serviceRequest.status' },
        { id: 'payment', labelKey: 'cat.serviceRequest.payment' },
      ],
    },
    {
      id: 'document-help',
      icon: '📄',
      labelKey: 'cat.documentHelp',
      subcategories: [
        { id: 'missing-document', labelKey: 'cat.documentHelp.missing' },
        { id: 'form-assistance', labelKey: 'cat.documentHelp.forms' },
        { id: 'certified-copy', labelKey: 'cat.documentHelp.copy' },
      ],
    },
    {
      id: 'complaint-feedback',
      icon: '🗣️',
      labelKey: 'cat.complaint',
      subcategories: [
        { id: 'service-complaint', labelKey: 'cat.complaint.service' },
        { id: 'suggestion', labelKey: 'cat.complaint.suggestion' },
      ],
    },
    {
      id: 'accessibility-help',
      icon: '♿',
      labelKey: 'cat.accessibilityHelp',
      subcategories: [
        { id: 'mobility-assistance', labelKey: 'cat.accessibilityHelp.mobility' },
        { id: 'interpreter-needed', labelKey: 'cat.assistance.interpreter' },
      ],
    },
    {
      id: 'facility-issue',
      icon: '🔧',
      labelKey: 'cat.facility',
      subcategories: [
        { id: 'spill-hazard', labelKey: 'cat.facility.spill' },
        { id: 'broken-equipment', labelKey: 'cat.facility.equipment' },
        { id: 'elevator-stuck', labelKey: 'cat.facility.elevator', minSeverityFloor: 'high' },
      ],
    },
  ],

  locations: [
    { id: 'main-lobby', labelKey: 'loc.mainLobby' },
    { id: 'service-hall', labelKey: 'loc.serviceHall' },
    { id: 'waiting-area', labelKey: 'loc.waitingArea' },
    { id: 'parking', labelKey: 'loc.parking' },
    { id: 'other', labelKey: 'loc.other' },
  ],

  routingRules: [
    {
      id: 'accessibility',
      match: { categoryId: 'accessibility-help' },
      route: { department: 'service-counter', priority: 2, slaMinutes: 10, escalateTo: null },
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
      id: 'documents',
      match: { categoryId: 'document-help' },
      route: { department: 'case-officers', priority: 3, slaMinutes: 30, escalateTo: null },
    },
    {
      id: 'complaints',
      match: { categoryId: 'complaint-feedback' },
      route: { department: 'case-officers', priority: 4, slaMinutes: 120, escalateTo: null },
    },
    {
      id: 'fallback',
      match: {},
      route: { department: 'service-counter', priority: 3, slaMinutes: 30, escalateTo: null },
    },
  ],
}

export default government
