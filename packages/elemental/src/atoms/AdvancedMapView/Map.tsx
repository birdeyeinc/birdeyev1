"use client";
import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import {
    Map as GoogleMapReact,
    useMap,
    useMapsLibrary,
    useApiIsLoaded,
} from "@vis.gl/react-google-maps";
import { MapMarker } from "./MapMarker";
// import MapLoader from "pages/setup/competitorsAI/components/ShimmerLoader/MapLoader";
// Removed clusterLocations usage; keep viewport util
import { isLocationInViewport } from "./mapUtils"; // existing import
import Styles from "./MapComponent.module.scss"

// Helper for cluster membership viewport check
const clusterMemberInViewport = (cluster: any, bounds: any, padding = 0.01) => {
    if (!cluster?.originalLocations) return false;
    return cluster.originalLocations.some((loc: any) => isLocationInViewport(loc, bounds, padding));
};
const clampClusterPosition = (cluster: any, bounds: any) => {
    if (!bounds || !cluster) return cluster;
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const clampedLat = Math.min(ne.lat(), Math.max(sw.lat(), cluster.latitude));
    const clampedLng = Math.min(ne.lng(), Math.max(sw.lng(), cluster.longitude));
    if (clampedLat !== cluster.latitude || clampedLng !== cluster.longitude) {
        return { ...cluster, latitude: clampedLat, longitude: clampedLng, wasClamped: true };
    }
    return cluster;
};

interface GoogleMapProps {
    locations: any;
    enableCustomMarker?: boolean;
    noDataScreen?: any;
    handleShowMarkerFromParent?: boolean;
    currentHoveredItemDict?: any;
    isLoading?: boolean;
    renderAdditionalTitleJSXInMapMarker?: any;
    getMapTooltipJsx?: (marker: any) => React.ReactNode;
    getClusterViewTooltipJsx?: (markers: any) => React.ReactNode;
    hideStreetViewControl?: boolean; // NEW: hide Street View control
    hideMapTypeControl?: boolean; // NEW: hide Satellite/Map type toggle
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
    mapId: string;
    getShimmerJsx?: () => React.ReactNode;
    businessTitle?:string
    fullscreenControl?:boolean;
    gestureHandling?:string;
    fixedMinZoomLevel?:boolean;
}

// DRY constants & helpers
const DEFAULT_INITIAL_ZOOM = 5;
const SINGLE_LOCATION_ZOOM = 15;
const VIEWPORT_PADDING = 0.01;
const MAX_MARKERS_CONFIG = [
    { minZoom: 12, count: 300 },
    { minZoom: 8, count: 200 },
    { minZoom: 4, count: 150 },
    { minZoom: -Infinity, count: 100 },
];
const CLUSTER_RADIUS_CONFIG = [
    { minZoom: 12, radius: 35 },
    { minZoom: 8, radius: 45 },
    { minZoom: 6, radius: 60 },
    { minZoom: 4, radius: 90 },
    { minZoom: -Infinity, radius: 110 },
];
const getMaxMarkers = (zoom: number) => {
    for (const cfg of MAX_MARKERS_CONFIG) if (zoom >= cfg.minZoom) return cfg.count;
    return 100;
};
const getClusterRadiusPx = (zoom: number) => {
    for (const cfg of CLUSTER_RADIUS_CONFIG) if (zoom >= cfg.minZoom) return cfg.radius;
    return 110;
};
// Added helper to determine if we should disable clustering entirely at high zoom
const shouldDisableClustering = (zoom: number) => zoom >= 13; // force breakup beyond this zoom

// Lightweight throttle helper (replaces prior debounce for drag / zoom)
const throttle = (fn: any, limit: number) => {
    let inFlight = false;
    let lastArgs: any[] | null = null;
    return (...args: any[]) => {
        if (inFlight) {
            lastArgs = args;
            return;
        }
        fn(...args);
        inFlight = true;
        setTimeout(() => {
            inFlight = false;
            if (lastArgs) {
                fn(...lastArgs);
                lastArgs = null;
            }
        }, limit);
    };
};

