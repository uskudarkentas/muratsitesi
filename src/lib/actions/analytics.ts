"use server";

import { db as prisma } from "@/lib/db";

export interface DeviceStats {
    total: number;
    desktop: number;
    mobile: number;
    tablet: number;
}

export type DeviceType = "MOBILE" | "DESKTOP" | "TABLET";

export async function getDeviceStats(category: string): Promise<DeviceStats> {
    // Group by device type for the given category (action)
    // We use 'contains' for flexible matching, e.g., "DUYURU" matches "DUYURU_VIEW", "ADD_DUYURU", etc.
    // Or we can match exact action strings if your logging is strict. 
    // Given the user prompt implies "Duyuru Analizleri", "Anket Analizleri", let's assume 'action' contains these keywords.

    const results = await prisma.analyticsLog.groupBy({
        by: ["device"],
        where: {
            action: {
                contains: category,
            },
            device: {
                not: null, // Only count entries with a logged device type
            }
        },
        _count: {
            device: true,
        },
    });

    // Calculate stats
    let desktop = 0;
    let mobile = 0;
    let tablet = 0;

    results.forEach((group) => {
        const count = group._count.device;
        if (group.device === "DESKTOP") desktop += count;
        else if (group.device === "MOBILE") mobile += count;
        else if (group.device === "TABLET") tablet += count;
    });

    const total = desktop + mobile + tablet;

    return {
        total,
        desktop,
        mobile,
        tablet,
    };
}
