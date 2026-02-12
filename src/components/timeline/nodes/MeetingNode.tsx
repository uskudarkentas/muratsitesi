import Link from "next/link";
import { cn } from "@/lib/utils";

interface MeetingNodeProps {
    meeting: any;
    stageSlug: string;
    onMeetingClick?: (meeting: any) => void;
    isAdmin?: boolean;
    onEditPost?: (post: any) => void;
    onDeletePost?: (postId: string) => void;
}

export function MeetingNode({
    meeting,
    stageSlug,
    onMeetingClick,
    isAdmin,
    onEditPost,
    onDeletePost
}: MeetingNodeProps) {
    // Helper to extract text from content (JSON or String)
    const getContentPreview = (content: any) => {
        if (!content) return null;
        try {
            const parsed = typeof content === 'string' && content.startsWith('{')
                ? JSON.parse(content)
                : content;

            if (typeof parsed === 'object' && parsed?.blocks) {
                return parsed.blocks[0]?.data?.text || "İçerik detayları için tıklayınız.";
            }
            return typeof content === 'string' ? content : null;
        } catch (e) {
            return typeof content === 'string' ? content : null;
        }
    };

    const previewText = getContentPreview(meeting.content);

    return (
        <div className="relative group/meeting cursor-pointer">
            {/* Vertical Connector Line - Back to main node */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[2px] h-[12.5dvh] bg-gray-200 dark:bg-gray-700 -z-10 origin-bottom scale-y-110"></div>

            <Link
                href={`/asamalar/${stageSlug}`}
                className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                onClick={(e) => {
                    // On mobile, prevent navigation and show modal
                    if (window.innerWidth < 768 && onMeetingClick) {
                        e.preventDefault();
                        onMeetingClick(meeting);
                    }
                }}
            >
                <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                </span>
            </Link>

            {/* Admin Controls for Meeting - Shifted to the left to avoid tooltip overlap */}
            {isAdmin && (
                <div className="absolute -top-2 -left-12 flex flex-col gap-2 opacity-0 group-hover/meeting:opacity-100 transition-opacity z-[60]">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEditPost?.(meeting);
                        }}
                        className="bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition-all hover:scale-110"
                        title="Toplantıyı Düzenle"
                    >
                        <span className="material-symbols-outlined !text-sm">edit</span>
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDeletePost?.(meeting.id);
                        }}
                        className="bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-all hover:scale-110"
                        title="Toplantıyı Sil"
                    >
                        <span className="material-symbols-outlined !text-sm">delete</span>
                    </button>
                </div>
            )}

            {/* Tooltip for Meeting */}
            <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-white px-4 py-3 rounded-xl shadow-xl border border-purple-100 opacity-0 group-hover/meeting:opacity-100 transition-opacity pointer-events-none z-50 min-w-[200px] max-w-[260px]">
                <p className="text-sm font-bold text-gray-800 mb-1">{meeting.title}</p>
                <p className="text-[11px] text-purple-600 font-medium mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined !text-[12px]">calendar_today</span>
                    {new Date(meeting.eventDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
                {previewText && (
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed border-t border-gray-100 pt-2">
                        {previewText}
                    </p>
                )}
            </div>
        </div>
    );
}
