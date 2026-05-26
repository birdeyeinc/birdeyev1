import type { ColumnBoundsInput, ColumnBounds } from '../types';

export const toPixelNumber = (value: unknown): number | null => {
    if (value == null) return null;
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value !== 'string') return null;

    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
};

export const resolveColumnBounds = ({
    columnKey,
    headerData,
    globalMin,
    globalMax,
}: ColumnBoundsInput): ColumnBounds => {
    const headerMin = toPixelNumber(headerData?.minWidth);
    const headerMax = toPixelNumber(headerData?.maxWidth);

    const min = headerMin ?? globalMin;
    const maxCandidate = headerMax ?? globalMax;
    const max = maxCandidate < min ? min : maxCandidate;

    return {
        columnKey,
        min,
        max,
    };
};

/**
 * Scales a column width and returns a pixel string constrained by optional
 * minimum and maximum bounds.
 *
 * @param width Base column width to scale.
 * @param minWidth Optional lower bound applied after scaling.
 * @param maxWidth Optional upper bound applied after scaling.
 * @param scaleFactor Positive multiplier applied to the base width.
 * @returns A pixel width string, clamped to `minWidth`/`maxWidth` when needed.
 */
export const calculateWidthWithScaleFactor = ({ width, minWidth, maxWidth, scaleFactor }: { width: number | string | undefined; minWidth?: number | string; maxWidth?: number | string; scaleFactor: number }): string | undefined => {
    if (width == null) return undefined;
    if (!Number.isFinite(scaleFactor) || scaleFactor <= 0) return undefined;
    const pixelWidth = toPixelNumber(width);
    const pixelMinWidth = toPixelNumber(minWidth);
    const pixelMaxWidth = toPixelNumber(maxWidth);

    if (pixelWidth == null) return undefined;

    const scaledWidth = pixelWidth * scaleFactor;

    // Keep the scaled value within any explicit column bounds.
    if (pixelMinWidth != null && scaledWidth < pixelMinWidth) {
        return `${pixelMinWidth}px`;
    }

    if (pixelMaxWidth != null && scaledWidth > pixelMaxWidth) {
        return `${pixelMaxWidth}px`;
    }

    return `${pixelWidth * scaleFactor}px`;
};