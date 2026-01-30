"use client";

import { useState } from "react";
import { createPost } from "@/actions/admin";

interface Stage {
    id: number;
    title: string;
}

interface CreateAnnouncementFormProps {
    onClose: () => void;
    onSuccess: () => void;
    stages: Stage[];
    initialStageId?: number;
}

export function CreateAnnouncementForm({ onClose, onSuccess, stages, initialStageId }: CreateAnnouncementFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(false);

    // Form State
    const [announcementTitle, setAnnouncementTitle] = useState("");
    const [announcementContent, setAnnouncementContent] = useState("");
    const [announcementStageId, setAnnouncementStageId] = useState<number>(initialStageId || (stages[0]?.id ?? 1));
    const [announcementImage, setAnnouncementImage] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

    const handleFileUpload = async (file: File): Promise<string | null> => {
        setUploadingFile(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                return data.url;
            }
            return null;
        } catch (error) {
            console.error("File upload error:", error);
            return null;
        } finally {
            setUploadingFile(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            let imageUrl = uploadedImageUrl;

            if (announcementImage && !uploadedImageUrl) {
                const url = await handleFileUpload(announcementImage);
                if (url) {
                    imageUrl = url;
                    setUploadedImageUrl(url);
                }
            }

            await createPost({
                stageId: announcementStageId,
                title: announcementTitle,
                content: announcementContent,
                imageUrl: imageUrl || undefined,
            });

            onSuccess();
        } catch (error) {
            console.error("Error creating announcement:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <button
                onClick={onClose}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
                <span className="material-symbols-outlined !text-lg">arrow_back</span>
                Geri
            </button>

            <div>
                <label className="block text-sm font-medium mb-2">Duyuru Başlığı *</label>
                <input
                    type="text"
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                    placeholder="Önemli Duyuru"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">İçerik *</label>
                <textarea
                    value={announcementContent}
                    onChange={(e) => setAnnouncementContent(e.target.value)}
                    placeholder="Duyuru içeriği..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Aşama Seçin *</label>
                <select
                    value={announcementStageId}
                    onChange={(e) => setAnnouncementStageId(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    {stages.map((stage) => (
                        <option key={stage.id} value={stage.id}>
                            {stage.title}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Görsel veya PDF Ekle (Opsiyonel)</label>
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setAnnouncementImage(e.target.files?.[0] || null)}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer"
                    />
                    {announcementImage && (
                        <p className="text-xs text-muted-foreground mt-2">Seçili: {announcementImage.name}</p>
                    )}
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-lg border border-border hover:bg-secondary transition-colors"
                >
                    İptal
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!announcementTitle || !announcementContent || isSubmitting || uploadingFile}
                    className="flex-1 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {uploadingFile ? (
                        <>
                            <span className="material-symbols-outlined !text-lg animate-spin">progress_activity</span>
                            Dosya Yükleniyor...
                        </>
                    ) : isSubmitting ? (
                        "Yayınlanıyor..."
                    ) : (
                        "Duyuru Yayınla"
                    )}
                </button>
            </div>
        </div>
    );
}
