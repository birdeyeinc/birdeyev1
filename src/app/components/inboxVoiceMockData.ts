export const INBOX_VOICE_SETTINGS_L2_KEY = "Settings/Voice";

export type VoiceUseCase =
  | "Conversational"
  | "Narration"
  | "Educational"
  | "Social media"
  | "Advertisement"
  | "Characters";

export type VoiceGender = "Male" | "Female" | "Neutral";
export type VoiceAge    = "Young" | "Middle aged" | "Old";
export type VoiceType   = "community" | "instant-clone" | "voice-design" | "professional-clone";

export type VoiceRow = {
  id: string;
  name: string;
  description: string;
  language: string;
  accent: string;
  flagEmoji: string;
  useCase: VoiceUseCase;
  gender: VoiceGender;
  ageCategory: VoiceAge;
  voiceType: VoiceType;
  addedOn: string;
  userCount: number;
  avatarColor: string;
  avatarImage?: string;
  usedByAgents?: string[];
  saved: boolean;
};

export type VoiceSettings = {
  stability: number;       // 0–100
  similarity: number;      // 0–100
  style: number;           // 0–100
  speed: number;           // 0.25–4.0, default 1.0
  speakerBoost: boolean;
};

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  stability: 50,
  similarity: 75,
  style: 0,
  speed: 1.0,
  speakerBoost: true,
};

export const VOICE_ROWS: VoiceRow[] = [
  {
    id: "v1",
    name: "RClayton",
    description: "Clear, Polished and Direct — Professional 45-year-old female voice",
    language: "English",
    accent: "American",
    flagEmoji: "🇺🇸",
    useCase: "Educational",
    gender: "Female",
    ageCategory: "Middle aged",
    voiceType: "community",
    addedOn: "Nov 09, 2025",
    userCount: 194,
    avatarColor: "#2563eb",
    avatarImage: "https://randomuser.me/api/portraits/women/44.jpg",
    usedByAgents: ["AI Receptionist"],
    saved: false,
  },
  {
    id: "v2",
    name: "Jessi",
    description: "Friendly, Smooth, and Soft — A pleasant mid-20s American female voice",
    language: "English",
    accent: "American",
    flagEmoji: "🇺🇸",
    useCase: "Narration",
    gender: "Female",
    ageCategory: "Young",
    voiceType: "community",
    addedOn: "May 14, 2024",
    userCount: 22600,
    avatarColor: "#16a34a",
    avatarImage: "https://randomuser.me/api/portraits/women/22.jpg",
    saved: true,
  },
  {
    id: "v3",
    name: "Lynda",
    description: "Bright, Inviting, and Clear — A middle-aged woman with a soft Scottish accent",
    language: "English",
    accent: "Scottish",
    flagEmoji: "🇬🇧",
    useCase: "Educational",
    gender: "Female",
    ageCategory: "Middle aged",
    voiceType: "instant-clone",
    addedOn: "Apr 22, 2024",
    userCount: 4000,
    avatarColor: "#0891b2",
    avatarImage: "https://randomuser.me/api/portraits/women/68.jpg",
    saved: false,
  },
  {
    id: "v4",
    name: "Lauren – Medical",
    description: "Medical Customer Care Agent — Warm, professional healthcare voice",
    language: "English",
    accent: "American",
    flagEmoji: "🇺🇸",
    useCase: "Conversational",
    gender: "Female",
    ageCategory: "Middle aged",
    voiceType: "professional-clone",
    addedOn: "Jun 03, 2024",
    userCount: 1400,
    avatarColor: "#7c3aed",
    avatarImage: "https://randomuser.me/api/portraits/women/52.jpg",
    usedByAgents: ["AI Receptionist", "Front desk"],
    saved: true,
  },
  {
    id: "v5",
    name: "Lauren – Friendly",
    description: "Friendly Customer Care Agent — Friendly & Engaging Customer Care voice",
    language: "English",
    accent: "American",
    flagEmoji: "🇺🇸",
    useCase: "Conversational",
    gender: "Female",
    ageCategory: "Young",
    voiceType: "voice-design",
    addedOn: "Mar 18, 2024",
    userCount: 2300,
    avatarColor: "#9333ea",
    avatarImage: "https://randomuser.me/api/portraits/women/18.jpg",
    saved: false,
  },
  {
    id: "v6",
    name: "Kaylin",
    description: "Bright & Energetic — A young and energetic voice with clarity and warmth",
    language: "English",
    accent: "American",
    flagEmoji: "🇺🇸",
    useCase: "Social media",
    gender: "Female",
    ageCategory: "Young",
    voiceType: "community",
    addedOn: "Nov 09, 2025",
    userCount: 6300,
    avatarColor: "#ea580c",
    avatarImage: "https://randomuser.me/api/portraits/women/29.jpg",
    saved: false,
  },
  {
    id: "v7",
    name: "Giselle Marie",
    description: "Positive and Engaging — Millennial American female with vibrant energy",
    language: "English",
    accent: "American",
    flagEmoji: "🇺🇸",
    useCase: "Advertisement",
    gender: "Female",
    ageCategory: "Young",
    voiceType: "instant-clone",
    addedOn: "May 12, 2025",
    userCount: 14800,
    avatarColor: "#db2777",
    avatarImage: "https://randomuser.me/api/portraits/women/36.jpg",
    saved: false,
  },
  {
    id: "v8",
    name: "Sophie",
    description: "Sparky and Social — A light and energetic voice of a young female creator",
    language: "English",
    accent: "American",
    flagEmoji: "🇺🇸",
    useCase: "Conversational",
    gender: "Female",
    ageCategory: "Young",
    voiceType: "community",
    addedOn: "Feb 28, 2024",
    userCount: 1900,
    avatarColor: "#0284c7",
    avatarImage: "https://randomuser.me/api/portraits/women/14.jpg",
    saved: false,
  },
  {
    id: "v9",
    name: "Valory B",
    description: "Natural Human Customer Care Agent — Warm, humanlike British tone",
    language: "English",
    accent: "British",
    flagEmoji: "🇬🇧",
    useCase: "Conversational",
    gender: "Female",
    ageCategory: "Middle aged",
    voiceType: "voice-design",
    addedOn: "Jan 15, 2024",
    userCount: 1600,
    avatarColor: "#059669",
    avatarImage: "https://randomuser.me/api/portraits/women/56.jpg",
    saved: false,
  },
  {
    id: "v10",
    name: "Ash",
    description: "Conversational, Kind and Bright — Warm and approachable everyday voice",
    language: "English",
    accent: "American",
    flagEmoji: "🇺🇸",
    useCase: "Conversational",
    gender: "Neutral",
    ageCategory: "Young",
    voiceType: "community",
    addedOn: "Jul 07, 2024",
    userCount: 17200,
    avatarColor: "#b45309",
    avatarImage: "https://randomuser.me/api/portraits/women/79.jpg",
    saved: false,
  },
  {
    id: "v11",
    name: "Marcus",
    description: "Authoritative and Clear — Deep, trustworthy male voice for corporate content",
    language: "English",
    accent: "American",
    flagEmoji: "🇺🇸",
    useCase: "Narration",
    gender: "Male",
    ageCategory: "Middle aged",
    voiceType: "professional-clone",
    addedOn: "Apr 30, 2025",
    userCount: 8900,
    avatarColor: "#1d4ed8",
    avatarImage: "https://randomuser.me/api/portraits/men/48.jpg",
    usedByAgents: ["Outbound agent"],
    saved: false,
  },
  {
    id: "v12",
    name: "Priya",
    description: "Warm and Articulate — South Asian-accented English for global audiences",
    language: "English",
    accent: "Indian",
    flagEmoji: "🇮🇳",
    useCase: "Educational",
    gender: "Female",
    ageCategory: "Young",
    voiceType: "instant-clone",
    addedOn: "Nov 08, 2025",
    userCount: 3200,
    avatarColor: "#dc2626",
    avatarImage: "https://randomuser.me/api/portraits/women/76.jpg",
    saved: false,
  },
];

