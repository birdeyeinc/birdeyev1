import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import PropTypes from "prop-types";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import Button from "atoms/Button";
import Styles from "./mapview.module.scss";
import { isNumber } from "lodash";

function GoogleMaps(props) {
    const { getShimmerComponent, isGoogleMapLoaded, DATA, getMapTooltipJsx, getMarkerIcon, enableCluster, markerIconDimension, clusterInfo, getClusterValue, getClusterViewTooltipJsx, isLightWeightPage, mapHeight } = props;

    const [overlayPosition, setOverlayPosition] = useState(null);
    const [overlayContent, setOverlayContent] = useState(null);
    const [clusterTooltip, setClusterTooltip] = useState(null);
    const [showReset, setShowReset] = useState(false);
    const [zoom, setZoom] = useState(2);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

    const mapRef = useRef(null);
    const defaultBoundsRef = useRef(null);
    const timeOutId = useRef(null);
    const clusterRef = useRef(null);
    const clusterHoveredRef = useRef(false);

    const memoizedMarkers = useMemo(() => Object.values(DATA?.markers || {}), [DATA]);

    useEffect(() => {
        return () => {
            clusterRef.current?.clearMarkers();
            clusterRef.current = null;
            clearTimeout(timeOutId.current);
        };
    }, []);

    const isValidLatLng = (marker) => {
        let lat = marker.lat || marker.latitude;
        let lon = marker.lon || marker.longitude;
        if(lat && isNumber(lat) && lon && isNumber(lon)) {
            return true;
        } else {
            return false;
        }
    }

    useEffect(() => {
        if (!window.google || !DATA?.markers || hasUserInteracted) return;
        const bounds = new window.google.maps.LatLngBounds();
        memoizedMarkers.forEach((marker) => {
            if ((marker.lat || marker.latitude) && (marker.lon || marker.longitude)) {
                isValidLatLng(marker) && bounds.extend({ lat: marker.lat || marker.latitude, lng: marker.lon || marker.longitude });
            }
        });
        defaultBoundsRef.current = bounds;
        mapRef.current?.fitBounds(bounds);
        setShowReset(false);
    }, [memoizedMarkers, isGoogleMapLoaded]);

    const onZoomChanged = useCallback(() => {
        const currentZoom = mapRef.current?.getZoom();
        if (currentZoom != null) setZoom(currentZoom);
        setHasUserInteracted(true);
    }, []);

    const handleMarkerMouseClick = useCallback(
        (marker) => {
           isValidLatLng(marker) && setOverlayPosition({ lat: marker.lat || marker.latitude, lng: marker.lon || marker.longitude });
            setOverlayContent(getMapTooltipJsx?.(marker));
        },
        [getMapTooltipJsx],
    );

    const handleCloseInfoWindow = useCallback(() => {
        setOverlayPosition(null);
        setOverlayContent(null);
        setClusterTooltip(null);
    }, []);

    const handleClusterMouseOver = useCallback(
        (position, markers) => {
            clearTimeout(timeOutId.current);
            setOverlayPosition(null);
            setOverlayContent(null);
            setClusterTooltip({
                position,
                content: getClusterViewTooltipJsx(markers)
            });
        },
        [getClusterViewTooltipJsx],
    );

    const handleClusterMouseOut = useCallback(() => {
        timeOutId.current = setTimeout(() => {
            if (!clusterHoveredRef.current) {
                setClusterTooltip(null);
            }
        }, 200);
    }, []);

    const handleClusterClick = useCallback(() => {
        setOverlayPosition(null);
        setOverlayContent(null);
        setClusterTooltip(null);
        setShowReset(true);
    }, []);

    const createOptimizedMarkers = useCallback(
        (markersData) =>
            markersData.map((m) => 
                isValidLatLng(m) ? {
                    position: { lat: m.lat || m.latitude, lng: m.lon || m.longitude },
                    data: m,
                    rank: m?.localSeoRank?.localSeoRank
                } : null
            ).filter(Boolean),
        [],
    );

    const setClusterView = useCallback(
        () => {
            const bounds = new window.google.maps.LatLngBounds();
            clusterRef.current?.clearMarkers();

            const { color = "blue", scale = 20, fillOpacity = 0.6, strokeColor = "white", strokeWeight = 2, labelColor = "white", labelFontSize = "14" } = clusterInfo || {};

            const optimizedMarkers = createOptimizedMarkers(memoizedMarkers);

            const markers = optimizedMarkers.map((markerData) => {
                if (!markerData?.position || !markerData?.position?.lat || !markerData?.position?.lng) {
                    return null; 
                }
                const marker = new window.google.maps.Marker({
                    position: markerData.position,
                    icon: {
                        url: markerData.data && getMarkerIcon(markerData.data),
                        scaledSize: new window.google.maps.Size(53.95, 38)
                    },
                    map: null
                });

                marker.addListener("click", () => handleMarkerMouseClick(markerData.data));
                marker.rank = markerData.rank;
                marker.data = markerData.data;
                bounds.extend(markerData.position);
                return marker;
            });

            clusterRef.current = new MarkerClusterer({
                map: mapRef.current,
                markers,
                renderer: {
                    render: ({ count, position, markers }) => {
                         if (!position || !position.lat || !position.lng) {
                            return null;
                        }
                        const clusterValue = getClusterValue ? getClusterValue(markers) : count;
                        const clusterMarker = new window.google.maps.Marker({
                            position,
                            label: { text: `${clusterValue}`, color: labelColor, fontSize: `${labelFontSize}px` },
                            icon: {
                                path: window.google.maps.SymbolPath.CIRCLE,
                                fillColor: color,
                                fillOpacity,
                                strokeColor,
                                strokeWeight,
                                scale
                            }
                        });

                        clusterMarker.addListener("mouseover", () => handleClusterMouseOver(position, markers));
                        clusterMarker.addListener("mouseout", handleClusterMouseOut);
                        clusterMarker.addListener("click", handleClusterClick);

                        return clusterMarker;
                    }
                }
            });
            if (zoom === 2) mapRef.current?.fitBounds(bounds);
        },
        [createOptimizedMarkers, getClusterValue, getMarkerIcon, clusterInfo, memoizedMarkers, handleMarkerMouseClick, handleClusterClick, handleClusterMouseOut, handleClusterMouseOver, zoom],
    );

    const resetMapView = () => {
        if (mapRef.current && defaultBoundsRef.current) {
            setShowReset(false);
            setHasUserInteracted(false);
            requestAnimationFrame(() => {
                setClusterView();
                requestAnimationFrame(() => {
                    mapRef.current.fitBounds(defaultBoundsRef.current);
                });
            });
        }
    };

    const getMarkerJsx = () => {
        const { width = 38, height = 26, padding = 6 } = markerIconDimension || {};
        return Object.entries(DATA.markers).map(([key, marker]) => (
            isValidLatLng(marker) &&
            <Marker
                key={key}
                position={{ lat: marker.lat || marker.latitude, lng: marker.lon || marker.longitude }}
                icon={
                    marker.currentLocationValue
                        ? {
                            url: marker && getMarkerIcon(marker),
                            scaledSize: new window.google.maps.Size(width + padding * 2, height + padding * 2)
                        }
                        : { url: marker && getMarkerIcon(marker) }
                }
                onClick={() => handleMarkerMouseClick(marker)}
            />
        ));
    };

    return (
        <div className={Styles["grid-rank-container"]}>
            <div className={Styles["grid-rank-map"]}>
                {isGoogleMapLoaded ? (
                    <>
                        {showReset && enableCluster && <Button onClick={resetMapView} label="" theme="secondary" icon="icon_phoenix-restart_alt" className={Styles["reset-button"]} />}
                        <GoogleMap
                            mapContainerStyle={{ width: "100%", height: isLightWeightPage ? "400px" : `${mapHeight}px`, borderRadius: "10px", cursor: "pointer" }}
                            zoom={zoom}
                            onClick={handleCloseInfoWindow}
                            onZoomChanged={onZoomChanged}
                            options={{
                                mapTypeControl: false,
                                fullscreenControl: false,
                                zoomControl: true,
                                streetViewControl: false,
                                draggable: true,
                                styles: [{ featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] }],
                                gestureHandling: "cooperative"
                            }}
                            onLoad={(map) => {
                                mapRef.current = map;
                                if (enableCluster) {
                                    setClusterView();
                                } else {
                                    const bounds = new window.google.maps.LatLngBounds();
                                    memoizedMarkers.forEach((marker) => {
                                        if ((marker.lat || marker.latitude) && (marker.lon || marker.longitude)) {
                                            isValidLatLng(marker) && bounds.extend({ lat: marker.lat || marker.latitude, lng: marker.lon || marker.longitude });
                                        }
                                    });
                                    map.fitBounds(bounds);
                                }
                            }}
                        >
                            {!enableCluster && getMarkerJsx()}
                            {overlayPosition && overlayContent && (
                                <InfoWindow position={overlayPosition} onCloseClick={handleCloseInfoWindow}>
                                    <div className="tooltip">{overlayContent}</div>
                                </InfoWindow>
                            )}
                            {enableCluster && clusterTooltip && (
                                <InfoWindow position={clusterTooltip.position} onCloseClick={handleClusterMouseOut}>
                                    <div
                                        className="tooltip"
                                        onMouseEnter={() => {
                                            clusterHoveredRef.current = true;
                                            clearTimeout(timeOutId.current);
                                        }}
                                        onMouseLeave={() => {
                                            clusterHoveredRef.current = false;
                                            setClusterTooltip(null);
                                        }}
                                    >
                                        {clusterTooltip.content}
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </>
                ) : (
                    getShimmerComponent("LocationView")
                )}
            </div>
        </div>
    );
}

GoogleMaps.propTypes = {
    getShimmerComponent: PropTypes.func,
    isGoogleMapLoaded: PropTypes.bool,
    DATA: PropTypes.object,
    getMapTooltipJsx: PropTypes.func,
    getMarkerIcon: PropTypes.func,
    mapData: PropTypes.object,
    markerIconDimension: PropTypes.object,
    enableCluster: PropTypes.bool,
    clusterInfo: PropTypes.object,
    getClusterValue: PropTypes.func,
    getClusterViewTooltipJsx: PropTypes.func,
    isLightWeightPage: PropTypes.bool,
    mapHeight: PropTypes.number
};

export default React.memo(GoogleMaps);