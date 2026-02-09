import { notFound } from "next/navigation";
import { getPageContent } from "@/server/actions/pageBuilderActions";
import Header from "@/components/Header";
import { BlockRenderer } from "@/components/page-builder/BlockRenderer";
import Footer from "@/components/Footer";
import { ContentBlock } from "@/types/page-builder";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function StagePage(props: PageProps) {
    const params = await props.params;
    const slug = params.slug;

    // Fetch page content
    const result = await getPageContent(slug);

    if (!result.success || !result.data) {
        notFound();
    }

    const { blocks } = result.data;

    return (
        <main className="flex min-h-screen flex-col bg-slate-50">
            <Header />

            <div className="flex-1 w-full pt-12">
                {blocks && Array.isArray(blocks) && (
                    <div className="flex flex-col gap-6">
                        {(blocks as ContentBlock[]).map((block, index) => (
                            <div key={block.id || index}>
                                <BlockRenderer block={block} isEditing={false} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
