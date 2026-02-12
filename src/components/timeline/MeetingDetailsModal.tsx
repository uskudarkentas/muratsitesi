import { motion } from "framer-motion";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface MeetingDetailsModalProps {
    meeting: any;
    onClose: () => void;
}

export function MeetingDetailsModal({
    meeting,
    onClose
}: MeetingDetailsModalProps) {
    if (!meeting) return null;

    // Helper to extract text from content (JSON or String)
    const getContentPreview = (content: any) => {
        if (!content) return null;
        try {
            const parsed = typeof content === 'string' && content.startsWith('{')
                ? JSON.parse(content)
                : content;

            if (typeof parsed === 'object' && parsed?.blocks) {
                return parsed.blocks[0]?.data?.text || "İçerik detayları mevcut değil.";
            }
            return typeof content === 'string' ? content : null;
        } catch (e) {
            return typeof content === 'string' ? content : null;
        }
    };

    const contentText = getContentPreview(meeting.content);

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[110]"
            >
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-10 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-purple-600 !text-3xl">
                                groups
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            {meeting.title}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-purple-600 font-medium mb-6 bg-purple-50 px-3 py-1 rounded-full">
                            <span className="material-symbols-outlined !text-[16px]">calendar_today</span>
                            <span>
                                {new Date(meeting.eventDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>

                        <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-left">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Toplantı İçeriği
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                {contentText || "İçerik bilgisi bulunmamaktadır."}
                            </p>
                        </div>

                        <div className="mt-6 w-full">
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