// Synchronous grid clustering fallback (used if worker not ready yet)
const gridCluster = (locations: any[], zoom: number) => {
    if (!locations.length) return [];
    const avgLat = locations.reduce((s, l) => s + parseFloat(l.latitude), 0) / locations.length;
    const clusterRadiusPx = getClusterRadiusPx(zoom);
    const metersPerPixel = (156543.03392 * Math.cos((avgLat * Math.PI) / 180)) / Math.pow(2, zoom);

    // Helper: Calculate distance between two points in degrees
    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const dLat = lat2 - lat1;
        const dLng = lng2 - lng1;
        return Math.sqrt(dLat * dLat + dLng * dLng);
    };

    // Helper: Check if two clusters overlap by more than threshold
    const clustersOverlap = (
        cluster1: any,
        cluster2: any,
        radius: number,
        overlapThreshold = 0.05,
    ) => {
        if (!cluster1.isCluster || !cluster2.isCluster) return false;

        const distance = calculateDistance(
            cluster1.latitude,
            cluster1.longitude,
            cluster2.latitude,
            cluster2.longitude,
        );

        const r1 = radius;
        const r2 = radius;

        if (distance >= r1 + r2) return false;

        if (distance <= Math.abs(r1 - r2)) {
            const smallerArea = Math.PI * Math.min(r1, r2) ** 2;
            const largerArea = Math.PI * Math.max(r1, r2) ** 2;
            return smallerArea / largerArea > overlapThreshold;
        }

        const part1 =
            r1 * r1 * Math.acos((distance * distance + r1 * r1 - r2 * r2) / (2 * distance * r1));
        const part2 =
            r2 * r2 * Math.acos((distance * distance + r2 * r2 - r1 * r1) / (2 * distance * r2));
        const part3 =
            0.5 *
            Math.sqrt(
                (-distance + r1 + r2) *
                    (distance + r1 - r2) *
                    (distance - r1 + r2) *
                    (distance + r1 + r2),
            );
        const intersectionArea = part1 + part2 - part3;

        const area1 = Math.PI * r1 * r1;
        const area2 = Math.PI * r2 * r2;
        const smallerArea = Math.min(area1, area2);

        const overlapPercentage = intersectionArea / smallerArea;
        return overlapPercentage > overlapThreshold;
    };

    // Helper: Merge two clusters
    const mergeClusters = (cluster1: any, cluster2: any) => {
        const allLocations = [
            ...(cluster1.originalLocations || [cluster1]),
            ...(cluster2.originalLocations || [cluster2]),
        ];

        const centerLat =
            allLocations.reduce((s, l) => s + parseFloat(l.latitude), 0) / allLocations.length;
        const centerLng =
            allLocations.reduce((s, l) => s + parseFloat(l.longitude), 0) / allLocations.length;

        return {
            id: `cluster_${allLocations[0].id}`,
            latitude: centerLat,
            longitude: centerLng,
            title: `${allLocations.length} locations`,
            name: `Cluster of ${allLocations.length}`,
            isCluster: true,
            clusterSize: allLocations.length,
            originalLocations: allLocations,
        };
    };

    // Helper: Merge overlapping clusters
    const mergeOverlappingClusters = (clusters: any[], clusterRadius: number) => {
        if (!clusters || clusters.length <= 1) return clusters;

        let merged = [...clusters];
        let hasOverlap = true;

        while (hasOverlap) {
            hasOverlap = false;
            const newMerged: any[] = [];
            const processed = new Set<number>();

            for (let i = 0; i < merged.length; i++) {
                if (processed.has(i)) continue;

                let current = merged[i];

                // Check for overlaps with remaining items (both clusters and individual markers)
                for (let j = i + 1; j < merged.length; j++) {
                    if (processed.has(j)) continue;

                    const other = merged[j];

                    // Calculate distance between current and other
                    const distance = calculateDistance(
                        current.latitude,
                        current.longitude,
                        other.latitude,
                        other.longitude,
                    );

                    // If distance is within cluster radius, merge them
                    if (distance <= clusterRadius * 2) {
                        // Use 2x radius for proximity check
                        // Convert individual markers to clusters if needed
                        if (!current.isCluster && !other.isCluster) {
                            // Both are individual markers - create a cluster
                            current = {
                                id: `cluster_${current.id}`,
                                latitude: (current.latitude + other.latitude) / 2,
                                longitude: (current.longitude + other.longitude) / 2,
                                title: `2 locations`,
                                name: `Cluster of 2`,
                                isCluster: true,
                                clusterSize: 2,
                                originalLocations: [current, other],
                            };
                        } else if (!current.isCluster && other.isCluster) {
                            // Current is individual, other is cluster - merge into cluster
                            current = mergeClusters(
                                { isCluster: true, originalLocations: [current] } as any,
                                other,
                            );
                        } else if (current.isCluster && !other.isCluster) {
                            // Current is cluster, other is individual - merge into cluster
                            current = mergeClusters(current, {
                                isCluster: true,
                                originalLocations: [other],
                            } as any);
                        } else if (current.isCluster && other.isCluster) {
                            // Both are clusters - check overlap
                            if (clustersOverlap(current, other, clusterRadius, 0.05)) {
                                current = mergeClusters(current, other);
                            } else {
                                continue; // No overlap, skip merging
                            }
                        }
                        processed.add(j);
                        hasOverlap = true;
                    }
                }

                newMerged.push(current);
                processed.add(i);
            }

            merged = newMerged;
        }

        return merged;
    };

    const compute = (radiusPx: number) => {
        const clusterRadiusMeters = radiusPx * metersPerPixel;
        const degLat = clusterRadiusMeters / 111320;
        const degLng = degLat / Math.cos((avgLat * Math.PI) / 180);
        const clusterRadiusDeg = Math.sqrt(degLat * degLat + degLng * degLng) / 2;

        const buckets = new Map<string, any[]>();
        for (const loc of locations) {
            const lat = parseFloat(loc.latitude);
            const lng = parseFloat(loc.longitude);
            if (loc.currentBusiness) {
                buckets.set(`cb_${loc.id}`, [loc]);
                continue;
            }
            const key = `${Math.floor(lat / degLat)}_${Math.floor(lng / degLng)}`;
            const arr = buckets.get(key);
            if (arr) arr.push(loc);
            else buckets.set(key, [loc]);
        }
        const out: any[] = [];
        for (const [key, arr] of buckets) {
            if (arr.length === 1 || key.startsWith("cb_")) {
                out.push(arr[0]);
                continue;
            }
            const centerLat = arr.reduce((s, l) => s + parseFloat(l.latitude), 0) / arr.length;
            const centerLng = arr.reduce((s, l) => s + parseFloat(l.longitude), 0) / arr.length;
            out.push({
                id: `cluster_${arr[0].id}`,
                latitude: centerLat,
                longitude: centerLng,
                title: `${arr.length} locations`,
                name: `Cluster of ${arr.length}`,
                isCluster: true,
                clusterSize: arr.length,
                originalLocations: arr,
            });
        }
        // Merge overlapping clusters
        return mergeOverlappingClusters(out, clusterRadiusDeg);
    };

    // Use consistent cluster radius - don't artificially enlarge for low zoom
    const out = compute(clusterRadiusPx);

    return out;
};

