import React, { useCallback, useRef, useState, memo, useEffect } from "react";
import { AdvancedMarker, InfoWindow, Marker } from "@vis.gl/react-google-maps";
import currentLocationIcon from "assets/images/current-location-icon.svg";
import brandLocationMapIcon from "assets/images/brand-location-map-icon.svg";
import Tooltip from "atoms/Tooltip";

// Cluster sizing constants (three discrete buckets)
const CLUSTER_SIZE_SMALL = 32; // px
const CLUSTER_SIZE_MEDIUM = 44; // px
const CLUSTER_SIZE_LARGE = 64; // px

// Thresholds to determine bucket (adjust as needed)
const CLUSTER_THRESHOLD_MEDIUM = 21; // >=21 becomes medium
const CLUSTER_THRESHOLD_LARGE = 81; // >=81 becomes large

// Hover effect scaling factor
const HOVER_SCALE_FACTOR = 1.2;

// Hover background color constant
const HOVER_BACKGROUND_COLOR = "rgba(25, 118, 210, 0.3)"; // Light blue background with 100% opacity

// Color palette (static now, no hover state)
const CLUSTER_COLORS = {
    small: { bg: "rgba(25, 118, 210, 0.3)", border: "#1976D2" },
    medium: { bg: "rgba(25, 118, 210, 0.3)", border: "#1976D2" },
    large: { bg: "rgba(25, 118, 210, 0.3)", border: "#1976D2" },
};

type MapMarkerProps = {
    location: any;
    enableCustomMarker: boolean;
    setMarkerRef: any;
    showIndexMarker: any;
    handleShowMarkerFromParent?: boolean;
    currentHoveredItemDict?: any;
    renderAdditionalTitleJSXInMapMarker?: any;
    getMapTooltipJsx?: (marker: any) => React.ReactNode;
    getClusterViewTooltipJsx?: (markers: any) => React.ReactNode;
    onClusterClick?: (cluster: any) => void;
    showMarkerTooltipOnClick?: boolean;
    onMarkerClick?: (markerId: string | number) => void;
    onMapClick?: () => void;
    clickedMarkerId?: string | number | null;
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
    businessTitle?:string
};

