export const OPERATORS = {
    BLANK: {
        label: "is blank",
        value: "blank",
        viewValue: "is_blank"
    },
    NOT_BLANK: {
        label: "is not blank",
        value: "not_blank",
        viewValue: "is_not_blank"
    },
    EQUALS_TO: {
        label: "equals to",
        value: "equals_to"
    },
    NOT_EQUALS_TO: {
        label: "not equals to",
        value: "not_equals_to"
    },
    STARTS_WITH: {
        label: "starts with",
        value: "starts_with"
    },
    LESS_THAN: {
        label: "is less than",
        value: "less_than",
        viewValue: "is_less_than"
    },
    LESS_THAN_EQUAL_TO: {
        label: "is less than equal to",
        value: "less_than_equal_to",
        viewValue: "is_less_than_equal_to"
    },
    GREATER_THAN: {
        label: "is greater than",
        value: "greater_than",
        viewValue: "is_greater_than"
    },
    GREATER_THAN_EQUAL_TO: {
        label: "is greater than equal to",
        value: "greater_than_equal_to",
        viewValue: "is_greater_than_equal_to"
    },
    BEFORE: {
        label: "before",
        value: "before"
    },
    AFTER: {
        label: "after",
        value: "after"
    },
    BETWEEN: {
        label: "between",
        value: "between"
    },
    IN: {
        label: "in",
        value: "in"
    },
    NOT_IN: {
        label: "not in",
        value: "not_in"
    },
    IN_ANY_OF: {
        label: "in any of",
        value: "in"//in
    },
    IN_NONE_OF: {
        label: "in none of",
        value: "not_in"//not_in
    },
    IS_ANY_OF: {
        label: "is any of",
        value: "is_any_of"//in
    },
    IS_NONE_OF: {
        label: "is none of",
        value: "is_none_of"//not_in
    },
    IS_BETWEEN: {
        label: "is between",
        value: "is_between"
    },
    CONTAINS: {
        label: "contains",
        value: "contains"
    },
    CONTAINS_ANY_OF: {
        label: "contains any of",
        value: "contains_any_of"
    },
    DOES_NOT_CONTAINS_ANY_OF: {
        label: "does not contains any of",
        value: "not_contains_any_of"
    },
    DOES_NOT_CONTAINS: {
        label: "does not contains",
        value: "not_contains"
    },
    STARTS_WITH_ANY_OF: {
        label: "starts with any of",
        value: "starts_with_any_of"
    },
    ENDS_WITH_ANY_OF: {
        label: "ends with any of",
        value: "ends_with_any_of"
    },
    DOES_NOT_STARTS_WITH: {
        label: "does not starts with",
        value: "not_starts_with"
    },
    IS_EQUAL_TO: {
        label: "is equal to",
        value: "equals_to"
    },
    NOT_BETWEEN: {
        label: "not between",
        value: "not_between"
    },
    IS: {
        label: "is",
        value: "is"
    },
    IS_NOT: {
        label: "is not",
        value: "is_not"
    },
    IS_EMPTY: {
        label: "is empty",
        value: "is_empty"
    },
    IS_NOT_EMPTY: {
        label: "is not empty",
        value: "is_not_empty"
    },
    IS_NOT_EQUAL_TO: {
        label: "is not equal to",
        value: "is_not_equal_to"
    },
    IS_LESS_THAN: {
        label: "is less than",
        value: "is_less_than"
    },
    IS_LESS_THAN_OR_EQUAL_TO: {
        label: "is less than or equal to",
        value: "is_less_than_or_equal_to"
    },
    IS_GREATER_THAN: {
        label: "is greater than",
        value: "is_greater_than"
    },
    IS_GREATER_THAN_OR_EQUAL_TO: {
        label: "is greater than or equal to",
        value: "is_greater_than_or_equal_to"
    },
    IS_BEFORE: {
        label: "is before",
        value: "is_before"
    },
    IS_AFTER: {
        label: "is after",
        value: "is_after"
    }
};

export const FIELD_DATA_TYPES = {
    DATE: {
        label: "Date",
        value: "date"
    },
    YESNO: {
        label: "Yes or no",
        value: "yesno"
    },
    CURRENCY: {
        label: "Currency",
        value: "currency"
    },
    NUMBER: {
        label: "Number",
        value: "number"
    },
    TEXT: {
        label: "Single value",
        value: "text"
    },
    TAG: {
        label: "Tags",
        value: "number"
    },
    TEXT_MULTI: {
        label: "Text multi",
        value: "text_multi"
    },
    NUMBER_SINGLE: {
        label: "Number single",
        value: "number_single"
    },
    DATE_TIME: {
        label: "Date time",
        value: "datetime"
    },
    TIME: {
        label: "Time",
        value: "time"
    },
    LIST_TEXT: {
        label: "List text",
        value: "list_text"
    },
    REVIEW: {
        label: "Wrote a review",
        value: "list_text"
    },
    URL: {
        label: "Url",
        value: "text"
    },
    DROPDOWN_SINGLE: {
        label: "Single select",
        value: "dropdown_single"
    },
    DROPDOWN_MULTI: {
        label: "Multi select",
        value: "dropdown_multi"
    }
};

