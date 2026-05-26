/* Grid clustering Web Worker
   Receives: { locations: Array<{id, latitude, longitude, currentBusiness}>, zoom, bounds: {sw:{lat,lng}, ne:{lat,lng}} }
   Returns: { clustered: [...], visible: [...], zoom }
*/

// Simple viewport check with padding
function inViewport(loc, b, padding = 0.01) {
    if (!b) return false;
    const { latitude: lat, longitude: lng } = loc;
    return (
        lat >= b.sw.lat - padding &&
        lat <= b.ne.lat + padding &&
        lng >= b.sw.lng - padding &&
        lng <= b.ne.lng + padding
    );
}

// Calculate distance between two points in degrees
function calculateDistance(lat1, lng1, lat2, lng2) {
    const dLat = lat2 - lat1;
    const dLng = lng2 - lng1;
    return Math.sqrt(dLat * dLat + dLng * dLng);
}

// Check if two clusters overlap by more than a given threshold
function clustersOverlap(cluster1, cluster2, radius1, radius2, overlapThreshold = 0.05) {
    if (!cluster1.isCluster || !cluster2.isCluster) return false;

    const distance = calculateDistance(
        cluster1.latitude,
        cluster1.longitude,
        cluster2.latitude,
        cluster2.longitude,
    );

    // Calculate overlap area
    const r1 = radius1;
    const r2 = radius2;

    // If distance is greater than sum of radii, no overlap
    if (distance >= r1 + r2) return false;

    // If one cluster is inside the other
    if (distance <= Math.abs(r1 - r2)) {
        const smallerArea = Math.PI * Math.min(r1, r2) ** 2;
        const largerArea = Math.PI * Math.max(r1, r2) ** 2;
        return smallerArea / largerArea > overlapThreshold;
    }

    // Calculate intersection area using formula for two circles
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
}

// Merge two clusters into one
function mergeClusters(cluster1, cluster2) {
    const allLocations = [
        ...(cluster1.originalLocations || [cluster1]),
        ...(cluster2.originalLocations || [cluster2]),
    ];

    const centerLat = allLocations.reduce((s, l) => s + l.latitude, 0) / allLocations.length;
    const centerLng = allLocations.reduce((s, l) => s + l.longitude, 0) / allLocations.length;

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
}

