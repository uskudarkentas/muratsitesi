import { cn } from "@/lib/utils";
import { Activity } from "./types";
import { ACTIVITY_TYPE_ICONS, ACTIVITY_STATUS_STYLES, DEFAULT_STATUS_STYLE } from "./config";
import { FileEdit, Plus, Pencil, Trash2, CheckCircle2, Megaphone, Calendar, FileText, Layout } from "lucide-react";

interface ActivityItemProps {
    activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
    // Dynamic Icon Logic based on Action Text
    let Icon = FileEdit;
    const actionLower = activity.action.toLowerCase();

    if (actionLower.includes("yeni") || actionLower.includes("ekledi") || actionLower.includes("başlattı")) {
        Icon = Plus;
    } else if (actionLower.includes("güncelledi") || actionLower.includes("düzenledi")) {
        Icon = Pencil;
    } else if (actionLower.includes("sildi")) {
        Icon = Trash2;
    } else if (actionLower.includes("tamamlandı")) {
        Icon = CheckCircle2;
    } else {
        // Fallback to type mapping
        Icon = ACTIVITY_TYPE_ICONS[activity.type] || FileEdit;
    }

    // Get status style configuration or fallback to default
    const statusStyle = ACTIVITY_STATUS_STYLES[activity.status] || DEFAULT_STATUS_STYLE;

    return (
        <div className="group relative px-5 py-2.5 transition-all duration-300 cursor-default hover:bg-slate-50/50 border-b border-gray-50 last:border-0">
            <div className="flex items-start gap-3">
                {/* Avatar / Icon */}
                <div className="relative z-10 flex flex-col items-center pt-0.5">
                    <div className={cn(
                        "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border border-white shadow-sm transition-transform duration-300 group-hover:scale-110",
                        activity.admin.color.replace('bg-', 'bg-').replace('text-', 'text-')
                    )}>
                        <Icon size={15} strokeWidth={2} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-0.5">
                        {/* Main Action Line */}
                        <div className="flex items-start justify-between gap-2">
                            <h4 className="text-[14px] font-bold text-gray-900 leading-snug tracking-tight">
                                {activity.action}
                            </h4>
                            <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap pt-0.5">
                                {activity.timestamp}
                            </span>
                        </div>

                        {/* Subtitle: Target Details */}
                        <div className="text-[12px] text-gray-500 font-medium mb-1 truncate">
                            {activity.target}
                        </div>

                        {/* Metadata & Status footer */}
                        <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-gray-400 font-medium">
                                    {activity.admin.name}
                                </span>
                                <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-md font-semibold">
                                    {activity.admin.role}
                                </span>
                            </div>

                            <span className="w-0.5 h-0.5 rounded-full bg-gray-200" />

                            <div className="flex items-center gap-1">
                                <div className={cn("w-1.5 h-1.5 rounded-full shadow-sm", statusStyle.dot)} />
                                <span className={cn("text-[9px] font-bold uppercase tracking-wider", statusStyle.container.split(' ')[1])}>
                                    {activity.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
