import React from "react";
import { icons, type LucideProps } from "lucide-react";

export const LUCIDE_ICON_STROKE_PX = 1.6;

export type IconName = keyof typeof icons;

export type IconProps = Omit<LucideProps, "ref"> & {
    name: IconName;
    size?: number;
    strokeWidth?: number;
};

export function Icon({
    name,
    size = 16,
    strokeWidth = LUCIDE_ICON_STROKE_PX,
    absoluteStrokeWidth = size !== 24,
    color = "currentColor",
    ...props
}: IconProps) {
    const Glyph = icons[name];

    if (!Glyph) {
        return null;
    }

    const ariaHidden =
        props["aria-label"] === undefined && props["aria-labelledby"] === undefined
            ? true
            : undefined;

    return (
        <Glyph
            size={size}
            strokeWidth={strokeWidth}
            absoluteStrokeWidth={absoluteStrokeWidth}
            color={color}
            aria-hidden={ariaHidden}
            {...props}
        />
    );
}

export default Icon;
