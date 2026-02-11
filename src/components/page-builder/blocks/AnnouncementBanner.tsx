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
    const { icon, title, description, backgroundColor = '#98EB94' } = block.data;
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    // Resolve Icon
    const IconComponent = IconMap[icon] || IconMap['Megaphone'];

    const handleUpdate = (key: string, value: string) => {
        if (onUpdate) {
            onUpdate({ ...block.data, [key]: value });
        }
    }

    return (
        <section className="w-full py-4 md:py-6">
            <div className="container mx-auto px-4">
                <div className="relative overflow-hidden rounded-[2rem] bg-white border border-slate-100 p-0 flex flex-col md:flex-row min-h-[180px] max-w-7xl mx-auto shadow-sm">

                    {/* Green Left Accent / Icon Area */}
                    <div className="relative w-full md:w-48 bg-[#a8f0a4] flex items-center justify-center p-8 md:p-0 flex-shrink-0">
                        <div className="relative">
                            <div
                                onClick={() => isEditing && setIsPickerOpen(!isPickerOpen)}
                                className={`w-20 h-20 bg-black/5 rounded-full flex items-center justify-center transition-all ${isEditing ? 'cursor-pointer hover:bg-black/10 hover:scale-105' : ''}`}
                            >
                                {IconComponent ? (
                                    <IconComponent weight="fill" className="w-10 h-10 text-[#1e4e1b]" />
                                ) : (
                                    <span className="material-symbols-outlined !text-4xl text-[#1e4e1b]">
                                        {icon}
                                    </span>
                                )}

                                {isEditing && (
                                    <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-sm text-xs text-slate-500">
                                        <span className="material-symbols-outlined !text-[12px]">edit</span>
                                    </div>
                                )}
                            </div>

                            {/* Icon Picker */}
                            <div className="absolute top-full left-0 z-50 mt-2">
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
                    <div className="flex-1 p-6 md:p-10 flex flex-col md:flex-row gap-6 bg-gradient-to-r from-white via-white to-slate-50/50">

                        {/* Text and Actions */}
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-xs font-bold text-[#458a42] uppercase tracking-wider">ÖNEMLİ DUYURU</span>
                            </div>

                            {isEditing ? (
                                <InlineText
                                    value={title}
                                    onSave={(val) => handleUpdate('title', val)}
                                    tagName="h3"
                                    className="text-2xl md:text-3xl font-extrabold text-[#1a1b1f] mb-3"
                                />
                            ) : (
                                <h3 className="text-2xl md:text-3xl font-extrabold text-[#1a1b1f] mb-3">
                                    {title}
                                </h3>
                            )}

                            {isEditing ? (
                                <InlineText
                                    value={description}
                                    onSave={(val) => handleUpdate('description', val)}
                                    tagName="p"
                                    className="text-base text-gray-600 leading-relaxed max-w-2xl mb-6"
                                />
                            ) : (
                                <p className="text-base text-gray-600 leading-relaxed max-w-2xl mb-6">
                                    {description}
                                </p>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                                {/* Download Button */}
                                {block.data.attachmentUrl && (
                                    <a
                                        href={block.data.attachmentUrl}
                                        download
                                        target="_blank"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ed2630] text-white rounded-xl font-bold hover:bg-[#d11f2a] transition-all shadow-md hover:shadow-lg text-sm"
                                    >
                                        <span className="material-symbols-outlined !text-[20px]">download</span>
                                        {block.data.attachmentText || "Dosyayı İndir"}
                                    </a>
                                )}

                                {/* Share Button */}
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
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
                                >
                                    <span className="material-symbols-outlined !text-[20px]">share</span>
                                    Paylaş
                                </button>
                            </div>
                        </div>

                        {/* Image Area (Right Side) */}
                        {block.data.imageUrl && (
                            <div className="w-full md:w-64 lg:w-80 flex-shrink-0">
                                <div className="relative aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-md border border-slate-100">
                                    <img
                                        src={block.data.imageUrl}
                                        alt={title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </section>
    );
}
