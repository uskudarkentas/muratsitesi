import { RichTextRenderer } from "@/components/RichTextRenderer";
import { cn } from "@/lib/utils";

interface RichTextBlockProps {
    data: {
        content: any;
        layout?: "full" | "centered" | "narrow";
    };
}

export function RichTextBlock({ data }: RichTextBlockProps) {
    return (
        <div className="max-w-5xl mx-auto px-4">
            <div className="prose prose-slate max-w-none">
                <RichTextRenderer content={data.content} />
            </div>
        </div>
    );
}
