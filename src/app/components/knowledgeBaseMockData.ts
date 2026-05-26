/** Used by the Inbox L2 nav (section label = "Resources"). */
export const KNOWLEDGE_BASE_L2_KEY = "Resources/Knowledge base";
/** Used by the Appointments L2 nav (section label = "Resource", singular). */
export const APPOINTMENTS_KB_L2_KEY = "Resource/Knowledge base";

export type KbSyncStatus = "synced" | "in-progress" | "failed";

export interface KbLinkRow {
  id: string;
  url: string;
  location: string;
  status: KbSyncStatus;
  lastSynced: string;
  addedOn: string;
}

export interface KbFileRow {
  id: string;
  name: string;
  status: "uploaded";
  location: string;
  uploadedOn: string;
}

// ─── Links — Aspen Dental healthcare references ───────────────────────────────

export const KB_LINK_ROWS: KbLinkRow[] = [
  { id: "l1",  url: "aspendental.com/services/teeth-cleaning",           location: "All locations",          status: "synced", lastSynced: "May 31, 2026", addedOn: "May 01, 2026" },
  { id: "l2",  url: "aspendental.com/services/dental-implants",          location: "All locations",          status: "synced", lastSynced: "May 31, 2026", addedOn: "May 01, 2026" },
  { id: "l3",  url: "aspendental.com/services/teeth-whitening",          location: "All locations",          status: "synced", lastSynced: "May 31, 2026", addedOn: "May 01, 2026" },
  { id: "l4",  url: "aspendental.com/services/orthodontics",             location: "All locations",          status: "synced", lastSynced: "May 31, 2026", addedOn: "May 02, 2026" },
  { id: "l5",  url: "aspendental.com/services/emergency-dental-care",    location: "All locations",          status: "synced", lastSynced: "May 31, 2026", addedOn: "May 02, 2026" },
  { id: "l6",  url: "aspendental.com/patient-resources/insurance",       location: "All locations",          status: "synced", lastSynced: "May 31, 2026", addedOn: "May 02, 2026" },
  { id: "l7",  url: "aspendental.com/patient-resources/financing",       location: "All locations",          status: "synced", lastSynced: "May 31, 2026", addedOn: "May 03, 2026" },
  { id: "l8",  url: "aspendental.com/patient-resources/faq",             location: "All locations",          status: "synced", lastSynced: "May 31, 2026", addedOn: "May 03, 2026" },
  { id: "l9",  url: "aspendental.com/locations/austin-tx",               location: "Austin, TX",             status: "synced", lastSynced: "May 31, 2026", addedOn: "May 04, 2026" },
  { id: "l10", url: "aspendental.com/locations/round-rock-tx",           location: "Round Rock, TX",         status: "synced", lastSynced: "May 31, 2026", addedOn: "May 04, 2026" },
  { id: "l11", url: "aspendental.com/locations/cedar-park-tx",           location: "Cedar Park, TX",         status: "synced", lastSynced: "May 31, 2026", addedOn: "May 05, 2026" },
  { id: "l12", url: "aspendental.com/blog/oral-hygiene-tips",            location: "All locations",          status: "synced", lastSynced: "May 31, 2026", addedOn: "May 05, 2026" },
  { id: "l13", url: "aspendental.com/blog/what-to-expect-first-visit",   location: "All locations",          status: "synced", lastSynced: "May 31, 2026", addedOn: "May 06, 2026" },
  { id: "l14", url: "aspendental.com/services/dentures",                 location: "All locations",          status: "synced", lastSynced: "May 31, 2026", addedOn: "May 06, 2026" },
  { id: "l15", url: "aspendental.com/services/root-canal",               location: "All locations",          status: "synced", lastSynced: "May 31, 2026", addedOn: "May 07, 2026" },
];

// ─── Files — Healthcare document names ───────────────────────────────────────

export const KB_FILE_ROWS: KbFileRow[] = [
  { id: "f1",  name: "Patient Intake Form – New Patient Registration.pdf",          status: "uploaded", location: "All locations",  uploadedOn: "May 07, 2026" },
  { id: "f2",  name: "Medical History Questionnaire – Adult.pdf",                   status: "uploaded", location: "All locations",  uploadedOn: "May 07, 2026" },
  { id: "f3",  name: "HIPAA Privacy Notice & Acknowledgment.pdf",                   status: "uploaded", location: "All locations",  uploadedOn: "May 07, 2026" },
  { id: "f4",  name: "Dental Treatment Consent Form.pdf",                           status: "uploaded", location: "All locations",  uploadedOn: "May 06, 2026" },
  { id: "f5",  name: "Insurance Verification Checklist.pdf",                        status: "uploaded", location: "All locations",  uploadedOn: "May 06, 2026" },
  { id: "f6",  name: "Post-Extraction Care Instructions.pdf",                       status: "uploaded", location: "All locations",  uploadedOn: "May 06, 2026" },
  { id: "f7",  name: "Root Canal Post-Op Instructions.pdf",                         status: "uploaded", location: "All locations",  uploadedOn: "May 05, 2026" },
  { id: "f8",  name: "Teeth Whitening Consent & Aftercare Guide.pdf",               status: "uploaded", location: "All locations",  uploadedOn: "May 05, 2026" },
  { id: "f9",  name: "Orthodontics Treatment Plan Overview.pdf",                    status: "uploaded", location: "All locations",  uploadedOn: "May 05, 2026" },
  { id: "f10", name: "Implant Surgery Pre-Op & Post-Op Guide.pdf",                  status: "uploaded", location: "All locations",  uploadedOn: "May 04, 2026" },
  { id: "f11", name: "Pediatric Dental Intake Form.pdf",                            status: "uploaded", location: "All locations",  uploadedOn: "May 04, 2026" },
  { id: "f12", name: "Financial Policy & Payment Agreement.pdf",                    status: "uploaded", location: "All locations",  uploadedOn: "May 04, 2026" },
  { id: "f13", name: "CareCredit & Financing Options Summary.pdf",                  status: "uploaded", location: "All locations",  uploadedOn: "May 03, 2026" },
  { id: "f14", name: "Antibiotic Pre-Medication Protocol – Cardiac Risk.pdf",       status: "uploaded", location: "All locations",  uploadedOn: "May 03, 2026" },
  { id: "f15", name: "Emergency Dental Visit – Triage Guidelines.pdf",              status: "uploaded", location: "All locations",  uploadedOn: "May 03, 2026" },
  { id: "f16", name: "Denture Care & Maintenance Guide.pdf",                        status: "uploaded", location: "All locations",  uploadedOn: "May 02, 2026" },
  { id: "f17", name: "Periodontal Disease Treatment Protocol.pdf",                  status: "uploaded", location: "All locations",  uploadedOn: "May 02, 2026" },
  { id: "f18", name: "COVID-19 Safety & Infection Control Policy.pdf",              status: "uploaded", location: "All locations",  uploadedOn: "May 02, 2026" },
  { id: "f19", name: "Staff Clinical Handbook – Updated May 2026.pdf",              status: "uploaded", location: "All locations",  uploadedOn: "May 01, 2026" },
  { id: "f20", name: "Appointment Scheduling & Cancellation Policy.pdf",            status: "uploaded", location: "All locations",  uploadedOn: "May 01, 2026" },
  { id: "f21", name: "Patient Satisfaction Survey Template.pdf",                    status: "uploaded", location: "All locations",  uploadedOn: "May 01, 2026" },
];
