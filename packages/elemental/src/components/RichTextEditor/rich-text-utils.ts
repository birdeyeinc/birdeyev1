// Helper to calculate proportional line height based on font size
// Uses tiered values for optimal readability across different sizes
export const calculateLineHeightForFontSize = (fontSize: string): string => {
    const fontSizeNum = parseFloat(fontSize);
    
    // Tiered line-height ratios based on best practices for readability
    // Smaller fonts need more spacing, larger fonts need tighter spacing
    if (fontSizeNum <= 12) {
        return "1.6";      // Small/caption text
    } else if (fontSizeNum <= 18) {
        return "1.5";      // Body text - optimal reading
    } else if (fontSizeNum <= 24) {
        return "1.4";      // Large body/subheadings
    } else if (fontSizeNum <= 36) {
        return "1.25";     // Headings
    } else if (fontSizeNum <= 48) {
        return "1.15";     // Large headings
    } else {
        return "1.1";      // Display/hero text (50px+)
    }
};