export const MapMarker = memo((props: MapMarkerProps) => {
    const [isInfoWindowVisible, setInfoWindowVisible] = useState(false);
    const [hoveredMarker, setHoveredMarker] = useState<any>({});
    const [isHovered, setIsHovered] = useState(false);
    const hoverTimeoutRef = useRef<any>(null);
    const markerAnchor = useRef<any>();

    const {
        location,
        enableCustomMarker,
        setMarkerRef,
        showIndexMarker,
        handleShowMarkerFromParent = false,
        currentHoveredItemDict = {},
        renderAdditionalTitleJSXInMapMarker,
        getMapTooltipJsx,
        getClusterViewTooltipJsx,
        onClusterClick,
        showMarkerTooltipOnClick = false,
        onMarkerClick,
        onMapClick,
        clickedMarkerId,
        renderClusterMarker,
        renderCustomMarker,
        businessTitle,
    } = props;
    const { latitude, longitude, id, currentBusiness, index, isCluster, clusterSize } = location;

    useEffect(() => {
        if (handleShowMarkerFromParent) {
            const idArr = Object.keys(currentHoveredItemDict).map(Number) || [];
            if (idArr?.includes(location?.id)) {
                if (currentHoveredItemDict[location?.id]) {
                    handleMouseOverMarker();
                } else {
                    handleMouseOutMarker();
                }
            }
        }
    }, [currentHoveredItemDict]);

    // Handle clickedMarkerId changes for tooltip visibility
    useEffect(() => {
        if (showMarkerTooltipOnClick && !isCluster) {
            if (clickedMarkerId === id) {
                // This marker was clicked, show tooltip
                setHoveredMarker(location);
                setIsHovered(true);
                setInfoWindowVisible(true);
            } else {
                // Another marker was clicked or map was clicked, hide tooltip
                setIsHovered(false);
                setInfoWindowVisible(false);
            }
        }
    }, [clickedMarkerId, showMarkerTooltipOnClick, isCluster, id, location]);

    const handleMouseOverMarker = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

        // If this is a cluster hover and we have click-based tooltips enabled,
        // hide any active marker tooltip by clearing the clicked marker
        if (isCluster && showMarkerTooltipOnClick && onMapClick) {
            onMapClick(); // This will clear the clickedMarkerId
        }

        setHoveredMarker(location);
        setIsHovered(true);
        setInfoWindowVisible(true);
    };

    const handleClusterClick = (e: any) => {
        // Prevent event bubbling
        if (e?.stopPropagation) e.stopPropagation();

        if (isCluster && onClusterClick && location.originalLocations) {
            // Close info window when clicking to zoom
            setInfoWindowVisible(false);
            onClusterClick(location);
        }
    };

    const handleMarkerClick = (e?: any) => {
        if (isCluster) {
            handleClusterClick(e);
        } else if (showMarkerTooltipOnClick) {
            // For click-based tooltips on markers only
            // Just call onMarkerClick - the useEffect will handle state updates
            if (onMarkerClick) {
                onMarkerClick(id);
            }
        } else {
            // Default behavior: show tooltip on hover
            handleMouseOverMarker();
        }
    };

    const handleMouseOutMarker = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setIsHovered(false);
            setInfoWindowVisible(false);
        }, 100);
    };

    const handleMouseOverInfoWindow = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        setIsHovered(true);
        setInfoWindowVisible(true);
    };

    const handleMouseOutInfoWindow = () => {
        setIsHovered(false);
        setInfoWindowVisible(false);
    };

    const redirectToMap = () => {
        window.open(hoveredMarker?.mapUrl);
    };

    // Map cluster size -> bucket config
    const getClusterBucket = (count: number = 0) => {
        if (count >= CLUSTER_THRESHOLD_LARGE) return "large";
        if (count >= CLUSTER_THRESHOLD_MEDIUM) return "medium";
        return "small";
    };

    // Returns visual metrics for a cluster (static)
    const getClusterVisual = (count: number = 0) => {
        const bucket = getClusterBucket(count);
        const size =
            bucket === "large"
                ? CLUSTER_SIZE_LARGE
                : bucket === "medium"
                  ? CLUSTER_SIZE_MEDIUM
                  : CLUSTER_SIZE_SMALL;
        const fontSize = Math.round(size * 0.38);
        const { bg, border } = CLUSTER_COLORS[bucket as "small" | "medium" | "large"];
        return { size, fontSize, bg, border };
    };

    // Static style creator (no hover)
    const getStaticClusterStyle = (visual: {
        size: number;
        fontSize: number;
        bg: string;
        border: string;
    }) =>
        ({
            width: visual.size,
            height: visual.size,
            background: visual.bg,
            border: `2px solid ${visual.border}`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 500,
            fontSize: visual.fontSize,
            color: "#fff",
            lineHeight: 1,
            position: "relative" as const,
            zIndex: 3,
        }) as React.CSSProperties;

    // Hover background style - positioned behind the cluster circle
    const getHoverBackgroundStyle = (visual: { size: number }) =>
        ({
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: visual.size * HOVER_SCALE_FACTOR, // Larger background circle
            height: visual.size * HOVER_SCALE_FACTOR,
            background: HOVER_BACKGROUND_COLOR,
            borderRadius: "50%",
            zIndex: 1,
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
            pointerEvents: "none" as const,
        }) as React.CSSProperties;

    const ref = useCallback(
        (marker: any) => {
            markerAnchor.current = marker;
            setMarkerRef(marker, id);
        },
        [setMarkerRef, id],
    );

    // Precompute cluster visuals for standard & hover (used for non custom advanced marker -> SVG)
    const clusterVisual = isCluster ? getClusterVisual(clusterSize || 0) : null;

    // Determine if info window should be visible
    const shouldShowInfoWindow = () => {
        if (showMarkerTooltipOnClick && !isCluster) {
            // For click-based tooltips on markers: show only if this marker is clicked
            return clickedMarkerId === id;
        } else {
            // Default behavior: show on hover
            return isInfoWindowVisible;
        }
    };
    return (
        <>
            {enableCustomMarker ? (
                <AdvancedMarker
                    ref={ref}
                    position={{ lat: latitude, lng: longitude }}
                    onClick={handleMarkerClick}
                >
                    <div
                        className={`marker-wrap marker-${id}`}
                        onMouseOver={
                            !showMarkerTooltipOnClick || isCluster
                                ? handleMouseOverMarker
                                : undefined
                        }
                        onMouseOut={
                            !showMarkerTooltipOnClick || isCluster
                                ? handleMouseOutMarker
                                : undefined
                        }
                        onClick={handleClusterClick}
                        style={{
                            cursor: isCluster ? "pointer" : "default",
                            position: "relative",
                        }}
                    >
                        {isCluster ? (
                            renderClusterMarker ? (
                                renderClusterMarker(location, isHovered, handleClusterClick)
                            ) : (
                                <div style={{ position: "relative", display: "inline-block" }}>
                                    {/* Hover background circle - behind */}
                                    <div style={getHoverBackgroundStyle(clusterVisual!)} />
                                    {/* Main cluster marker - on top */}
                                    <div style={getStaticClusterStyle(clusterVisual!)}>
                                        {/* Centered cluster size label */}
                                        {/* {clusterSize || "C"} */}
                                    </div>
                                </div>
                            )
                        ) : renderCustomMarker ? (
                            renderCustomMarker(location, isHovered, handleMarkerClick)
                        ) : currentBusiness ? (
                            <img src={currentLocationIcon} />
                        ) : !showIndexMarker ? (
                            <img src={brandLocationMapIcon} />
                        ) : (
                            <span className="num-block">{index + 1}</span>
                        )}
                    </div>
                </AdvancedMarker>
            ) : (
                <Marker
                    ref={ref}
                    onMouseOver={
                        !showMarkerTooltipOnClick || isCluster ? handleMouseOverMarker : undefined
                    }
                    onMouseOut={
                        !showMarkerTooltipOnClick || isCluster ? handleMouseOutMarker : undefined
                    }
                    onClick={handleMarkerClick}
                    position={{ lat: latitude, lng: longitude }}
                    icon={
                        isCluster && clusterVisual
                            ? {
                                  url:
                                      "data:image/svg+xml;charset=UTF-8," +
                                      encodeURIComponent(`
                                <svg width="${clusterVisual.size * HOVER_SCALE_FACTOR}" height="${clusterVisual.size * HOVER_SCALE_FACTOR}" viewBox="0 0 ${clusterVisual.size * HOVER_SCALE_FACTOR} ${clusterVisual.size * HOVER_SCALE_FACTOR}" xmlns="http://www.w3.org/2000/svg">
                                    <!-- Hover background circle - behind everything -->
                                    <circle cx="${(clusterVisual.size * HOVER_SCALE_FACTOR) / 2}" cy="${(clusterVisual.size * HOVER_SCALE_FACTOR) / 2}" r="${(clusterVisual.size * HOVER_SCALE_FACTOR) / 2 - 2}" 
                                            fill="${HOVER_BACKGROUND_COLOR}" 
                                            opacity="${isHovered ? 1 : 0}" 
                                            style="transition: opacity 0.2s ease-out;" />
                                    <!-- Main cluster circle - on top with solid background -->
                                    <circle cx="${(clusterVisual.size * HOVER_SCALE_FACTOR) / 2}" cy="${(clusterVisual.size * HOVER_SCALE_FACTOR) / 2}" r="${clusterVisual.size / 2}" 
                                            fill="${clusterVisual.bg}" stroke="${clusterVisual.border}" stroke-width="2" />
                                    <!-- Text -->
                                    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="white" 
                                          font-size="${clusterVisual.fontSize}" font-family="Arial, Helvetica, sans-serif" font-weight="600">
                                          ${clusterSize || "C"}
                                    </text>
                                </svg>
                            `),
                                  scaledSize: new window.google.maps.Size(
                                      clusterVisual.size * HOVER_SCALE_FACTOR,
                                      clusterVisual.size * HOVER_SCALE_FACTOR,
                                  ),
                                  anchor: new window.google.maps.Point(
                                      (clusterVisual.size * HOVER_SCALE_FACTOR) / 2,
                                      (clusterVisual.size * HOVER_SCALE_FACTOR) / 2,
                                  ),
                              }
                            : undefined
                    }
                />
            )}
            {shouldShowInfoWindow() && (
                <InfoWindow anchor={markerAnchor.current} headerDisabled>
                    <div
                        className="map-hover-section"
                        onMouseEnter={handleMouseOverInfoWindow}
                        onMouseLeave={handleMouseOutInfoWindow}
                    >
                        {hoveredMarker?.isCluster ? (
                            getClusterViewTooltipJsx ? (
                                getClusterViewTooltipJsx(hoveredMarker?.originalLocations || [])
                            ) : (
                                (() => {
                                    return (
                                        <div>
                                            <strong>
                                                {hoveredMarker?.clusterSize} {businessTitle}
                                            </strong>
                                            <div className="tooltip-subtitle">
                                                <i className="icon_phoenix-info" />
                                                <span>
                                                    Click or pan on a cluster to zoom in and view
                                                    all {businessTitle} within it.
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })()
                            )
                        ) : getMapTooltipJsx ? (
                            getMapTooltipJsx(hoveredMarker)
                        ) : (
                            <>
                                <div
                                    className={`${hoveredMarker?.mapUrl ? "display-flex display-flex-center justify-content-betweeen" : ""}`}
                                >
                                    <div className="display-flex display-flex-center">
                                        <strong title={hoveredMarker?.name}>
                                            {hoveredMarker?.name}
                                        </strong>
                                        {renderAdditionalTitleJSXInMapMarker &&
                                            renderAdditionalTitleJSXInMapMarker(hoveredMarker)}
                                    </div>
                                    {!!hoveredMarker?.mapUrl && (
                                        <Tooltip
                                            text="Show Google page"
                                            customContainerClassName="status-tooltip"
                                        >
                                            <span onClick={redirectToMap} className="preview-block">
                                                <i className="icon_phoenix-header-preview pointer" />
                                            </span>
                                        </Tooltip>
                                    )}
                                </div>
                                {!!hoveredMarker?.reviewRating && (
                                    <div className="rating-wrap display-flex display-flex-center">
                                        <span className="star-rating-block display-flex-center">
                                            <span className="rating">
                                                {hoveredMarker?.reviewRating}
                                            </span>{" "}
                                        </span>{" "}
                                        <span className="dot">·</span>{" "}
                                        <span className="review-block">
                                            {hoveredMarker?.reviewCount}
                                        </span>
                                    </div>
                                )}
                                <span>{hoveredMarker?.address}</span>
                            </>
                        )}
                    </div>
                </InfoWindow>
            )}
        </>
    );
});
