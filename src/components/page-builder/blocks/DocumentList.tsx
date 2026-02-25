"use client";

import { DocumentListBlock, DocumentItem } from "@/types/page-builder";
import Link from "next/link";
import { RichText } from "../RichText";
import { useState, useRef } from "react";
import { uploadFile } from "@/actions/upload";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash, ArrowsClockwise, FilePdf, DownloadSimple, ShareNetwork } from "@phosphor-icons/react";

interface DocumentListProps {
    block: DocumentListBlock;
    isEditing?: boolean;
    onUpdate?: (newData: any) => void;
}

export function DocumentList({ block, isEditing = false, onUpdate }: DocumentListProps) {
    const { title, documents } = block.data;
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpdateTitle = (val: string) => {
        if (onUpdate) {
            onUpdate({ ...block.data, title: val });
        }
    };

    const handleUpdateDocTitle = (index: number, val: string) => {
        if (onUpdate) {
            const newDocs = [...documents];
            newDocs[index] = { ...newDocs[index], title: val };
            onUpdate({ ...block.data, documents: newDocs });
        }
    };

    const handleAddDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !onUpdate) return;

        // Limit to 50MB for PDFs/Documents
        const MAX_SIZE = 50 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            alert("Dosya boyutu çok büyük (Maksimum 50MB). Lütfen dökümanı optimize edip tekrar deneyin.");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const result = await uploadFile(formData);

            if (result.success && result.url) {
                const newDoc: DocumentItem = {
                    id: uuidv4(),
                    title: file.name.split('.')[0],
                    fileUrl: result.url,
                    fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                    uploadDate: new Date().toLocaleDateString('tr-TR')
                };
                onUpdate({ ...block.data, documents: [...documents, newDoc] });
            } else {
                alert(result.error || "Dosya yüklenirken bir hata oluştu");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Bağlantı hatası oluştu");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemoveDocument = (id: string) => {
        if (onUpdate) {
            onUpdate({ ...block.data, documents: documents.filter(d => d.id !== id) });
        }
    };

    const handleDownload = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename || 'dokuman.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download error:", error);
            window.open(url, '_blank');
        }
    };

    const handleShare = async (url: string, title: string) => {
        const shareData = {
            title: title || 'Murat Sitesi - Doküman Paylaşımı',
            text: `${title} dokümanını Murat Sitesi üzerinden inceleyin.`,
            url: window.location.origin + url,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            const encodedText = encodeURIComponent(`${shareData.text}\n\n${shareData.url}`);
            window.open(`https://wa.me/?text=${encodedText}`, '_blank');
        }
    };

    return (
        <section className="w-full bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4 pt-2 pb-2 md:pt-4 md:pb-4">
                <div className="max-w-7xl mx-auto">
                    <div className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden">
                        <div className="relative z-10 px-6 py-8 md:px-12 md:py-14">

                            <div className="max-w-none mx-auto">
                                {isEditing ? (
                                    <RichText
                                        value={title}
                                        onSave={handleUpdateTitle}
                                        className="text-2xl md:text-3xl font-bold text-[#1a1b1f] dark:text-white text-left mb-6"
                                        placeholder="Liste Başlığı"
                                    />
                                ) : (
                                    <div
                                        className="text-2xl md:text-3xl font-bold text-[#1a1b1f] dark:text-white text-left mb-6"
                                        dangerouslySetInnerHTML={{ __html: title }}
                                    />
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {documents.map((doc, index) => (
                                    <div key={doc.id} className="relative group">
                                        <div
                                            className="flex items-center gap-5 p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300"
                                        >
                                            {/* PDF Icon / Preview */}
                                            <Link
                                                href={isEditing ? '#' : doc.fileUrl}
                                                target={isEditing ? undefined : "_blank"}
                                                rel={isEditing ? undefined : "noopener noreferrer"}
                                                className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-xl bg-red-50 dark:bg-red-900/10 text-[#ed2630] hover:scale-105 transition-transform"
                                                onClick={(e) => isEditing && e.preventDefault()}
                                            >
                                                <FilePdf size={32} weight="duotone" />
                                            </Link>

                                            <div className="flex-1 min-w-0">
                                                {isEditing ? (
                                                    <RichText
                                                        value={doc.title}
                                                        onSave={(val) => handleUpdateDocTitle(index, val)}
                                                        className="text-base font-medium text-slate-700 dark:text-white mb-1"
                                                        placeholder="Doküman Adı"
                                                    />
                                                ) : (
                                                    <Link
                                                        href={doc.fileUrl}
                                                        target="_blank"
                                                        className="text-base font-medium text-slate-700 dark:text-white mb-1 block truncate hover:text-[#ed2630] transition-colors"
                                                        dangerouslySetInnerHTML={{ __html: doc.title }}
                                                    />
                                                )}
                                                <div className="flex items-center gap-3 text-[12px] text-slate-500 dark:text-slate-400 font-medium">
                                                    {doc.fileSize && <span>{doc.fileSize}</span>}
                                                    {doc.uploadDate && <span className="opacity-60">{doc.uploadDate}</span>}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            {!isEditing && (
                                                <div className="flex gap-2 ml-2">
                                                    <button
                                                        onClick={() => handleShare(doc.fileUrl, doc.title)}
                                                        className="p-2 text-slate-400 hover:text-[#ed2630] hover:bg-red-50 rounded-full transition-all"
                                                        title="Paylaş"
                                                    >
                                                        <ShareNetwork size={20} weight="bold" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDownload(doc.fileUrl, `${doc.title}.pdf`)}
                                                        className="p-2 text-slate-400 hover:text-[#ed2630] hover:bg-red-50 rounded-full transition-all"
                                                        title="İndir"
                                                    >
                                                        <DownloadSimple size={20} weight="bold" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Delete Button */}
                                        {isEditing && (
                                            <button
                                                onClick={() => handleRemoveDocument(doc.id)}
                                                className="absolute -top-2 -right-2 p-1.5 bg-white shadow-md rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all scale-0 group-hover:scale-100 z-10 border border-slate-100"
                                                title="Sil"
                                            >
                                                <Trash size={14} weight="bold" />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {/* Add Document Card (Edit Mode) */}
                                {isEditing && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="flex items-center justify-center gap-3 p-5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 hover:bg-red-50 hover:border-red-300 transition-all"
                                    >
                                        {isUploading ? (
                                            <ArrowsClockwise size={24} className="animate-spin text-red-500" />
                                        ) : (
                                            <>
                                                <Plus size={20} weight="bold" className="text-red-500" />
                                                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Yeni Döküman Ekle</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleAddDocument}
                                            className="hidden"
                                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                                        />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
