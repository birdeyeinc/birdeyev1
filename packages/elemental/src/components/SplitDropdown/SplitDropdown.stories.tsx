import React, { useRef, useState } from "react";
import SplitDropdown from ".";
import TimePeriod from "atoms/TimePeriod";
import type {
    CustomPanelProps,
    SplitDropdownOption,
    SplitDropdownOutputItem,
} from "./interface";
import LoadingShimmer from "atoms/LoadingShimmer";

export default {
    title: "Component/SplitDropdown",
    component: SplitDropdown,
    tags: ["autodocs"],
};

type TimePeriodValue = {
    months?: number;
    days?: number;
    groupByDays?: number;
    key?: string;
};

type FilterValues = {
    "responses-single": SplitDropdownOption | null;
    "reviews-paginated": SplitDropdownOption | null;
    "locations-paginated": Record<string, SplitDropdownOption>;
    "users-multi": Record<string, SplitDropdownOption>;
    "time-period-filter": TimePeriodValue;
};

type SingleSelectLeftValues = {
    "survey-responses": SplitDropdownOption | null;
};

type InlineTimePeriodPanelProps = {
    value: TimePeriodValue | undefined;
    onChange: CustomPanelProps["onChange"];
    actions: CustomPanelProps["actions"];
};

const surveyOptions: SplitDropdownOption[] = [
    { value: "survey-1", label: "All questions - Standard survey 2026" },
    { value: "survey-2", label: "Standard survey by location" },
    { value: "survey-3", label: "Satisfaction survey" },
    { value: "survey-4", label: "Pulse survey" },
    { value: "survey-5", label: "New survey" },
    { value: "survey-6", label: "Customer satisfaction survey" },
    { value: "survey-7", label: "Feedback form" },
    { value: "survey-8", label: "Where can we improve" },
    { value: "survey-9", label: "Food quality survey" },
    { value: "survey-10", label: "Customer happiness survey" }
];

const paginatedReviewSiteOptions: SplitDropdownOption[] = [
    { value: "review-site-1", label: "Google" },
    { value: "review-site-2", label: "Yelp" },
    { value: "review-site-3", label: "Facebook" },
    { value: "review-site-4", label: "Birdeye" },
    { value: "review-site-5", label: "Airbnb" },
    { value: "review-site-6", label: "Tripadvisor" },
    { value: "review-site-7", label: "OpenTable" },
    { value: "review-site-8", label: "Booking.com" },
    { value: "review-site-9", label: "Trustpilot" },
    { value: "review-site-10", label: "Glassdoor" },
    { value: "review-site-11", label: "Capterra" },
    { value: "review-site-12", label: "G2" },
];

const paginatedLocationOptions: SplitDropdownOption[] = [
    { value: "loc-1", label: "0140 - South Bend, IN" },
    { value: "loc-2", label: "0151 - Waterville, ME" },
    { value: "loc-3", label: "0160 - Bangor, ME" },
    { value: "loc-4", label: "0164 - Goshen, IN" },
    { value: "loc-5", label: "0171 - Greenwood, IN" },
    { value: "loc-6", label: "0185 - Greenville, SC" },
    { value: "loc-7", label: "0191 - Boise, ID" },
    { value: "loc-8", label: "0203 - Flagstaff, AZ" },
    { value: "loc-9", label: "0210 - Boulder, CO" },
    { value: "loc-10", label: "0227 - Akron, OH" },
    { value: "loc-11", label: "0236 - Reno, NV" },
    { value: "loc-12", label: "0244 - Chattanooga, TN" },
];

const userOptions: SplitDropdownOption[] = [
    { value: "user-1", label: "Ava Johnson" },
    { value: "user-2", label: "Liam Carter" },
    { value: "user-3", label: "Noah Martinez" },
    { value: "user-4", label: "Emma Thompson" },
    { value: "user-5", label: "Olivia Wilson" },
    { value: "user-6", label: "Sophia Davis" },
    { value: "user-7", label: "Ethan Walker" },
    { value: "user-8", label: "Mia Harris" },
];

const PAGE_SIZE = 4;
const MAX_PAGES = 3;

const simulateApi = <T,>(result: T): Promise<T> =>
    new Promise((resolve) => setTimeout(() => resolve(result), 700));

const defaultTimePeriodValue: TimePeriodValue = { months: 12, groupByDays: 0 };

const createInitialFilterValues = (): FilterValues => ({
    "responses-single": { label: "All questions - Standard survey 2026", value: "survey-1" },
    "reviews-paginated": { label: "Yelp", value: "review-site-2" },
    "locations-paginated": {
        "loc-2": { label: "0151 - Waterville, ME", value: "loc-2" },
        "loc-4": { label: "0164 - Goshen, IN", value: "loc-4" },
    },
    "users-multi": {
        "user-2": { label: "Liam Carter", value: "user-2" },
        "user-5": { label: "Olivia Wilson", value: "user-5" },
        "user-7": { label: "Ethan Walker", value: "user-7" },
    },
    "time-period-filter": defaultTimePeriodValue,
});

