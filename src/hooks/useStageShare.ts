import { getLatestAnnouncement, getAnnouncementPreview } from "@/lib/mockData";

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
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return { handleShare };
}
