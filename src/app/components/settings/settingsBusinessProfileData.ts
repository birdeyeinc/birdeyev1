import type { SettingsBusinessRow } from "./settingsBusinessTableData";

export type ProfileFieldControl =
  | "text"
  | "textarea"
  | "url"
  | "email"
  | "tel"
  | "readOnlyLink"
  | "linkAction"
  | "checkbox"
  | "select"
  | "multiSelect"
  | "heading"
  | "number";

export interface ProfileField {
  label: string;
  value?: string;
  description?: string;
  placeholder?: string;
  maxLength?: number;
  control?: ProfileFieldControl;
  required?: boolean;
  options?: string[];
  checkboxLabel?: string;
  linkActionLabel?: string;
  subsection?: string;
  showAiHint?: boolean;
  /** Question / help icon on label (e.g. Yelp description). */
  showHelpIcon?: boolean;
}

export interface ProfileSection {
  title: string;
  fields: ProfileField[];
}

export interface HoursInterval {
  start: string;
  end: string;
}

export interface HoursWeeklyRow {
  dayKey: string;
  dayLabel: string;
  closed: boolean;
  intervals: HoursInterval[];
}

export interface HoursOfOperationSection {
  title: string;
  timeZone: string;
  timeZoneOptions: string[];
  businessStatus: string;
  businessStatusOptions: string[];
  openedOn: string;
  openedOnPlaceholder: string;
  regularMode: "open24" | "appointment" | "custom";
  weekly: HoursWeeklyRow[];
}

const H_SCOPE = "hours-of-operation";

export function seedHoursOfOperationValues(section: HoursOfOperationSection): Record<string, string> {
  const out: Record<string, string> = {
    [`${H_SCOPE}:timezone`]: section.timeZone,
    [`${H_SCOPE}:businessStatus`]: section.businessStatus,
    [`${H_SCOPE}:openedOn`]: section.openedOn,
    [`${H_SCOPE}:mode`]: section.regularMode,
  };
  for (const row of section.weekly) {
    out[`${H_SCOPE}:day:${row.dayKey}:closed`] = row.closed ? "true" : "false";
    row.intervals.forEach((int, i) => {
      out[`${H_SCOPE}:day:${row.dayKey}:int:${i}:start`] = int.start;
      out[`${H_SCOPE}:day:${row.dayKey}:int:${i}:end`] = int.end;
    });
  }
  return out;
}

/** Half-hour steps for hours-of-operation time Selects (US 12h labels). */
export const HOURS_TIME_OPTIONS: string[] = (() => {
  const out: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const d = new Date(2000, 0, 1, h, m);
      out.push(d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }));
    }
  }
  return out;
})();

/** Typed fields for **Business information** (production Birdeye reference). */
export type BusinessInformationField =
  | {
      id: "name";
      kind: "name";
      label: string;
      required: true;
      value: string;
      guidelineBefore: string;
      guidelineLinkText: string;
      guidelineHref: string;
    }
  | {
      id: "type";
      kind: "type";
      label: string;
      value: string;
      options: readonly [string, string];
    }
  | {
      id: "address";
      kind: "address";
      label: string;
      required: true;
      country: string;
      street: string;
      apt: string;
      city: string;
      state: string;
      zip: string;
      hideAddressInListing: boolean;
      serviceAtCustomerLocations: boolean;
      countryOptions: string[];
      /** When set and non-empty, state is a Select; otherwise a text input. */
      stateOptions?: string[];
      streetPlaceholder: string;
      aptPlaceholder: string;
      cityPlaceholder: string;
      statePlaceholder: string;
      zipPlaceholder: string;
      hideAddressLabel: string;
      serviceAtCustomerLabel: string;
    }
  | {
      id: "mapMarker";
      kind: "mapMarker";
      label: string;
      required: true;
      query: string;
      emptyMessage: string;
    }
  | {
      id: "mainPhone";
      kind: "mainPhone";
      label: string;
      value: string;
      description: string;
    }
  | {
      id: "email";
      kind: "email";
      label: string;
      value: string;
    }
  | {
      id: "website";
      kind: "website";
      label: string;
      value: string;
    }
  | {
      id: "category";
      kind: "category";
      label: string;
      intro: string;
      primaryLabel: string;
      primaryRequired: boolean;
      primaryValue: string;
      primaryOptions: string[];
      additionalLabel: string;
      additionalPlaceholder: string;
      additionalValue: string;
    }
  | {
      id: "description";
      kind: "description";
      label: string;
      value: string;
      maxLength: number;
      placeholder: string;
      showInfoIcon: boolean;
    }
  | {
      id: "gbp";
      kind: "gbpCheckbox";
      sectionHeading: string;
      checkboxLabel: string;
      checked: boolean;
    };

