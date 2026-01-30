"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface AddContentTriggerProps {
    position: number;
    onClick: () => void;
}

export function AddContentTrigger({
    position,
    onClick,
}: AddContentTriggerProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative flex items-center justify-center h-16 group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            {/* Connector line segment */}
            <div className="absolute left-1/2 -translate-x-1/2 w-[2px] h-full bg-gray-200 dark:bg-gray-700 group-hover:bg-primary/30 transition-colors"></div>

            {/* Plus button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                    scale: isHovered ? 1 : 0,
                    opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="relative z-10 size-10 rounded-full bg-gray-400 hover:bg-gray-500 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
                aria-label="İçerik Ekle"
            >
                <span className="material-symbols-outlined !text-2xl">add</span>
            </motion.button>

            {/* Tooltip */}
            {isHovered && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-20"
                >
                    Aşama veya Etkinlik Ekle
                </motion.div>
            )}
        </div>
    );
}
