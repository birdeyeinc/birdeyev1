// ─── Field types ──────────────────────────────────────────────────────────────

export type IntakeFieldType =
  | "short_text"
  | "long_text"
  | "email"
  | "phone"
  | "date"
  | "dropdown"
  | "radio"
  | "checkbox"
  | "yes_no"
  | "rating"
  | "nps"
  | "pain_scale"
  | "file_upload"
  | "photo_capture"
  | "signature"
  | "consent"
  | "matrix"
  | "section_header"
  | "divider";

export interface IntakeFormField {
  id: string;
  type: IntakeFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  helpText?: string;
  options?: string[];
  consentText?: string;
  matrixRows?: string[];
  matrixCols?: string[];
  maxStars?: 3 | 5 | 10;
  allowedFileTypes?: string[];
  maxFiles?: number;
}

export interface IntakeFormStep {
  id: string;
  title: string;
  fields: IntakeFormField[];
}

export type IntakeFormStatus = "draft" | "active" | "inactive";

export interface IntakeForm {
  id: string;
  name: string;
  description?: string;
  location: string;
  fieldCount: number;
  submissionCount: number;
  completionRate: number;
  status: IntakeFormStatus;
  createdBy: string;
  createdOn: string;
  steps: IntakeFormStep[];
}

export interface IntakeFormSubmission {
  id: string;
  formId: string;
  patientName: string;
  submittedOn: string;
  completionTimeSec: number;
  status: "complete" | "partial";
  responses: IntakeFormFieldResponse[];
}

export interface IntakeFormFieldResponse {
  fieldId: string;
  fieldLabel: string;
  fieldType: IntakeFieldType;
  value: string | string[] | boolean | null;
}

export interface IntakeFormTemplate {
  id: string;
  name: string;
  description: string;
  category: "general" | "dental" | "mental_health" | "pediatric" | "specialty";
  createdBy: string;
  stepCount: number;
  fieldCount: number;
  steps: IntakeFormStep[];
  thumbnailVariant:
    | "demographic"
    | "medical"
    | "consent"
    | "insurance"
    | "feedback"
    | "pediatric"
    | "mental_health"
    | "ros";
}

// ─── L2 nav key ───────────────────────────────────────────────────────────────

export const INTAKE_FORMS_L2_KEY = "Resource/Intake forms";
export const INTAKE_FORMS_PATH_PREFIX = "/appointments/resource/intake-forms/";

// ─── Mock forms ───────────────────────────────────────────────────────────────

const DEMOGRAPHICS_STEP: IntakeFormStep = {
  id: "s-demo",
  title: "Patient information",
  fields: [
    { id: "f-name",    type: "short_text", label: "Full name",          placeholder: "First and last name", required: true },
    { id: "f-dob",     type: "date",       label: "Date of birth",                                          required: true },
    { id: "f-gender",  type: "radio",      label: "Gender identity",    options: ["Male", "Female", "Non-binary", "Prefer not to say"], required: false },
    { id: "f-phone",   type: "phone",      label: "Phone number",       placeholder: "(555) 000-0000",       required: true },
    { id: "f-email",   type: "email",      label: "Email address",      placeholder: "you@example.com",      required: true },
    { id: "f-addr",    type: "short_text", label: "Home address",       placeholder: "Street, City, State, ZIP", required: false },
    { id: "f-lang",    type: "dropdown",   label: "Preferred language", options: ["English", "Spanish", "French", "Mandarin", "Hindi", "Arabic", "Other"], required: false },
    { id: "f-ec-name", type: "short_text", label: "Emergency contact name",     placeholder: "Full name",   required: false },
    { id: "f-ec-rel",  type: "dropdown",   label: "Relationship",       options: ["Spouse", "Parent", "Child", "Sibling", "Friend", "Other"], required: false },
    { id: "f-ec-ph",   type: "phone",      label: "Emergency contact phone",    placeholder: "(555) 000-0000", required: false },
  ],
};