export function formatUserCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return String(n);
}

export const USE_CASE_SAMPLE_TEXT: Record<VoiceUseCase, string> = {
  Conversational:
    "Hi there! Thanks for reaching out. I'm here to help you schedule an appointment or answer any questions you have. What can I do for you today?",
  Narration:
    "In a world where every moment counts, clarity and precision define the difference between good and great. Our story begins with a single idea — to make every interaction meaningful.",
  Educational:
    "Welcome to today's lesson. We'll explore the fundamentals of effective communication, breaking down complex concepts into clear, actionable insights. Let's get started.",
  "Social media":
    "Hey everyone! So excited to share this with you — have you tried this yet? Drop a comment below and let me know what you think! Don't forget to follow for more!",
  Advertisement:
    "Introducing the solution that changes everything. Designed for those who demand the best, crafted for performance, built to last. Experience the difference today.",
  Characters:
    "Ah, welcome, brave adventurer! The path ahead is fraught with peril, but fear not — for together, we shall overcome any obstacle that stands in our way!",
};

export const USE_CASE_SAMPLE_DURATION_S: Record<VoiceUseCase, number> = {
  Conversational:   9,
  Narration:       12,
  Educational:     10,
  "Social media":  10,
  Advertisement:   10,
  Characters:      11,
};

export const VOICE_TYPE_LABEL: Record<VoiceType, string> = {
  "community":         "Community",
  "instant-clone":     "Instant clone",
  "voice-design":      "Voice design",
  "professional-clone":"Professional clone",
};
