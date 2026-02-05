"use client";

import { useState, useEffect, useRef } from "react";
import {
    UsersThree, FileText, ShieldCheck, Megaphone, Info, Warning,
    CheckCircle, Star, Heart, House, Gear, Rocket, Lightbulb,
    ChatCircle, Phone, Envelope, MapPin, Calendar, Clock, Trophy
} from "@phosphor-icons/react";

interface IconPickerProps {
    currentIcon: string;
    onSelect: (iconName: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

const AVAILABLE_ICONS = [
    { name: "UsersThree", icon: UsersThree },
    { name: "FileText", icon: FileText },
    { name: "ShieldCheck", icon: ShieldCheck },
    { name: "Megaphone", icon: Megaphone },
    { name: "Info", icon: Info },
    { name: "Warning", icon: Warning },
    { name: "CheckCircle", icon: CheckCircle },
    { name: "Lightbulb", icon: Lightbulb },
    { name: "Rocket", icon: Rocket },
    { name: "Star", icon: Star },
    { name: "Heart", icon: Heart },
    { name: "House", icon: House },
    { name: "Gear", icon: Gear },
    { name: "ChatCircle", icon: ChatCircle },
    { name: "Phone", icon: Phone },
    { name: "Envelope", icon: Envelope },
    { name: "MapPin", icon: MapPin },
    { name: "Calendar", icon: Calendar },
    { name: "Clock", icon: Clock },
    { name: "Trophy", icon: Trophy },
];

export function IconPicker({ currentIcon, onSelect, isOpen, onClose }: IconPickerProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={ref}
            className="absolute z-50 mt-2 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-64 grid grid-cols-5 gap-2"
        >
            {AVAILABLE_ICONS.map((item) => (
                <button
                    key={item.name}
                    onClick={() => {
                        onSelect(item.name);
                        onClose();
                    }}
                    className={`p-2 rounded-lg flex items-center justify-center transition-all hover:bg-slate-100 dark:hover:bg-slate-700 ${currentIcon === item.name ? "bg-[#ed2630]/10 text-[#ed2630] ring-1 ring-[#ed2630]" : "text-slate-600 dark:text-slate-300"
                        }`}
                    title={item.name}
                >
                    <item.icon weight={currentIcon === item.name ? "fill" : "regular"} className="w-6 h-6" />
                </button>
            ))}
        </div>
    );
}
