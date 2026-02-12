import { TextBlock } from "@/types/page-builder";
import { InlineText } from "../InlineText";

interface TextBlockComponentProps {
    block: TextBlock;
    isEditing?: boolean;
    onUpdate?: (newData: any) => void;
}

export function TextBlockComponent({ block, isEditing = false, onUpdate }: TextBlockComponentProps) {
    const { title, content } = block.data;

    // Placeholder text to show when empty
    const PLACEHOLDER = "<p>Buraya metin giriniz...</p>";

    // Check if content is effectively empty or is the default placeholder
    const isPlaceholder = !content || content === PLACEHOLDER || content === '<p></p>';

    const handleSaveTitle = (val: string) => {
        if (onUpdate) {
            onUpdate({ ...block.data, title: val });
        }
    };

    const handleSaveContent = (val: string) => {
        if (onUpdate) {
            onUpdate({ ...block.data, content: val });
        }
    };

    return (

        <section className="w-full bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4 pt-2 pb-2 md:pt-4 md:pb-4">
                <div className="max-w-7xl mx-auto">
                    <div className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden">
                        <div className="relative z-10 px-6 py-8 md:px-12 md:py-14">
                            {/* Optional Title */}
                            {(title || isEditing) && (
                                <div className="mb-6">
                                    {isEditing ? (
                                        <InlineText
                                            value={title || ""}
                                            placeholder="Blok Başlığı (İsteğe bağlı)"
                                            onSave={handleSaveTitle}
                                            tagName="h3"
                                            className="text-2xl md:text-3xl font-bold text-[#1a1b1f] dark:text-white mb-2"
                                        />
                                    ) : (
                                        title && (
                                            <h3 className="text-2xl md:text-3xl font-bold text-[#1a1b1f] dark:text-white mb-4">
                                                {title}
                                            </h3>
                                        )
                                    )}
                                </div>
                            )}

                            {isEditing ? (
                                <div
                                    className={`prose prose-lg prose-slate dark:prose-invert max-w-none ${isPlaceholder ? 'opacity-50' : ''}`}
                                    onClick={() => {
                                        // If it's placeholder, clear it immediately so user can type
                                        if (isPlaceholder && onUpdate) {
                                            onUpdate({ ...block.data, content: '' });
                                        }
                                    }}
                                >
                                    <InlineText
                                        value={content || PLACEHOLDER}
                                        onSave={handleSaveContent}
                                        tagName="div"
                                        className="min-h-[1.5em] outline-none"
                                        multiline={true}
                                    />
                                </div>
                            ) : (
                                <div
                                    className="prose prose-lg prose-slate dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: content || '' }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
