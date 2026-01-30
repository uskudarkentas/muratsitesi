"use client";

import { Plus } from "lucide-react";

interface QuickAddButtonProps {
    onClick: () => void;
}

export function QuickAddButton({ onClick }: QuickAddButtonProps) {
    return (
        <button
            onClick={onClick}
            className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-[#ed2630] hover:bg-red-700 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            title="Hızlı Duyuru Ekle"
        >
            <Plus className="w-4 h-4" />
            <span>Hızlı Ekle</span>
        </button>
    );
}