export interface BusinessInformationSection {
  title: string;
  fields: BusinessInformationField[];
}

/** Bare keys merged into `fieldValues` for the business information section (no section prefix). */
export function seedBusinessInformationValues(fields: BusinessInformationField[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of fields) {
    switch (f.kind) {
      case "name":
        out.name = f.value;
        break;
      case "type":
        out.type = f.value;
        break;
      case "address":
        out["address:country"] = f.country;
        out["address:street"] = f.street;
        out["address:apt"] = f.apt;
        out["address:city"] = f.city;
        out["address:state"] = f.state;
        out["address:zip"] = f.zip;
        out["address:hideListing"] = f.hideAddressInListing ? "true" : "false";
        out["address:serviceAtCustomer"] = f.serviceAtCustomerLocations ? "true" : "false";
        break;
      case "mapMarker":
        out["map:query"] = f.query;
        break;
      case "mainPhone":
        out.mainPhone = f.value;
        break;
      case "email":
        out.email = f.value;
        break;
      case "website":
        out.website = f.value;
        break;
      case "category":
        out["category:primary"] = f.primaryValue;
        out["category:additional"] = f.additionalValue;
        break;
      case "description":
        out.description = f.value;
        break;
      case "gbpCheckbox":
        out.gbp = f.checked ? "true" : "false";
        break;
      default:
        break;
    }
  }
  return out;
}

export interface MediaSpec {
  label: string;
  rules: string[];
  value?: string;
}

/** One row in the header field search; `fieldDomId` matches `data-field-id` on form rows. */
export interface BusinessProfileSearchHit {
  sectionKey: string;
  sectionTitle: string;
  fieldLabel: string;
  fieldDomId: string;
  haystack: string;
}

export function slugFieldDomPart(label: string): string {
  return label
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");
}

