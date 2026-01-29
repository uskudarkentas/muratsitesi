import { notFound } from "next/navigation";
import { getStageBySlug, STAGES } from "@/lib/stages";
import { getStagePosts } from "@/actions/timeline";
import Header from "@/components/Header";
import { RichTextRenderer } from "@/components/RichTextRenderer";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export function generateStaticParams() {
    return STAGES.map((stage) => ({
        slug: stage.slug,
    }));
}

export default async function StagePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const stage = getStageBySlug(slug);

    if (!stage) {
        notFound();
    }

    // Fetch real posts from database
    const posts = await getStagePosts(params.slug);

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
                    {posts.length === 0 ? (
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
                        posts.map((post) => (
                            <div
                                key={post.id}
                                className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground mb-1">
                                            {post.title}
                                        </h2>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span className="material-symbols-outlined !text-lg">schedule</span>
                                            <span>
                                                {post.publishedAt
                                                    ? format(new Date(post.publishedAt), 'd MMMM yyyy HH:mm', { locale: tr })
                                                    : 'Tarih Yok'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase">
                                        {post.type}
                                    </div>
                                </div>

                                {/* Rich Content Render */}
                                <RichTextRenderer content={post.content} />

                                {/* Extra Actions if needed based on type can go here */}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
