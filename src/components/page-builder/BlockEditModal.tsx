"use client";

import { useState, useEffect, useRef } from "react";
import { ContentBlock } from "@/types/page-builder";
import { X, Plus, Trash, UploadSimple, FilePdf } from "@phosphor-icons/react";
import { uploadFile } from "@/actions/upload";

interface BlockEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedBlock: ContentBlock) => void;
    block: ContentBlock;
}

export function BlockEditModal({ isOpen, onClose, onSave, block }: BlockEditModalProps) {
    const [formData, setFormData] = useState<any>(block.data);

    // Reset form data when block changes
    useEffect(() => {
        setFormData(JSON.parse(JSON.stringify(block.data))); // Deep copy
    }, [block]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({
            ...block,
            data: formData,
        });
        onClose();
    };

    const handleChange = (key: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [key]: value,
        }));
    };

    // Helper for array inputs (like cards in InfoCardGrid)
    const handleArrayChange = (arrayKey: string, index: number, field: string, value: any) => {
        setFormData((prev: any) => {
            const newArray = [...(prev[arrayKey] || [])];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [arrayKey]: newArray };
        });
    };

    const renderFields = () => {
        switch (block.type) {
            case 'hero':
                return (
                    <div className="space-y-4">
                        <InputField label="Başlık" value={formData.title} onChange={(v) => handleChange('title', v)} />
                        <TextAreaField label="Açıklama" value={formData.description} onChange={(v) => handleChange('description', v)} />
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Arka Plan Görseli</label>
                            <FileUploadField
                                value={formData.backgroundImage}
                                onChange={(url) => handleChange('backgroundImage', url)}
                                accept="image/*"
                                label="Görsel Yükle"
                            />
                        </div>
                        {/* Button fields removed per request */}
                    </div>
                );

            case 'info-card-grid':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-slate-700">Bilgi Kartları</label>
                        </div>
                        {(formData.cards || []).map((card: any, index: number) => (
                            <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 relative">
                                <div className="absolute top-2 right-2 text-xs font-bold text-slate-400">#{index + 1}</div>
                                <div className="grid grid-cols-2 gap-3">
                                    <InputField label="İkon (Phosphor Name)" value={card.icon} onChange={(v) => handleArrayChange('cards', index, 'icon', v)} placeholder="UsersThree, ShieldCheck..." />
                                    <InputField label="Başlık" value={card.title} onChange={(v) => handleArrayChange('cards', index, 'title', v)} />
                                </div>
                                <TextAreaField label="Açıklama" value={card.description} onChange={(v) => handleArrayChange('cards', index, 'description', v)} />
                            </div>
                        ))}
                    </div>
                );

            case 'announcement-banner':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="İkon (Phosphor Name)" value={formData.icon} onChange={(v) => handleChange('icon', v)} placeholder="Megaphone, Info..." />
                            <InputField label="Arka Plan Rengi" type="color" value={formData.backgroundColor} onChange={(v) => handleChange('backgroundColor', v)} />
                        </div>
                        <InputField label="Başlık" value={formData.title} onChange={(v) => handleChange('title', v)} />
                        <TextAreaField label="Açıklama" value={formData.description} onChange={(v) => handleChange('description', v)} />

                        <div className="border-t border-slate-100 pt-4 mt-4 space-y-4">
                            <h4 className="text-sm font-bold text-slate-900">Medya ve Dosyalar</h4>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Görsel (Opsiyonel)</label>
                                <FileUploadField
                                    value={formData.imageUrl}
                                    onChange={(url) => handleChange('imageUrl', url)}
                                    accept="image/*"
                                    label="Görsel Yükle"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dosya / PDF (Opsiyonel)</label>
                                <FileUploadField
                                    value={formData.attachmentUrl}
                                    onChange={(url) => handleChange('attachmentUrl', url)}
                                    accept=".pdf,.doc,.docx"
                                    label="Dosya Yükle"
                                />
                            </div>

                            <InputField
                                label="Buton Metni (Eğer dosya varsa)"
                                value={formData.attachmentText}
                                onChange={(v) => handleChange('attachmentText', v)}
                                placeholder="Örn: Dokümanı İndir"
                            />
                        </div>
                    </div>
                );

            case 'document-list':
                return (
                    <div className="space-y-6">
                        <InputField label="Liste Başlığı" value={formData.title} onChange={(v) => handleChange('title', v)} />
                        <label className="text-sm font-bold text-slate-700 block mt-4 mb-2">Dokümanlar</label>
                        {(formData.documents || []).map((doc: any, index: number) => (
                            <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 relative">
                                <button
                                    onClick={() => {
                                        const newDocs = [...formData.documents];
                                        newDocs.splice(index, 1);
                                        handleChange('documents', newDocs);
                                    }}
                                    className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded"
                                >
                                    <Trash size={16} />
                                </button>
                                <InputField label="Doküman Adı" value={doc.title} onChange={(v) => handleArrayChange('documents', index, 'title', v)} />

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500">Dosya Seçimi</label>
                                    <FileUploadField
                                        value={doc.fileUrl}
                                        onChange={(url) => handleArrayChange('documents', index, 'fileUrl', url)}
                                        accept=".pdf,.doc,.docx"
                                        label="PDF Yükle"
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => handleChange('documents', [...(formData.documents || []), { id: Date.now(), title: 'Yeni Doküman', fileUrl: '', type: 'pdf' }])}
                            className="flex items-center gap-2 text-sm font-bold text-[#ed2630] hover:bg-red-50 px-3 py-2 rounded-lg"
                        >
                            <Plus size={16} /> Doküman Ekle
                        </button>
                    </div>
                );

            case 'text':
                return (
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-700">İçerik (HTML)</label>
                        <textarea
                            className="w-full h-48 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ed2630] font-mono text-sm"
                            value={formData.content}
                            onChange={(e) => handleChange('content', e.target.value)}
                        />
                    </div>
                );

            case 'image':
                return (
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Görsel</label>
                            <FileUploadField
                                value={formData.url}
                                onChange={(url) => handleChange('url', url)}
                                accept="image/*"
                                label="Görsel Yükle"
                            />
                        </div>
                        <InputField label="Alt Metin" value={formData.alt} onChange={(v) => handleChange('alt', v)} />
                        <InputField label="Altyazı (Opsiyonel)" value={formData.caption} onChange={(v) => handleChange('caption', v)} />
                    </div>
                );

            default:
                return <p className="text-gray-500">Bu blok tipi için düzenleme alanı bulunamadı.</p>;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-[#46474A] dark:text-white">
                        Bloğu Düzenle
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {renderFields()}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                        Vazgeç
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 font-bold text-white bg-[#ed2630] hover:bg-[#d11f2a] rounded-xl transition-colors shadow-lg hover:shadow-red-600/20"
                    >
                        Değişiklikleri Kaydet
                    </button>
                </div>
            </div>
        </div>
    );
}

// Helper Components
function InputField({ label, value, onChange, placeholder, type = "text" }: any) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
            <input
                type={type}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ed2630] bg-white dark:bg-slate-800"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );
}

function TextAreaField({ label, value, onChange }: any) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
            <textarea
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ed2630] bg-white dark:bg-slate-800 min-h-[100px]"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

// File Upload Component
function FileUploadField({ value, onChange, accept, label }: { value: string, onChange: (url: string) => void, accept?: string, label: string }) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const result = await uploadFile(formData);

            if (result.success && result.url) {
                onChange(result.url); // Set the URL back to parent
            } else {
                alert("Dosya yüklenemedi: " + result.error);
            }
        } catch (error) {
            console.error(error);
            alert("Bir hata oluştu");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
        }
    };

    return (
        <div className="flex gap-3 items-center">
            {/* Hidden Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={accept}
                onChange={handleFileChange}
            />

            {/* URL Display */}
            <input
                type="text"
                readOnly
                value={value || ''}
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 cursor-not-allowed text-xs"
                placeholder="Dosya seçilmedi"
            />

            {/* Upload Button */}
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors font-medium text-sm"
            >
                {isUploading ? (
                    <span className="material-symbols-outlined animate-spin !text-base">progress_activity</span>
                ) : (
                    <UploadSimple weight="bold" />
                )}
                {isUploading ? 'Yükleniyor...' : label}
            </button>
        </div>
    );
}
