// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from "../table.module.scss";
import type { UseVirtualizationParams, UseVirtualizationReturn } from '../types';

/**
 * Custom hook for table virtualization
 * Handles scroll detection, visible range calculation, and container management
 */
const useVirtualization = ({ data, virtualization, containerRef, enabledHeaders: headers, rowHoverAction, enableAccordion }: UseVirtualizationParams): UseVirtualizationReturn => {
    const [scrollTop, setScrollTop] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const [measuredRowHeight, setMeasuredRowHeight] = useState<number | null>(null);
    const scrollElementRef = useRef<Window | Element | null>(null);
    const measurementRef = useRef<{ measured: boolean; retryCount: number }>({ measured: false, retryCount: 0 });
    
    // Check if using window scroll
    const useWindow = virtualization?.useWindow ?? false;

    // Auto-measure row height from actual DOM
    useEffect(() => {
        if (!virtualization.enabled || !data?.length || measurementRef.current.measured) return;
        
        let retryTimeoutId: ReturnType<typeof setTimeout> | null = null;
        
        const measureRowHeight = () => {
            try {
                const tbody = containerRef.current;
                if (!tbody) return;
                
                // Look for the first actual row (not spacer)
                const firstRow = tbody.querySelector('tr:not([style*="pointer-events: none"])');
                if (!firstRow) {
                    // Retry after a short delay if row not found
                    if (measurementRef.current.retryCount < 3) {
                        measurementRef.current.retryCount++;
                        retryTimeoutId = setTimeout(measureRowHeight, 100);
                    }
                    return;
                }
                
                const height = firstRow.getBoundingClientRect().height;
                if (height > 0) {
                    setMeasuredRowHeight(Math.round(height));
                    measurementRef.current.measured = true;
                }
            } catch (error) {
                console.warn('Error measuring row height:', error);
            }
        };
        
        // Measure after a short delay to ensure DOM is ready
        const initialTimeoutId = setTimeout(measureRowHeight, 50);
        
        return () => {
            clearTimeout(initialTimeoutId);
            if (retryTimeoutId) {
                clearTimeout(retryTimeoutId);
            }
        };
    }, [virtualization.enabled, data?.length, containerRef]);

    // Setup scroll listener and container size observer
    useEffect(() => {
        if (!virtualization.enabled) return;
        let isMounted = true;
        let initTimeoutId: ReturnType<typeof setTimeout> | null = null;

        const findScrollContainer = () => {
            // If useWindow is enabled, use window for scrolling
            if (useWindow) {
                return window;
            }
            
            // Start from the tbody and go up to find scrollable container
            let element = containerRef.current;
            
            // Safety check for containerRef
            if (!element) {
                return document.body;
            }
            
            while (element && element !== document.body) {
                element = element?.parentElement;
                
                if (!element) break;
                
                try {
                    // Check if element is scrollable
                    const computedStyle = window.getComputedStyle(element);
                    const hasVerticalScroll = computedStyle.overflowY === 'auto' || computedStyle.overflowY === 'scroll';
                    
                    if (hasVerticalScroll && element?.scrollHeight > element?.clientHeight) {
                        return element;
                    }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (_error) {
                    continue;
                }
            }
            
            // Fallback to document.body if no scrollable container found
            return document.body;
        };

        const scrollContainer = findScrollContainer();
        scrollElementRef.current = scrollContainer;
        const isWindowScroll = scrollContainer === window;
        const elementScrollContainer: HTMLElement | null = isWindowScroll ? null : (scrollContainer as HTMLElement);

        const handleScroll = () => {
            if (!isMounted) return;
            if (isWindowScroll) {
                // For window scroll, calculate scroll position relative to table
                const tableElement = containerRef.current?.closest('table') || containerRef.current;
                if (tableElement) {
                    const rect = tableElement.getBoundingClientRect();
                    // Calculate how much of the table has scrolled past the viewport top
                    const tableScrolledPast = Math.max(0, -rect.top);
                    setScrollTop(tableScrolledPast);
                } else {
                    setScrollTop(window.scrollY);
                }
            } else {
                setScrollTop(elementScrollContainer?.scrollTop || 0);
            }
        };

        const handleResize = () => {
            if (!isMounted) return;
            if (isWindowScroll) {
                setContainerHeight(window.innerHeight);
            } else {
                setContainerHeight(elementScrollContainer?.clientHeight || window.innerHeight);
            }
        };

        // Initial setup with timeout to ensure DOM is ready
        initTimeoutId = setTimeout(() => {
            if (!isMounted) return;
            handleScroll();
            handleResize();
        }, 200);

        // Add event listeners
        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
        
        // For window scroll, also observe window resize
        if (isWindowScroll) {
            window.addEventListener('resize', handleResize, { passive: true });
        }
        
        const resizeObserver = new ResizeObserver(handleResize);
        if (elementScrollContainer) {
            resizeObserver.observe(elementScrollContainer);
        } else if (containerRef.current) {
            // Observe table container for size changes
            resizeObserver.observe(containerRef.current);
        }
        
        return () => {
            isMounted = false;
            if (initTimeoutId) {
                clearTimeout(initTimeoutId);
            }
            scrollContainer.removeEventListener('scroll', handleScroll);
            if (isWindowScroll) {
                window.removeEventListener('resize', handleResize);
            }
            resizeObserver.disconnect();
        };
    }, [virtualization.enabled, useWindow]);

    // Calculate visible items
    const { visibleItems, totalHeight, offsetY, effectiveRowHeight } = useMemo(() => {
        // Disable virtualization if accordion is enabled (variable row heights make virtualization problematic)
        if (!virtualization.enabled || !data?.length || enableAccordion) {
            return { visibleItems: data || [], totalHeight: 0, offsetY: 0 };
        }

        // Use measured height if available, fallback to provided height, then default
        const effectiveRowHeight = virtualization.rowHeight||measuredRowHeight || 50;
        const { overscan } = virtualization;
        const itemCount = data.length;
        
        // Don't proceed with calculations until we have a proper row height
        if (!measuredRowHeight && !virtualization.rowHeight) {
            return { visibleItems: data || [], totalHeight: 0, offsetY: 0 };
        }
        
        // Simplified calculation - use scrollTop directly since we're tracking it from the correct container
        const scrollPosition = scrollTop;
        const viewportHeight = containerHeight || 600; // Fallback height
        
        const effectiveViewportHeight = viewportHeight > 0 ? viewportHeight : 600; // Default height
        const safeOverscan = Math.max(0, overscan || 5); // Ensure overscan is not negative
        
        // Calculate visible range without overscan first
        const visibleStartIndex = Math.floor(scrollPosition / effectiveRowHeight);
        const visibleEndIndex = Math.ceil((scrollPosition + effectiveViewportHeight) / effectiveRowHeight) - 1;
        
        // Apply overscan - distribute total overscan budget between before/after
        // Split overscan roughly in half, but adjust based on available space
        const halfOverscan = Math.floor(safeOverscan / 2);
        const remainderOverscan = safeOverscan - halfOverscan;
        
        // Calculate how much we can actually add before and after
        const maxOverscanBefore = visibleStartIndex; // Can't go below 0
        const maxOverscanAfter = itemCount - 1 - visibleEndIndex; // Can't go beyond itemCount
        
        // Distribute overscan, but if we can't use all on one side, give it to the other side
        let overscanBefore = Math.min(halfOverscan, maxOverscanBefore);
        let overscanAfter = Math.min(remainderOverscan, maxOverscanAfter);
        
        // If we have leftover overscan budget, redistribute it
        const unusedBefore = halfOverscan - overscanBefore;
        const unusedAfter = remainderOverscan - overscanAfter;
        
        if (unusedBefore > 0) {
            overscanAfter = Math.min(overscanAfter + unusedBefore, maxOverscanAfter);
        }
        if (unusedAfter > 0) {
            overscanBefore = Math.min(overscanBefore + unusedAfter, maxOverscanBefore);
        }
        
        const startIndex = visibleStartIndex - overscanBefore;
        const endIndex = visibleEndIndex + overscanAfter;
        


        const visibleItems = [];
        for (let i = startIndex; i <= endIndex; i++) {
            if (data[i]) {
                visibleItems.push({ ...data[i], originalIndex: i });
            }
        }

        return {
            visibleItems,
            totalHeight: itemCount * effectiveRowHeight,
            offsetY: startIndex * effectiveRowHeight,
            effectiveRowHeight
        };
    }, [data, scrollTop, containerHeight, virtualization, measuredRowHeight, enableAccordion]);

    // Generate spacer rows for virtualization
    const renderSpacers = () => {
        if (!virtualization.enabled) return { topSpacer: null, bottomSpacer: null };

        const colSpan = headers.length + (rowHoverAction?.enable ? 1 : 0);
        
        const topSpacer = offsetY > 0 ? (
            <tr className={`${styles["table-row"]}`} key="top-spacer" style={{ height: offsetY, pointerEvents: 'none' }}>
                <td colSpan={colSpan} style={{ padding: 0, border: 'none' }}></td>
            </tr>
        ) : null;

        const effectiveRowHeight = measuredRowHeight || virtualization.rowHeight || 50;
        const bottomSpacerHeight = totalHeight - offsetY - (visibleItems.length * effectiveRowHeight);
        const bottomSpacer = bottomSpacerHeight > 0 ? (
            <tr className={`${styles["table-row"]}`} key="bottom-spacer" style={{ height: bottomSpacerHeight, pointerEvents: 'none' }}>
                <td colSpan={colSpan} style={{ padding: 0, border: 'none' }}></td>
            </tr>
        ) : null;

        return { topSpacer, bottomSpacer };
    };

    // Determine if virtualization is actually active (considering accordion feature)
    const actuallyVirtualized = Boolean(virtualization.enabled && !enableAccordion && data?.length > 0);

    return {
        visibleItems,
        totalHeight,
        offsetY,
        renderSpacers,
        isVirtualized: actuallyVirtualized,
        effectiveRowHeight
    };
};

export default useVirtualization;
