import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageBlockProps {
    data: {
        url: string;
        caption?: string;
        alt?: string;
        displayStyle?: "fit" | "cover" | "contain";
        layout?: "full" | "centered" | "narrow";
    };
}

export function ImageBlock({ data }: ImageBlockProps) {
    return (
        <div className={cn(
            "w-full my-12",
            data.layout === "centered" && "max-w-5xl mx-auto px-4",
            data.layout === "narrow" && "max-w-2xl mx-auto px-4"
        )}>
            <div className={cn(
                "relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 bg-white",
                data.displayStyle === "cover" ? "aspect-video" : "aspect-auto"
            )}>
                <img
                    src={data.url}
                    alt={data.alt || data.caption || "İçerik görseli"}
                    className={cn(
                        "w-full h-auto max-h-[80vh]",
                        data.displayStyle === "cover" ? "object-cover h-full" : "object-contain"
                    )}
                />
            </div>
            {data.caption && (
                <p className="mt-4 text-center text-sm text-slate-400 font-medium italic">
                    {data.caption}
                </p>
            )}
        </div>
    );
}
