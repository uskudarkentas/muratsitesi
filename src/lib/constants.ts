export const TIMELINE_CONSTANTS = {
    // Responsive item heights (in vh) based on visible count
    ITEM_HEIGHT_VH: 20,           // Base: 20vh for 2-1-2 (5 items)
    CONTAINER_HEIGHT_VH: 85,      // 85vh visible area (increased from 70)
    ACTIVE_STAGE_ID: 7,           // Riskli Yapı İlanı

    // Visibility configuration for 2-1-2 pattern
    MIN_BEFORE: 2,                // Minimum completed steps visible
    MIN_AFTER: 2,                 // Minimum upcoming steps visible
} as const;