const INSURANCE_STEP: IntakeFormStep = {
  id: "s-ins",
  title: "Insurance",
  fields: [
    { id: "f-ins-hdr",    type: "section_header", label: "Primary insurance", required: false },
    { id: "f-ins-name",   type: "short_text",      label: "Insurance provider",   placeholder: "e.g. Blue Cross Blue Shield", required: true },
    { id: "f-ins-id",     type: "short_text",      label: "Member ID",            placeholder: "Policy / member number",      required: true },
    { id: "f-ins-grp",    type: "short_text",      label: "Group number",         placeholder: "Group number",                required: false },
    { id: "f-ins-sub",    type: "short_text",      label: "Subscriber name",      placeholder: "Name on the policy",          required: true },
    { id: "f-ins-rel",    type: "dropdown",         label: "Subscriber relationship", options: ["Self", "Spouse", "Child", "Other"], required: true },
    { id: "f-ins-card",   type: "photo_capture",   label: "Insurance card (front)", required: false },
    { id: "f-ins2-hdr",   type: "section_header",  label: "Secondary insurance (optional)", required: false },
    { id: "f-ins2-name",  type: "short_text",      label: "Secondary insurance provider", placeholder: "Leave blank if none", required: false },
    { id: "f-ins2-id",    type: "short_text",      label: "Secondary member ID",          placeholder: "Policy / member number", required: false },
  ],
};

const MEDICAL_HISTORY_STEP: IntakeFormStep = {
  id: "s-med",
  title: "Medical history",
  fields: [
    { id: "f-med-allergy", type: "long_text",   label: "Allergies",          placeholder: "List any medication, food, or environmental allergies (or 'None')", required: true },
    { id: "f-med-meds",    type: "long_text",   label: "Current medications", placeholder: "Name, dosage, and frequency (or 'None')",                          required: true },
    { id: "f-med-cond",    type: "checkbox",    label: "Current medical conditions", options: ["Hypertension", "Diabetes", "Asthma", "Heart disease", "Cancer", "Thyroid disorder", "Arthritis", "Depression / Anxiety", "Other"], required: false },
    { id: "f-med-surg",    type: "long_text",   label: "Previous surgeries or hospitalizations", placeholder: "Describe with approximate dates (or 'None')", required: false },
    { id: "f-fam-hdr",     type: "section_header", label: "Family history",  required: false },
    { id: "f-fam-hist",    type: "matrix",      label: "Family medical history",
      matrixRows: ["Heart disease", "Diabetes", "Cancer", "Hypertension", "Mental illness", "Stroke"],
      matrixCols: ["Parent", "Sibling", "Grandparent", "Unknown"],
      required: false },
    { id: "f-social-hdr",  type: "section_header", label: "Social history", required: false },
    { id: "f-smoke",       type: "radio",       label: "Smoking status",     options: ["Never", "Former smoker", "Current smoker"], required: false },
    { id: "f-alcohol",     type: "dropdown",    label: "Alcohol use",        options: ["None", "Occasional (1–2/week)", "Moderate (3–7/week)", "Heavy (8+/week)"], required: false },
  ],
};

const CONSENT_STEP: IntakeFormStep = {
  id: "s-consent",
  title: "Consent & authorizations",
  fields: [
    { id: "f-hipaa",  type: "consent",   label: "HIPAA Notice of Privacy Practices",
      consentText: "I acknowledge that I have received, reviewed, and understand the Notice of Privacy Practices. I understand that this notice describes how my health information may be used and disclosed and how I can access this information. This notice has been provided to me as required by the HIPAA Privacy Rule (45 CFR § 164.520).",
      required: true },
    { id: "f-sig-hipaa", type: "signature", label: "Signature — HIPAA acknowledgment", required: true },
    { id: "f-tx",     type: "consent",   label: "Consent to treatment",
      consentText: "I consent to and authorize the provision of medical care, treatment, and procedures as deemed necessary by the healthcare providers at this practice. I understand that I have the right to ask questions about my treatment and to refuse treatment.",
      required: true },
    { id: "f-fin",    type: "consent",   label: "Financial responsibility",
      consentText: "I agree to be responsible for all charges not covered by my insurance, including co-pays, deductibles, and non-covered services. I authorize the practice to bill my insurance company on my behalf.",
      required: true },
    { id: "f-sig-fin",   type: "signature", label: "Signature — financial responsibility", required: true },
  ],
};