export function buildBusinessProfileSearchIndex(data: SettingsBusinessProfileData): BusinessProfileSearchHit[] {
  const hits: BusinessProfileSearchHit[] = [];

  const push = (sectionKey: string, sectionTitle: string, fieldDomId: string, fieldLabel: string, extraHay = "") => {
    const haystack = `${sectionTitle} ${fieldLabel} ${extraHay}`.toLowerCase().replaceAll(/\s+/g, " ").trim();
    hits.push({ sectionKey, sectionTitle, fieldLabel, fieldDomId, haystack });
  };

  const biKey = "business-information";
  const biTitle = data.businessInformation.title;
  for (const f of data.businessInformation.fields) {
    switch (f.kind) {
      case "name":
        push(biKey, biTitle, `${biKey}-${f.id}`, f.label);
        break;
      case "type":
        push(biKey, biTitle, `${biKey}-${f.id}`, f.label, f.options.join(" "));
        break;
      case "address":
        push(biKey, biTitle, `${biKey}-${f.id}`, f.label, "street city state zip country postal suite apartment");
        break;
      case "mapMarker":
        push(biKey, biTitle, `${biKey}-${f.id}`, f.label, "map location");
        break;
      case "mainPhone":
        push(biKey, biTitle, `${biKey}-${f.id}`, f.label, "phone");
        break;
      case "email":
        push(biKey, biTitle, `${biKey}-${f.id}`, f.label);
        break;
      case "website":
        push(biKey, biTitle, `${biKey}-${f.id}`, f.label, "url");
        break;
      case "category":
        push(biKey, biTitle, `${biKey}-${f.id}`, f.label, f.intro);
        push(biKey, biTitle, `${biKey}-${f.id}`, f.primaryLabel, "category google");
        push(biKey, biTitle, `${biKey}-${f.id}`, f.additionalLabel, "category");
        break;
      case "description":
        push(biKey, biTitle, `${biKey}-${f.id}`, f.label, "birdai");
        break;
      case "gbpCheckbox":
        push(biKey, biTitle, `${biKey}-${f.id}`, f.checkboxLabel, f.sectionHeading);
        break;
      default:
        break;
    }
  }

  const addProfileSection = (sectionKey: string, section: ProfileSection) => {
    for (const field of section.fields) {
      if (field.control === "heading") {
        push(sectionKey, section.title, `${sectionKey}-${slugFieldDomPart(field.label)}`, field.label);
        continue;
      }
      push(sectionKey, section.title, `${sectionKey}-${slugFieldDomPart(field.label)}`, field.label, field.description ?? "");
    }
  };

  const ho = data.hoursOfOperation;
  const hoKey = "hours-of-operation";
  push(hoKey, ho.title, `${hoKey}-timezone`, "Time zone");
  push(hoKey, ho.title, `${hoKey}-business-status`, "Business status");
  push(hoKey, ho.title, `${hoKey}-opened-on`, "Opened on");
  for (const row of ho.weekly) {
    push(hoKey, ho.title, `${hoKey}-${slugFieldDomPart(row.dayLabel)}`, row.dayLabel, "hours closed interval");
  }
  push(hoKey, ho.title, `${hoKey}-special-hours`, "Special hours");
  push(hoKey, ho.title, `${hoKey}-google-more-hours`, "More hours");
  push(hoKey, ho.title, `${hoKey}-apple-more-hours`, "More hours");
  addProfileSection("additional-information", data.additionalInformation);

  data.channelOverrides.forEach((section, index) => {
    addProfileSection(`channel-${index}`, section);
  });

  data.mediaGallery.forEach((media) => {
    push("media-gallery", "Media gallery", `media-gallery-${slugFieldDomPart(media.label)}`, media.label, media.rules.join(" "));
  });

  data.socialProfiles.forEach((s) => {
    push("social-profiles", "Social profiles", `social-profiles-${slugFieldDomPart(s.platform)}`, s.platform);
  });

  data.customFields.forEach((field) => {
    if (field.control === "heading") {
      push("custom-fields", "Custom fields", `custom-fields-${slugFieldDomPart(field.label)}`, field.label);
      return;
    }
    push("custom-fields", "Custom fields", `custom-fields-${slugFieldDomPart(field.label)}`, field.label);
  });

  return hits;
}

export interface SocialProfileField {
  platform: string;
  value?: string;
}

export interface SettingsBusinessProfileData {
  remainingFields: number;
  businessInformation: BusinessInformationSection;
  hoursOfOperation: HoursOfOperationSection;
  additionalInformation: ProfileSection;
  mediaGallery: MediaSpec[];
  channelOverrides: ProfileSection[];
  socialProfiles: SocialProfileField[];
  customFields: ProfileField[];
}

function websiteFromName(name: string): string {
  return `https://${name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/^-+|-+$/g, "")}.com`;
}


