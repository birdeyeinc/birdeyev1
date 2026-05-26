// Utility functions for map optimization

interface Location {
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    name: string;
    currentBusiness?: boolean;
    [key: string]: any;
}

interface ClusteredLocation extends Location {
    isCluster?: boolean;
    clusterSize?: number;
    originalLocations?: Location[];
}

// Calculate pixel distance between two points on the map
export const calculatePixelDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
    map: any,
): number => {
    if (!map) {
        // Use geographic distance converted to approximate pixels
        const kmDistance = calculateDistance(lat1, lng1, lat2, lng2);
        return kmDistance * 50; // 1km ≈ 50px at zoom level 4-6
    }

    try {
        const projection = map.getProjection();
        const zoom = map.getZoom() || 4;

        if (!projection) {
            // Fallback: use geographic distance with zoom-based conversion
            const kmDistance = calculateDistance(lat1, lng1, lat2, lng2);
            const pixelsPerKm = Math.pow(2, zoom - 4) * 10; // Zoom-based conversion
            return kmDistance * pixelsPerKm;
        }

        const point1 = projection.fromLatLngToPoint(new google.maps.LatLng(lat1, lng1));
        const point2 = projection.fromLatLngToPoint(new google.maps.LatLng(lat2, lng2));

        if (!point1 || !point2) {
            // Fallback to geographic distance
            const kmDistance = calculateDistance(lat1, lng1, lat2, lng2);
            const pixelsPerKm = Math.pow(2, zoom - 4) * 10;
            return kmDistance * pixelsPerKm;
        }

        const scale = Math.pow(2, zoom);

        const pixelDistance = Math.sqrt(
            Math.pow((point1.x - point2.x) * scale, 2) + Math.pow((point1.y - point2.y) * scale, 2),
        );

        return pixelDistance;
    } catch (_) {
        // Fallback to geographic distance if pixel calculation fails
        const kmDistance = calculateDistance(lat1, lng1, lat2, lng2);
        const zoom = map?.getZoom() || 4;
        const pixelsPerKm = Math.pow(2, zoom - 4) * 10;
        return kmDistance * pixelsPerKm;
    }
};

// Calculate distance between two points using Haversine formula (fallback)
export const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};

// Pixel-based clustering algorithm for nearby locations
export const clusterLocations = (
    locations: Location[],
    clusterRadius: number = 50, // pixels
    map?: any, // Google Maps instance for pixel calculations
): ClusteredLocation[] => {
    if (!locations.length) return [];

    const clustered: ClusteredLocation[] = [];
    const processed = new Set<string>();

    locations.forEach((location, _) => {
        if (processed.has(location.id)) return;

        // Always keep current business separate
        if (location.currentBusiness) {
            clustered.push(location);
            processed.add(location.id);
            return;
        }

        const nearby = locations.filter((other) => {
            if (processed.has(other.id) || other.currentBusiness || other.id === location.id) {
                return false;
            }

            const distance = calculatePixelDistance(
                parseFloat(location.latitude.toString()),
                parseFloat(location.longitude.toString()),
                parseFloat(other.latitude.toString()),
                parseFloat(other.longitude.toString()),
                map,
            );

            return distance <= clusterRadius;
        });

        if (nearby.length >= 0) {
            // Create cluster even with 1 nearby location (2 total)
            // Create cluster
            const allInCluster = [location, ...nearby];
            const centerLat =
                allInCluster.reduce((sum, loc) => sum + parseFloat(loc.latitude.toString()), 0) /
                allInCluster.length;
            const centerLon =
                allInCluster.reduce((sum, loc) => sum + parseFloat(loc.longitude.toString()), 0) /
                allInCluster.length;

            // Only create cluster if there are at least 2 locations
            if (allInCluster.length >= 2) {
                const clusterItem = {
                    id: `cluster_${location.id}`,
                    latitude: centerLat,
                    longitude: centerLon,
                    title: `${allInCluster.length} locations`,
                    name: `Cluster of ${allInCluster.length}`,
                    isCluster: true,
                    clusterSize: allInCluster.length,
                    originalLocations: allInCluster,
                };

                clustered.push(clusterItem);

                // Mark all as processed
                allInCluster.forEach((loc) => processed.add(loc.id));
            } else {
                // Single location
                clustered.push(location);
                processed.add(location.id);
            }
        } else {
            // Single location
            clustered.push(location);
            processed.add(location.id);
        }
    });

    return clustered;
};

// Get zoom level based clustering radius in pixels
export const getClusteringRadius = (zoomLevel: number): number => {
    // More aggressive pixel-based clustering
    if (zoomLevel >= 15) return 30; // 30px - tight clustering for close zoom
    if (zoomLevel >= 12) return 35; // 35px
    if (zoomLevel >= 10) return 40; // 40px
    if (zoomLevel >= 8) return 45; // 45px
    if (zoomLevel >= 6) return 50; // 50px
    if (zoomLevel >= 4) return 60; // 60px
    return 70; // 70px for very zoomed out view
};

// Throttle function for performance optimization
export const throttle = (func: any, limit: number) => {
    let inThrottle: boolean;
    return function (this: any, ...args: any[]) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

// Check if location is within viewport bounds with padding
export const isLocationInViewport = (
    location: Location,
    bounds: any,
    padding: number = 0.01,
): boolean => {
    if (!bounds) return false;

    const lat = parseFloat(location.latitude.toString());
    const lng = parseFloat(location.longitude.toString());

    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    return (
        lat >= sw.lat() - padding &&
        lat <= ne.lat() + padding &&
        lng >= sw.lng() - padding &&
        lng <= ne.lng() + padding
    );
};