export const LOGICAL_OPERATORS = {
    AND: "AND",
    OR: "OR"
};

export const DELIMETER = ";;;";

export const VALIDATION_ERRORS = {
    CURRENCY: "Invalid data format for <column name>. Allowed formats are $200.00, USD 200, 200, -$200.00,\n -USD 200, -200",
    DATE: "Invalid date format for <column name>. Allowed formats are MM/dd/YYYY or MM-dd-YYYY",
    NUMBER: "Please enter a valid input for <column name>",
    YESNO: "Invalid data provided for <column name>. Allowed values are 0, 1, yes, no, true, false, on or off",
    TEXT: "Enter a valid value",
    EMPTY_VALUE: "Please enter a value",
    EMPTY_FIELD: "Select a field",
    EMPTY_CONDITION: "Select a condition",
    LIST_TEXT: "Please enter a valid input for <column name>"
};

export const FIELD_NAME = {
    REVIEW_SOURCE: "Review source",
    REVIEW_RATING: "Review rating",
    REFERRED_THROUGH: "Referred through",
    SURVEY: "Survey",
    ASSIGNEE: "Assignee",
    SPECIALIST: "Specialist",
    APPOINTMENT_TYPE: "Service",
    APPOINTMENT_STATUS: "Appointment status",
    SECONDARY_FILTER: "Secondary filter",
    APPOINTMENT_TIME: "Appointment time",
    SOURCE: "Source",
    CUSTOMER_TYPE: "Customer type",
    FORM_STATUS: "Form fill status",
    DAY_OF_THE_WEEK: "Day of the week",
    WROTE_REVIEW: "Wrote a review"
};

export const CUSTOMER_TYPE = {
    NEW: {
        label: "New",
        value: "new"
    },
    EXISTING: {
        label: "Existing",
        value: "existing"
    }
};

export const WEEK_DAYS = {
    SUNDAY: {
        label: "Sunday",
        value: "sunday"
    },
    MONDAY: {
        label: "Monday",
        value: "monday"
    },
    TUESDAY: {
        label: "Tuesday",
        value: "tuesday"
    },
    WEDNESDAY: {
        label: "Wednesday",
        value: "wednesday"
    },
    THURSDAY: {
        label: "Thursday",
        value: "thursday"
    },
    FRIDAY: {
        label: "Friday",
        value: "friday"
    },
    SATURDAY: {
        label: "Saturday",
        value: "saturday"
    }
};
export const CAMPAIGN_TYPE = {
    RR: "review_request",
    CX: "cx_request",
    ONLY_CX: "cx",
    PROMOTION: "promotional",
    SURVEY: "survey_request",
    REFER: "referral",
    REFERRAL_REQUEST_SMS: "referral_sms",
    APPOINTMENT_REMINDER: "appointment_reminder",
    REMINDER: "reminder",
    APPOINTMENT_RECALL: "appointment_recall",
    RECALL: "recall",
    APPOINTMENT_FORM: "appointment_form",
    FORM: "form",
    TEXTING: "texting",
    SPLIT: "split_automation"
};
export const TRIGGER_TYPE = {
    CONTACT_ADDED: {
        value: "contact_added",
        label: "Contact is added",
        type: "C"
    },
    LEAD_CONVERTED_TO_CONTACT: {
        value: "lead_converted_to_contact",
        label: "Lead is converted to contact",
        type: "C"
    },
    REVIEW_WRITTEN: {
        value: "review_written",
        label: "Review is written",
        type: "R"
    },
    SURVEY_COMPLETED: {
        value: "survey_completed",
        label: "Survey completed",
        type: "S"
    },
    REFERRAL_LEAD_GENERATED: {
        value: "referral_lead_generated",
        label: "Lead generated",
        type: "RF"
    },
    PAYMENT_COMPLETED: {
        value: "payment_completed",
        label: "Payment completed",
        type: "P"
    },
    PAYMENT_FAILED: {
        value: "payment_failed",
        label: "Payment failed",
        type: "P"
    },
    PAYMENT_REFUNDED: {
        value: "payment_refunded",
        label: "Payment refunded",
        type: "P"
    },
    INBOX_CONVERSATION_CLOSED: {
        value: "inbox_conversation_closed",
        label: "Inbox conversation closed",
        type: "I"
    },
    BEFORE_APPOINTMENT_DATE: {
        value: "before_appointment_date",
        label: "Before appointment date",
        type: "A"
    },
    APPOINTMENT_RECALL: {
        value: "appointment_recall",
        label: "Appointment recall",
        type: "A"
    },
    APPOINTMENT_BOOKED: {
        value: "appointment_booked",
        label: "Appointment is booked",
        type: "A"
    },
    APPOINTMENT_CANCELED: {
        value: "appointment_canceled",
        label: "Appointment is canceled",
        type: "A"
    },
    APPOINTMENT_COMPLETED: {
        value: "appointment_completed",
        label: "Appointment is completed",
        type: "A"
    },
    APPOINTMENT_MISSED: {
        value: "appointment_missed",
        label: "Appointment is missed",
        type: "A"
    },
    CONTACT_EVENT: {
        value: "contact_event",
        label: "Contact's Event",
        type: "C"
    }
};