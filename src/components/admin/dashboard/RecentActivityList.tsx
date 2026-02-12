"use client";

import { Activity } from "./activity/types";
import { ActivityItem } from "./activity/ActivityItem";
import { MOCK_ACTIVITIES } from "./activity/data";
import { useEffect, useState } from "react";
import { getRecentSystemActivities } from "@/actions/analytics";

interface RecentActivityListProps {
    activities?: Activity[];
}

export function RecentActivityList({ activities: initialActivities }: RecentActivityListProps) {
    const [activities, setActivities] = useState<Activity[]>(initialActivities || []);
    const [loading, setLoading] = useState(!initialActivities);

    useEffect(() => {
        if (!initialActivities) {
            const fetchActivities = async () => {
                const data = await getRecentSystemActivities(5);
                setActivities(data as any);
                setLoading(false);
            };
            fetchActivities();
        }
    }, [initialActivities]);
    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden h-full flex flex-col font-sans">
            <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse" />
                    <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">Sistem Günlüğü</h3>
                </div>
                <button className="text-xs text-gray-400 hover:text-gray-900 font-semibold transition-all flex items-center gap-1 group">
                    Tümünü Gör
                    <span className="group-hover:translate-x-0.5 transition-transform duration-300">→</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto relative no-scrollbar">
                {/* Vertical Timeline Line */}
                <div className="absolute left-[39px] top-0 bottom-0 w-[1px] bg-gray-100/80 z-0" />

                <div className="relative z-10 py-2">
                    {activities.map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} />
                    ))}
                </div>
            </div>
        </div>
    );
}
