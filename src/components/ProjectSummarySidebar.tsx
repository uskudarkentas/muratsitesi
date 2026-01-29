"use client";

import { useEffect, useState } from "react";
import { useTimelineContext } from "@/context/TimelineContext";
import { getFutureEvents } from "@/actions/timeline";
import { STAGES } from "@/lib/stages";
import { TIMELINE_CONSTANTS } from "@/lib/constants";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface EventData {
    title: string;
    type: 'MEETING' | 'SURVEY' | 'ANNOUNCEMENT';
    eventDate: Date | null;
}

export function ProjectSummarySidebar() {
    const { focusedStageId } = useTimelineContext();
    const [activeStageId, setActiveStageId] = useState(TIMELINE_CONSTANTS.ACTIVE_STAGE_ID);
    const [futureEvent, setFutureEvent] = useState<EventData | null>(null);

    // Get active stage details
    const activeStage = STAGES.find(s => s.id === activeStageId);

    // Calculate progress (stages completed / total)
    // Assuming stages are sequential and 1-based IDs roughly map to sequence
    // ACTIVE_STAGE_ID is 7 (Riskli Yapı İlanı). Completed = 6. 
    // Total = 11.
    const completedCount = activeStageId - 1;
    const progressPercentage = (completedCount / STAGES.length) * 100;

    // Fetch future events when focused stage changes
    useEffect(() => {
        // Only fetch if focused stage is relevant or general project summary should update?
        // User requirement: "If there is a future meeting ... for the focused stage ... display it".

        // We use focusedStageId from context
        // Debounce?
        const timer = setTimeout(async () => {
            if (focusedStageId) {
                const event = await getFutureEvents(focusedStageId);
                setFutureEvent(event as any);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [focusedStageId]);

    return (
        <aside className="hidden lg:block absolute left-4 top-6 w-64 z-20">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-left">
                <h3 className="text-lg font-bold text-[#46474A] mb-4 text-left">Proje Özeti</h3>
                <div className="space-y-3 text-sm text-left">
                    <div>
                        <p className="text-gray-500 text-xs mb-1">Proje Adı</p>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">Murat Sitesi</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs mb-1">Toplam Aşama</p>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">{STAGES.length} Aşama</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs mb-1">Aktif Aşama</p>
                        <p className="font-semibold text-[#98EB94]">{activeStage?.title || "Bilinmiyor"}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs mb-1">İlerleme</p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-2">
                            <div
                                className="bg-[#98EB94] h-3 rounded-full transition-all duration-1000"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{completedCount}/{STAGES.length} Tamamlandı</p>
                    </div>

                    {/* Horizontal Divider */}
                    <div className="border-t border-gray-100 dark:border-gray-700 my-4"></div>

                    {/* Conditional Future Events Section */}
                    {futureEvent && (
                        <div className="animate-in fade-in slide-in-from-left-2 mb-4">
                            <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-1">
                                <span className="material-symbols-outlined !text-base">event</span>
                                Yaklaşan Etkinlik
                            </h4>
                            <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                                <p className="font-semibold text-gray-800 dark:text-gray-200 text-xs mb-1">
                                    {futureEvent.title}
                                </p>
                                <p className="text-gray-500 text-[10px] flex items-center gap-1">
                                    <span className="material-symbols-outlined !text-[12px]">schedule</span>
                                    {futureEvent.eventDate ? format(new Date(futureEvent.eventDate), 'd MMMM yyyy HH:mm', { locale: tr }) : 'Tarih Belirlenmedi'}
                                </p>
                            </div>
                            <div className="border-t border-gray-100 dark:border-gray-700 my-4"></div>
                        </div>
                    )}

                    {/* Project Imprint */}
                    <h4 className="text-sm font-bold text-[#46474A] mb-3">Proje Künyesi</h4>
                    <div className="space-y-3">
                        <div>
                            <p className="text-gray-500 text-xs mb-1">Blok Sayısı</p>
                            <p className="font-semibold text-gray-700 dark:text-gray-300">11 Blok</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs mb-1">Toplam İnşaat Alanı</p>
                            <p className="font-semibold text-gray-700 dark:text-gray-300">154.000 m²</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs mb-1">Bağımsız Birim Sayısı</p>
                            <p className="font-semibold text-gray-700 dark:text-gray-300">450 Konut</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
