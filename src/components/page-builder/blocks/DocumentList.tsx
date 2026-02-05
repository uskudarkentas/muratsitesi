import { DocumentListBlock } from "@/types/page-builder";
import Link from "next/link";

interface DocumentListProps {
    block: DocumentListBlock;
    isEditing?: boolean;
}

export function DocumentList({ block, isEditing = false }: DocumentListProps) {
    const { title, documents } = block.data;

    return (
        <section className="w-full py-12 md:py-16 bg-background">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[#46474A] dark:text-white mb-8">
                    {title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((doc) => (
                        <Link
                            key={doc.id}
                            href={isEditing ? '#' : doc.fileUrl}
                            target={isEditing ? undefined : "_blank"}
                            rel={isEditing ? undefined : "noopener noreferrer"}
                            className="group flex items-center gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#ed2630] hover:shadow-md transition-all"
                            onClick={(e) => isEditing && e.preventDefault()}
                        >
                            {/* PDF Icon */}
                            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-lg bg-red-50 dark:bg-red-900/20 text-[#ed2630]">
                                <span className="material-symbols-outlined !text-3xl">
                                    picture_as_pdf
                                </span>
                            </div>

                            {/* Document Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-[#46474A] dark:text-white mb-1 truncate group-hover:text-[#ed2630] transition-colors">
                                    {doc.title}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                    {doc.fileSize && (
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined !text-sm">
                                                folder
                                            </span>
                                            {doc.fileSize}
                                        </span>
                                    )}
                                    {doc.uploadDate && (
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined !text-sm">
                                                calendar_today
                                            </span>
                                            {doc.uploadDate}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Download Icon */}
                            <div className="flex-shrink-0">
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-[#ed2630] transition-colors">
                                    download
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
