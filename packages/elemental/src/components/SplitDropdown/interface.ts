import type { ReactNode } from "react";

export interface SplitDropdownOption {
    value: string | number;
    label: string;
    [key: string]: any;
}

export interface SplitDropdownPaginationConfig {
    hasMore?: boolean;
    isLoading?: boolean;
    isLoadingMore?: boolean;
    currentPage?: number;
    search?: string;
    onOpen?: () => void;
    onLoadMore?: () => void;
    onSearch?: (search: string) => void;
    loader?: ReactNode;
    useWindow?: boolean;
    initialLoad?: boolean;
    threshold?: number;
    containerHeight?: string;
}

export interface CustomPanelProps {
    value: any;
    onChange: Function;
    actions: {
        applyValue: (value: any) => void;
        clearAll: () => void;
    };
}

export interface ListWithCheckBoxPassthroughProps {
    searchPlaceholder?: string;
    disableSelectAllBtn?: boolean;
    disableSearchBox?: boolean;
    getAdditionalSelectAllText?: () => string;
    showCheckboxBeforeText?: boolean;
    customClass?: string;
    freezeOptions?: boolean;
    showVerifiedIcon?: boolean;
    selectAllBtnText?: string;
    enableSelectAllNumber?: number;
    showDeleteIcon?: boolean;
    isReverseSelection?: boolean;
    reverseSelectedData?: any;
    virtualizationProps?: {
        isEnabled?: boolean;
        rowHeight?: (index: number) => number;
        className?: string;
        overscanRowCount?: number;
        listHeight?: number;
    };
    preventCheckBoxPropagation?: boolean;
    addBrowserTooltipToLabel?: boolean;
    searchDebounceDelay?: number;
    showLoader?: boolean;
    fieldDrivenSearchOptions?: {
        enabled?: boolean;
        fieldOptions?: any[];
        selectedSearchType?: string;
        searchFilterProps?: object;
    };
    showSelectedCount?: boolean;
}

export interface SplitDropdownPanelItem {
    type?: string;
    key: string;
    label: string;
    value?: any;
    showRightPanel?: boolean;
    showSelectionCount?: boolean;
    dropdownHeight?: number;
    rightPanelWidth?: number;
    loading?: boolean;
    loaderComponent?: ReactNode | (() => ReactNode);
    fetchData?: (key: string) => void;
    renderCustomSelectionIndicator?: Function;
    getSelectionCount?: (value: any) => number;
    options?: SplitDropdownOption[];
    listProps?: ListWithCheckBoxPassthroughProps;
    searchPlaceholder?: string;
    noDataScreen?: ReactNode;
    error?: string;
    pagination?: SplitDropdownPaginationConfig;
    renderCustomJSXInRightPanel?: Function;
}

export interface SplitDropdownOutputItem {
    key: string;
    label: string;
    value?: any;
}

export interface SplitDropdownProps {
    items: SplitDropdownPanelItem[];
    onApply: (appliedItems: SplitDropdownOutputItem[]) => void;
    onLeftItemChange?: (item: SplitDropdownPanelItem) => void;
    defaultSelectedKey?: string;
    isSingleSelectLeft?: boolean;
    triggerLabel?: string;
    triggerJSX?: ReactNode;
    leftPanelHeader?: string;
    closeOnOutsideClick?: boolean;
    autoPosition?: boolean;
    dropdownHeight?: number;
    className?: string;
    leftPanelWidth?: number;
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    usePortal?: boolean;
    enableKeyboardNavigation?: boolean;
    isReseller?: boolean;
}

