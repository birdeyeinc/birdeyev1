export interface MapViewProps{
    mapData?: any;
    getMapTooltipJsx?: any;
    getMarkerList?: any;
    getMarkerValue?: any;
    getMarkerId?: any,
    drillToInternalPage?: any;
    getMarkerIcon?: any;
    centralLoc?: any;
    googleMapApiKey?: string;
    mapHeight?: number;
    markerIconDimension?: any;
    getShimmerJsx?: any;
    enableCluster?: boolean;
    clusterInfo?: any;
    getClusterValue?: any;
    getClusterViewTooltipJsx?: any;
    isLightWeightPage?: boolean;
}

export interface MapViewState{
    isGoogleMapLoaded?: boolean;
    processedMapData?: any;
}