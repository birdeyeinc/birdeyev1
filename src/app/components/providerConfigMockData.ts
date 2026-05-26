// Mock data: Providers configuration table
// Bridges EHR system with AI booking agent — tells the agent who can book what, where, and how.

export type AgentBookingPermission = "auto_book" | "offer_and_confirm" | "transfer_to_staff";
export type DerivedBookingStatus  = "auto_book" | "confirm_with_staff" | "transfer_only" | "mixed" | "disabled";
export type ProviderStatus        = "active" | "inactive" | "temporarily_disabled";

export interface LocationRef {
  locationId:   string;
  locationName: string;
}

export interface AppointmentTypeConfig {
  typeId:                  string;
  typeName:                string;
  defaultDurationMinutes:  15 | 20 | 30 | 45 | 60;
  newPatientsAllowed:      boolean;
  agentBookingPermission:  AgentBookingPermission;
  minimumNoticeHours:      0 | 2 | 24 | 48;
}

export interface ProviderConfig {
  providerId:              string;
  name:                    string;
  specialty:               string;
  npi:                     string;
  lastSyncedAt:            string;                    // ISO timestamp
  locations:               LocationRef[];
  appointmentTypes:        AppointmentTypeConfig[];
  ehrScheduleSync:         boolean;
  status:                  ProviderStatus;
  statusOverrideReason:    string | null;
  derivedAgentBookingStatus: DerivedBookingStatus;
}

/* ─── Shared locations ─── */
const LOCATIONS: Record<string, LocationRef> = {
  main:       { locationId: "LOC-001", locationName: "Main Clinic"        },
  downtown:   { locationId: "LOC-002", locationName: "Downtown Office"    },
  north:      { locationId: "LOC-003", locationName: "North Branch"       },
  south:      { locationId: "LOC-004", locationName: "South Campus"       },
  telehealth: { locationId: "LOC-005", locationName: "Telehealth Hub"     },
};

