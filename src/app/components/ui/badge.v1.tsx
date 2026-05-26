import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

/*
 * Badge — Chakra-UI-inspired variant × colorPalette × size system.
 *
 * variant:      solid | subtle | outline | surface | plain
 * colorPalette: gray | red | orange | yellow | green | teal | blue | cyan | purple | pink
 * size:         xs | sm | md | lg
 *
 * Legacy variants (default, secondary, destructive) are preserved as aliases.
 */

export type BadgeColorPalette =
  | "gray" | "red" | "orange" | "yellow" | "green"
  | "teal" | "blue" | "cyan" | "purple" | "pink";

export type BadgeVariant = "solid" | "subtle" | "outline" | "surface" | "plain"
  | "default" | "secondary" | "destructive"; // legacy aliases

const BASE =
  "inline-flex items-center justify-center gap-1 whitespace-nowrap shrink-0 w-fit font-medium [&>svg]:pointer-events-none [&>svg]:size-3 transition-colors overflow-hidden";

const SIZE = {
  xs: "rounded px-1.5 py-px  text-[10px]",
  sm: "rounded-sm px-2 py-0.5 text-[11px]",
  md: "rounded-md px-2 py-0.5 text-xs",
  lg: "rounded-md px-2.5 py-1 text-sm",
} as const;

// Color × visual variant matrix
const PALETTE: Record<BadgeColorPalette, Record<"solid" | "subtle" | "outline" | "surface" | "plain", string>> = {
  gray: {
    solid:   "bg-gray-600 text-white dark:bg-gray-500",
    subtle:  "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    outline: "border border-gray-400 text-gray-700 dark:border-gray-500 dark:text-gray-300",
    surface: "bg-gray-50 border border-gray-200 text-gray-700 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300",
    plain:   "text-gray-700 dark:text-gray-300",
  },
  red: {
    solid:   "bg-red-600 text-white dark:bg-red-500",
    subtle:  "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    outline: "border border-red-400 text-red-700 dark:border-red-500 dark:text-red-300",
    surface: "bg-red-50 border border-red-200 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-300",
    plain:   "text-red-700 dark:text-red-300",
  },
  orange: {
    solid:   "bg-orange-500 text-white dark:bg-orange-400",
    subtle:  "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    outline: "border border-orange-400 text-orange-700 dark:border-orange-500 dark:text-orange-300",
    surface: "bg-orange-50 border border-orange-200 text-orange-700 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-300",
    plain:   "text-orange-700 dark:text-orange-300",
  },
  yellow: {
    solid:   "bg-yellow-500 text-white dark:bg-yellow-400",
    subtle:  "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
    outline: "border border-yellow-400 text-yellow-700 dark:border-yellow-500 dark:text-yellow-300",
    surface: "bg-yellow-50 border border-yellow-200 text-yellow-700 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-300",
    plain:   "text-yellow-700 dark:text-yellow-300",
  },
  green: {
    solid:   "bg-green-600 text-white dark:bg-green-500",
    subtle:  "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
    outline: "border border-green-400 text-green-700 dark:border-green-500 dark:text-green-300",
    surface: "bg-green-50 border border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300",
    plain:   "text-green-700 dark:text-green-300",
  },
  teal: {
    solid:   "bg-teal-600 text-white dark:bg-teal-500",
    subtle:  "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
    outline: "border border-teal-400 text-teal-700 dark:border-teal-500 dark:text-teal-300",
    surface: "bg-teal-50 border border-teal-200 text-teal-700 dark:bg-teal-950 dark:border-teal-800 dark:text-teal-300",
    plain:   "text-teal-700 dark:text-teal-300",
  },
  blue: {
    solid:   "bg-blue-600 text-white dark:bg-blue-500",
    subtle:  "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    outline: "border border-blue-400 text-blue-700 dark:border-blue-500 dark:text-blue-300",
    surface: "bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300",
    plain:   "text-blue-700 dark:text-blue-300",
  },
  cyan: {
    solid:   "bg-cyan-500 text-white dark:bg-cyan-400",
    subtle:  "bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
    outline: "border border-cyan-400 text-cyan-700 dark:border-cyan-500 dark:text-cyan-300",
    surface: "bg-cyan-50 border border-cyan-200 text-cyan-700 dark:bg-cyan-950 dark:border-cyan-800 dark:text-cyan-300",
    plain:   "text-cyan-700 dark:text-cyan-300",
  },
  purple: {
    solid:   "bg-purple-600 text-white dark:bg-purple-500",
    subtle:  "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    outline: "border border-purple-400 text-purple-700 dark:border-purple-500 dark:text-purple-300",
    surface: "bg-purple-50 border border-purple-200 text-purple-700 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-300",
    plain:   "text-purple-700 dark:text-purple-300",
  },
  pink: {
    solid:   "bg-pink-600 text-white dark:bg-pink-500",
    subtle:  "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
    outline: "border border-pink-400 text-pink-700 dark:border-pink-500 dark:text-pink-300",
    surface: "bg-pink-50 border border-pink-200 text-pink-700 dark:bg-pink-950 dark:border-pink-800 dark:text-pink-300",
    plain:   "text-pink-700 dark:text-pink-300",
  },
};

// Legacy variant aliases → mapped to new system
const LEGACY: Record<string, { variant: "solid" | "subtle"; colorPalette: BadgeColorPalette }> = {
  default:     { variant: "solid",  colorPalette: "blue" },
  secondary:   { variant: "subtle", colorPalette: "gray" },
  destructive: { variant: "solid",  colorPalette: "red" },
};

// Preserved semantic shortcuts (matches old birdeyev2 badge usage)
const SEMANTIC: Record<string, string> = {
  success: PALETTE.green.subtle,
  warning: PALETTE.orange.subtle,
  purple:  PALETTE.purple.subtle,
  outline: "border border-border text-foreground",
};

export interface BadgeProps extends React.ComponentProps<"span"> {
  /** Visual style. Default: "subtle". */
  variant?: BadgeVariant | "success" | "warning";
  /** Color palette. Default: "gray". */
  colorPalette?: BadgeColorPalette;
  /** Size. Default: "sm". */
  size?: keyof typeof SIZE;
  asChild?: boolean;
}

function Badge({
  className,
  variant = "subtle",
  colorPalette = "gray",
  size = "sm",
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  // Resolve visual classes
  let colorCls: string;
  if (variant in LEGACY) {
    const { variant: v, colorPalette: c } = LEGACY[variant as keyof typeof LEGACY];
    colorCls = PALETTE[c][v];
  } else if (variant in SEMANTIC) {
    colorCls = SEMANTIC[variant as keyof typeof SEMANTIC];
  } else {
    const v = variant as "solid" | "subtle" | "outline" | "surface" | "plain";
    colorCls = PALETTE[colorPalette]?.[v] ?? PALETTE.gray.subtle;
  }

  return (
    <Comp
      data-slot="badge"
      className={cn(BASE, SIZE[size], colorCls, className)}
      {...props}
    />
  );
}

// Keep badgeVariants export for any consumers that import it directly
const badgeVariants = cva(BASE);

export { Badge, badgeVariants };