export const MOCK_FORMS: IntakeForm[] = [
  {
    id: "if1",
    name: "Patient General Intake",
    description: "Complete new patient intake covering demographics, insurance, medical history, and consent.",
    location: "All locations",
    fieldCount: 34,
    submissionCount: 142,
    completionRate: 94,
    status: "active",
    createdBy: "Balaji K",
    createdOn: "2026-04-15",
    steps: [DEMOGRAPHICS_STEP, INSURANCE_STEP, MEDICAL_HISTORY_STEP, CONSENT_STEP],
  },
  {
    id: "if2",
    name: "Cardiology New Patient",
    description: "Cardiac-specific intake with cardiovascular history and stress screening.",
    location: "Heart & Vascular Center – Austin",
    fieldCount: 18,
    submissionCount: 38,
    completionRate: 88,
    status: "active",
    createdBy: "Naveen Suravarpu",
    createdOn: "2026-04-10",
    steps: [
      DEMOGRAPHICS_STEP,
      {
        id: "s-cardio",
        title: "Cardiovascular history",
        fields: [
          { id: "f-cp",     type: "yes_no",    label: "Have you ever experienced chest pain or pressure?",     required: true },
          { id: "f-sob",    type: "yes_no",    label: "Do you experience shortness of breath with activity?",  required: true },
          { id: "f-pain",   type: "pain_scale",label: "Current chest discomfort level",                        required: false },
          { id: "f-hx",     type: "checkbox",  label: "Cardiac history", options: ["Heart attack", "Heart failure", "Arrhythmia", "Pacemaker / ICD", "Prior cardiac surgery", "None"], required: true },
          { id: "f-meds-c", type: "long_text", label: "Cardiac medications", placeholder: "Name and dosage",   required: false },
        ],
      },
      CONSENT_STEP,
    ],
  },
  {
    id: "if3",
    name: "Mental Health Intake",
    description: "Behavioral health intake with PHQ-9, GAD-7, and safety screening.",
    location: "Behavioral Wellness – South Campus",
    fieldCount: 22,
    submissionCount: 27,
    completionRate: 91,
    status: "active",
    createdBy: "Manav Subramanian",
    createdOn: "2026-03-28",
    steps: [
      DEMOGRAPHICS_STEP,
      {
        id: "s-mh",
        title: "Mental health history",
        fields: [
          { id: "f-phq9",  type: "matrix",   label: "PHQ-9 — Over the last 2 weeks, how often have you been bothered by:",
            matrixRows: ["Little interest or pleasure in doing things", "Feeling down, depressed, or hopeless", "Trouble falling or staying asleep, or sleeping too much", "Feeling tired or having little energy", "Poor appetite or overeating", "Feeling bad about yourself", "Trouble concentrating", "Moving or speaking slowly or being fidgety", "Thoughts that you would be better off dead"],
            matrixCols: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
            required: true },
          { id: "f-gad7",  type: "matrix",   label: "GAD-7 — Over the last 2 weeks, how often have you been bothered by:",
            matrixRows: ["Feeling nervous, anxious, or on edge", "Not being able to stop or control worrying", "Worrying too much about different things", "Trouble relaxing", "Being so restless it's hard to sit still", "Becoming easily annoyed or irritable", "Feeling afraid something awful might happen"],
            matrixCols: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
            required: true },
          { id: "f-si",    type: "yes_no",    label: "In the past 2 weeks, have you had thoughts of harming yourself?", required: true },
          { id: "f-psych-hx", type: "long_text", label: "Previous mental health diagnoses or treatment", placeholder: "Describe any prior diagnoses, therapy, or psychiatric medications", required: false },
        ],
      },
      CONSENT_STEP,
    ],
  },
  {
    id: "if4",
    name: "OB/GYN Wellness",
    description: "Annual wellness visit intake for OB/GYN patients.",
    location: "2 locations",
    fieldCount: 14,
    submissionCount: 0,
    completionRate: 0,
    status: "draft",
    createdBy: "Vaishali Grover",
    createdOn: "2026-04-22",
    steps: [DEMOGRAPHICS_STEP, INSURANCE_STEP],
  },
  {
    id: "if5",
    name: "Post-Visit Feedback",
    description: "Short feedback form sent after each appointment.",
    location: "All locations",
    fieldCount: 5,
    submissionCount: 203,
    completionRate: 79,
    status: "active",
    createdBy: "Balaji K",
    createdOn: "2026-03-01",
    steps: [
      {
        id: "s-fb",
        title: "Your experience",
        fields: [
          { id: "f-rating",  type: "rating",     label: "How would you rate your visit overall?", maxStars: 5,  required: true },
          { id: "f-nps",     type: "nps",         label: "How likely are you to recommend us to a friend or family member?", required: true },
          { id: "f-like",    type: "long_text",   label: "What did you like most?",  placeholder: "Tell us what went well…", required: false },
          { id: "f-improve", type: "long_text",   label: "What could we improve?",   placeholder: "Any suggestions…",        required: false },
          { id: "f-fb-con",  type: "yes_no",      label: "May we contact you about your feedback?", required: false },
        ],
      },
    ],
  },
  {
    id: "if6",
    name: "Telehealth Screening",
    description: "Pre-visit screening for telehealth appointments.",
    location: "4 locations",
    fieldCount: 9,
    submissionCount: 61,
    completionRate: 83,
    status: "inactive",
    createdBy: "Priya Nair",
    createdOn: "2026-01-12",
    steps: [
      DEMOGRAPHICS_STEP,
      {
        id: "s-tele",
        title: "Telehealth readiness",
        fields: [
          { id: "f-device",  type: "dropdown",  label: "Device you will use", options: ["Smartphone", "Tablet", "Laptop", "Desktop"], required: true },
          { id: "f-reason",  type: "long_text", label: "Reason for today's visit", placeholder: "Briefly describe your concern…", required: true },
          { id: "f-urgent",  type: "yes_no",    label: "Is this an emergency situation?", required: true },
        ],
      },
    ],
  },
];