const GoogleMap = ({
    locations,
    enableCustomMarker = false,
    noDataScreen,
    handleShowMarkerFromParent = false,
    currentHoveredItemDict = {},
    isLoading = false,
    renderAdditionalTitleJSXInMapMarker,
    getMapTooltipJsx,
    getClusterViewTooltipJsx,
    hideStreetViewControl = true,
    hideMapTypeControl = true,
    showMarkerTooltipOnClick = false,
    showResetZoomButton = false,
    resetZoomButtonPosition = 'above-controls',
    resetZoomButtonStyle,
    renderClusterMarker,
    renderCustomMarker,
    transformLocationData,
    hideMapDetailsBlock = false,
    initialZoom = DEFAULT_INITIAL_ZOOM,
    mapId,
    getShimmerJsx,
    businessTitle,
    fullscreenControl,
    gestureHandling,
    fixedMinZoomLevel,
}: GoogleMapProps) => {
    const map = useMap("comp-map");
    const coreLib = useMapsLibrary("core");
    const isMapLoaded = useApiIsLoaded();

    const [, setMarkers] = useState<any>({});
    const [visibleLocations, setVisibleLocations] = useState<any[]>([]);
    const [isMapReady, setIsMapReady] = useState(false);
    const [currentZoom, setCurrentZoom] = useState<number>(initialZoom); // start at configurable zoom
    const [clusteredLocations, setClusteredLocations] = useState<any[]>([]);
    const [clickedMarkerId, setClickedMarkerId] = useState<string | number | null>(null);
    const [showResetButton, setShowResetButton] = useState(false);

    const workerRef = useRef<Worker | null>(null);
    const pendingBoundsRef = useRef<any>(null);
    const previousZoomRef = useRef<number>(initialZoom);
    const zoomDebounceRef = useRef<NodeJS.Timeout | null>(null);

    // Prepare lightweight data array with flexible transformation
    const mapLocations: any[] = useMemo(() => {
        return (locations || [])
            .map((location: any, index: number) => {
                // Use custom transformation if provided, otherwise use default transformation
                if (transformLocationData) {
                    return transformLocationData(location, index);
                }

                // Default transformation (backward compatibility)
                return {
                    id: location.id,
                    latitude: parseFloat(location.latitude),
                    longitude: parseFloat(location.longitude),
                    currentBusiness: location.currentBusiness,
                    showIndexMarker: location.showIndexMarker,
                    title: location.title,
                    name: location.name,
                    address: location.address,
                    index,
                };
            })
            .filter(
                (l: any) => l && !Number.isNaN(l.latitude) && !Number.isNaN(l.longitude) && l.id,
            );
    }, [locations, transformLocationData]);

    // Dynamic center
    const mapCenter = useMemo(() => {
        if (!mapLocations.length) return { lat: 40.7128, lng: -74.006 };
        const avgLat = mapLocations.reduce((s, l) => s + l.latitude, 0) / mapLocations.length;
        const avgLng = mapLocations.reduce((s, l) => s + l.longitude, 0) / mapLocations.length;
        return { lat: avgLat, lng: avgLng };
    }, [mapLocations]);

    const currentBusiness = useMemo(
        () => (locations || []).find((l) => l.currentBusiness) || {},
        [locations],
    );

    // Init worker
    useEffect(() => {
        if (workerRef.current) return; // already
        try {
            workerRef.current = new Worker(new URL("./clusterWorker.js", import.meta.url));
            workerRef.current.onmessage = (e: MessageEvent) => {
                const { clustered, visible, zoom } = e.data || {};
                if (Array.isArray(clustered)) setClusteredLocations(clustered);
                if (Array.isArray(visible)) setVisibleLocations(visible);
                if (typeof zoom === "number") setCurrentZoom(zoom);
            };
        } catch (err) {
            // Fallback: no worker environment -> synchronous clustering
            console.warn("Worker init failed, using synchronous clustering", err);
        }
        return () => {
            workerRef.current?.terminate();
            workerRef.current = null;
        };
    }, []);

    // Reset map when locations change (brand/location switch)
    useEffect(() => {
        if (map && mapLocations.length > 0) {
            setIsMapReady(false);
            setClusteredLocations([]);
            setVisibleLocations([]);
        }
    }, [mapLocations.length, map]);

    // Initial map fit
    useEffect(() => {
        if (!coreLib || !map || !mapLocations.length || isMapReady) return;
        const bounds = new coreLib.LatLngBounds();
        mapLocations.forEach((loc) =>
            bounds.extend(new coreLib.LatLng(loc.latitude, loc.longitude)),
        );

        // Fit bounds to show all markers - let Google Maps calculate optimal zoom
        map.fitBounds(bounds);

        // Wait for bounds to be set, then enforce minimum zoom
        setTimeout(() => {
            const calculatedZoom = map.getZoom() || initialZoom;

            // Only adjust zoom for single location case
            if (mapLocations.length === 1) {
                map.setZoom(SINGLE_LOCATION_ZOOM);
            } else if (calculatedZoom < initialZoom && fixedMinZoomLevel) {
                map.setZoom(initialZoom);
                map.setCenter(mapCenter);
            }

            setIsMapReady(true);
            const finalZoom = map.getZoom() || calculatedZoom;
            const initialClustered = gridCluster(mapLocations, finalZoom);
            setClusteredLocations(initialClustered);
            setVisibleLocations(initialClustered.slice(0, 100));
            setCurrentZoom(finalZoom);

            // Trigger bounds change after initial setup
            setTimeout(() => {
                if (map) handleBoundsChanged();
            }, 50);
        }, 100);
    }, [coreLib, map, mapLocations, isMapReady]);

    // Throttled bounds change
    const _handleBoundsChanged = useCallback(() => {
        if (!map || !isMapReady) return;
        const bounds = map.getBounds();
        if (!bounds) return;
        const zoom = map.getZoom() || currentZoom;

        // Smart zoom calculation based on zoom direction (for clustering logic)
        const previousZoom = previousZoomRef.current;
        const isZoomingIn = zoom > previousZoom + 0.05; // Reduced threshold to catch smaller changes
        const isZoomingOut = zoom < previousZoom - 0.05;

        let effectiveZoom = zoom;

        // Calculate effective zoom for clustering without changing map zoom
        if (!Number.isInteger(zoom)) {
            if (isZoomingIn) {
                // Zooming in: use ceiling for clustering calculations
                // Examples: 5→5.4 becomes 6, 7→7.2 becomes 8
                effectiveZoom = Math.ceil(zoom);
            } else if (isZoomingOut) {
                // Zooming out: use floor for clustering calculations
                // Examples: 6→5.8 becomes 5, 8→7.6 becomes 7
                effectiveZoom = Math.floor(zoom);
            } else {
                // No clear direction or very small movement: round to nearest
                effectiveZoom = Math.round(zoom);
            }
        } else {
            // Already integer zoom
            effectiveZoom = zoom;
        }

        // Update refs for next comparison
        previousZoomRef.current = zoom;
        setCurrentZoom(effectiveZoom); // Use effective zoom for state
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        const radiusPx = getClusterRadiusPx(effectiveZoom);
        const disableClustering = shouldDisableClustering(effectiveZoom);
        const payload = {
            locations: mapLocations,
            zoom: effectiveZoom,
            bounds: { sw: { lat: sw.lat(), lng: sw.lng() }, ne: { lat: ne.lat(), lng: ne.lng() } },
            radiusPx,
            disableClustering,
        };
        pendingBoundsRef.current = payload;
        if (workerRef.current) {
            workerRef.current.postMessage(payload);
        } else {
            const clustered = disableClustering
                ? mapLocations
                : gridCluster(mapLocations, effectiveZoom);
            const adjusted = clustered.map((loc) => {
                if (loc.isCluster) {
                    const centerVisible = isLocationInViewport(loc, bounds, VIEWPORT_PADDING);
                    const memberVisible = clusterMemberInViewport(loc, bounds, VIEWPORT_PADDING);
                    if (!centerVisible && memberVisible) return clampClusterPosition(loc, bounds);
                }
                return loc;
            });
            let visible: any[];
            if (effectiveZoom < 4) {
                visible = adjusted.slice(0, getMaxMarkers(effectiveZoom));
            } else {
                visible = adjusted.filter((loc) => {
                    if (loc.isCluster)
                        return (
                            isLocationInViewport(loc, bounds, VIEWPORT_PADDING) ||
                            clusterMemberInViewport(loc, bounds, VIEWPORT_PADDING)
                        );
                    return isLocationInViewport(loc, bounds, VIEWPORT_PADDING);
                });
            }
            const maxMarkers = getMaxMarkers(effectiveZoom);
            setClusteredLocations(adjusted);
            setVisibleLocations(visible.slice(0, maxMarkers));
        }
    }, [map, isMapReady, mapLocations, currentZoom]);

    // Handle drag end - immediate update for viewport changes
    const handleDragEnd = useCallback(() => {
        if (!map || !isMapReady) return;
        _handleBoundsChanged();
    }, [map, isMapReady, _handleBoundsChanged]);

    // Handle zoom change - debounced to prevent flickering on decimal zoom changes
    const handleZoomChanged = useCallback(() => {
        if (!map || !isMapReady) return;
        // Clear existing debounce timer
        if (zoomDebounceRef.current) {
            clearTimeout(zoomDebounceRef.current);
        }

        // Debounce zoom changes to prevent excessive re-plotting during scroll
        zoomDebounceRef.current = setTimeout(() => {
            const currentZoom = map.getZoom() || 5;
            const previousZoom = previousZoomRef.current;
            const isZoomingIn = currentZoom > previousZoom + 0.05;
            const isZoomingOut = currentZoom < previousZoom - 0.05;

            let effectiveZoom = currentZoom;

            // Calculate effective zoom for clustering
            if (!Number.isInteger(currentZoom)) {
                if (isZoomingIn) {
                    effectiveZoom = Math.ceil(currentZoom); // 5→5.4 becomes 6
                } else if (isZoomingOut) {
                    effectiveZoom = Math.floor(currentZoom); // 6→5.8 becomes 5
                } else {
                    effectiveZoom = Math.round(currentZoom);
                }
            }

            // Only update if effective zoom has actually changed to prevent unnecessary re-renders
            const currentEffectiveZoom = Math.round(previousZoomRef.current);
            if (effectiveZoom !== currentEffectiveZoom) {
                _handleBoundsChanged();
            }
        }, 150); // 150ms debounce - prevents multiple updates during zoom scroll
    }, [map, isMapReady, _handleBoundsChanged]);

    const handleBoundsChanged = useMemo(
        () => throttle(_handleBoundsChanged, 120),
        [_handleBoundsChanged],
    );

    // Map listeners - separate handlers for different events
    useEffect(() => {
        if (!map || !isMapReady) return;
        const listeners = [
            map.addListener("dragend", handleDragEnd),
            map.addListener("zoom_changed", handleZoomChanged),
            map.addListener("idle", handleBoundsChanged), // Keep idle as fallback
        ];

        return () => {
            listeners.forEach((l) => l && l.remove && l.remove());
            // Clear any pending debounce timer
            if (zoomDebounceRef.current) {
                clearTimeout(zoomDebounceRef.current);
                zoomDebounceRef.current = null;
            }
        };
    }, [map, isMapReady, handleDragEnd, handleZoomChanged, handleBoundsChanged]);

    // Ensure fallback initial cluster if worker slower
    useEffect(() => {
        if (isMapReady && clusteredLocations.length === 0 && mapLocations.length) {
            const zoom = currentZoom;
            const clustered = gridCluster(mapLocations, zoom);
            setClusteredLocations(clustered);
            setVisibleLocations(clustered.slice(0, 100));
        }
    }, [isMapReady, clusteredLocations.length, mapLocations, currentZoom]);

    // Fail-safe for visibleLocations
    useEffect(() => {
        if (isMapReady && clusteredLocations.length > 0 && visibleLocations.length === 0) {
            // Fail-safe: ensure at least some markers/clusters render (e.g. very low zoom)
            const fallbackMax = getMaxMarkers(currentZoom);
            setVisibleLocations(clusteredLocations.slice(0, fallbackMax));
        }
    }, [isMapReady, clusteredLocations, visibleLocations.length, currentZoom]);

    const setMarkerRef = useCallback((marker: any, key: string) => {
        setMarkers((prev) => {
            if ((marker && prev[key]) || (!marker && !prev[key])) return prev;
            if (marker) return { ...prev, [key]: marker };
            const { [key]: _, ...rest } = prev;
            return rest;
        });
    }, []);

    // Handle cluster click to zoom in and show individual markers
    const handleClusterClick = useCallback(
        (cluster: any) => {
            if (!map || !coreLib || !cluster.originalLocations) return;

            try {
                // Show reset button if enabled
                if (showResetZoomButton) {
                    setShowResetButton(true);
                }

                // Create bounds for all locations in the cluster
                const bounds = new coreLib.LatLngBounds();

                cluster.originalLocations.forEach((location: any) => {
                    bounds.extend(
                        new coreLib.LatLng(
                            parseFloat(location.latitude),
                            parseFloat(location.longitude),
                        ),
                    );
                });

                // Add some padding to the bounds
                const ne = bounds.getNorthEast();
                const sw = bounds.getSouthWest();
                const padding = 0.001; // Small padding for better view

                const paddedBounds = new coreLib.LatLngBounds(
                    new coreLib.LatLng(sw.lat() - padding, sw.lng() - padding),
                    new coreLib.LatLng(ne.lat() + padding, ne.lng() + padding),
                );

                // Fit the map to show all cluster locations
                map.fitBounds(paddedBounds);

                // Optionally set a minimum zoom level to prevent over-zooming on tightly packed clusters
                setTimeout(() => {
                    const currentZoom = map.getZoom() || 15;
                    if (currentZoom > 18) {
                        map.setZoom(18); // Max zoom to maintain readability
                    }
                }, 100);
            } catch (error) {
                console.warn("Error handling cluster click:", error);
            }
        },
        [map, coreLib, showResetZoomButton],
    );

    // Handle marker click for tooltip display
    const handleMarkerClick = useCallback(
        (markerId: string | number) => {
            if (showMarkerTooltipOnClick) {
                setClickedMarkerId(markerId);
            }
        },
        [showMarkerTooltipOnClick],
    );

    // Handle map click to hide tooltips
    const handleMapClick = useCallback(() => {
        if (showMarkerTooltipOnClick) {
            setClickedMarkerId(null);
        }
    }, [showMarkerTooltipOnClick]);

    // Handle reset zoom button click
    const handleResetZoom = useCallback(() => {
        if (!map || !mapLocations.length) return;

        try {
            if (mapLocations.length === 1) {
                // For single location, center and use single location zoom
                const location = mapLocations[0];
                map.setCenter({ lat: location.latitude, lng: location.longitude });
                map.setZoom(15);
            } else {
                // For multiple locations, fit bounds to show all markers
                if (coreLib) {
                    const bounds = new coreLib.LatLngBounds();
                    mapLocations.forEach((loc) =>
                        bounds.extend(new coreLib.LatLng(loc.latitude, loc.longitude)),
                    );
                    map.fitBounds(bounds);

                    // Ensure minimum zoom level
                    setTimeout(() => {
                        const calculatedZoom = map.getZoom() || initialZoom;
                        const finalZoom = Math.max(calculatedZoom, initialZoom);
                        if (calculatedZoom < initialZoom && fixedMinZoomLevel) {
                            map.setZoom(finalZoom);
                            map.setCenter(mapCenter);
                        }
                    }, 100);
                }
            }

            // Hide the reset button
            setShowResetButton(false);
        } catch (error) {
            console.warn("Error resetting zoom:", error);
        }
    }, [map, mapLocations, coreLib, initialZoom]);

    if (!isMapLoaded || isLoading) return getShimmerJsx ? getShimmerJsx() : "";

    return (
        <React.Fragment>
                <GoogleMapReact
                    id="comp-map"
                    style={{ width: "100%", height: "100%" }}
                    mapId={mapId}
                    defaultCenter={mapCenter}
                clickableIcons={false}
                disableDefaultUI={false}
                zoomControl={true}
                gestureHandling={gestureHandling} 
                fullscreenControl={fullscreenControl}
                streetViewControl={!hideStreetViewControl}
                mapTypeControl={!hideMapTypeControl}
                onClick={handleMapClick}
                mapTypeId={
                    hideMapTypeControl && (window as any).google?.maps?.MapTypeId?.ROADMAP
                        ? (window as any).google.maps.MapTypeId.ROADMAP
                        : undefined
                }
            >
                {isMapReady &&
                    clusteredLocations.length > 0 &&
                    visibleLocations.map((location: any) => (
                        <MapMarker
                            key={`${location.id}_${location.isCluster ? "cluster" : "location"}`}
                            location={location}
                            setMarkerRef={setMarkerRef}
                            showIndexMarker={currentBusiness.showIndexMarker}
                            enableCustomMarker={enableCustomMarker}
                            handleShowMarkerFromParent={handleShowMarkerFromParent}
                            currentHoveredItemDict={currentHoveredItemDict}
                            renderAdditionalTitleJSXInMapMarker={
                                renderAdditionalTitleJSXInMapMarker
                            }
                            getMapTooltipJsx={getMapTooltipJsx}
                            getClusterViewTooltipJsx={getClusterViewTooltipJsx}
                            onClusterClick={handleClusterClick}
                            showMarkerTooltipOnClick={showMarkerTooltipOnClick}
                            onMarkerClick={handleMarkerClick}
                            onMapClick={handleMapClick}
                            clickedMarkerId={clickedMarkerId}
                            renderClusterMarker={renderClusterMarker}
                            renderCustomMarker={renderCustomMarker}
                            businessTitle={businessTitle}
                        />
                    ))}


            {showResetButton && showResetZoomButton && (
                <div
                    className={Styles[`reset-zoom-button-${resetZoomButtonPosition}`]}
                    style={resetZoomButtonStyle}
                    onClick={handleResetZoom}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f5f5f5";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                    }}
                    title={"Reset"}
                >
                    <i className="icon_phoenix-restart_alt" />
                </div>
            )}
            </GoogleMapReact>


            {!!mapLocations.length && !hideMapDetailsBlock && (
                <div className="show-map-detail-block">
                    {`Showing ${currentBusiness.detailBlockText || "locations of "}`}
                    <span>{currentBusiness.title}</span>
                </div>
            )}
            {noDataScreen?.isShow ? (
                <div className="no-location-overlay-block display-flex display-flex-center justify-content-center">
                    <div className="text-center">
                        {noDataScreen.logoOrImg}
                        <p className="mb-8">{noDataScreen.text}</p>
                        {noDataScreen.ctaJsx}
                    </div>
                </div>
            ) : null}
        </React.Fragment>
    );
};

export default GoogleMap;
