import { getLatestAnnouncement, getAnnouncementPreview } from "@/lib/mockData";
import { trackAnalytics } from "@/actions/analytics";
import { ActionType } from "@/shared/types/analytics";

export function useStageShare() {
    const handleShare = async (stage: any) => {
        const latestAnnouncement = getLatestAnnouncement(stage.id);
        const text = latestAnnouncement
            ? getAnnouncementPreview(latestAnnouncement)
            : "Murat Sitesi Kentsel Dönüşüm Süreci";

        const shareData = {
            title: `Murat Sitesi - ${stage.title}`,
            text: text,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
                alert("Bağlantı kopyalandı!");
            }

            // Track share analytics (non-blocking)
            try {
                await trackAnalytics({
                    action: ActionType.SHARE,
                    targetId: stage.id.toString(),
                });
            } catch (analyticsError) {
                // Silently fail - analytics should not block user actions
                console.warn('Failed to track share analytics:', analyticsError);
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return { handleShare };
}
