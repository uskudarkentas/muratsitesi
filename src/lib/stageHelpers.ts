import { cn } from "@/lib/utils";
import { getLatestAnnouncement, getAnnouncementPreview } from "@/lib/mockData";
import { Stage } from "@/lib/stages"; // Assuming Stage type needs to be exported from stages.ts, or used as any if not available yet

export const cardStyles = {
    base: "bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg relative transition-all duration-300",
    active: "border-2 border-[#98EB94] scale-110 origin-left",
    inactive: "border border-gray-200 dark:border-gray-700",
};

export function getCardClassName(isCurrent: boolean) {
    return cn(
        cardStyles.base,
        isCurrent ? cardStyles.active : cardStyles.inactive
    );
}

export function getStageInputClassName(isFocused: boolean) {
    return cn(
        "block transition-all break-words leading-tight",
        isFocused ? "text-sm md:text-2xl font-bold" : "text-xs md:text-xl font-medium"
    );
}

export function getStageDescription(
    stageId: number,
    isCurrent: boolean,
    isPast: boolean,
    activeStageIndex: number,
    popupIndex?: number
): string {
    // Basic isCurrent/isPast logic
    const latestAnnouncement = getLatestAnnouncement(stageId);
    if (latestAnnouncement && isCurrent) {
        return getAnnouncementPreview(latestAnnouncement);
    }
    return isCurrent
        ? "Bu aşama şu an aktif. Henüz duyuru bulunmamaktadır."
        : isPast
            ? "Bu aşama başarıyla tamamlanmıştır."
            : "Bu aşama henüz aktif değildir.";
}
