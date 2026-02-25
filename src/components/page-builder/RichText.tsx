"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { useEffect, useState } from 'react';
import { Bold, Heading2, Heading3, Heading4 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextProps {
    value: string;
    onSave: (newValue: string) => void;
    className?: string;
    placeholder?: string;
}

const AUTO_CLEAR_STRINGS = [
    "Başlık Buraya",
    "Açıklama metni buraya gelecek. Kentsel dönüşüm süreci hakkında bilgi verin.",
    "Metin içeriği buraya gelecek",
    "Buraya metin giriniz...",
    "Blok Başlığı (İsteğe bağlı)"
];

const BRAND_COLORS = [
    { name: 'Kırmızı', color: '#ed2630' },
    { name: 'Koyu', color: '#1a1b1f' },
    { name: 'Gri', color: '#64748b' },
];

export function RichText({ value, onSave, className = "", placeholder = "Metin girin..." }: RichTextProps) {
    const [isFocused, setIsFocused] = useState(false);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            TextStyle,
            Color,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onSave(editor.getHTML());
        },
        onFocus: ({ editor }) => {
            setIsFocused(true);
            const text = editor.getText();
            if (AUTO_CLEAR_STRINGS.includes(text.trim())) {
                editor.commands.clearContent();
            }
        },
        onBlur: () => {
            setIsFocused(false);
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML() && !isFocused) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor, isFocused]);

    if (!editor) return null;

    return (
        <div
            className="relative group"
            onClick={(e) => e.stopPropagation()}
        >
            {/* ── Persistent Toolbar (visible when focused) ── */}
            {isFocused && (
                <div className="flex items-center gap-0.5 mb-1.5 bg-white border border-slate-200 rounded-lg shadow-md p-1 w-fit">
                    {/* Bold → Semi-Bold */}
                    <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
                        className={cn(
                            "p-1.5 rounded hover:bg-slate-100 transition-colors",
                            editor.isActive('bold') ? "bg-slate-100 text-[#ed2630]" : "text-slate-600"
                        )}
                        title="Kalın (Semi-Bold)"
                    >
                        <Bold size={14} strokeWidth={2.5} />
                    </button>

                    <div className="w-px h-5 bg-slate-200 mx-0.5" />

                    {/* Headings */}
                    <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
                        className={cn(
                            "p-1.5 rounded hover:bg-slate-100 transition-colors",
                            editor.isActive('heading', { level: 2 }) ? "bg-slate-100 text-[#ed2630]" : "text-slate-600"
                        )}
                        title="Büyük Başlık (H2)"
                    >
                        <Heading2 size={14} />
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}
                        className={cn(
                            "p-1.5 rounded hover:bg-slate-100 transition-colors",
                            editor.isActive('heading', { level: 3 }) ? "bg-slate-100 text-[#ed2630]" : "text-slate-600"
                        )}
                        title="Orta Başlık (H3)"
                    >
                        <Heading3 size={14} />
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 4 }).run(); }}
                        className={cn(
                            "p-1.5 rounded hover:bg-slate-100 transition-colors",
                            editor.isActive('heading', { level: 4 }) ? "bg-slate-100 text-[#ed2630]" : "text-slate-600"
                        )}
                        title="Küçük Başlık (H4)"
                    >
                        <Heading4 size={14} />
                    </button>

                    <div className="w-px h-5 bg-slate-200 mx-0.5" />

                    {/* Colors */}
                    {BRAND_COLORS.map(({ name, color }) => (
                        <button
                            key={name}
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setColor(color).run(); }}
                            className="w-5 h-5 rounded-full border border-slate-200 shadow-sm hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            title={name}
                        />
                    ))}
                    {/* Rengi sıfırla */}
                    <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetColor().run(); }}
                        className="w-5 h-5 rounded-full border border-slate-300 bg-white text-[9px] flex items-center justify-center text-slate-400 shadow-sm hover:scale-110 transition-transform"
                        title="Rengi Sıfırla"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* ── Editor Content ── */}
            <EditorContent
                editor={editor}
                className={cn(
                    // NO prose here — font size is inherited from parent className
                    "max-w-none transition-all",
                    "[&_strong]:font-semibold [&_b]:font-semibold",
                    "[&_p]:m-0 [&_p]:leading-inherit",
                    "cursor-text rounded px-1",
                    isFocused
                        ? "outline-none ring-2 ring-[#ed2630] ring-offset-2 rounded-md min-h-[50px]"
                        : "hover:outline-dashed hover:outline-1 hover:outline-slate-300",
                    className
                )}
            />

            {/* Placeholder */}
            {!value && !isFocused && (
                <div className="absolute top-0 left-2 text-slate-400 italic pointer-events-none text-sm">
                    {placeholder}
                </div>
            )}
        </div>
    );
}
