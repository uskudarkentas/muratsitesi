"use client";

import { useState } from "react";
import { AnnouncementBannerBlock } from "@/types/page-builder";
import {
    UsersThree, FileText, ShieldCheck, Info, CheckCircle, Warning,
    Circle, Square, AppWindow, Article, Megaphone, Star, Heart,
    House, Gear, Rocket, Lightbulb, ChatCircle, Phone, Envelope,
    MapPin, Calendar, Clock, Trophy, Campfire, Broadcast, BellRinging
} from "@phosphor-icons/react";
import { InlineText } from "../InlineText";
import { IconPicker } from "../IconPicker";
import { RichText } from "../RichText";

interface AnnouncementBannerProps {
    block: AnnouncementBannerBlock;
    isEditing?: boolean;
    onUpdate?: (newData: any) => void;
}

// Icon Mapping
const IconMap: Record<string, any> = {
    'Megaphone': Megaphone,
    'Campfire': Campfire,
    'Broadcast': Broadcast,
    'Info': Info,
    'Warning': Warning,
    'BellRinging': BellRinging,
    'Star': Star,
    'Heart': Heart,
    'Lightbulb': Lightbulb,
    'Rocket': Rocket
};


export function AnnouncementBanner({ block, isEditing = false, onUpdate }: AnnouncementBannerProps) {
    const { icon, title, description, backgroundColor = '#98EB94', layout } = block.data;
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    // Resolve Icon
    const IconComponent = IconMap[icon] || IconMap['Megaphone'];

    const handleUpdate = (key: string, value: string) => {
        if (onUpdate) {
            onUpdate({ ...block.data, [key]: value });
        }
    }

    return (
        <section className="w-full bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4 pt-2 pb-2 md:pt-4 md:pb-4">
                <div className="max-w-7xl mx-auto">
                    <div className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">

                        {/* Layout Switcher (Edit Mode Only) */}
                        {isEditing && (
                            <div className="absolute top-6 left-6 z-40 flex bg-white/90 backdrop-blur p-1 rounded-xl border border-slate-200 shadow-sm gap-1">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleUpdate('layout', 'banner'); }}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${(!layout || layout === 'banner') ? 'bg-[#ed2630] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Banner
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleUpdate('layout', 'article'); }}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${layout === 'article' ? 'bg-[#ed2630] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Makale
                                </button>
                            </div>
                        )}

                        {(!layout || layout === 'banner') ? (
                            /* --- ORIGINAL BANNER LAYOUT --- */
                            <div className="flex flex-col md:flex-row min-h-[180px]">
                                {/* Green Left Accent / Icon Area */}
                                <div className="relative w-full md:w-56 bg-[#a8f0a4] flex items-center justify-center p-8 md:p-0 flex-shrink-0">
                                    <div className="relative">
                                        <div
                                            onClick={() => isEditing && setIsPickerOpen(!isPickerOpen)}
                                            className={`w-24 h-24 bg-black/5 rounded-full flex items-center justify-center transition-all ${isEditing ? 'cursor-pointer hover:bg-black/10 hover:scale-105' : ''}`}
                                        >
                                            {IconComponent ? (
                                                <IconComponent weight="fill" className="w-12 h-12 text-[#1e4e1b]" />
                                            ) : (
                                                <span className="material-symbols-outlined !text-4xl text-[#1e4e1b]">
                                                    {icon}
                                                </span>
                                            )}

                                            {isEditing && (
                                                <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md text-xs text-slate-500 border border-slate-100">
                                                    <span className="material-symbols-outlined !text-[12px]">edit</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Icon Picker Popover */}
                                        <div className="absolute top-full left-0 z-50 mt-4" onClick={(e) => e.stopPropagation()}>
                                            <IconPicker
                                                isOpen={isPickerOpen}
                                                onClose={() => setIsPickerOpen(false)}
                                                currentIcon={icon}
                                                onSelect={(newIcon) => handleUpdate('icon', newIcon)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="flex-1 p-8 md:p-12 flex flex-col md:flex-row gap-8 bg-gradient-to-r from-white via-white to-slate-50/30">
                                    {/* Text and Actions */}
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="w-8 h-1 bg-[#458a42] rounded-full"></span>
                                            <span className="text-xs font-bold text-[#458a42] uppercase tracking-[0.2em]">ÖNEMLİ DUYURU</span>
                                        </div>

                                        <div onClick={(e) => e.stopPropagation()}>
                                            {isEditing ? (
                                                <RichText
                                                    value={title}
                                                    onSave={(val) => handleUpdate('title', val)}
                                                    className="text-2xl md:text-4xl font-black text-[#1a1b1f] dark:text-white mb-4 leading-tight tracking-tight"
                                                    placeholder="Başlık Buraya"
                                                />
                                            ) : (
                                                <h3
                                                    className="text-2xl md:text-4xl font-black text-[#1a1b1f] dark:text-white mb-4 leading-tight tracking-tight"
                                                    dangerouslySetInnerHTML={{ __html: title }}
                                                />
                                            )}

                                            {isEditing ? (
                                                <RichText
                                                    value={description}
                                                    onSave={(val) => handleUpdate('description', val)}
                                                    className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mb-8"
                                                    placeholder="Duyuru metni..."
                                                />
                                            ) : (
                                                <div
                                                    className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mb-8 prose prose-slate dark:prose-invert max-w-none"
                                                    dangerouslySetInnerHTML={{ __html: description }}
                                                />
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-4">
                                            {block.data.attachmentUrl && (
                                                <a
                                                    href={block.data.attachmentUrl}
                                                    download
                                                    target="_blank"
                                                    className="inline-flex items-center gap-3 px-6 py-3 bg-[#ed2630] text-white rounded-2xl font-bold hover:bg-[#d11f2a] transition-all shadow-lg hover:shadow-xl text-sm uppercase tracking-wider"
                                                >
                                                    <span className="material-symbols-outlined !text-[20px]">download</span>
                                                    {block.data.attachmentText || "Dosyayı İndir"}
                                                </a>
                                            )}

                                            <button
                                                onClick={() => {
                                                    if (navigator.share) {
                                                        navigator.share({
                                                            title: title,
                                                            text: description,
                                                            url: window.location.href
                                                        }).catch(console.error);
                                                    } else {
                                                        navigator.clipboard.writeText(window.location.href);
                                                        alert("Bağlantı kopyalandı!");
                                                    }
                                                }}
                                                className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 text-slate-700 dark:text-white dark:bg-slate-700 dark:border-slate-600 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-all text-sm uppercase tracking-wider shadow-sm"
                                            >
                                                <span className="material-symbols-outlined !text-[20px]">share</span>
                                                Paylaş
                                            </button>
                                        </div>
                                    </div>

                                    {/* Image Area (Right Side) */}
                                    {block.data.imageUrl && (
                                        <div className="w-full md:w-72 lg:w-96 flex-shrink-0">
                                            <div className="relative aspect-video md:aspect-square rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700 group/img">
                                                <img
                                                    src={block.data.imageUrl}
                                                    alt={title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/5 transition-colors" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* --- NEW ARTICLE LAYOUT (For Long Content) --- */
                            <div className="flex flex-col">
                                {/* Large Icon Header */}
                                <div className="h-4 bg-[#a8f0a4]" />

                                <div className="p-8 md:p-16 flex flex-col items-center">
                                    <div className="relative mb-8 group/article-icon">
                                        <div
                                            onClick={() => isEditing && setIsPickerOpen(!isPickerOpen)}
                                            className={`w-20 h-20 bg-slate-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center transition-all shadow-inner ${isEditing ? 'cursor-pointer hover:bg-slate-100 hover:scale-105' : ''}`}
                                        >
                                            {IconComponent ? (
                                                <IconComponent weight="fill" className="w-10 h-10 text-[#458a42]" />
                                            ) : (
                                                <span className="material-symbols-outlined !text-3xl text-[#458a42]">
                                                    {icon}
                                                </span>
                                            )}
                                        </div>
                                        {isEditing && (
                                            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-md border border-slate-100 dark:border-slate-600">
                                                <span className="material-symbols-outlined !text-[10px]">edit</span>
                                            </div>
                                        )}
                                        {/* Icon Picker Popover */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 mt-4" onClick={(e) => e.stopPropagation()}>
                                            <IconPicker
                                                isOpen={isPickerOpen}
                                                onClose={() => setIsPickerOpen(false)}
                                                currentIcon={icon}
                                                onSelect={(newIcon) => handleUpdate('icon', newIcon)}
                                            />
                                        </div>
                                    </div>

                                    <div className="w-full max-w-4xl text-center flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="w-4 h-1 bg-[#458a42] rounded-full"></span>
                                            <span className="text-xs font-black text-[#458a42] uppercase tracking-[0.4em]">ÖNEMLİ DUYURU</span>
                                            <span className="w-4 h-1 bg-[#458a42] rounded-full"></span>
                                        </div>

                                        {isEditing ? (
                                            <RichText
                                                value={title}
                                                onSave={(val) => handleUpdate('title', val)}
                                                className="text-3xl md:text-5xl font-black text-[#1a1b1f] dark:text-white mb-8 leading-[1.1] tracking-tight"
                                                placeholder="Büyük Başlık"
                                            />
                                        ) : (
                                            <h3
                                                className="text-3xl md:text-5xl font-black text-[#1a1b1f] dark:text-white mb-8 leading-[1.1] tracking-tight"
                                                dangerouslySetInnerHTML={{ __html: title }}
                                            />
                                        )}

                                        <div className="w-16 h-px bg-slate-200 dark:bg-slate-700 mb-8" />

                                        {isEditing ? (
                                            <RichText
                                                value={description}
                                                onSave={(val) => handleUpdate('description', val)}
                                                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed text-left"
                                                placeholder="Uzun duyuru metni buraya..."
                                            />
                                        ) : (
                                            <div
                                                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed text-left prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-p:mb-6"
                                                dangerouslySetInnerHTML={{ __html: description }}
                                            />
                                        )}

                                        {/* Footer Actions */}
                                        <div className="mt-16 pt-10 border-t border-slate-100 dark:border-slate-700 w-full flex flex-wrap justify-center gap-6">
                                            {block.data.attachmentUrl && (
                                                <a
                                                    href={block.data.attachmentUrl}
                                                    download
                                                    target="_blank"
                                                    className="inline-flex items-center gap-4 px-10 py-5 bg-[#ed2630] text-white rounded-[2rem] font-black hover:bg-[#d11f2a] transition-all shadow-xl hover:shadow-2xl active:scale-95 text-sm uppercase tracking-widest"
                                                >
                                                    <span className="material-symbols-outlined !text-[24px]">download</span>
                                                    {block.data.attachmentText || "BELGEYİ İNDİR"}
                                                </a>
                                            )}

                                            <button
                                                onClick={() => {
                                                    if (navigator.share) {
                                                        navigator.share({
                                                            title: title,
                                                            text: description,
                                                            url: window.location.href
                                                        }).catch(console.error);
                                                    } else {
                                                        navigator.clipboard.writeText(window.location.href);
                                                        alert("Bağlantı kopyalandı!");
                                                    }
                                                }}
                                                className="inline-flex items-center gap-4 px-10 py-5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white rounded-[2rem] font-black hover:bg-slate-100 dark:hover:bg-slate-600 transition-all text-sm uppercase tracking-widest shadow-sm"
                                            >
                                                <span className="material-symbols-outlined !text-[24px]">share</span>
                                                PAYLAŞ
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
