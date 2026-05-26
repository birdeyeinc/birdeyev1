export function splitNumberAndUnit(str: string = "") {
    try {
        if (!str || (typeof str !== "string" && typeof str !== "number")) return { value: null, unit: null };
        const match = str?.match(/^([+-]?\d+(?:\.\d+)?)([a-zA-Z%]*)$/);
        if (match) {
            return { value: parseFloat(match[1]), unit: match[2] };
        }
        return { value: null, unit: null };
    } catch (error) {
        return { value: null, unit: null };
    }
}

export function splitValueFromUnit(value: string) {
    try {
        if (!value || (typeof value !== "string" && typeof value !== "number")) return { value: null, unit: null };
        const match = /^(\d+(?:\.\d+)?)([a-z%]*)$/.exec(value);
        if (!match) return { number: null, unit: null };
        return { number: parseFloat(match[1]), unit: match[2] || null };
    } catch (error) {
        return { number: null, unit: null };
    }
}

// get image from background property
export function extractLinkFromBackgroundProperty(urlString = "") {
    const match = urlString?.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/);
    return match ? match[1] : null;
};
