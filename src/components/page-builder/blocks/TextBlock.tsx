import { TextBlock } from "@/types/page-builder";

interface TextBlockComponentProps {
    block: TextBlock;
    isEditing?: boolean;
}

export function TextBlockComponent({ block, isEditing = false }: TextBlockComponentProps) {
    const { content } = block.data;

    return (
        <section className="w-full py-8 md:py-12 bg-background">
            <div className="container mx-auto px-4">
                <div
                    className="prose prose-slate dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </section>
    );
}
