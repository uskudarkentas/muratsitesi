"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Paperclip } from "@phosphor-icons/react";
import { createPost } from "@/actions/admin";
import { TemplateChips } from "./TemplateChips";
import { MobilePreview } from "./MobilePreview";

interface SimplifiedAnnouncementModalProps {
    isOpen: boolean;
    onClose: () => void;
    stageId: number;
}

export function SimplifiedAnnouncementModal({
    isOpen,
    onClose,
    stageId,
}: SimplifiedAnnouncementModalProps) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTemplateSelect = (templateContent: string) => {
        setContent(templateContent);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let fileUrl = "";

            // 1. Upload file if exists
            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch("/api/admin/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Dosya yüklenemedi");
                }

                const result = await response.json();
                if (result.success) {
                    fileUrl = result.url;
                }
            }

            // 2. Create Post
            const result = await createPost({
                stageId,
                title,
                content,
                attachmentUrl: fileUrl, // Using attachmentUrl for generic files
            });

            if (!result.success) {
                throw new Error(result.error || "Duyuru oluşturulamadı");
            }

            // 3. Success Feedback
            // Reset form
            setTitle("");
            setContent("");
            setFile(null);
            onClose();
            router.refresh();

            // Optional: You could add a toast notification here
            // toast.success("Duyuru başarıyla yayınlandı");

        } catch (error) {
            console.error("Submission error:", error);
            alert("Bir hata oluştu: " + (error instanceof Error ? error.message : "Bilinmeyen hata"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop with glassmorphism */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-xl z-[60]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-4 md:inset-8 lg:inset-16 z-[70] flex items-center justify-center"
                    >
                        <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] w-full max-w-6xl max-h-full overflow-hidden flex flex-col border border-slate-200/50">
                            {/* Header - Simplified, no stage navigation */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <div>
                                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                        Hızlı Duyuru Ekle
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Duyurunuzu oluşturun ve yayınlayın
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                                >
                                    <X weight="light" className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            {/* Split-Screen Content */}
                            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                                {/* Left Column - Form (60%) */}
                                <div className="flex-1 lg:w-[60%] p-8 overflow-y-auto bg-slate-50/50">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Title Field */}
                                        <div>
                                            <label className="block text-sm font-semibold tracking-tight text-slate-700 mb-2">
                                                Başlık
                                            </label>
                                            <input
                                                type="text"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Örn: Toplantı Duyurusu"
                                                required
                                                maxLength={100}
                                                className="w-full px-4 py-3 rounded-xl border-0 bg-slate-50/50 text-slate-900 placeholder-slate-400 ring-1 ring-transparent focus:ring-1 focus:ring-slate-300 focus:bg-white transition-all duration-200 ease-in-out shadow-sm"
                                            />
                                            <p className="text-xs text-slate-500 mt-1.5 font-medium">
                                                {title.length}/100 karakter
                                            </p>
                                        </div>

                                        {/* Content Field with Templates */}
                                        <div>
                                            <label className="block text-sm font-semibold tracking-tight text-slate-700 mb-2">
                                                Duyuru İçeriği
                                            </label>
                                            <TemplateChips onSelectTemplate={handleTemplateSelect} />
                                            <textarea
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                placeholder="Duyuru içeriğini buraya yazın..."
                                                required
                                                rows={10}
                                                maxLength={1000}
                                                className="w-full px-4 py-3 rounded-xl border-0 bg-slate-50/50 text-slate-900 placeholder-slate-400 ring-1 ring-transparent focus:ring-1 focus:ring-slate-300 focus:bg-white transition-all duration-200 ease-in-out resize-none shadow-sm"
                                            />
                                            <p className="text-xs text-slate-500 mt-1.5 font-medium">
                                                {content.length}/1000 karakter
                                            </p>
                                        </div>

                                        {/* File Upload */}
                                        <div>
                                            <label className="block text-sm font-semibold tracking-tight text-slate-700 mb-2">
                                                Belge Ekle (İsteğe Bağlı)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    id="file-upload"
                                                    onChange={handleFileChange}
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor="file-upload"
                                                    className="flex items-center justify-center gap-3 w-full px-4 py-3.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 cursor-pointer transition-all duration-200 ease-in-out"
                                                >
                                                    <Paperclip weight="thin" className="w-5 h-5 text-slate-400" style={{ strokeWidth: '1.2px' }} />
                                                    <span className="text-sm text-slate-600 font-medium">
                                                        {file ? file.name : "PDF veya resim yükleyin"}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="flex-1 px-6 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold hover:bg-slate-100 transition-all shadow-sm"
                                            >
                                                Vazgeç
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting || !title || !content}
                                                className="flex-1 px-6 py-3 rounded-xl bg-[#ED1C24] text-white font-bold hover:bg-[#d11f2a] shadow-[0_10px_20px_-5px_rgba(237,28,36,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(237,28,36,0.4)] disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                {isSubmitting ? "Yayınlanıyor..." : "Yayınla"}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Right Column - Mobile Preview (40%) */}
                                <div className="hidden lg:block lg:w-[40%] border-l border-slate-100 p-6 overflow-y-auto">
                                    <MobilePreview
                                        title={title}
                                        content={content}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
