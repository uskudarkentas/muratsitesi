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

    return (
        <div className="group relative px-6 py-4 transition-all duration-300 cursor-default hover:bg-slate-50/50">
            <div className="flex items-start gap-4">
                {/* Timeline Node & Avatar */}
                <div className="relative z-10 flex flex-col items-center">
                    <div className={cn(
                        "h-8 w-8 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0 border border-white shadow-sm transition-transform duration-300 group-hover:scale-110",
                        activity.admin.color.replace('bg-', 'bg-').replace('text-', 'text-')
                    )}>
                        {activity.admin.initials}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex flex-col gap-1">
                        {/* Main Action Line */}
                        <div className="flex items-start justify-between gap-2">
                            <h4 className="text-[14.5px] font-semibold text-gray-800 leading-snug tracking-tight">
                                {activity.action}
                                <span className="mx-2 text-gray-300 font-light">·</span>
                                <span className="text-gray-900 font-bold decoration-gray-200/50 underline-offset-4 decoration-2">
                                    {activity.target}
                                </span>
                            </h4>
                            <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap pt-1">
                                {activity.timestamp}
                            </span>
                        </div>

                        {/* Metadata & Status */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[12px] text-gray-500 font-medium">
                                    {activity.admin.name}
                                </span>
                                <span className="w-1 h-3 border-l border-gray-200" />
                                <span className="text-[11px] text-gray-400 font-normal">
                                    {activity.admin.role}
                                </span>
                            </div>

                            <span className="w-1 h-1 rounded-full bg-gray-200" />

                            <div className="flex items-center gap-1.5">
                                <div className={cn("w-1.5 h-1.5 rounded-full shadow-sm", statusStyle.dot)} />
                                <span className={cn("text-[11px] font-bold uppercase tracking-wider", statusStyle.container.split(' ')[1])}>
                                    {activity.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subtle Icon on Hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 self-center">
                    <TypeIcon size={16} strokeWidth={1.5} className="text-slate-300" />
                </div>
            </div>
        </div>
    );
}
