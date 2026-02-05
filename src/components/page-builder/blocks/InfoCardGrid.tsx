"use client";

import { useState } from "react";
import { InfoCardGridBlock } from "@/types/page-builder";
import {
    UsersThree, FileText, ShieldCheck, Info, CheckCircle, Warning,
    Circle, Square, AppWindow, Article, Megaphone, Star, Heart,
    House, Gear, Rocket, Lightbulb, ChatCircle, Phone, Envelope,
    MapPin, Calendar, Clock, Trophy
} from "@phosphor-icons/react";
import { InlineText } from "../InlineText";
import { IconPicker } from "../IconPicker";

interface InfoCardGridProps {
    block: InfoCardGridBlock;
    isEditing?: boolean;
    onUpdate?: (newData: any) => void;
}

// Map legacy Phosphor icon names and new ones to actual components
const IconMap: Record<string, any> = {
    'UsersThree': UsersThree,
    'FileText': FileText,
    'ShieldCheck': ShieldCheck,
    'Info': Info,
    'CheckCircle': CheckCircle,
    'Warning': Warning,
    'Circle': Circle,
    'Square': Square,
    'AppWindow': AppWindow,
    'Article': Article,
    'Megaphone': Megaphone,
    'Star': Star,
    'Heart': Heart,
    'House': House,
    'Gear': Gear,
    'Rocket': Rocket,
    'Lightbulb': Lightbulb,
    'ChatCircle': ChatCircle,
    'Phone': Phone,
    'Envelope': Envelope,
    'MapPin': MapPin,
    'Calendar': Calendar,
    'Clock': Clock,
    'Trophy': Trophy
};

export function InfoCardGrid({ block, isEditing = false, onUpdate }: InfoCardGridProps) {
    const { cards } = block.data;
    const [activeIconPicker, setActiveIconPicker] = useState<number | null>(null);

    // Use grid-cols-1 for mobile, md:grid-cols-2 for tablets, lg:grid-cols-3 for desktops
    const gridColsClass = cards.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3';

    const handleCardUpdate = (index: number, key: string, value: string) => {
        if (!onUpdate) return;

        const newCards = [...cards];
        newCards[index] = { ...newCards[index], [key]: value };

        onUpdate({ ...block.data, cards: newCards });
    };

    return (
        <section className="w-full py-8 bg-transparent">
            <div className="container mx-auto px-4">
                <div className={`grid grid-cols-1 ${gridColsClass} gap-6 md:gap-8`}>
                    {cards.map((card, index) => {
                        // Determine Icon Component
                        const IconComponent = IconMap[card.icon] || IconMap['Circle'];

                        return (
                            <div
                                key={card.id}
                                className="group relative bg-white dark:bg-slate-800 rounded-[2rem] p-8 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 h-full flex flex-col"
                            >
                                {/* Icon Area */}
                                <div className="relative mb-8 flex-shrink-0">
                                    <div
                                        onClick={() => isEditing && setActiveIconPicker(activeIconPicker === index ? null : index)}
                                        className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-700 text-slate-600 transition-colors ${isEditing ? 'cursor-pointer hover:bg-slate-100 hover:ring-2 hover:ring-[#ed2630] hover:text-[#ed2630]' : 'group-hover:bg-[#ed2630]/10 group-hover:text-[#ed2630]'}`}
                                    >
                                        {IconComponent && <IconComponent weight="duotone" className="w-8 h-8" />}

                                        {/* Edit Badge */}
                                        {isEditing && (
                                            <div className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow-md border border-slate-200">
                                                <span className="material-symbols-outlined !text-[10px] text-slate-400">edit</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Icon Picker Popover */}
                                    <div className="absolute top-full left-0 z-50">
                                        <IconPicker
                                            isOpen={activeIconPicker === index}
                                            onClose={() => setActiveIconPicker(null)}
                                            currentIcon={card.icon}
                                            onSelect={(newIcon) => handleCardUpdate(index, 'icon', newIcon)}
                                        />
                                    </div>
                                </div>

                                {/* Title with Red Accent Line */}
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="w-1 h-6 bg-[#ed2630] rounded-full"></span>
                                    {isEditing ? (
                                        <InlineText
                                            value={card.title}
                                            onSave={(val) => handleCardUpdate(index, 'title', val)}
                                            tagName="h3"
                                            className="text-xl font-bold text-[#1a1b1f] dark:text-white"
                                        />
                                    ) : (
                                        <h3 className="text-xl font-bold text-[#1a1b1f] dark:text-white">
                                            {card.title}
                                        </h3>
                                    )}
                                </div>

                                {/* Description */}
                                {isEditing ? (
                                    <InlineText
                                        value={card.description}
                                        onSave={(val) => handleCardUpdate(index, 'description', val)}
                                        tagName="p"
                                        className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm md:text-base"
                                    />
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm md:text-base">
                                        {card.description}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
