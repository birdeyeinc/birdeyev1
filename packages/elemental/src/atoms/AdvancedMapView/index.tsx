"use client";
import React, { useEffect, useState, useMemo } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import Map from "./Map";

interface MapContainerProps {
    locations: any;
    origin: string;
    enableCustomMarker?: boolean;
    noDataScreen?: any;
    handleShowMarkerFromParent?: boolean;
    currentHoveredItemDict?: any;
    isLoading?: boolean;
    renderAdditionalTitleJSXInMapMarker?: any;
    getMapTooltipJsx?: (marker: any) => React.ReactNode;
    getClusterViewTooltipJsx?: (markers: any) => React.ReactNode;
    showMarkerTooltipOnClick?: boolean;
    showResetZoomButton?: boolean;
    resetZoomButtonPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'above-controls';
    resetZoomButtonStyle?: React.CSSProperties;
    renderClusterMarker?: (
        location: any,
        isHovered: boolean,
        handleClusterClick: (e: any) => void,
    ) => React.ReactNode;
    renderCustomMarker?: (
        location: any,
        isHovered: boolean,
        handleMarkerClick: (e?: any) => void,
    ) => React.ReactNode;
    transformLocationData?: (location: any, index: number) => any;
    hideMapDetailsBlock?: boolean;
    initialZoom?: number;
    googleMapsApiKey: string;
    mapId: string;
    getShimmerJsx?: () => React.ReactNode;
    businessTitle?:string
    fullscreenControl?: boolean;
    gestureHandling?:string;
    fixedMinZoomLevel?: boolean;
}

const Container = ({
    locations,
    origin,
    enableCustomMarker = false,
    noDataScreen,
    handleShowMarkerFromParent = false,
    currentHoveredItemDict = {},
    isLoading = false,
    renderAdditionalTitleJSXInMapMarker,
    getMapTooltipJsx,
    getClusterViewTooltipJsx,
    showMarkerTooltipOnClick = false,
    showResetZoomButton = false,
    resetZoomButtonPosition = 'above-controls',
    resetZoomButtonStyle,
    renderClusterMarker,
    renderCustomMarker,
    transformLocationData,
    hideMapDetailsBlock = false,
    initialZoom,
    googleMapsApiKey,
    mapId,
    getShimmerJsx,
    businessTitle = "Locations",
    fullscreenControl = true,
    gestureHandling = "greedy",
    fixedMinZoomLevel = false,
}: MapContainerProps) => {
    const [showMap, setShowMap] = useState(true); // Start with true to avoid re-initialization
    const [isMapInitialized, setIsMapInitialized] = useState(false);

    // Memoize locations to prevent unnecessary re-renders
    const memoizedLocations = useMemo(() => {
        return Array.isArray(locations) ? locations : [];
    }, [locations]);

    // Memoize the map key to prevent APIProvider re-creation
    const mapKey = useMemo(() => {
        return `map-${origin}`;
    }, [origin]);

    // Generate a key based on locations to force recreation when locations change
    const mapComponentKey = useMemo(() => {
        return `map-component-${JSON.stringify(memoizedLocations.map((l: any) => l.id))}`;
    }, [memoizedLocations]);

    // Memoized Map component to prevent re-creation
    const MemoizedMap = useMemo(() => {
        return (
            <Map
                key={mapComponentKey}
                locations={memoizedLocations}
                enableCustomMarker={enableCustomMarker}
                noDataScreen={noDataScreen}
                handleShowMarkerFromParent={handleShowMarkerFromParent}
                currentHoveredItemDict={currentHoveredItemDict}
                isLoading={isLoading} // We handle loading above
                renderAdditionalTitleJSXInMapMarker={renderAdditionalTitleJSXInMapMarker}
                getMapTooltipJsx={getMapTooltipJsx}
                getClusterViewTooltipJsx={getClusterViewTooltipJsx}
                showMarkerTooltipOnClick={showMarkerTooltipOnClick}
                showResetZoomButton={showResetZoomButton}
                resetZoomButtonPosition={resetZoomButtonPosition}
                resetZoomButtonStyle={resetZoomButtonStyle}
                renderClusterMarker={renderClusterMarker}
                renderCustomMarker={renderCustomMarker}
                transformLocationData={transformLocationData}
                hideMapDetailsBlock={hideMapDetailsBlock}
                initialZoom={initialZoom}
                mapId={mapId}
                getShimmerJsx={getShimmerJsx}
                businessTitle={businessTitle}
                fullscreenControl={fullscreenControl}
                gestureHandling={gestureHandling}
                fixedMinZoomLevel={fixedMinZoomLevel}
            />
        );
    }, [
        memoizedLocations,
        noDataScreen,
        handleShowMarkerFromParent,
        currentHoveredItemDict,
        renderAdditionalTitleJSXInMapMarker,
        getMapTooltipJsx,
        getClusterViewTooltipJsx,
        showMarkerTooltipOnClick,
        showResetZoomButton,
        resetZoomButtonPosition,
        resetZoomButtonStyle,
        enableCustomMarker,
        isLoading,
        renderClusterMarker,
        renderCustomMarker,
        transformLocationData,
        hideMapDetailsBlock,
        initialZoom,
        mapId,
        businessTitle,
        fullscreenControl,
        gestureHandling,
        fixedMinZoomLevel,
        getShimmerJsx,
    ]);

    // Fast initialization for better performance - only for origin changes
    useEffect(() => {
        if (!isMapInitialized) {
            setShowMap(true);
            setIsMapInitialized(true);
            return;
        }

        // Only reset map for origin changes, not location changes
        if (origin) {
            setShowMap(false);
            const timer = setTimeout(() => {
                setShowMap(true);
            }, 50); // Reduced delay

            return () => clearTimeout(timer);
        }
    }, [origin]); // Removed isMapInitialized dependency to prevent unnecessary resets
    return (
        <React.Fragment>
            {showMap && (
                <APIProvider
                    key={mapKey}
                    apiKey={googleMapsApiKey}
                    libraries={["places", "marker"]}
                >
                    {MemoizedMap}
                </APIProvider>
            )}
        </React.Fragment>
    );
};

// Memoized container to prevent unnecessary re-renders
const MemoizedContainer = React.memo(Container, (prevProps, nextProps) => {
    // Custom comparison function for better performance
    return (
        prevProps.origin === nextProps.origin &&
        prevProps.isLoading === nextProps.isLoading &&
        prevProps.enableCustomMarker === nextProps.enableCustomMarker &&
        prevProps.handleShowMarkerFromParent === nextProps.handleShowMarkerFromParent &&
        JSON.stringify(prevProps.locations) === JSON.stringify(nextProps.locations) &&
        JSON.stringify(prevProps.noDataScreen) === JSON.stringify(nextProps.noDataScreen) &&
        JSON.stringify(prevProps.currentHoveredItemDict) ===
            JSON.stringify(nextProps.currentHoveredItemDict)
    );
});

export default MemoizedContainer;
