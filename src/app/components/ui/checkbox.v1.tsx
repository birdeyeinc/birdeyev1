"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";

import { cn } from "./utils";

/**
 * Checkbox — **Aero DS** alignment ([Figma](https://www.figma.com/design/xecPAre4cKkeXEdvTig1oI/Aero-Design-System?node-id=1306-1458)):
 * unselected = light border + white fill; selected / indeterminate = `primary` fill + white icon.
 */
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "group peer size-4 shrink-0 rounded-[4px] border border-border bg-input-background outline-none transition-colors duration-150",
        "dark:bg-input/30",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon
          className="hidden size-3.5 group-data-[state=checked]:block group-data-[state=indeterminate]:hidden"
          strokeWidth={1.6}
          absoluteStrokeWidth
          aria-hidden
        />
        <MinusIcon
          className="hidden size-3.5 group-data-[state=indeterminate]:block group-data-[state=checked]:hidden"
          strokeWidth={1.6}
          absoluteStrokeWidth
          aria-hidden
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
