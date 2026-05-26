import omitBy from "lodash/omitBy";

/**
 *
 * @param {*} reportConfig it is main input props which we are getting from parent
 * @param {*} configKeysWithOrder `order` key in this array is `IMPORTANT`, as whatever output we get from function it will carry forward as input to next function
 * @param {*} fallbackFns if reportConfig.parserConfig.utilityFns does not have respective function then fallbackFns will triggered
 * @returns object which will pass into ReactHighChart component
 */
export function baseConverter(reportConfig, configKeysWithOrder, fallbackFns) {
    const { parserConfig } = reportConfig;
    const { utilityFns } = parserConfig;

    const config = configKeysWithOrder
        .sort((a, b) => a.order - b.order)
        .reduce((acc, { key, fn }) => {
            acc[key] = utilityFns?.[fn]?.(reportConfig, acc) || (typeof fallbackFns[fn] === "function" ? fallbackFns[fn](reportConfig, acc) : undefined);
            return acc;
        }, {});
    const filteredConfig = omitBy(config, (value) => value === null || value === undefined);
    return {
        ...filteredConfig,
        credits: { enabled: false },
        exporting: { enabled: false },
        accessibility: { enabled: false },
    };
}
