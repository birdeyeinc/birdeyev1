export const Const = {
    REVIEW: "review",
    REFERRAL: "referral",
    RECOMMEND: "recommend",
    SENTIMENT: "sentiment",
    SUBJECT: "subject",
    HEADING: "heading",
    MESSAGE: "message",
    CX_EMAIL: "cx_email",
    CX_SMS: "cx_sms",
    QUESTION: "question",
    OPTION: "option",
    REVIEW_REQUEST_SMS: "review_request_sms",
    REVIEW_REQUEST_EMAIL: "review_request_email",
    APPOINTMENT_REMINDER_SMS: "appointment_reminder_sms",
    APPOINTMENT_REMINDER_EMAIL: "appointment_reminder",
    APPOINTMENT_RECALL_SMS: "appointment_recall_sms",
    APPOINTMENT_RECALL_EMAIL: "appointment_recall",
    APPOINTMENT_FORM_SMS: "appointment_form_sms",
    APPOINTMENT_FORM_EMAIL: "appointment_form",
    PROMOTION_EMAIL: "promotion_email",
    CUSTOM_SMS: "promotion_sms",
    SURVEY_EMAIL: "survey_email",
    SURVEY_SMS: "survey_sms",
    SHARE_REVIEW_EMAIL: "review_referral",
    CUSTOM_URL: "custom_url",
    FEEDBACK: "feedback",
    EMPTY: "empty",
    MIN_MAX: "min_max",
    EMPTY_OR_VALID_URL: "empty_or_valid_url",
    EMPTY_OR_VALID_URL_OR_TELEPHONE: "empty_or_valid_url_or_telephone",
    VALID_URL: "valid_url",
    VALID_URL_OR_TOKEN: "valid_url_or_token",
    CUSTOM_IMAGE: "custom",
    COLOR_IMAGE: "color",
    BACKGROUND_IMAGE: "image",
    POSITIVE_LABEL: "positive_label",
    NEUTRAL_LABEL: "neutral_label",
    NEGATIVE_LABEL: "negative_label",
    YES_LABEL: "yes_label",
    NO_LABEL: "no_label",
    NPS: "nps",
    YES_NO: "yes_no",
    SENTIMENT_FEEDBACK: "sentiment",
    FIVE_STAR: "star",
    GENERAL_EMAIL_ID: "general-email",
    GENERAL_SMS_ID: "general-sms",
    REVIEW_EMAIL_ID: "review-email",
    REVIEW_SMS_ID: "review-sms",
    RECOMMEND_ID: "recommend",
    NOT_RECOMMEND_ID: "non-recommend",
    SENTIMENT_CHECK_ID: "sentiment-check",
    FEEDBACK_ID: "feedback",
    SEND_REMINDER_ID: "send-reminder",
    CONTAINS: "contains-text",
    THANKYOU: "thankyou",
    STATIC_LOC_STR: "This is an example of how your template will look based on the selected location.",
    REFERRAL_EMAIL: "referral_email",
    REFERRAL_REQUEST_EMAIL: "referral_email",
    REFERRAL_SMS: "referral_sms",
    REFERRAL_REQUEST_SMS: "referral_sms",
    REFERRAL_EMAIL_ID: "referral-email",
    REFERRAL_SMS_ID: "referral-sms",
    REFERRALMESSAGE: "referralmessage",
    REFERRALFORM: "referralform",
    UNSAVED_HEADER: "Unsaved changes",
    UNSAVED_MESSAGE: "You haven’t saved your changes. Are you sure you want to leave this page?",
    UNSAVED_NOTEXT: "Cancel",
    UNSAVED_OKTEXT: "Leave without saving",
    CAMPAIGN_INFO_HEAD1: "Text messages will be sent to contacts between 8 AM and 8 PM, based on their respective time zones. This rule applies to both campaigns and automations.",
    CAMPAIGN_INFO_HEAD2: "Communication sent via Quick Send or Inbox will not be impacted.",
    CAMPAIGN_INFO_HEAD3: "Reminder emails don’t count towards the sent count or frequency limit.",
    VALID_ANALYTICS: "valid-analytics",
    CONFIRMATION: "confirmation",
    CANCELLATION: "cancellation",
    DEFAULT_SPECIALIST_VALUE: "Provider",
    APPOINTMENTFORM: "appointmentform",
    FORMURL: "formurl",
    MORE_THAN_ONE_URL: "moreThanOneUrl",
    EDIT: "edit",
    VIEW: "view",
    NO_ACCESS: "no_access",
    WROTE_A_REVIEW: "Wrote a review",
    TEXT: "sms",
    EMAIL: "email",
    WHATSAPP_MARKETING: "whatsapp_marketing",
    WHATSAPP_UTILITY: "whatsapp_utility",
    WHATSAPP_AUTHENTICATION: "whatsapp_authentication"
};

export const TEMPLATES_TABS = [
    {
        label: "Text",
        value: "text"
    },
    {
        label: "Email",
        value: "email"
    }
];

export const TEMPLATESLIST_VIEW = {
    TEMPLATES: "templates",
    MESSENGER: "messenger",
    QUICKSEND: "quick-send",
    CREATE_CAMPAIGN: "create_campaign"
};

export const CUSTOM_VALUES_TYPE = {
    LIST_TEXT: "list_text"
};

export const CAMPAIGN_TYPE_SETTINGS = {
    IRRESPECTIVE:"IRRESPECTIVE_OF_CAMPAIGN_TYPE",
    PER_CAMPAIGN:"PER_CAMPAIGN_TYPE",
    FOR_EACH: "SHARED_CAMPAIGN_TYPE"
};

export const SETTINGS_LOCATION_OPTIONS = [
    { label: "Per location", value: "false" },
    { label: "Irrespective of location", value: "true" }
];

export const SETTINGS_CAMPAIGN_OPTIONS = [
    { label: "For each campaign type", value: CAMPAIGN_TYPE_SETTINGS.FOR_EACH },
    { label: "Per campaign type", value: CAMPAIGN_TYPE_SETTINGS.PER_CAMPAIGN },
    { label: "Irrespective of campaign type", value: CAMPAIGN_TYPE_SETTINGS.IRRESPECTIVE }
];

export const SETTINGS_DAYS_OPTIONS = [{ "label": "1 day", "value": 1 }, { "label": "2 days", "value": 2 }, {
    "label": "3 days",
    "value": 3
}, { "label": "4 days", "value": 4 }, { "label": "5 days", "value": 5 }, {
    "label": "6 days",
    "value": 6
}, { "label": "7 days", "value": 7 }, { "label": "8 days", "value": 8 }, {
    "label": "9 days",
    "value": 9
}, { "label": "10 days", "value": 10 }, { "label": "11 days", "value": 11 }, {
    "label": "12 days",
    "value": 12
}, { "label": "13 days", "value": 13 }, { "label": "14 days", "value": 14 }, {
    "label": "21 days",
    "value": 21
}, {
    "label": "30 days",
    "value": 30
}, { "label": "60 days", "value": 60 }, { "label": "90 days", "value": 90 }, {
    "label": "180 days",
    "value": 180
}, {
    "label": "365 days",
    "value": 365
}];

export const COMMUNICATION_RESTRICTIONS_OPTIONS = [
    { label: "Per survey", value: "PER_SURVEY" },
    { label: "Across all surveys", value: "ACROSS_ALL_SURVEYS" }
];
