export type VerticalId = "healthcare" | "automotive" | "dental";

export interface Vertical {
  id: VerticalId;
  label: string;
  slug: string;
}

export const VERTICALS: Vertical[] = [
  { id: "healthcare", label: "Birdeye Healthcare", slug: "healthcare" },
  { id: "automotive", label: "Birdeye Automotive", slug: "automotive" },
  { id: "dental",     label: "Birdeye Dental",     slug: "dental"     },
];

export const DEFAULT_VERTICAL: VerticalId = "healthcare";

export function getVertical(id: VerticalId): Vertical {
  return VERTICALS.find((v) => v.id === id)!;
}

export function isValidVertical(slug: string): slug is VerticalId {
  return VERTICALS.some((v) => v.slug === slug);
}
