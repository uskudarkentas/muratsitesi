import { notFound } from "next/navigation";
import { getStageBySlug, STAGES } from "@/lib/stages";
import { STAGE_ANNOUNCEMENTS } from "@/lib/mockData";
import Header from "@/components/Header";

export function generateStaticParams() {
    return STAGES.map((stage) => ({
        slug: stage.slug,
    }));
}

export default function StagePage({ params }: { params: { slug: string } }) {
    const stage = getStageBySlug(params.slug);

    if (!stage) {
        notFound();
    }

    const announcements = STAGE_ANNOUNCEMENTS[stage.id] || [];

    return (
        <main className="flex min-h-screen flex-col bg-background pb-[env(safe-area-inset-bottom)]">
            <Header />

            <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">
                {/* Stage Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="size-16 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary !text-4xl">
                            {stage.icon}
                        </span>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-foreground">{stage.title}</h1>
                        <p className="text-muted-foreground mt-1">Aşama #{stage.id}</p>
                    </div>
                </div>

                {/* Announcements */}
                <div className="space-y-6">
                    {announcements.length === 0 ? (
                        <div className="bg-card border border-border rounded-2xl p-12 text-center">
                            <span className="material-symbols-outlined text-muted-foreground !text-6xl mb-4 block">
                                info
                            </span>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                Henüz Duyuru Bulunmuyor
                            </h3>
                            <p className="text-muted-foreground">
                                Bu aşama için henüz yayınlanmış bir duyuru bulunmamaktadır.
                            </p>
                        </div>
                    ) : (
                        announcements
                            .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
                            .map((announcement) => (
                                <div
                                    key={announcement.id}
                                    className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
                                >
                                    {/* Text Announcement */}
                                    {announcement.type === 'text' && (
                                        <>
                                            <h2 className="text-2xl font-bold text-foreground mb-3">
                                                {announcement.title}
                                            </h2>
                                            <p className="text-muted-foreground mb-4 leading-relaxed">
                                                {announcement.content}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="material-symbols-outlined !text-lg">schedule</span>
                                                <span>{announcement.publishedAt.toLocaleDateString('tr-TR')}</span>
                                            </div>
                                        </>
                                    )}

                                    {/* Survey Announcement */}
                                    {announcement.type === 'survey' && (
                                        <>
                                            <h2 className="text-2xl font-bold text-foreground mb-3">
                                                {announcement.title}
                                            </h2>
                                            <p className="text-muted-foreground mb-6">{announcement.question}</p>

                                            <div className="space-y-3 mb-4">
                                                {announcement.options.map((option, idx) => {
                                                    const total = announcement.results
                                                        ? Object.values(announcement.results).reduce((a, b) => a + b, 0)
                                                        : 0;
                                                    const votes = announcement.results?.[option] || 0;
                                                    const percentage = total > 0 ? Math.round((votes / total) * 100) : 0;

                                                    return (
                                                        <div key={idx} className="space-y-1">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="font-medium">{option}</span>
                                                                <span className="text-muted-foreground">{votes} oy (%{percentage})</span>
                                                            </div>
                                                            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                                                                <div
                                                                    className="bg-primary h-full transition-all"
                                                                    style={{ width: `${percentage}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="material-symbols-outlined !text-lg">schedule</span>
                                                <span>{announcement.publishedAt.toLocaleDateString('tr-TR')}</span>
                                            </div>
                                        </>
                                    )}

                                    {/* Document Announcement */}
                                    {announcement.type === 'document' && (
                                        <>
                                            <h2 className="text-2xl font-bold text-foreground mb-3">
                                                {announcement.title}
                                            </h2>
                                            <p className="text-muted-foreground mb-4">{announcement.description}</p>

                                            <a
                                                href={announcement.fileUrl}
                                                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                                            >
                                                <span className="material-symbols-outlined">download</span>
                                                {announcement.fileName}
                                            </a>

                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                                                <span className="material-symbols-outlined !text-lg">schedule</span>
                                                <span>{announcement.publishedAt.toLocaleDateString('tr-TR')}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                    )}
                </div>
            </div>
        </main>
    );
}
