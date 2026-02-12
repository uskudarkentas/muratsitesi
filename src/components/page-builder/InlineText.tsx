"use client";

import { useEffect, useRef, useState } from "react";

// List of default strings that should be auto-cleared on focus
const AUTO_CLEAR_STRINGS = [
    "Başlık Buraya",
    "Açıklama metni buraya gelecek. Kentsel dönüşüm süreci hakkında bilgi verin.",
    "Komşu Bilgilendirme",
    "Tüm hak sahipleri süreçten anlık haberdar edilir.",
    "Gerekli Belgeler",
    "Gerekli dokümanlar sisteme yüklenecektir.",
    "Güvenli Dönüşüm",
    "Mülkiyet haklarınız korunarak ilerliyoruz.",
    "Sitemiz İçin Hızlı Tarama",
    "Murat Sitesi bloklarında yapılacak hızlı tarama testleri için yönetime bildirimde bulunabilirsiniz.",
    "İndirilebilir Dokümanlar",
    "Metin içeriği buraya gelecek",
    "Başlık",
    "Metin",
    "Liste Başlığı",
    "Liste maddesi 1",
    "Liste maddesi 2",
    "Liste maddesi 3"
];

interface InlineTextProps {
    value: string;
    onSave: (newValue: string) => void;
    className?: string;
    tagName?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
    placeholder?: string;
    multiline?: boolean;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    autoFocus?: boolean;
    stripPastedNewlines?: boolean;
}

export function InlineText({
    value,
    onSave,
    className = "",
    tagName: Tag = "div",
    placeholder = "Metin girin...",
    multiline = false,
    onKeyDown,
    autoFocus = false,
    stripPastedNewlines = false,
}: InlineTextProps) {
    const [isEditing, setIsEditing] = useState(false);
    const containerRef = useRef<HTMLElement>(null);

    // Initial AutoFocus
    useEffect(() => {
        if (autoFocus) {
            setIsEditing(true);
        }
    }, [autoFocus]); // Run when autoFocus changes

    // Focus management
    useEffect(() => {
        if (isEditing && containerRef.current) {
            const el = containerRef.current;

            // Check if value is one of the default strings -> Clear it
            if (AUTO_CLEAR_STRINGS.includes(value)) {
                el.textContent = "";
            }

            el.focus();

            // Move cursor to end (only if we didn't clear it, mostly relevant for editing real content)
            if (el.textContent !== "") {
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(el);
                range.collapse(false);
                sel?.removeAllRanges();
                sel?.addRange(range);
            }
        }
    }, [isEditing, value]);

    const handlePaste = (e: React.ClipboardEvent) => {
        if (stripPastedNewlines) {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            // Replace newlines and carriage returns with a single space
            const cleanText = text.replace(/[\r\n]+/g, ' ');
            document.execCommand("insertText", false, cleanText);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
        setIsEditing(false);
        const newValue = e.currentTarget.textContent || "";

        // If empty, user might have cleared it. 
        // If it was a default value and they left it empty, maybe we save empty string? 
        // Yes, let the user decide.
        if (newValue !== value) {
            onSave(newValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (onKeyDown) {
            onKeyDown(e);
        }

        if (e.defaultPrevented) return;

        if (e.key === "Enter" && !e.shiftKey && !multiline) {
            e.preventDefault();
            e.currentTarget.blur();
        }
    };

    if (isEditing) {
        return (
            <Tag
                ref={containerRef}
                contentEditable
                suppressContentEditableWarning
                className={`outline-none ring-2 ring-[#ed2630] ring-offset-2 rounded px-1 min-w-[50px] ${className}`}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
            >
                {value}
            </Tag>
        );
    }

    return (
        <Tag
            className={`cursor-text hover:outline-dashed hover:outline-1 hover:outline-slate-300 rounded px-1 transition-all ${className} ${!value ? 'text-slate-400 italic' : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
            }}
        >
            {value || placeholder}
        </Tag>
    );
}
