import { MODULE_NAMES } from "./constants.js";
const { ENT_REPORT, SETUP, REVIEWS, LISTING, SUPPORT, APPOINTMENTS, CREATE_ROLE, CONTACTS } = MODULE_NAMES;

export const getSelectedParentAndSubOptionIndex = (moduleName, noDynamicMenuData, activeIndex) => {
    let selectedParent = 0;
    let selectedSubOption = 0;
    let selectedSubSubOption = 0;
    if (moduleName === ENT_REPORT) {
        if (activeIndex) {
            const indexArr = activeIndex.split(";") || [];
            selectedParent = parseInt(indexArr[0] || 0);
            selectedSubOption = parseInt(indexArr[1] || 0);
            selectedSubSubOption = parseInt(indexArr[2] || 0);
        } else {
            if (!noDynamicMenuData) {
                return {
                    selectedParent: 1,
                    selectedSubOption: 1,
                    selectedSubSubOption: 1
                };
            }
            const isBetaCustomer = window?.BE?.env?.entReportingBetaCustomers?.indexOf(window?.BE?.business?.id) > -1;
            const isEntDashboardEnabled = window?.BE?.business?.productFeatures?.isEnterpriseReportingDashboardEnabled || isBetaCustomer;
            const index = isEntDashboardEnabled ? 2 : 1;
            selectedParent = index;
            selectedSubOption = index;
            selectedSubSubOption = index;
        }

    } else if (moduleName === SETUP || moduleName === LISTING || moduleName === SUPPORT || moduleName === APPOINTMENTS || moduleName === CREATE_ROLE || moduleName === CONTACTS) {
        selectedParent = activeIndex || 0;
    } else {
        const indexArr = activeIndex?.split(";") || [];
        selectedParent = indexArr[0] ? parseInt(indexArr[0]) : null;
        selectedSubOption = indexArr[1] ? parseInt(indexArr[1]) : null;
        selectedSubSubOption = indexArr[2] ? parseInt(indexArr[2]) : null;
    }
    return {
        selectedParent,
        selectedSubOption,
        selectedSubSubOption
    };
};

export const getPageTitle = (moduleName) => {
    if (moduleName === ENT_REPORT) {
        return "Enterprise Dashboard";
    } else {
        return "";
    }
};

/** Title length tier for SCSS `data-title-tier` (font sizes live in RailNav.module.scss only). */
export const getRailNavTitleTier = (title: string): "sm" | "xs" | undefined => {
    const len = (title || "").trim().length;
    if (len > 30) {
        return "xs";
    }
    if (len > 20) {
        return "sm";
    }
    return undefined;
};

export const isShowCreateOption = (moduleName) => {
    if (moduleName === ENT_REPORT) {
        return window?.BE?.business?.productFeatures?.isEnterpriseReportingDashboardEnabled;
    } else {
        return false;
    }
};

export const dynamicMenuPathName = (moduleName) => {
    if (moduleName === ENT_REPORT) {
        return "/dashboard/analytics-dash/board";
    }
};
export function removeRedirectUri(url: string): string {
  const urlObj = new URL(url);
  urlObj.searchParams.delete('redirectUri');
  return urlObj.toString();
}