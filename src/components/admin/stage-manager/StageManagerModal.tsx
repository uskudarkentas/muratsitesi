"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Article, CheckCircle, Clock } from "@phosphor-icons/react";
import { updateStage, createStage } from "@/actions/admin";

interface StageManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    insertAfterOrder?: number;
    nextOrder?: number;
    editStage?: any;
    usedIcons?: string[];
    activeStageOrder?: number;
}

export function StageManagerModal({
    isOpen,
    onClose,
    insertAfterOrder,
    nextOrder,
    editStage,
    usedIcons = [],
    activeStageOrder = 0
}: StageManagerModalProps) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [iconKey, setIconKey] = useState("folder_open");
    const [status, setStatus] = useState("LOCKED");
    const [variant, setVariant] = useState("default");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        if (editStage) {
            setTitle(editStage.title || "");
            setDescription(editStage.description || "");
            setIconKey(editStage.iconKey || "folder_open");
            setStatus(editStage.status || "LOCKED");
            setVariant(editStage.variant || "default");
        } else {
            setTitle("");
            setDescription("");
            setIconKey("folder_open");
            setStatus("LOCKED");
            setVariant("default");
        }
    }, [editStage, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Generate Slug
            const trMap: { [key: string]: string } = {
                'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
                'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
            };

            const cleanSlug = title
                .split('')
                .map(char => trMap[char] || char)
                .join('')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

            const finalSlug = cleanSlug || `stage-${Date.now()}`;

            // Validation
            const targetOrder = editStage
                ? editStage.sequenceOrder
                : (insertAfterOrder !== undefined
                    ? (nextOrder !== undefined ? (insertAfterOrder + nextOrder) / 2 : insertAfterOrder + 1)
                    : 1);

            if (status === 'LOCKED' && targetOrder < activeStageOrder) {
                setValidationError('Gelecek aşamayı seçtiniz lütfen yerini değiştirin.');
                setIsSubmitting(false);
                return;
            }

            if (status === 'COMPLETED' && targetOrder > activeStageOrder) {
                setValidationError('Tamamlanmış bir aşama için yanlış yer seçtiniz. Lütfen yerini değiştirin.');
                setIsSubmitting(false);
                return;
            }

            if (editStage) {
                await updateStage(editStage.id, {
                    title,
                    description,
                    iconKey,
                    status: status as any,
                    variant,
                    slug: finalSlug
                });
            } else {
                await createStage({
                    title,
                    description,
                    iconKey,
                    status: status as any,
                    variant,
                    slug: finalSlug,
                    sequenceOrder: targetOrder
                });
            }

            onClose();
            router.refresh();
        } catch (error) {
            console.error("Error saving stage:", error);
            alert("Kaydedilirken bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="bg-white relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">
                                    {editStage ? "Aşamayı Düzenle" : "Yeni Aşama Ekle"}
                                </h3>
                                <p className="text-sm text-slate-500">Timeline üzerindeki bu adımı yapılandırın</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={24} weight="bold" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-slate-700">Aşama Başlığı</label>
                                    <input
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#ed2630] focus:border-transparent outline-none transition-all"
                                        placeholder="Örn: Yıkım Başlangıcı"
                                    />
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Durum</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#ed2630] outline-none transition-all"
                                    >
                                        <option value="LOCKED">Beklemede (Gelecek)</option>
                                        <option value="ACTIVE">Aktif (Devam Ediyor)</option>
                                        <option value="COMPLETED">Tamamlandı</option>
                                    </select>
                                </div>

                                {/* Variant */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Görünüm</label>
                                    <div className="flex bg-slate-100 p-1 rounded-xl">
                                        <button
                                            type="button"
                                            onClick={() => setVariant('default')}
                                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${variant === 'default' ? "bg-white text-[#ed2630] shadow-sm" : "text-slate-500"}`}
                                        >
                                            Normal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setVariant('small')}
                                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${variant === 'small' ? "bg-white text-[#ed2630] shadow-sm" : "text-slate-500"}`}
                                        >
                                            Ara Adım
                                        </button>
                                    </div>
                                </div>


                                {/* Icon Picker */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-slate-700">İkon Seçimi</label>
                                    <div className="grid grid-cols-6 sm:grid-cols-9 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 h-48 overflow-y-auto custom-scrollbar">
                                        {[
                                            "star", "article", "assignment", "history_edu", "folder_open", "description",
                                            "apartment", "location_city", "home", "business", "domain",
                                            "domain_disabled", "construction", "engineering", "build", "architecture",
                                            "moving", "local_shipping", "key", "signature", "verified",
                                            "handshake", "groups", "trending_up", "map", "analytics"
                                        ].filter(icon => {
                                            if (icon === 'star') return true; // Ara adımlar için yıldız her zaman seçilebilir olmalı
                                            if (editStage && editStage.iconKey === icon) return true;
                                            return !usedIcons.includes(icon);
                                        }).map((icon) => (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() => setIconKey(icon)}
                                                className={`aspect-square flex items-center justify-center rounded-xl transition-all ${iconKey === icon
                                                    ? "bg-[#ed2630] text-white shadow-lg scale-110"
                                                    : "bg-white text-slate-400 hover:bg-slate-200"
                                                    }`}
                                            >
                                                <span className="material-symbols-outlined !text-2xl">{icon}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-white transition-all"
                            >
                                Vazgeç
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !title}
                                className="flex-[2] px-6 py-3 rounded-xl bg-[#ed2630] text-white font-bold hover:bg-[#d11f2a] shadow-lg shadow-red-200 disabled:bg-slate-300 disabled:shadow-none transition-all"
                            >
                                {isSubmitting ? "Kaydediliyor..." : (editStage ? "Değişiklikleri Kaydet" : "Aşamayı Oluştur")}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
            {/* Validation Error Modal */}
            <AnimatePresence>
                {validationError && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
                            onClick={() => setValidationError(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white relative w-full max-w-sm rounded-[2rem] p-8 shadow-2xl border border-red-50 text-center"
                        >
                            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined !text-4xl">warning</span>
                            </div>
                            <h4 className="text-xl font-bold text-slate-800 mb-3">Hatalı Konum</h4>
                            <p className="text-slate-600 mb-8 leading-relaxed">
                                {validationError}
                            </p>
                            <button
                                onClick={() => setValidationError(null)}
                                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                            >
                                Tamam
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AnimatePresence>
    );
}
