import { notFound } from "next/navigation";
import { getStagePosts } from "@/actions/timeline";
import Header from "@/components/Header";
import { db } from "@/lib/db";
import { DynamicBlockRenderer } from "@/components/blocks/DynamicBlockRenderer";
import Footer from "@/components/Footer";

// Force dynamic rendering to handle new stages immediately
export const dynamic = "force-dynamic";

export default async function StagePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Fetch stage from DB
    const stage = await db.stage.findUnique({
        where: { slug },
    });

    if (!stage) {
        notFound();
    }

    // Fetch real posts from database
    const posts = await getStagePosts(slug);

    return (
        <main className="flex min-h-screen flex-col bg-slate-50">
            <Header />

            <div className="flex-1 w-full pt-8 md:pt-12">
                {/* Dynamic Page Content (Block System) */}
                {stage.content && (
                    <div className="w-full">
                        <DynamicBlockRenderer blocks={stage.content as any} />
                    </div>
                )}

            </div>
            <Footer />
        </main>
    );
}