// ─── Mock submissions (for "Patient General Intake") ─────────────────────────

export const MOCK_SUBMISSIONS: IntakeFormSubmission[] = [
  {
    id: "sub1",
    formId: "if1",
    patientName: "Sarah M. Park",
    submittedOn: "2026-05-08T09:32:00Z",
    completionTimeSec: 454,
    status: "complete",
    responses: [
      { fieldId: "f-name",     fieldLabel: "Full name",          fieldType: "short_text", value: "Sarah M. Park" },
      { fieldId: "f-dob",      fieldLabel: "Date of birth",      fieldType: "date",       value: "1988-03-03" },
      { fieldId: "f-gender",   fieldLabel: "Gender identity",    fieldType: "radio",      value: "Female" },
      { fieldId: "f-phone",    fieldLabel: "Phone number",       fieldType: "phone",      value: "(512) 555-0142" },
      { fieldId: "f-email",    fieldLabel: "Email address",      fieldType: "email",      value: "sarah.park@email.com" },
      { fieldId: "f-ins-name", fieldLabel: "Insurance provider", fieldType: "short_text", value: "Blue Cross Blue Shield" },
      { fieldId: "f-ins-id",   fieldLabel: "Member ID",          fieldType: "short_text", value: "XYZ123456789" },
      { fieldId: "f-med-allergy", fieldLabel: "Allergies",       fieldType: "long_text",  value: "Penicillin (severe), Shellfish" },
      { fieldId: "f-med-meds",    fieldLabel: "Current medications", fieldType: "long_text", value: "Lisinopril 10mg daily, Metformin 500mg twice daily" },
      { fieldId: "f-med-cond",    fieldLabel: "Current medical conditions", fieldType: "checkbox", value: ["Hypertension", "Diabetes"] },
      { fieldId: "f-hipaa",    fieldLabel: "HIPAA acknowledgment", fieldType: "consent",  value: true },
      { fieldId: "f-tx",       fieldLabel: "Consent to treatment", fieldType: "consent", value: true },
      { fieldId: "f-fin",      fieldLabel: "Financial responsibility", fieldType: "consent", value: true },
    ],
  },
  {
    id: "sub2",
    formId: "if1",
    patientName: "James T. Okafor",
    submittedOn: "2026-05-07T14:18:00Z",
    completionTimeSec: 372,
    status: "complete",
    responses: [
      { fieldId: "f-name",  fieldLabel: "Full name",      fieldType: "short_text", value: "James T. Okafor" },
      { fieldId: "f-dob",   fieldLabel: "Date of birth",  fieldType: "date",       value: "1975-11-22" },
      { fieldId: "f-phone", fieldLabel: "Phone number",   fieldType: "phone",      value: "(737) 555-0284" },
      { fieldId: "f-email", fieldLabel: "Email address",  fieldType: "email",      value: "j.okafor@email.com" },
      { fieldId: "f-ins-name", fieldLabel: "Insurance provider", fieldType: "short_text", value: "Aetna" },
      { fieldId: "f-ins-id",   fieldLabel: "Member ID",   fieldType: "short_text", value: "AET9876543" },
      { fieldId: "f-med-allergy", fieldLabel: "Allergies", fieldType: "long_text", value: "None known" },
      { fieldId: "f-hipaa", fieldLabel: "HIPAA acknowledgment", fieldType: "consent", value: true },
    ],
  },
  {
    id: "sub3",
    formId: "if1",
    patientName: "Ana R. Delgado",
    submittedOn: "2026-05-07T10:05:00Z",
    completionTimeSec: 721,
    status: "partial",
    responses: [
      { fieldId: "f-name",  fieldLabel: "Full name",      fieldType: "short_text", value: "Ana R. Delgado" },
      { fieldId: "f-dob",   fieldLabel: "Date of birth",  fieldType: "date",       value: "1992-06-15" },
      { fieldId: "f-phone", fieldLabel: "Phone number",   fieldType: "phone",      value: "(512) 555-0391" },
      { fieldId: "f-email", fieldLabel: "Email address",  fieldType: "email",      value: "ana.delgado@email.com" },
    ],
  },
  {
    id: "sub4",
    formId: "if1",
    patientName: "Marcus J. Webb",
    submittedOn: "2026-05-06T16:44:00Z",
    completionTimeSec: 509,
    status: "complete",
    responses: [
      { fieldId: "f-name",  fieldLabel: "Full name",     fieldType: "short_text", value: "Marcus J. Webb" },
      { fieldId: "f-dob",   fieldLabel: "Date of birth", fieldType: "date",       value: "1968-09-04" },
      { fieldId: "f-phone", fieldLabel: "Phone number",  fieldType: "phone",      value: "(512) 555-0017" },
      { fieldId: "f-email", fieldLabel: "Email address", fieldType: "email",      value: "marcus.webb@email.com" },
      { fieldId: "f-ins-name", fieldLabel: "Insurance provider", fieldType: "short_text", value: "UnitedHealth" },
      { fieldId: "f-med-allergy", fieldLabel: "Allergies", fieldType: "long_text", value: "Sulfa drugs (rash)" },
      { fieldId: "f-med-cond", fieldLabel: "Current medical conditions", fieldType: "checkbox", value: ["Heart disease", "Hypertension"] },
      { fieldId: "f-hipaa", fieldLabel: "HIPAA acknowledgment", fieldType: "consent", value: true },
      { fieldId: "f-tx",    fieldLabel: "Consent to treatment", fieldType: "consent", value: true },
      { fieldId: "f-fin",   fieldLabel: "Financial responsibility", fieldType: "consent", value: true },
    ],
  },
  {
    id: "sub5",
    formId: "if1",
    patientName: "Emily C. Harrison",
    submittedOn: "2026-05-06T11:22:00Z",
    completionTimeSec: 398,
    status: "complete",
    responses: [
      { fieldId: "f-name",  fieldLabel: "Full name",     fieldType: "short_text", value: "Emily C. Harrison" },
      { fieldId: "f-dob",   fieldLabel: "Date of birth", fieldType: "date",       value: "2001-02-28" },
      { fieldId: "f-gender",fieldLabel: "Gender identity",fieldType: "radio",     value: "Female" },
      { fieldId: "f-phone", fieldLabel: "Phone number",  fieldType: "phone",      value: "(512) 555-0763" },
      { fieldId: "f-email", fieldLabel: "Email address", fieldType: "email",      value: "emily.h@email.com" },
      { fieldId: "f-ins-name", fieldLabel: "Insurance provider", fieldType: "short_text", value: "Cigna" },
      { fieldId: "f-med-allergy", fieldLabel: "Allergies", fieldType: "long_text", value: "None" },
      { fieldId: "f-hipaa", fieldLabel: "HIPAA acknowledgment", fieldType: "consent", value: true },
      { fieldId: "f-tx",    fieldLabel: "Consent to treatment", fieldType: "consent", value: true },
    ],
  },
];