// Merge overlapping clusters
function mergeOverlappingClusters(clusters, clusterRadius) {
    if (!clusters || clusters.length <= 1) return clusters;

    let merged = [...clusters];
    let hasOverlap = true;

    // Keep merging until no more overlaps found
    while (hasOverlap) {
        hasOverlap = false;
        const newMerged = [];
        const processed = new Set();

        for (let i = 0; i < merged.length; i++) {
            if (processed.has(i)) continue;

            let current = merged[i];

            // Check for overlaps with remaining items (both clusters and individual markers)
            for (let j = i + 1; j < merged.length; j++) {
                if (processed.has(j)) continue;

                const other = merged[j];

                // Calculate distance between current and other (handle both clusters and individuals)
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
                            { isCluster: true, originalLocations: [current] },
                            other,
                        );
                    } else if (current.isCluster && !other.isCluster) {
                        // Current is cluster, other is individual - merge into cluster
                        current = mergeClusters(current, {
                            isCluster: true,
                            originalLocations: [other],
                        });
                    } else if (current.isCluster && other.isCluster) {
                        // Both are clusters - check overlap
                        if (clustersOverlap(current, other, clusterRadius, clusterRadius, 0.05)) {
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
}

function gridCluster(locations, zoom) {
    if (!locations || !locations.length) return [];
    const avgLat = locations.reduce((s, l) => s + l.latitude, 0) / locations.length;
    const clusterRadiusPx = zoom >= 12 ? 35 : zoom >= 8 ? 45 : zoom >= 4 ? 60 : 70;
    const metersPerPixel = (156543.03392 * Math.cos((avgLat * Math.PI) / 180)) / Math.pow(2, zoom);
    const clusterRadiusMeters = clusterRadiusPx * metersPerPixel;
    const degLat = clusterRadiusMeters / 111320; // meters per degree latitude
    const degLng = degLat / Math.cos((avgLat * Math.PI) / 180);
    const clusterRadiusDeg = Math.sqrt(degLat * degLat + degLng * degLng) / 2; // Average radius in degrees

    const buckets = new Map();
    for (const loc of locations) {
        if (loc.currentBusiness) {
            buckets.set(`cb_${loc.id}`, [loc]);
            continue;
        }
        const key = `${Math.floor(loc.latitude / degLat)}_${Math.floor(loc.longitude / degLng)}`;
        const arr = buckets.get(key);
        if (arr) arr.push(loc);
        else buckets.set(key, [loc]);
    }
    const out = [];
    for (const [key, arr] of buckets.entries()) {
        if (arr.length === 1 || key.startsWith("cb_")) {
            out.push(arr[0]);
            continue;
        }
        const centerLat = arr.reduce((s, l) => s + l.latitude, 0) / arr.length;
        const centerLng = arr.reduce((s, l) => s + l.longitude, 0) / arr.length;
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
}

function clusterAnyMemberInViewport(cluster, b, padding = 0.01) {
    if (!cluster.originalLocations) return false;
    for (const loc of cluster.originalLocations) {
        if (inViewport({ latitude: loc.latitude, longitude: loc.longitude }, b, padding))
            return true;
    }
    return false;
}

// Clamp helper
function clampClusterPosition(cluster, b) {
    if (!b || !cluster) return cluster;
    const { latitude, longitude } = cluster;
    const clampedLat = Math.min(b.ne.lat, Math.max(b.sw.lat, latitude));
    const clampedLng = Math.min(b.ne.lng, Math.max(b.sw.lng, longitude));
    if (clampedLat !== latitude || clampedLng !== longitude) {
        return { ...cluster, latitude: clampedLat, longitude: clampedLng, wasClamped: true };
    }
    return cluster;
}

self.onmessage = function (e) {
    try {
        const {
            locations = [],
            zoom = 4,
            bounds,
            radiusPx,
            disableClustering = false,
        } = e.data || {};
        let clustered = disableClustering ? locations : gridCluster(locations, zoom);
        // Recompute with custom radius if provided and not disabling clustering
        if (!disableClustering && typeof radiusPx === "number") {
            // Override cluster radius by temporarily adjusting zoom-based result if radiusPx smaller (higher zoom)
            // Simple refinement: if zoom high and radiusPx <= 35 ensure breakup
            if (radiusPx <= 30 && zoom >= 12) clustered = gridCluster(locations, zoom + 1); // simulate tighter buckets
        }
        let visibleAll;
        if (bounds) {
            visibleAll = clustered
                .map((loc) => {
                    if (loc.isCluster) {
                        const centerVisible = inViewport(loc, bounds, 0.01);
                        const memberVisible = clusterAnyMemberInViewport(loc, bounds, 0.01);
                        if (!centerVisible && memberVisible) {
                            return clampClusterPosition(loc, bounds);
                        }
                    }
                    return loc;
                })
                .filter((loc) => {
                    if (loc.isCluster)
                        return (
                            inViewport(loc, bounds, 0.01) ||
                            clusterAnyMemberInViewport(loc, bounds, 0.01)
                        );
                    return inViewport(loc, bounds, 0.01);
                });
        } else {
            visibleAll = clustered.slice(0, 100);
        }
        const maxMarkers = zoom >= 12 ? 300 : zoom >= 8 ? 200 : zoom >= 4 ? 150 : 100;
        const visible = visibleAll.slice(0, maxMarkers);
        self.postMessage({ clustered, visible, zoom });
    } catch (err) {
        self.postMessage({ clustered: [], visible: [], zoom: 4, error: err && err.message });
    }
};