const applyPayloadToValues = <T extends Record<string, unknown>>(
    previousValues: T,
    payload: SplitDropdownOutputItem[]
): T => payload.reduce((acc, item) => {
    if (!Object.prototype.hasOwnProperty.call(item, "value")) {
        return acc;
    }

    acc[item.key as keyof T] = item.value as T[keyof T];
    return acc;
}, { ...previousValues });

const InlineTimePeriodPanel = ({ value, onChange, actions }: InlineTimePeriodPanelProps) => {
    return (
        <TimePeriod
            isInline
            selectedDateRange={value || defaultTimePeriodValue}
            onChangeSelectedDateRange={onChange as (value: TimePeriodValue) => void}
            onDateChange={onChange as (value: TimePeriodValue) => void}
            onApply={actions.applyValue}
            onClear={() => actions.clearAll()}
            applyLabel="Apply"
            clearLabel="Clear"
        />
    );
};

export const SingleSelectLeft = () => {
    const [selectedValues, setSelectedValues] = useState<SingleSelectLeftValues>({
        "survey-responses": null,
    });

    const [responseOptions, setResponseOptions] = useState<SplitDropdownOption[]>([]);
    const [responseLoading, setResponseLoading] = useState(false);

    const loadResponses = async () => {
        if (responseLoading || responseOptions.length > 0) return;
        setResponseLoading(true);
        const options = await simulateApi(surveyOptions);
        setResponseOptions(options);
        setResponseLoading(false);
    };

    const items = [
        {
            key: "survey-nps",
            label: "Survey NPS",
            showRightPanel: false,
        },
        {
            key: "survey-responses",
            label: "Responses",
            type: "single",
            options: responseOptions,
            loading: responseLoading,
            value: selectedValues["survey-responses"],
            rightPanelWidth: 240,
            fetchData: loadResponses,
            loaderComponent : () => (<LoadingShimmer shimmerCount={new Array(7).fill({ height: "review-translating", width: "full-width" })} displayCount={1} />),
            showSelectionCount: false
        },
    ];

    return (
        <div style={{ padding: 40 }}>
            <SplitDropdown
                items={items}
                isSingleSelectLeft
                defaultSelectedKey="survey-nps"
                onLeftItemChange={(item) => {
                    console.log("Left panel selected:", item);
                }}
                onApply={(appliedItems) => {
                    console.log("Applied payload:", appliedItems);
                    setSelectedValues((previousValues) => applyPayloadToValues(previousValues, appliedItems));
                }}
                leftPanelHeader="Reports"
                dropdownHeight={300}
                usePortal
            />
        </div>
    );
};

SingleSelectLeft.storyName = "Single Select Left";
SingleSelectLeft.parameters = {
    docs: {
        description: {
            story: "Demonstrates left-panel-first selection. Left-only items apply immediately, while panel items still use the right panel and shared footer. The parent only stores the selected values it cares about.",
        },
    },
};

