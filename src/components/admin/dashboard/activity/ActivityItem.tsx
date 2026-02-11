import { cn } from "@/lib/utils";
import { Activity } from "./types";
import { ACTIVITY_TYPE_ICONS, ACTIVITY_STATUS_STYLES, DEFAULT_STATUS_STYLE } from "./config";
import { FileEdit } from "lucide-react";

interface ActivityItemProps {
    activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
    const TypeIcon = ACTIVITY_TYPE_ICONS[activity.type] || FileEdit;

    // Get status style configuration or fallback to default
    const statusStyle = ACTIVITY_STATUS_STYLES[activity.status] || DEFAULT_STATUS_STYLE;
    const StatusIcon = statusStyle.icon;

    return (
        <div className="group p-4 hover:bg-gray-50/40 transition-all duration-200 cursor-default">
            <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 min-w-0">
                    {/* Avatar */}
                    <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 border-white shadow-sm",
                        activity.admin.color
                    )}>
                        {activity.admin.initials}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-gray-600 font-normal">
                                {activity.admin.name}
                            </span>
                            <span className="text-[10px] text-gray-300 font-normal">
                                {activity.admin.role}
                            </span>
                        </div>

                        <div className="text-sm text-gray-400 font-light mt-0.5 flex items-center gap-1.5 flex-wrap">
                            <span>{activity.action}</span>
                            <span className="text-sm font-medium text-gray-700 ml-0.5 flex items-center gap-1">
                                — {activity.target}
                                <TypeIcon size={14} strokeWidth={1.5} className="text-gray-400 ml-1" />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Status & Time */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border bg-opacity-50 border-opacity-50",
                        statusStyle.container
                    )}>
                        <StatusIcon size={10} strokeWidth={1.5} />
                        {activity.status}
                    </span>
                    <span className="text-[10px] text-gray-300 font-normal">
                        {activity.timestamp}
                    </span>
                </div>
            </div>
        </div>
    );
}
