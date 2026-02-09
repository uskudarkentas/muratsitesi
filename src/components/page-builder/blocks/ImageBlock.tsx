import { ImageBlock } from "@/types/page-builder";
import Image from "next/image";

interface ImageBlockComponentProps {
    block: ImageBlock;
    isEditing?: boolean;
}

export function ImageBlockComponent({ block, isEditing = false }: ImageBlockComponentProps) {
    const { url, alt, caption } = block.data;

    return (
        <section className="w-full py-4 md:py-6 bg-background">
            <div className="container mx-auto px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
                        {/* 
                      Added unoptimized={true} to bypass strict external image domain config.
                      This ensures placeholder images (like placehold.co) and other external URLs 
                      load immediately without requiring server restarts or config whitelisting.
                    */}
                        <Image
                            src={url}
                            alt={alt || "Görsel"}
                            fill
                            className="object-cover"
                            unoptimized={true}
                        />
                    </div>
                    {caption && (
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                            {caption}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
