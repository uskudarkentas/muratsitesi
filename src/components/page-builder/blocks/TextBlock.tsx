import { TextBlock } from "@/types/page-builder";
import { InlineText } from "../InlineText";

interface TextBlockComponentProps {
    block: TextBlock;
    isEditing?: boolean;
    onUpdate?: (newData: any) => void;
}

export function TextBlockComponent({ block, isEditing = false, onUpdate }: TextBlockComponentProps) {
    const { content } = block.data;

    // Placeholder text to show when empty
    const PLACEHOLDER = "<p>Buraya metin giriniz...</p>";

    // Check if content is effectively empty or is the default placeholder
    const isPlaceholder = !content || content === PLACEHOLDER || content === '<p></p>';

    const handleSave = (val: string) => {
        if (onUpdate) {
            onUpdate({ ...block.data, content: val });
        }
    };

    return (
        <section className="w-full py-4 md:py-6 bg-background">
            <div className="container mx-auto px-4">
                <div className="max-w-7xl mx-auto">
                    {isEditing ? (
                        <div
                            className={`prose prose-slate dark:prose-invert max-w-none ${isPlaceholder ? 'opacity-50' : ''}`}
                            onClick={() => {
                                // If it's placeholder, clear it immediately so user can type
                                if (isPlaceholder && onUpdate) {
                                    onUpdate({ ...block.data, content: '' });
                                }
                            }}
                        >
                            <InlineText
                                value={content || PLACEHOLDER}
                                onSave={handleSave}
                                tagName="div"
                                className="min-h-[1.5em] outline-none"
                            />
                        </div>
                    ) : (
                        <div
                            className="prose prose-slate dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: content || '' }}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}
