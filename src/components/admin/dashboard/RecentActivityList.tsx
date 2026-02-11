"use client";

import { Activity } from "./activity/types";
import { ActivityItem } from "./activity/ActivityItem";
import { MOCK_ACTIVITIES } from "./activity/data";

interface RecentActivityListProps {
    activities?: Activity[];
}

export function RecentActivityList({ activities = MOCK_ACTIVITIES }: RecentActivityListProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] overflow-hidden h-full flex flex-col font-sans">
            <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <h3 className="text-base font-bold text-gray-900 tracking-tight">Sistem Aktivite Günlüğü</h3>
                </div>
                <button className="text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors flex items-center gap-1 group">
                    Tümünü Gör
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-gray-50">
                    {activities.map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} />
                    ))}
                </div>
            </div>
        </div>
    );
}