export const FilterMatrix = () => {
    const [selectedValues, setSelectedValues] = useState<FilterValues>(createInitialFilterValues);

    // — Responses (non-paginated single select) —
    const [responseOptions, setResponseOptions] = useState<SplitDropdownOption[]>([]);
    const [responseLoading, setResponseLoading] = useState(false);

    // — Reviews (paginated single select) —
    const [reviewOptions, setReviewOptions] = useState<SplitDropdownOption[]>([]);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewLoadingMore, setReviewLoadingMore] = useState(false);
    const [reviewHasMore, setReviewHasMore] = useState(true);
    const reviewPage = useRef(0);
    const reviewSearch = useRef("");

    // — Locations (paginated multi select) —
    const [locationOptions, setLocationOptions] = useState<SplitDropdownOption[]>([]);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationLoadingMore, setLocationLoadingMore] = useState(false);
    const [locationHasMore, setLocationHasMore] = useState(true);
    const locationPage = useRef(0);
    const locationSearch = useRef("");

    // — Users (non-paginated multi select) —
    const [usersOptions, setUsersOptions] = useState<SplitDropdownOption[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);

    const loadResponses = async () => {
        if (responseLoading || responseOptions.length > 0) return;
        setResponseLoading(true);
        const options = await simulateApi(surveyOptions);
        setResponseOptions(options);
        setResponseLoading(false);
    };

    const loadUsers = async () => {
        if (usersLoading || usersOptions.length > 0) return;
        setUsersLoading(true);
        const options = await simulateApi(userOptions);
        setUsersOptions(options);
        setUsersLoading(false);
    };

    const loadReviews = async (page: number, search = "") => {
        if (page === 1) setReviewLoading(true);
        else setReviewLoadingMore(true);

        const filtered = search
            ? paginatedReviewSiteOptions.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
            : paginatedReviewSiteOptions;
        const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
        const newItems = await simulateApi(pageItems);

        setReviewOptions((prev) => (page === 1 ? newItems : [...prev, ...newItems]));
        setReviewHasMore(newItems.length === PAGE_SIZE && page < MAX_PAGES);
        setReviewLoading(false);
        setReviewLoadingMore(false);
        reviewPage.current = page;
        reviewSearch.current = search;
    };

    const loadLocations = async (page: number, search = "") => {
        if (page === 1) setLocationLoading(true);
        else setLocationLoadingMore(true);

        const filtered = search
            ? paginatedLocationOptions.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
            : paginatedLocationOptions;
        const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
        const newItems = await simulateApi(pageItems);

        setLocationOptions((prev) => (page === 1 ? newItems : [...prev, ...newItems]));
        setLocationHasMore(newItems.length === PAGE_SIZE && page < MAX_PAGES);
        setLocationLoading(false);
        setLocationLoadingMore(false);
        locationPage.current = page;
        locationSearch.current = search;
    };

    const storyItems = [
        {
            key: "responses-single",
            label: "Responses",
            type: "single",
            options: responseOptions,
            loading: responseLoading,
            value: selectedValues["responses-single"],
            rightPanelWidth: 280,
            fetchData: loadResponses,
        },
        {
            key: "reviews-paginated",
            label: "Reviews",
            type: "single",
            options: reviewOptions,
            value: selectedValues["reviews-paginated"],
            rightPanelWidth: 320,
            searchPlaceholder: "Search review sites",
            pagination: {
                isLoading: reviewLoading,
                isLoadingMore: reviewLoadingMore,
                hasMore: reviewHasMore,
                loader: <div style={{ padding: "8px 10px" }}>Loading review sites...</div>,
                useWindow: false,
                threshold: 120,
                onOpen: () => reviewPage.current === 0 && loadReviews(1),
                onLoadMore: () => loadReviews(reviewPage.current + 1, reviewSearch.current),
                onSearch: (search: string) => loadReviews(1, search),
            },
        },
        {
            key: "locations-paginated",
            label: "Locations",
            type: "multi",
            options: locationOptions,
            value: selectedValues["locations-paginated"],
            rightPanelWidth: 320,
            searchPlaceholder: "Search locations",
            pagination: {
                isLoading: locationLoading,
                isLoadingMore: locationLoadingMore,
                hasMore: locationHasMore,
                loader: <div style={{ padding: "8px 10px" }}>Loading locations...</div>,
                useWindow: false,
                threshold: 120,
                onOpen: () => locationPage.current === 0 && loadLocations(1),
                onLoadMore: () => loadLocations(locationPage.current + 1, locationSearch.current),
                onSearch: (search: string) => loadLocations(1, search),
            },
        },
        {
            key: "users-multi",
            label: "Users",
            type: "multi",
            options: usersOptions,
            loading: usersLoading,
            value: selectedValues["users-multi"],
            rightPanelWidth: 260,
            fetchData: loadUsers,
        },
        {
            key: "time-period-filter",
            label: "Time Period",
            type: "custom",
            dropdownHeight: 414,
            rightPanelWidth: 735,
            value: selectedValues["time-period-filter"],
            renderCustomJSXInRightPanel: ({ value, onChange, actions }: CustomPanelProps) => (
                <InlineTimePeriodPanel value={value} onChange={onChange} actions={actions} />
            ),
            renderCustomSelectionIndicator: (value: TimePeriodValue | undefined) => {
                if (!value || typeof value !== "object") return null;
                const v = value || {};
                if (v.months) return `${v.months}M`;
                if (v.days) return `${v.days}D`;
                return "Custom";
            },
        },
    ];

    return (
        <div style={{ padding: 40 }}>
            <SplitDropdown
                items={storyItems}
                onLeftItemChange={(item) => {
                    console.log("Left panel selected:", item);
                }}
                onApply={(appliedItems) => {
                    console.log("Applied payload:", appliedItems);
                    setSelectedValues((prev) => applyPayloadToValues(prev, appliedItems));
                }}
                defaultSelectedKey="responses-single"
                leftPanelHeader="Filters"
                dropdownHeight={330}
                triggerLabel="Explore Filters"
            />
        </div>
    );
};

FilterMatrix.storyName = "Filter Matrix";
FilterMatrix.parameters = {
    docs: {
        description: {
            story: "Shows single, multi, paginated, and custom items together. The parent keeps only applied values, while the dropdown item config is derived at render time.",
        },
    },
};
