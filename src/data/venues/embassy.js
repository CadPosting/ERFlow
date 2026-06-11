const embassy = {
  id: 'embassy',
  nameKey: 'venue.embassy',
  icon: '🏤',

  departments: [
    { id: 'consular', nameKey: 'dept.consular', icon: '🛂' },
    { id: 'security', nameKey: 'dept.security', icon: '🛡️' },
    { id: 'frontdesk', nameKey: 'dept.frontdesk', icon: '🛎️' },
  ],

  categories: [
    {
      id: 'citizen-emergency',
      icon: '🚨',
      labelKey: 'cat.citizenEmergency',
      subcategories: [
        { id: 'lost-stolen-passport', labelKey: 'cat.citizenEmergency.passport' },
        { id: 'detained-relative', labelKey: 'cat.citizenEmergency.detained', minSeverityFloor: 'high' },
        { id: 'medical-emergency-abroad', labelKey: 'cat.citizenEmergency.medical', minSeverityFloor: 'high' },
      ],
    },
    {
      id: 'passport-visa',
      icon: '🛂',
      labelKey: 'cat.passportVisa',
      subcategories: [
        { id: 'visa-application', labelKey: 'cat.passportVisa.visa' },
        { id: 'passport-renewal', labelKey: 'cat.passportVisa.renewal' },
        { id: 'document-legalization', labelKey: 'cat.passportVisa.legalization' },
      ],
    },
    {
      id: 'appointments',
      icon: '📅',
      labelKey: 'cat.appointments',
      subcategories: [
        { id: 'check-in', labelKey: 'cat.appointments.checkIn' },
        { id: 'reschedule', labelKey: 'cat.appointments.reschedule' },
      ],
    },
    {
      id: 'general-inquiry',
      icon: '💬',
      labelKey: 'cat.generalInquiry',
      subcategories: [
        { id: 'question', labelKey: 'cat.generalInquiry.question' },
        { id: 'lost-item', labelKey: 'cat.assistance.lostItem' },
      ],
    },
  ],

  locations: [
    { id: 'main-lobby', labelKey: 'loc.mainLobby' },
    { id: 'consular-section', labelKey: 'loc.consularSection' },
    { id: 'waiting-area', labelKey: 'loc.waitingArea' },
    { id: 'other', labelKey: 'loc.other' },
  ],

  routingRules: [
    {
      id: 'citizen-emergency-high',
      match: { categoryId: 'citizen-emergency', minSeverity: 'high' },
      route: { department: 'consular', priority: 1, slaMinutes: 5, escalateTo: null },
    },
    {
      id: 'citizen-emergency-any',
      match: { categoryId: 'citizen-emergency' },
      route: { department: 'consular', priority: 2, slaMinutes: 15, escalateTo: null },
    },
    {
      id: 'passport-visa',
      match: { categoryId: 'passport-visa' },
      route: { department: 'consular', priority: 3, slaMinutes: 30, escalateTo: null },
    },
    {
      id: 'appointments',
      match: { categoryId: 'appointments' },
      route: { department: 'frontdesk', priority: 3, slaMinutes: 15, escalateTo: null },
    },
    {
      id: 'fallback',
      match: {},
      route: { department: 'frontdesk', priority: 3, slaMinutes: 30, escalateTo: null },
    },
  ],
}

export default embassy
