import type { MetadataConfig } from '../types';

type MetadataObject = Record<string, any>;

/**
 * 
 * Provides a hybrid approach to pass metadata (className, style, id, etc.) to table elements:
 * 
 * 1. Global Config (metadataConfig prop):
 *    - tr: Global defaults for all <tr> elements
 *    - th: Column-specific defaults for <th> elements by column key
 *    - td: Column-specific defaults for <td> elements by column key
 * 
 * 2. Inline Metadata (in data):
 *    - Row-level: row.metadata applies to <tr>
 *    - Cell-level: row.rowData[columnKey].metadata applies to <td>
 * 
 * Merge Strategy:
 *    - className: Concatenated (global + inline)
 *    - style: Shallow merged (inline overrides global)
 *    - Other attributes: Inline overrides global
 */

/**
 * Get metadata for a <tr> element
 * Merges global tr config with inline row metadata
 * 
 * @param {Object} metadataConfig - Global metadata configuration
 * @param {Object} rowMetadata - Inline metadata from row.metadata
 * @returns {Object} Merged metadata for the <tr> element
 */
export const getTrMetadata = (metadataConfig: MetadataConfig | undefined, rowMetadata: MetadataObject | undefined): MetadataObject => {
    const globalTr = metadataConfig?.tr || {};
    const inlineMetadata = rowMetadata || {};
    
    return mergeMetadata(globalTr, inlineMetadata);
};

/**
 * Get metadata for a <th> element
 * Uses column-specific config from metadataConfig.th[columnKey]
 * 
 * @param {Object} metadataConfig - Global metadata configuration
 * @param {string} columnKey - The column key (header value)
 * @returns {Object} Metadata for the <th> element
 */
export const getThMetadata = (metadataConfig: MetadataConfig | undefined, columnKey: string, cellMetadata?: MetadataObject): MetadataObject => {
    const globalDefault = metadataConfig?.th?.['*'] || {};
    const columnSpecific = metadataConfig?.th?.[columnKey] || {};
    const inlineMetadata = cellMetadata || {};
    
    // First merge global default with column-specific, then with inline
    const globalMerged = mergeMetadata(globalDefault, columnSpecific);
    return mergeMetadata(globalMerged, inlineMetadata);
};

/**
 * Get metadata for a <td> element
 * Merges global td config with inline cell metadata
 * 
 * @param {Object} metadataConfig - Global metadata configuration
 * @param {string} columnKey - The column key
 * @param {Object} cellMetadata - Inline metadata from cell.metadata
 * @returns {Object} Merged metadata for the <td> element
 */
export const getTdMetadata = (metadataConfig: MetadataConfig | undefined, columnKey: string, cellMetadata?: MetadataObject): MetadataObject => {
    const globalDefault = metadataConfig?.td?.['*'] || {};
    const columnSpecific = metadataConfig?.td?.[columnKey] || {};
    const inlineMetadata = cellMetadata || {};
    
    // First merge global default with column-specific, then with inline
    const globalMerged = mergeMetadata(globalDefault, columnSpecific);
    return mergeMetadata(globalMerged, inlineMetadata);
};

/**
 * Merge two metadata objects
 * - className: Concatenated
 * - style: Shallow merged (second overrides first)
 * - Other attributes: Second overrides first
 * 
 * @param {Object} base - Base metadata
 * @param {Object} override - Override metadata
 * @returns {Object} Merged metadata
 */
export const mergeMetadata = (base: MetadataObject = {}, override: MetadataObject = {}): MetadataObject => {
    if (!base && !override) return {};
    if (!base) return { ...override };
    if (!override) return { ...base };
    
    const result = { ...base, ...override };
    
    // Concatenate classNames
    if (base.className || override.className) {
        result.className = [base.className, override.className]
            .filter(Boolean)
            .join(' ')
            .trim() || undefined;
    }
    
    // Shallow merge styles
    if (base.style || override.style) {
        result.style = { ...base.style, ...override.style };
    }
    
    return result;
};

/**
 * Apply metadata to element props
 * Filters out undefined values and spreads into props object
 * 
 * @param {Object} existingProps - Existing element props (className, style, etc.)
 * @param {Object} metadata - Metadata to apply
 * @returns {Object} Merged props object
 */
export const applyMetadataToProps = (existingProps: MetadataObject = {}, metadata: MetadataObject = {}): MetadataObject => {
    if (!metadata || Object.keys(metadata).length === 0) {
        return existingProps;
    }
    
    const result = { ...existingProps };
    
    // Merge className
    if (metadata.className) {
        result.className = [existingProps.className, metadata.className]
            .filter(Boolean)
            .join(' ')
            .trim() || undefined;
    }
    
    // Merge style
    if (metadata.style) {
        result.style = { ...existingProps.style, ...metadata.style };
    }
    
    // Apply other attributes (id, data-*, aria-*, etc.)
    Object.keys(metadata).forEach(key => {
        if (key !== 'className' && key !== 'style' && metadata[key] !== undefined) {
            result[key] = metadata[key];
        }
    });
    
    return result;
};