// ─── Template library ─────────────────────────────────────────────────────────

export const MOCK_TEMPLATES: IntakeFormTemplate[] = [
  {
    id: "tpl-blank",
    name: "Blank",
    description: "Start from scratch with an empty canvas.",
    category: "general",
    createdBy: "System",
    stepCount: 1,
    fieldCount: 0,
    thumbnailVariant: "demographic",
    steps: [{ id: "s1", title: "Page 1", fields: [] }],
  },
  {
    id: "tpl-demo",
    name: "Patient demographics",
    description: "Standard patient info: name, DOB, contact details, emergency contact.",
    category: "general",
    createdBy: "System",
    stepCount: 1,
    fieldCount: 10,
    thumbnailVariant: "demographic",
    steps: [DEMOGRAPHICS_STEP],
  },
  {
    id: "tpl-med",
    name: "Medical history",
    description: "Medications, allergies, conditions, surgical and family history.",
    category: "general",
    createdBy: "System",
    stepCount: 1,
    fieldCount: 9,
    thumbnailVariant: "medical",
    steps: [MEDICAL_HISTORY_STEP],
  },
  {
    id: "tpl-ins",
    name: "Insurance verification",
    description: "Primary and secondary insurance fields with card photo capture.",
    category: "general",
    createdBy: "System",
    stepCount: 1,
    fieldCount: 10,
    thumbnailVariant: "insurance",
    steps: [INSURANCE_STEP],
  },
  {
    id: "tpl-consent",
    name: "New patient consent",
    description: "HIPAA NPP acknowledgment, treatment consent, and financial responsibility — all with e-signature.",
    category: "general",
    createdBy: "System",
    stepCount: 1,
    fieldCount: 5,
    thumbnailVariant: "consent",
    steps: [CONSENT_STEP],
  },
  {
    id: "tpl-ros",
    name: "Review of systems",
    description: "14-system ROS matrix — Constitutional, Eyes, ENT, Cardiovascular, and more.",
    category: "general",
    createdBy: "System",
    stepCount: 1,
    fieldCount: 1,
    thumbnailVariant: "ros",
    steps: [
      {
        id: "s-ros",
        title: "Review of systems",
        fields: [
          { id: "f-ros", type: "matrix", label: "Review of systems — check any symptoms you have experienced in the past 30 days",
            matrixRows: ["Constitutional (fatigue, fever, weight change)", "Eyes (vision changes, pain)", "ENT (hearing, congestion, sore throat)", "Cardiovascular (chest pain, palpitations)", "Respiratory (cough, shortness of breath)", "Gastrointestinal (nausea, abdominal pain)", "Genitourinary (urgency, frequency)", "Musculoskeletal (joint pain, weakness)", "Skin (rash, itching)", "Neurological (headache, numbness)", "Psychiatric (mood, sleep, anxiety)", "Endocrine (temperature sensitivity, fatigue)", "Hematologic (easy bruising, bleeding)", "Allergic / Immunologic (allergies, frequent infections)"],
            matrixCols: ["Yes", "No"],
            required: true },
        ],
      },
    ],
  },
  {
    id: "tpl-new-patient",
    name: "New patient (complete)",
    description: "Full 4-step intake: demographics → insurance → medical history → consent.",
    category: "general",
    createdBy: "System",
    stepCount: 4,
    fieldCount: 34,
    thumbnailVariant: "demographic",
    steps: [DEMOGRAPHICS_STEP, INSURANCE_STEP, MEDICAL_HISTORY_STEP, CONSENT_STEP],
  },
  {
    id: "tpl-peds",
    name: "Pediatric intake",
    description: "3-step pediatric form: patient & guardian info, developmental history, immunizations.",
    category: "pediatric",
    createdBy: "System",
    stepCount: 3,
    fieldCount: 18,
    thumbnailVariant: "pediatric",
    steps: [
      {
        id: "s-peds-demo",
        title: "Patient & guardian",
        fields: [
          { id: "fp-name",    type: "short_text", label: "Child's full name",           required: true },
          { id: "fp-dob",     type: "date",        label: "Date of birth",                required: true },
          { id: "fp-gender",  type: "radio",       label: "Sex assigned at birth", options: ["Male", "Female", "Other"], required: false },
          { id: "fp-par1",    type: "short_text",  label: "Parent / guardian name",       required: true },
          { id: "fp-rel",     type: "dropdown",    label: "Relationship", options: ["Mother", "Father", "Legal guardian", "Other"], required: true },
          { id: "fp-phone",   type: "phone",       label: "Parent phone",                 required: true },
          { id: "fp-email",   type: "email",       label: "Parent email",                 required: true },
        ],
      },
      {
        id: "s-peds-hx",
        title: "Health history",
        fields: [
          { id: "fp-birth",   type: "radio",    label: "Delivery method", options: ["Vaginal", "C-section", "Unknown"], required: false },
          { id: "fp-wt",      type: "short_text", label: "Birth weight",  placeholder: "e.g. 7 lbs 4 oz",              required: false },
          { id: "fp-dev",     type: "long_text",  label: "Developmental milestones",  placeholder: "Any concerns about development, walking, talking, etc.", required: false },
          { id: "fp-allergy", type: "long_text",  label: "Allergies",                 placeholder: "Food, medication, environmental (or 'None')",            required: true },
          { id: "fp-meds",    type: "long_text",  label: "Current medications",       placeholder: "Name and dosage (or 'None')",                            required: true },
        ],
      },
      {
        id: "s-peds-imm",
        title: "Immunizations & consent",
        fields: [
          { id: "fp-vax",     type: "file_upload", label: "Immunization record", allowedFileTypes: ["pdf", "jpg", "png"], maxFiles: 2, required: false },
          { id: "fp-hipaa",   type: "consent",     label: "HIPAA Notice of Privacy Practices",
            consentText: "I acknowledge receipt of the Notice of Privacy Practices and authorize treatment for the minor named above.",
            required: true },
          { id: "fp-sig",     type: "signature",   label: "Parent / guardian signature", required: true },
        ],
      },
    ],
  },
  {
    id: "tpl-mh",
    name: "Mental health intake",
    description: "3-step behavioral health intake with PHQ-9, GAD-7, and safety screening.",
    category: "mental_health",
    createdBy: "System",
    stepCount: 3,
    fieldCount: 22,
    thumbnailVariant: "mental_health",
    steps: [
      DEMOGRAPHICS_STEP,
      MOCK_FORMS[2].steps[1], // reuse cardiology mental health step
      CONSENT_STEP,
    ],
  },
  {
    id: "tpl-feedback",
    name: "Post-visit feedback",
    description: "5-question satisfaction survey with star rating and NPS.",
    category: "general",
    createdBy: "System",
    stepCount: 1,
    fieldCount: 5,
    thumbnailVariant: "feedback",
    steps: MOCK_FORMS[4].steps,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) +
    " · " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m} min ${s} sec` : `${s} sec`;
}

export function getFormTotalFields(form: IntakeForm | IntakeFormTemplate): number {
  return form.steps.flatMap((s) => s.fields).length;
}
