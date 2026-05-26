
import React from "react";
import { MapViewState, MapViewProps } from "./interface";
import GoogleMaps from "./GoogleMaps";
import Styles from "./mapview.module.scss";


class MapView extends React.Component<MapViewProps, MapViewState> {
  constructor(props: MapViewProps) {
    super(props);
    const processedData = this.getMapData(props.mapData);
    this.state = {
      isGoogleMapLoaded: false,
      processedMapData: processedData,
    };
  }

  componentDidMount(): void {
    const { googleMapApiKey } = this.props;
    if (!window.google && googleMapApiKey) {
      const googleScript = document.createElement("script");
      googleScript.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapApiKey}`;
      googleScript.async = true;
      googleScript.defer = true;
      googleScript.onload = () => {
        this.setState({ isGoogleMapLoaded: true });
      };
      document.body.appendChild(googleScript);
    } else {
      this.setState({ isGoogleMapLoaded: true });
    }
  }

  componentDidUpdate(prevProps: MapViewProps): void {
    // Check multiple conditions for when to update
    const mapDataRefChanged = prevProps.mapData !== this.props.mapData;
    
    // Deep comparison of mapData
    const prevMapDataStr = JSON.stringify(prevProps.mapData);
    const currentMapDataStr = JSON.stringify(this.props.mapData);
    const mapDataContentChanged = prevMapDataStr !== currentMapDataStr;
    
    // Update if any condition is true
    if (mapDataRefChanged || mapDataContentChanged) {
      const newProcessedData = this.getMapData(this.props.mapData);
      
      // Compare the processed data to see if it actually changed
      const prevProcessedDataStr = JSON.stringify(this.state.processedMapData);
      const newProcessedDataStr = JSON.stringify(newProcessedData);
      const processedDataChanged = prevProcessedDataStr !== newProcessedDataStr;
      
      if (processedDataChanged) {
        this.setState({
          processedMapData: newProcessedData,
        });
      }
    }
  }

  getMarkers = (data: any) => {
    const { getMarkerList, getMarkerValue, getMarkerId } = this.props;
    let locations = getMarkerList ? getMarkerList(data) : [];
    let marker: any = {};
    if (locations) {
      locations.forEach((item: { latitude: any; longitude: any; }) => {
        let id = getMarkerId ? getMarkerId(item) : Math.random();
        let obj = {
          lat: item?.latitude,
          lon: item?.longitude,
          currentLocationValue: getMarkerValue ? getMarkerValue(item) : null,
          id,
          ...item
        };
        marker[id] = obj;
      });
    }
    return marker;
  };

  getMapCenter = (data: any) => {
    const {
      getMarkerList,
      getMarkerValue,
      getMarkerId,
      centralLoc,
    } = this.props;
    let locations = getMarkerList(data);
    if (locations && locations.length > 0) {
      let id = getMarkerId(centralLoc);
      let centerMark: any = {};
      let centerLocObj = {
        lat: centralLoc?.lat || centralLoc?.latitude,
        lon: centralLoc?.lon || centralLoc?.longitude,
        currentLocationValue: getMarkerValue(centralLoc),
        id,
      };
      centerMark[id] = centerLocObj;
      return centerMark;
    } else {
      return {};
    }
  };

  getMapData = (mapData: any) => {
    let marker = this.getMarkers(mapData);
    let mapCenter = this.getMapCenter(mapData);
    return {
      markers: marker,
      center: mapCenter,
    };
  };
  getShimmerComponent = () => {
    const { getShimmerJsx } = this.props;
    return  getShimmerJsx ? getShimmerJsx() : <React.Fragment>
          <div>
              Loading component
          </div>
      </React.Fragment>
  };

  render() {
    const { mapData, getMapTooltipJsx, getMarkerIcon, mapHeight = 500, markerIconDimension, isLightWeightPage, clusterInfo, getClusterValue, getClusterViewTooltipJsx, enableCluster }  = this.props;
    const { isGoogleMapLoaded, processedMapData } = this.state;
    
    // ALWAYS process fresh data in render to ensure we have the latest
    const freshProcessedData = this.getMapData(mapData);
    
    // Use state data if available, otherwise use fresh data
    const dataToUse = processedMapData || freshProcessedData;
    
    // Create a lightweight key based on marker count and center location
    const markerCount = Object.keys(dataToUse?.markers || {}).length;
    const centerKey = dataToUse?.center ? Object.keys(dataToUse.center).join(',') : 'no-center';
    const dataKey = `markers-${markerCount}-center-${centerKey}`;
    
    return (
      <div style={{ height: `${mapHeight}px` }}>
         <div className={Styles["average-rank-tableMapw"]}>
            <GoogleMaps
              key={dataKey} // Use processed data as key to force update when data changes
              isGoogleMapLoaded={isGoogleMapLoaded}
              getShimmerComponent={this.getShimmerComponent}
              DATA={dataToUse} // Use the determined data
              getMapTooltipJsx={getMapTooltipJsx}
              getMarkerIcon={getMarkerIcon}
              mapHeight={mapHeight}
              markerIconDimension={markerIconDimension}
              enableCluster={enableCluster}
              clusterInfo={clusterInfo}
              getClusterValue={getClusterValue}
              getClusterViewTooltipJsx={getClusterViewTooltipJsx}
              isLightWeightPage={isLightWeightPage}
            />
        </div>
      </div>
    );
  }
}

export default MapView;
