import { notFound } from "next/navigation";
import { stageService } from "@/features/stages/services/stageService";
import { pageBuilderService } from "@/features/page-builder/services/pageBuilderService";
import { DynamicStageCard } from "@/components/DynamicStageCard";
import { BlockRenderer } from "@/components/page-builder/BlockRenderer";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function StagePage({ params }: PageProps) {
    const { slug } = await params;

    // 1. Fetch Stage Info (for ID, title, sequence)
    let stage;
    try {
        stage = await stageService.getStageBySlug(slug);
    } catch (error) {
        notFound();
    }

    // 2. Fetch Page Builder Content (if exists)
    const pageContent = await pageBuilderService.getPageContentOrNull(slug);

    return (
        <div className="container mx-auto py-8 space-y-12">

            {/* Page Builder Content */}
            {pageContent && pageContent.blocks.length > 0 ? (
                <div className="space-y-6">
                    {pageContent.blocks.map((block: any) => (
                        <BlockRenderer
                            key={block.id}
                            block={block}
                            pageSlug={slug}
                            stageNumber={stage.sequenceOrder}
                        />
                    ))}
                </div>
            ) : (
                /* Fallback if no page builder content */
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-3xl">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">{stage.title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto px-4">
                        {stage.description || "Bu aşama için henüz detaylı içerik eklenmemiştir."}
                    </p>
                </div>
            )}

            {/* Dynamic Content / Latest Updates (Optional/Secondary) */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-12">
                <div className="flex items-center gap-3 mb-6">
                    <span className="w-1 h-6 bg-[#ed2630] rounded-full"></span>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                        Güncel Duyurular ve Etkinlikler
                    </h2>
                </div>
                <DynamicStageCard stageId={stage.id} />
            </div>
        </div>
    );
}