/* ─── Shared appointment type templates ─── */
const APT = {
  newPatient:        (permission: AgentBookingPermission): AppointmentTypeConfig => ({
    typeId: "AT-001", typeName: "New Patient Consult", defaultDurationMinutes: 60,
    newPatientsAllowed: true, agentBookingPermission: permission, minimumNoticeHours: 48,
  }),
  followUp:          (permission: AgentBookingPermission): AppointmentTypeConfig => ({
    typeId: "AT-002", typeName: "Follow-up Visit", defaultDurationMinutes: 20,
    newPatientsAllowed: false, agentBookingPermission: permission, minimumNoticeHours: 2,
  }),
  annualPhysical:    (permission: AgentBookingPermission): AppointmentTypeConfig => ({
    typeId: "AT-003", typeName: "Annual Physical", defaultDurationMinutes: 45,
    newPatientsAllowed: true, agentBookingPermission: permission, minimumNoticeHours: 48,
  }),
  telehealth:        (permission: AgentBookingPermission): AppointmentTypeConfig => ({
    typeId: "AT-004", typeName: "Telehealth Visit", defaultDurationMinutes: 30,
    newPatientsAllowed: false, agentBookingPermission: permission, minimumNoticeHours: 2,
  }),
  urgentCare:        (): AppointmentTypeConfig => ({
    typeId: "AT-005", typeName: "Urgent Care Visit", defaultDurationMinutes: 15,
    newPatientsAllowed: true, agentBookingPermission: "transfer_to_staff", minimumNoticeHours: 0,
  }),
  procedureConsult:  (permission: AgentBookingPermission): AppointmentTypeConfig => ({
    typeId: "AT-006", typeName: "Procedure Consult", defaultDurationMinutes: 45,
    newPatientsAllowed: false, agentBookingPermission: permission, minimumNoticeHours: 48,
  }),
  mentalHealthCheckin: (): AppointmentTypeConfig => ({
    typeId: "AT-007", typeName: "Mental Health Check-in", defaultDurationMinutes: 30,
    newPatientsAllowed: false, agentBookingPermission: "transfer_to_staff", minimumNoticeHours: 24,
  }),
  prenatal:          (permission: AgentBookingPermission): AppointmentTypeConfig => ({
    typeId: "AT-008", typeName: "Prenatal Visit", defaultDurationMinutes: 30,
    newPatientsAllowed: true, agentBookingPermission: permission, minimumNoticeHours: 24,
  }),
  wellChild:         (permission: AgentBookingPermission): AppointmentTypeConfig => ({
    typeId: "AT-009", typeName: "Well-Child Visit", defaultDurationMinutes: 30,
    newPatientsAllowed: true, agentBookingPermission: permission, minimumNoticeHours: 48,
  }),
  immunization:      (): AppointmentTypeConfig => ({
    typeId: "AT-010", typeName: "Immunization Only", defaultDurationMinutes: 15,
    newPatientsAllowed: true, agentBookingPermission: "auto_book", minimumNoticeHours: 2,
  }),
  chronicDisease:    (permission: AgentBookingPermission): AppointmentTypeConfig => ({
    typeId: "AT-011", typeName: "Chronic Disease Management", defaultDurationMinutes: 30,
    newPatientsAllowed: false, agentBookingPermission: permission, minimumNoticeHours: 24,
  }),
  preOpConsult:      (): AppointmentTypeConfig => ({
    typeId: "AT-012", typeName: "Pre-operative Consult", defaultDurationMinutes: 45,
    newPatientsAllowed: false, agentBookingPermission: "offer_and_confirm", minimumNoticeHours: 48,
  }),
  postOpFollowUp:    (): AppointmentTypeConfig => ({
    typeId: "AT-013", typeName: "Post-operative Follow-up", defaultDurationMinutes: 20,
    newPatientsAllowed: false, agentBookingPermission: "auto_book", minimumNoticeHours: 2,
  }),
  echodReview:       (): AppointmentTypeConfig => ({
    typeId: "AT-014", typeName: "Echocardiogram Review", defaultDurationMinutes: 30,
    newPatientsAllowed: false, agentBookingPermission: "offer_and_confirm", minimumNoticeHours: 48,
  }),
  sportsPhysical:    (): AppointmentTypeConfig => ({
    typeId: "AT-015", typeName: "Sports Physical", defaultDurationMinutes: 20,
    newPatientsAllowed: true, agentBookingPermission: "auto_book", minimumNoticeHours: 24,
  }),
  skinCheck:         (permission: AgentBookingPermission): AppointmentTypeConfig => ({
    typeId: "AT-016", typeName: "Full Skin Check", defaultDurationMinutes: 30,
    newPatientsAllowed: true, agentBookingPermission: permission, minimumNoticeHours: 48,
  }),
  biopsyConsult:     (): AppointmentTypeConfig => ({
    typeId: "AT-017", typeName: "Biopsy / Procedure Consult", defaultDurationMinutes: 45,
    newPatientsAllowed: false, agentBookingPermission: "transfer_to_staff", minimumNoticeHours: 48,
  }),
  colonoscopyConsult: (): AppointmentTypeConfig => ({
    typeId: "AT-018", typeName: "Colonoscopy Consult", defaultDurationMinutes: 45,
    newPatientsAllowed: false, agentBookingPermission: "offer_and_confirm", minimumNoticeHours: 48,
  }),
  initialPsych:      (): AppointmentTypeConfig => ({
    typeId: "AT-019", typeName: "Initial Psychiatric Evaluation", defaultDurationMinutes: 60,
    newPatientsAllowed: true, agentBookingPermission: "transfer_to_staff", minimumNoticeHours: 48,
  }),
  medicationMgmt:    (): AppointmentTypeConfig => ({
    typeId: "AT-020", typeName: "Medication Management", defaultDurationMinutes: 20,
    newPatientsAllowed: false, agentBookingPermission: "offer_and_confirm", minimumNoticeHours: 24,
  }),
  jointInjection:    (): AppointmentTypeConfig => ({
    typeId: "AT-021", typeName: "Joint Injection", defaultDurationMinutes: 30,
    newPatientsAllowed: false, agentBookingPermission: "offer_and_confirm", minimumNoticeHours: 48,
  }),
};

