"use client";

import { useState } from "react";
import { createStage } from "@/actions/admin";

interface CreateStageFormProps {
    onClose: () => void;
    onSuccess: () => void;
    insertPosition: number;
}

export function CreateStageForm({ onClose, onSuccess, insertPosition }: CreateStageFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [stageTitle, setStageTitle] = useState("");
    const [stageDescription, setStageDescription] = useState("");
    const [stageIcon, setStageIcon] = useState("folder_open");
    const [isInterim, setIsInterim] = useState(false);
    const [stageStatus, setStageStatus] = useState("LOCKED");

    const iconOptions = [
        "folder_open", "description", "gavel", "engineering", "apartment",
        "handshake", "verified", "assignment_turned_in", "construction",
        "home_work", "fact_check", "task_alt", "star", "event", "campaign",
    ];

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const slug = stageTitle
                .toLowerCase()
                .replace(/ğ/g, "g")
                .replace(/ü/g, "u")
                .replace(/ş/g, "s")
                .replace(/ı/g, "i")
                .replace(/ö/g, "o")
                .replace(/ç/g, "c")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

            await createStage({
                title: stageTitle,
                slug,
                description: stageDescription,
                iconKey: stageIcon,
                sequenceOrder: insertPosition,
                variant: isInterim ? "small" : "default",
                status: stageStatus as any,
            });

            onSuccess();
        } catch (error) {
            console.error("Error creating stage:", error);
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
                <label className="block text-sm font-medium mb-2">Aşama Başlığı *</label>
                <input
                    type="text"
                    value={stageTitle}
                    onChange={(e) => setStageTitle(e.target.value)}
                    placeholder="Ön Protokol"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Açıklama *</label>
                <textarea
                    value={stageDescription}
                    onChange={(e) => setStageDescription(e.target.value)}
                    placeholder="Aşama hakkında kısa açıklama"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Durum</label>
                <select
                    value={stageStatus}
                    onChange={(e) => setStageStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="LOCKED">Pasif (Gelecek Aşama)</option>
                    <option value="ACTIVE">Aktif (Şuanki Aşama)</option>
                    <option value="COMPLETED">Tamamlandı (Geçmiş Aşama)</option>
                </select>
            </div>

            <div className="flex items-center gap-2 mb-4 p-3 bg-secondary/50 rounded-lg border border-border">
                <input
                    type="checkbox"
                    id="isInterim"
                    checked={isInterim}
                    onChange={(e) => setIsInterim(e.target.checked)}
                    className="size-5 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                />
                <label htmlFor="isInterim" className="text-sm font-medium cursor-pointer select-none">
                    Bu bir Ara Aşama / Toplantıdır (Küçük Görünüm)
                </label>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">İkon Seçin *</label>
                <div className="grid grid-cols-6 gap-2">
                    {iconOptions.map((icon) => (
                        <button
                            key={icon}
                            onClick={() => setStageIcon(icon)}
                            className={`size-12 rounded-lg border-2 flex items-center justify-center transition-all ${stageIcon === icon
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50"
                                }`}
                        >
                            <span className="material-symbols-outlined !text-xl">{icon}</span>
                        </button>
                    ))}
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
                    disabled={!stageTitle || !stageDescription || isSubmitting}
                    className="flex-1 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Ekleniyor..." : "Aşama Ekle"}
                </button>
            </div>
        </div>
    );
}