export function getSettingsBusinessProfileData(row: SettingsBusinessRow): SettingsBusinessProfileData {
  const sparse = row.status !== "Active";
  const city = row.location.split(",")[0]?.trim() ?? row.location;
  const state = row.location.split(",")[1]?.trim() ?? "CA";
  const typeDisplay = row.type === "Virtual location" ? "Provider" : row.type;

  return {
    remainingFields: sparse ? 14 : 6,
    businessInformation: {
      title: "Business information",
      fields: [
        {
          id: "name",
          kind: "name",
          label: "Name",
          required: true,
          value: row.businessName,
          guidelineBefore: "For guidelines to represent your business, ",
          guidelineLinkText: "click here",
          guidelineHref: "#",
        },
        {
          id: "type",
          kind: "type",
          label: "Type",
          value: typeDisplay,
          options: ["Physical location", "Provider"] as const,
        },
        {
          id: "address",
          kind: "address",
          label: "Address",
          required: true,
          country: sparse ? "" : "United States",
          street: sparse ? "" : "151 Main St",
          apt: "",
          city: sparse ? "" : city,
          state: sparse ? "" : state,
          zip: sparse ? "" : "94102",
          hideAddressInListing: false,
          serviceAtCustomerLocations: false,
          countryOptions: ["India", "United States", "United Kingdom", "Canada", "Australia"],
          stateOptions: sparse
            ? undefined
            : [
                "AL",
                "AK",
                "AZ",
                "AR",
                "CA",
                "CO",
                "CT",
                "DE",
                "FL",
                "GA",
                "California",
                "Colorado",
                "New York",
                "Texas",
              ],
          streetPlaceholder: "Street address",
          aptPlaceholder: "Apartment/Suite",
          cityPlaceholder: "City",
          statePlaceholder: "Select state",
          zipPlaceholder: "Postal code",
          hideAddressLabel: "Hide address in listing",
          serviceAtCustomerLabel: "We deliver or provide service at customer locations",
        },
        {
          id: "mapMarker",
          kind: "mapMarker",
          label: "Map marker",
          required: true,
          query: sparse ? "" : `${city}, ${state}`,
          emptyMessage: "No location found",
        },
        {
          id: "mainPhone",
          kind: "mainPhone",
          label: "Main phone number",
          value: sparse ? "" : "+1 (415) 555-0142",
          description:
            "We recommend you to put your local number. This will be the default number across all social listings.",
        },
        {
          id: "email",
          kind: "email",
          label: "Email",
          value: sparse ? "" : `hello@${row.businessName.toLowerCase().replaceAll(" ", "")}.com`,
        },
        {
          id: "website",
          kind: "website",
          label: "Website",
          value: sparse ? "" : websiteFromName(row.businessName),
        },
        {
          id: "category",
          kind: "category",
          label: "Category",
          intro: "Set your primary and additional categories (default for Google).",
          primaryLabel: "Primary category",
          primaryRequired: true,
          primaryValue: sparse ? "" : "Business reputation management",
          primaryOptions: [
            "American grocery store",
            "Business reputation management",
            "Restaurant",
            "Retail store",
            "Professional services",
          ],
          additionalLabel: "Additional categories",
          additionalPlaceholder: "Enter additional category",
          additionalValue: "",
        },
        {
          id: "description",
          kind: "description",
          label: "Business description",
          value: sparse
            ? ""
            : `${row.businessName} helps customers discover and engage with your brand across listings, reviews, and local channels.`,
          maxLength: 750,
          placeholder: "Write a description or generate one using BirdAI.",
          showInfoIcon: true,
        },
        {
          id: "gbp",
          kind: "gbpCheckbox",
          sectionHeading: "Update information on",
          checkboxLabel: "Your Google Business Profile",
          checked: !sparse,
        },
      ],
    },
    hoursOfOperation: {
      title: "Hours of operation",
      timeZone: row.timezone,
      timeZoneOptions: [
        "(GMT-08:00) Pacific Time",
        "(GMT-05:00) Eastern Time",
        "(GMT+05:30) Asia/Calcutta",
        row.timezone,
      ],
      businessStatus: row.status === "Inactive" ? "Closed" : "Open",
      businessStatusOptions: ["Open", "Closed", "Temporarily closed"],
      openedOn: sparse ? "" : "May 06, 2026",
      openedOnPlaceholder: "Choose date",
      regularMode: "custom",
      weekly: [
        {
          dayKey: "mon",
          dayLabel: "Monday",
          closed: false,
          intervals: [{ start: "9:00 AM", end: "6:00 PM" }],
        },
        {
          dayKey: "tue",
          dayLabel: "Tuesday",
          closed: false,
          intervals: [{ start: "9:00 AM", end: "6:00 PM" }],
        },
        {
          dayKey: "wed",
          dayLabel: "Wednesday",
          closed: false,
          intervals: [{ start: "9:00 AM", end: "6:00 PM" }],
        },
        {
          dayKey: "thu",
          dayLabel: "Thursday",
          closed: false,
          intervals: [{ start: "9:00 AM", end: "6:00 PM" }],
        },
        {
          dayKey: "fri",
          dayLabel: "Friday",
          closed: false,
          intervals: [{ start: "9:00 AM", end: "6:00 PM" }],
        },
        {
          dayKey: "sat",
          dayLabel: "Saturday",
          closed: sparse,
          intervals: sparse ? [{ start: "9:00 AM", end: "5:00 PM" }] : [{ start: "10:00 AM", end: "4:00 PM" }],
        },
        {
          dayKey: "sun",
          dayLabel: "Sunday",
          closed: true,
          intervals: [{ start: "9:00 AM", end: "5:00 PM" }],
        },
      ],
    },
    additionalInformation: {
      title: "Additional information",
      fields: [
        { label: "Year established", value: sparse ? undefined : "2017", placeholder: "Add opening year" },
        { label: "Languages", value: sparse ? undefined : "English, Spanish", placeholder: "English, Spanish, etc." },
        {
          label: "Keywords",
          value: sparse ? undefined : "local seo, reputation, engagement",
          control: "textarea",
          maxLength: 1000,
          placeholder: "Add keywords separated by comma",
          description:
            "Comma-separated keywords. Does not sync to Google Business Profile.",
        },
        {
          label: "Products",
          value: sparse ? undefined : "Platform subscription",
          control: "textarea",
          maxLength: 1000,
          placeholder: "Add products separated by comma",
          description: "Comma-separated products. Sync behavior depends on channel.",
        },
        {
          label: "Services",
          value: sparse ? undefined : "Listings, Reviews, Messaging",
          control: "textarea",
          maxLength: 1000,
          placeholder: "Add services separated by comma",
          description: "Comma-separated services. Sync behavior depends on channel.",
        },
        {
          label: "Payment types",
          value: sparse ? "" : "Card,ACH",
          description: "Select all the payment methods that your business accept.",
          placeholder: "Add the payment methods you accept",
          control: "multiSelect",
          options: [
            "Cash",
            "Card",
            "ACH",
            "Invoice",
            "Apple Pay",
            "Google Pay",
            "Check",
          ],
        },
        {
          label: "Additional payment types",
          value: sparse ? undefined : "Invoice",
          placeholder: "Add additional payment types",
          description: "Payment methods not listed above.",
        },
        {
          label: "Impressum",
          value: sparse ? undefined : "Available",
          control: "textarea",
          maxLength: 2000,
          placeholder: "Add Impressum",
          description: "Required in some regions (for example Austria, Germany, Switzerland).",
        },
        {
          label: "Local phone number",
          subsection: "Additional contact information",
          value: sparse ? undefined : "+1 (415) 555-0142",
          placeholder: "Enter local phone number",
          control: "tel",
        },
        {
          label: "Tollfree number",
          value: sparse ? undefined : "+1 (800) 555-0100",
          placeholder: "Enter toll free number",
          control: "tel",
        },
        {
          label: "iOS app url",
          subsection: "Apps",
          value: sparse ? undefined : "https://apps.apple.com/app/example",
          placeholder: "Enter iOS App URL",
          control: "url",
        },
        {
          label: "Android app url",
          value: sparse ? undefined : "https://play.google.com/store/apps/details?id=example",
          placeholder: "Enter Android App URL",
          control: "url",
        },
      ],
    },
    mediaGallery: [
      {
        label: "Logo",
        rules: ["Format: JPG or PNG", "Size: 10KB to 5MB", "Dimensions: 720 x 720 px"],
        value: sparse ? undefined : "Uploaded",
      },
      {
        label: "Cover photos - Microsite",
        rules: ["Format: JPG or PNG", "Size: 10KB to 5MB", "Dimensions: 1296 x 367 px"],
        value: sparse ? undefined : "Uploaded",
      },
      {
        label: "Cover photos - Google",
        rules: ["Format: JPG or PNG", "Size: 10KB to 5MB", "Dimensions: 1024 x 575 px", "Aspect Ratio: 16:9"],
        value: sparse ? undefined : "Uploaded",
      },
      {
        label: "Cover photos - Facebook",
        rules: ["Format: JPG or PNG", "Size: 10KB to 5MB", "Dimensions: 851 x 315 px", "Aspect Ratio: 2.70:1"],
        value: sparse ? undefined : "Uploaded",
      },
      {
        label: "Photo and video albums",
        rules: ["Photo: >=400px to <=3960px", "Video: MP4 up to 30 secs", "Video size: Up to 75MB"],
        value: sparse ? undefined : "12 photos, 2 videos",
      },
    ],
    channelOverrides: [
      {
        title: "Google business listing",
        fields: [
          { label: "Store id", value: sparse ? undefined : `store-${row.id}` },
          {
            label: "Google phone number",
            value: sparse ? undefined : "+1 (415) 555-0142",
            description: "This will override the main phone number for Google listing.",
          },
          {
            label: "Google override business description",
            value: sparse ? undefined : `${row.businessName} — Google listing description.`,
            control: "textarea",
            maxLength: 750,
            showAiHint: true,
            placeholder: "Write a description or generate one using BirdAI.",
            description: "This will override the default description listed for Google listing.",
          },
          {
            label: "Update information on",
            control: "checkbox",
            checkboxLabel: "Your Google Business Profile",
            value: sparse ? undefined : "true",
          },
          {
            label: "Google website override link",
            value: sparse ? undefined : websiteFromName(row.businessName),
            control: "url",
            description: "This will override the default website listed for Google listing.",
          },
          {
            label: "Appointment link",
            value: sparse ? undefined : `${websiteFromName(row.businessName)}/book`,
            control: "url",
            placeholder: "Enter appointment link",
            description: "Let customers make appointments by linking them to your appointments page.",
          },
          {
            label: "Reservation link",
            value: sparse ? undefined : `${websiteFromName(row.businessName)}/reserve`,
            control: "url",
            placeholder: "Enter reservation link",
            description: "Let customers reserve tables by linking them to your reservations page.",
          },
          {
            label: "Menu link",
            value: sparse ? undefined : `${websiteFromName(row.businessName)}/menu`,
            control: "url",
            placeholder: "Enter menu link",
            description: "Show customers what you serve by linking them to your menu.",
          },
          {
            label: "Order ahead link",
            value: sparse ? undefined : `${websiteFromName(row.businessName)}/order`,
            control: "url",
            placeholder: "Enter order ahead link",
            description: "Let customers place delivery and pick-up orders by linking them to your ordering page.",
          },
          {
            label: "WhatsApp Business link",
            value: sparse ? undefined : "",
            control: "url",
            placeholder: "Enter WhatsApp Business link",
            description: "Let customers message you on WhatsApp directly from your Google listing.",
          },
          {
            label: "Text message number",
            value: sparse ? undefined : "",
            placeholder: "Enter text message number",
            description: "Let customers reach you via text message directly from your Google listing.",
          },
        ],
      },
      {
        title: "Apple business listing",
        fields: [
          { label: "Apple business name", value: row.businessName, placeholder: "Enter business name" },
          {
            label: "Apple phone number",
            value: sparse ? undefined : "+1 (415) 555-0142",
            placeholder: "Enter phone number",
            description: "This will show on your Apple listing, replacing your primary phone number if present.",
          },
          {
            label: "Apple website override link",
            value: sparse ? undefined : websiteFromName(row.businessName),
            control: "url",
            placeholder: "Enter Apple override link",
            description: "This will override the default website listed for Apple listing.",
          },
        ],
      },
      {
        title: "Facebook listing",
        fields: [
          {
            label: "Facebook override business description",
            value: sparse ? undefined : "Location page description configured",
            control: "textarea",
            maxLength: 750,
            showAiHint: true,
            placeholder: "Write a description or generate one using BirdAI.",
          },
          { label: "Facebook phone number", value: sparse ? undefined : "+1 (415) 555-0142" },
          {
            label: "Facebook website override link",
            value: sparse ? undefined : websiteFromName(row.businessName),
            control: "url",
          },
        ],
      },
      {
        title: "Bing listing",
        fields: [
          {
            label: "Bing override business description",
            value: sparse ? undefined : "Sample Bing listing description.",
            control: "textarea",
            maxLength: 4096,
            showAiHint: true,
            showHelpIcon: true,
            placeholder: "Write a description or generate one using BirdAI.",
            description: "Overrides the default description for Bing.",
          },
          {
            label: "Bing phone number",
            value: sparse ? undefined : "+1 (415) 555-0142",
            description: "This will override the main phone number for Bing listing.",
          },
          {
            label: "Bing website override link",
            value: sparse ? undefined : websiteFromName(row.businessName),
            control: "url",
            placeholder: "Enter Bing override link",
            description: "This will override the default website listed for Bing listing.",
          },
        ],
      },
      {
        title: "Yelp listing",
        fields: [
          { label: "Yelp business name", value: row.businessName, placeholder: "Enter business name" },
          {
            label: "Yelp description",
            value: sparse ? undefined : "Sample Yelp listing copy for this location.",
            control: "textarea",
            maxLength: 1000,
            showAiHint: true,
            showHelpIcon: true,
            placeholder: "Write a description or generate one using BirdAI.",
            description: "Overrides the default description for Yelp.",
          },
          {
            label: "Yelp phone number",
            value: sparse ? undefined : "+1 (415) 555-0142",
            description: "This will override the main phone number for Yelp listing.",
          },
          { label: "Yelp website url", value: sparse ? undefined : websiteFromName(row.businessName), control: "url" },
        ],
      },
      {
        title: "Microsite listing",
        fields: [
          {
            label: "Microsite URL",
            control: "readOnlyLink",
            value: `https://birdeye.com/${row.businessName.toLowerCase().replaceAll(" ", "-")}-${row.id}`,
          },
          {
            label: "Microsite override business description",
            value: sparse ? undefined : `${row.businessName} microsite description configured`,
            control: "textarea",
            maxLength: 5000,
            showAiHint: true,
            showHelpIcon: true,
            placeholder: "Write a description or generate one using BirdAI.",
            description: "This will override the default description listed for Microsite listing.",
          },
        ],
      },
    ],
    socialProfiles: [
      { platform: "Google", value: sparse ? undefined : "https://www.google.com/maps/place/example" },
      { platform: "Facebook", value: sparse ? undefined : "https://www.facebook.com/example" },
      { platform: "X (Twitter)", value: sparse ? undefined : "https://x.com/example" },
      { platform: "YouTube", value: sparse ? undefined : "https://www.youtube.com/@example" },
      { platform: "LinkedIn", value: sparse ? undefined : "https://www.linkedin.com/company/example" },
      { platform: "Instagram", value: sparse ? undefined : "https://www.instagram.com/example" },
      { platform: "Pinterest", value: undefined },
      { platform: "BBB", value: undefined },
      { platform: "LendingTree", value: undefined },
    ],
    customFields: [
      {
        label: "Region manager",
        value: row.owner,
        placeholder: "Please enter the value of Region manager.",
      },
      {
        label: "Insurance provider",
        control: "select",
        options: ["Aetna", "Blue Cross", "Cigna", "UnitedHealthcare"],
        value: sparse ? undefined : "Aetna",
      },
      {
        label: "Medical conditions",
        control: "textarea",
        maxLength: 500,
        placeholder: "Please enter the value of Medical conditions.",
        value: sparse ? undefined : "None reported",
      },
      {
        label: "Gift card links",
        value: sparse ? undefined : `${websiteFromName(row.businessName)}/gift-cards`,
        control: "url",
        placeholder: "https://",
      },
      {
        label: "Area code",
        control: "number",
        value: sparse ? undefined : "415",
        placeholder: "Please enter the value of Area code.",
      },
      { label: "Location node id", value: `node-${row.id}`, placeholder: "Please enter the value of Location node id." },
      {
        label: "Coverage regions",
        control: "multiSelect",
        options: ["West", "Central", "East", "South"],
        value: sparse ? "" : "West,East",
        placeholder: "Select regions",
      },
      {
        label: "Client notes",
        control: "textarea",
        maxLength: 2000,
        placeholder: "Please enter the value of Client notes.",
        value: sparse ? undefined : "Long-form notes for this tenant.",
      },
    ],
  };
}
