
export default {
  "pageHeader": {
    "ds-page-header-title": {
      "description": "Standardization fontStyle for Page Headers",
      "fontSize": "18px",
      "fontWeight": "400",
      "lineHeight": "26px",
      "letterSpacing": "-0.02px",
      "usage": "Use for main page titles and headers"
    },
    "ds-page-subheader": {
      "description": "Standardization fontStyle for Page Sub-headers",
      "fontSize": "16px",
      "fontWeight": "400",
      "lineHeight": "24px",
      "letterSpacing": "-0.02px",
      "usage": "Use for section sub-headers within pages"
    },
    "ds-page-header": {
      "description": "Overall header size standardization",
      "height": "64px",
      "padding": "14px 30px",
      "display": "flex",
      "alignItems": "center",
      "boxSizing": "border-box",
      "usage": "Container for page headers with standard height and padding"
    },
    "ds-page-header-description": {
      "description": "Standardization fontStyle for Page Headers description",
      "fontSize": "12px",
      "fontWeight": "400",
      "lineHeight": "18px",
      "color": "$gray-light",
      "usage": "Use for descriptive text under page headers"
    }
  },
  "buttons": {
    "ds-button-secondary": {
      "description": "Secondary button stroke standardization",
      "border": "1px solid $gray75",
      "fontWeight": "400",
      "transition": "all 0.3s ease",
      "usage": "Use for secondary action buttons with outlined style"
    }
  },
  "components": {
    "ds-dropdown-text": {
      "description": "Standard dropdown text style",
      "fontFamily": "'Inter', sans-serif",
      "fontWeight": "400",
      "usage": "Use for text inside dropdown components"
    },
    "ds-popup-heading": {
      "description": "Standard popup heading style",
      "fontWeight": "400",
      "letterSpacing": "-0.02px",
      "usage": "Use for headings in popup/modal components"
    },
    "ds-sidePanel-heading": {
      "description": "Standard side panel heading style",
      "fontWeight": "400",
      "usage": "Use for headings in side panel components"
    },
    "ds-popup-container": {
      "description": "Container for popup with close button positioning",
      "position": "relative",
      "usage": "Wrapper for popup components with standardized close button"
    },
    "ds-popup-close": {
      "description": "Close button for popups",
      "position": "absolute",
      "top": "8px",
      "right": "16px",
      "width": "24px",
      "height": "24px",
      "padding": "6px",
      "cursor": "pointer",
      "zIndex": "10",
      "display": "flex",
      "alignItems": "center",
      "justifyContent": "center",
      "usage": "Standardized close button for popup/modal components"
    }
  },
  "metrics": {
    "ds-metric-large": {
      "description": "Large numbers for metrics display",
      "fontSize": "32px",
      "fontWeight": "400",
      "letterSpacing": "-0.02px",
      "usage": "Use for displaying large metric values"
    },
    "ds-metric-small": {
      "description": "Small numbers for metrics display",
      "fontSize": "16px",
      "fontWeight": "400",
      "letterSpacing": "-0.02px",
      "usage": "Use for displaying smaller metric values"
    },
    "ds-kpi-container--left": {
      "description": "Reporting KPI alignment - Left",
      "textAlign": "left",
      "usage": "Use for left-aligned KPI containers"
    },
    "ds-kpi-container--center": {
      "description": "Reporting KPI alignment - Center",
      "textAlign": "center",
      "usage": "Use for center-aligned KPI containers"
    }
  },
  "guidelines": {
    "implementation": "Import uiFoundations in your SCSS: @import 'sass/uiFoundations/_index.scss'",
    "propUsage": "Add isAeroDesign={true} prop to components to enable DS compliance",
    "classUsage": "Apply DS classes directly to elements or use getEncodedStyleClass for CSS modules"
  }
};