/* ─── Helper: ISO timestamp within past 7 days ─── */
function recentSync(daysAgo: number, hour = 8, min = 0): string {
  const d = new Date("2026-05-08T00:00:00Z");
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
}

/* ─── Mock provider records ─── */
export const PROVIDER_CONFIG_DATA: ProviderConfig[] = [
  // 1. Family Medicine — high-volume PCP, mostly auto_book
  {
    providerId: "PRV-001",
    name: "Dr. Sarah Patel, MD",
    specialty: "Family Medicine",
    npi: "1234567890",
    lastSyncedAt: recentSync(0, 6, 15),
    locations: [LOCATIONS.main, LOCATIONS.north, LOCATIONS.telehealth],
    ehrScheduleSync: true,
    status: "active",
    statusOverrideReason: null,
    derivedAgentBookingStatus: "mixed",
    appointmentTypes: [
      APT.newPatient("offer_and_confirm"),
      APT.followUp("auto_book"),
      APT.annualPhysical("auto_book"),
      APT.telehealth("auto_book"),
      APT.urgentCare(),
      APT.chronicDisease("auto_book"),
    ],
  },

  // 2. Internal Medicine — mixed permissions
  {
    providerId: "PRV-002",
    name: "Dr. Marcus Johnson, DO",
    specialty: "Internal Medicine",
    npi: "2345678901",
    lastSyncedAt: recentSync(1, 7, 30),
    locations: [LOCATIONS.main, LOCATIONS.downtown],
    ehrScheduleSync: true,
    status: "active",
    statusOverrideReason: null,
    derivedAgentBookingStatus: "mixed",
    appointmentTypes: [
      APT.newPatient("offer_and_confirm"),
      APT.followUp("auto_book"),
      APT.annualPhysical("offer_and_confirm"),
      APT.telehealth("auto_book"),
      APT.chronicDisease("offer_and_confirm"),
      APT.procedureConsult("transfer_to_staff"),
    ],
  },

  // 3. Cardiology — specialist, confirm-heavy
  {
    providerId: "PRV-003",
    name: "Dr. Yuki Tanaka, MD",
    specialty: "Cardiology",
    npi: "3456789012",
    lastSyncedAt: recentSync(0, 9, 0),
    locations: [LOCATIONS.main, LOCATIONS.south],
    ehrScheduleSync: true,
    status: "active",
    statusOverrideReason: null,
    derivedAgentBookingStatus: "confirm_with_staff",
    appointmentTypes: [
      APT.newPatient("offer_and_confirm"),
      APT.followUp("offer_and_confirm"),
      APT.telehealth("offer_and_confirm"),
      APT.echodReview(),
      APT.procedureConsult("transfer_to_staff"),
      APT.chronicDisease("offer_and_confirm"),
    ],
  },

  // 4. Pediatrics — well-child and immunizations auto_book
  {
    providerId: "PRV-004",
    name: "Dr. Emily Rodriguez, MD",
    specialty: "Pediatrics",
    npi: "4567890123",
    lastSyncedAt: recentSync(2, 8, 45),
    locations: [LOCATIONS.north, LOCATIONS.main, LOCATIONS.telehealth],
    ehrScheduleSync: true,
    status: "active",
    statusOverrideReason: null,
    derivedAgentBookingStatus: "mixed",
    appointmentTypes: [
      APT.newPatient("offer_and_confirm"),
      APT.wellChild("auto_book"),
      APT.immunization(),
      APT.sportsPhysical(),
      APT.telehealth("auto_book"),
      APT.urgentCare(),
      APT.followUp("auto_book"),
    ],
  },

  // 5. Orthopedic Surgery — credentialing pending (temporarily disabled)
  {
    providerId: "PRV-005",
    name: "Dr. James Okafor, MD",
    specialty: "Orthopedic Surgery",
    npi: "5678901234",
    lastSyncedAt: recentSync(3, 11, 0),
    locations: [LOCATIONS.south, LOCATIONS.main],
    ehrScheduleSync: false,
    status: "temporarily_disabled",
    statusOverrideReason: "Credentialing pending — estimated completion May 20, 2026",
    derivedAgentBookingStatus: "disabled",
    appointmentTypes: [
      APT.newPatient("offer_and_confirm"),
      APT.followUp("offer_and_confirm"),
      APT.preOpConsult(),
      APT.postOpFollowUp(),
      APT.jointInjection(),
      APT.procedureConsult("transfer_to_staff"),
    ],
  },

  // 6. OB/GYN — prenatal auto_book, new patients confirm
  {
    providerId: "PRV-006",
    name: "Dr. Priya Nair, MD",
    specialty: "Obstetrics & Gynecology",
    npi: "6789012345",
    lastSyncedAt: recentSync(0, 7, 0),
    locations: [LOCATIONS.downtown, LOCATIONS.main, LOCATIONS.telehealth],
    ehrScheduleSync: true,
    status: "active",
    statusOverrideReason: null,
    derivedAgentBookingStatus: "mixed",
    appointmentTypes: [
      APT.newPatient("offer_and_confirm"),
      APT.followUp("auto_book"),
      APT.prenatal("auto_book"),
      APT.telehealth("auto_book"),
      APT.annualPhysical("auto_book"),
      APT.procedureConsult("transfer_to_staff"),
    ],
  },

  // 7. Family Medicine — high-volume, mostly auto_book
  {
    providerId: "PRV-007",
    name: "Dr. Thomas Chen, MD",
    specialty: "Family Medicine",
    npi: "7890123456",
    lastSyncedAt: recentSync(1, 6, 30),
    locations: [LOCATIONS.downtown, LOCATIONS.north],
    ehrScheduleSync: true,
    status: "active",
    statusOverrideReason: null,
    derivedAgentBookingStatus: "auto_book",
    appointmentTypes: [
      APT.followUp("auto_book"),
      APT.annualPhysical("auto_book"),
      APT.telehealth("auto_book"),
      APT.sportsPhysical(),
      APT.immunization(),
      APT.chronicDisease("auto_book"),
    ],
  },

  // 8. Family Medicine NP — all auto_book
  {
    providerId: "PRV-008",
    name: "Amara Diallo, NP",
    specialty: "Family Medicine",
    npi: "8901234567",
    lastSyncedAt: recentSync(0, 8, 0),
    locations: [LOCATIONS.north, LOCATIONS.telehealth],
    ehrScheduleSync: true,
    status: "active",
    statusOverrideReason: null,
    derivedAgentBookingStatus: "auto_book",
    appointmentTypes: [
      APT.followUp("auto_book"),
      APT.telehealth("auto_book"),
      APT.immunization(),
      APT.chronicDisease("auto_book"),
      APT.urgentCare(),
    ],
  },

  // 9. Dermatology — new patients confirm, procedures transfer
  {
    providerId: "PRV-009",
    name: "Dr. Robert Kim, MD",
    specialty: "Dermatology",
    npi: "9012345678",
    lastSyncedAt: recentSync(4, 9, 15),
    locations: [LOCATIONS.downtown, LOCATIONS.south],
    ehrScheduleSync: true,
    status: "active",
    statusOverrideReason: null,
    derivedAgentBookingStatus: "confirm_with_staff",
    appointmentTypes: [
      APT.newPatient("offer_and_confirm"),
      APT.followUp("offer_and_confirm"),
      APT.skinCheck("offer_and_confirm"),
      APT.biopsyConsult(),
      APT.telehealth("offer_and_confirm"),
    ],
  },

  // 10. Psychiatry — transfer-only for all sensitive visits
  {
    providerId: "PRV-010",
    name: "Dr. Fatima Al-Hassan, MD",
    specialty: "Psychiatry",
    npi: "0123456789",
    lastSyncedAt: recentSync(2, 10, 0),
    locations: [LOCATIONS.main, LOCATIONS.telehealth],
    ehrScheduleSync: true,
    status: "active",
    statusOverrideReason: null,
    derivedAgentBookingStatus: "transfer_only",
    appointmentTypes: [
      APT.initialPsych(),
      APT.medicationMgmt(),
      APT.mentalHealthCheckin(),
      APT.telehealth("transfer_to_staff"),
    ],
  },

  // 11. Gastroenterology — mixed
  {
    providerId: "PRV-011",
    name: "Dr. David Morales, MD",
    specialty: "Gastroenterology",
    npi: "1122334455",
    lastSyncedAt: recentSync(1, 8, 30),
    locations: [LOCATIONS.south, LOCATIONS.downtown],
    ehrScheduleSync: true,
    status: "active",
    statusOverrideReason: null,
    derivedAgentBookingStatus: "mixed",
    appointmentTypes: [
      APT.newPatient("offer_and_confirm"),
      APT.followUp("auto_book"),
      APT.colonoscopyConsult(),
      APT.telehealth("auto_book"),
      APT.procedureConsult("transfer_to_staff"),
      APT.chronicDisease("auto_book"),
    ],
  },

  // 12. Internal Medicine — inactive, EHR sync disabled
  {
    providerId: "PRV-012",
    name: "Dr. Lisa Kowalski, MD",
    specialty: "Internal Medicine",
    npi: "2233445566",
    lastSyncedAt: recentSync(7, 14, 0),
    locations: [LOCATIONS.main],
    ehrScheduleSync: false,
    status: "inactive",
    statusOverrideReason: "Provider no longer accepting new patients at this location",
    derivedAgentBookingStatus: "disabled",
    appointmentTypes: [
      APT.followUp("offer_and_confirm"),
      APT.telehealth("offer_and_confirm"),
      APT.chronicDisease("offer_and_confirm"),
    ],
  },

  // 13. Cardiology — high auto_book (established practice)
  {
    providerId: "PRV-013",
    name: "Dr. Raj Sharma, MD",
    specialty: "Cardiology",
    npi: "3344556677",
    lastSyncedAt: recentSync(0, 7, 45),
    locations: [LOCATIONS.main, LOCATIONS.downtown, LOCATIONS.telehealth],
    ehrScheduleSync: true,
    status: "active",
    statusOverrideReason: null,
    derivedAgentBookingStatus: "mixed",
    appointmentTypes: [
      APT.newPatient("offer_and_confirm"),
      APT.followUp("auto_book"),
      APT.telehealth("auto_book"),
      APT.echodReview(),
      APT.chronicDisease("auto_book"),
    ],
  },

  // 14. Pediatrics — on leave through end of month
  {
    providerId: "PRV-014",
    name: "Dr. Nina Johansson, MD",
    specialty: "Pediatrics",
    npi: "4455667788",
    lastSyncedAt: recentSync(5, 9, 0),
    locations: [LOCATIONS.north],
    ehrScheduleSync: true,
    status: "temporarily_disabled",
    statusOverrideReason: "On leave through May 31, 2026",
    derivedAgentBookingStatus: "disabled",
    appointmentTypes: [
      APT.wellChild("auto_book"),
      APT.immunization(),
      APT.newPatient("offer_and_confirm"),
      APT.followUp("auto_book"),
      APT.sportsPhysical(),
    ],
  },

  // 15. Orthopedic Surgery — post-op heavy, transfer for new
  {
    providerId: "PRV-015",
    name: "Dr. Keisha Washington, MD",
    specialty: "Orthopedic Surgery",
    npi: "5566778899",
    lastSyncedAt: recentSync(1, 11, 30),
    locations: [LOCATIONS.south, LOCATIONS.main],
    ehrScheduleSync: true,
    status: "active",
    statusOverrideReason: null,
    derivedAgentBookingStatus: "mixed",
    appointmentTypes: [
      APT.newPatient("transfer_to_staff"),
      APT.followUp("auto_book"),
      APT.preOpConsult(),
      APT.postOpFollowUp(),
      APT.jointInjection(),
      APT.procedureConsult("offer_and_confirm"),
    ],
  },

  // 16. Family Medicine — Spanish-speaking clinic, telehealth-first
  {
    providerId: "PRV-016",
    name: "Dr. Carmen Herrera, MD",
    specialty: "Family Medicine",
    npi: "6677889900",
    lastSyncedAt: recentSync(0, 8, 0),
    locations: [LOCATIONS.downtown, LOCATIONS.telehealth],
    ehrScheduleSync: true,
    status: "active",
    statusOverrideReason: null,
    derivedAgentBookingStatus: "auto_book",
    appointmentTypes: [
      APT.newPatient("offer_and_confirm"),
      APT.followUp("auto_book"),
      APT.annualPhysical("auto_book"),
      APT.telehealth("auto_book"),
      APT.chronicDisease("auto_book"),
      APT.immunization(),
    ],
  },

  // 17. Geriatrics — chronic disease focus, confirm for complex
  {
    providerId: "PRV-017",
    name: "Dr. Samuel Osei, MD",
    specialty: "Geriatrics",
    npi: "7788990011",
    lastSyncedAt: recentSync(3, 10, 30),
    locations: [LOCATIONS.main, LOCATIONS.south, LOCATIONS.telehealth],
    ehrScheduleSync: true,
    status: "active",
    statusOverrideReason: null,
    derivedAgentBookingStatus: "confirm_with_staff",
    appointmentTypes: [
      APT.newPatient("offer_and_confirm"),
      APT.followUp("offer_and_confirm"),
      APT.telehealth("offer_and_confirm"),
      APT.chronicDisease("offer_and_confirm"),
      APT.annualPhysical("offer_and_confirm"),
      APT.procedureConsult("transfer_to_staff"),
    ],
  },

  // 18. OB/GYN — second provider, mixed
  {
    providerId: "PRV-018",
    name: "Dr. Aisha Bangura, MD",
    specialty: "Obstetrics & Gynecology",
    npi: "8899001122",
    lastSyncedAt: recentSync(1, 7, 15),
    locations: [LOCATIONS.main, LOCATIONS.telehealth],
    ehrScheduleSync: true,
    status: "active",
    statusOverrideReason: null,
    derivedAgentBookingStatus: "mixed",
    appointmentTypes: [
      APT.newPatient("offer_and_confirm"),
      APT.prenatal("auto_book"),
      APT.followUp("auto_book"),
      APT.annualPhysical("auto_book"),
      APT.telehealth("auto_book"),
      APT.procedureConsult("transfer_to_staff"),
    ],
  },

  // 19. Endocrinology — diabetes management, mostly auto_book follow-ups
  {
    providerId: "PRV-019",
    name: "Dr. Wei Zhang, MD, PhD",
    specialty: "Endocrinology",
    npi: "9900112233",
    lastSyncedAt: recentSync(2, 9, 45),
    locations: [LOCATIONS.downtown, LOCATIONS.north],
    ehrScheduleSync: true,
    status: "active",
    statusOverrideReason: null,
    derivedAgentBookingStatus: "mixed",
    appointmentTypes: [
      APT.newPatient("offer_and_confirm"),
      APT.followUp("auto_book"),
      APT.telehealth("auto_book"),
      APT.chronicDisease("auto_book"),
      APT.procedureConsult("offer_and_confirm"),
    ],
  },

  // 20. Neurology — complex, mostly transfer or confirm
  {
    providerId: "PRV-020",
    name: "Dr. Ingrid Larsson, MD",
    specialty: "Neurology",
    npi: "0011223344",
    lastSyncedAt: recentSync(0, 8, 30),
    locations: [LOCATIONS.main, LOCATIONS.south],
    ehrScheduleSync: true,
    status: "active",
    statusOverrideReason: null,
    derivedAgentBookingStatus: "confirm_with_staff",
    appointmentTypes: [
      APT.newPatient("offer_and_confirm"),
      APT.followUp("offer_and_confirm"),
      APT.telehealth("offer_and_confirm"),
      APT.procedureConsult("transfer_to_staff"),
      APT.chronicDisease("offer_and_confirm"),
    ],
  },
];
