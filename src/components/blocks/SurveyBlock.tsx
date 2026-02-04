"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Info } from "@phosphor-icons/react/dist/ssr";

interface SurveyBlockProps {
    data: {
        question: string;
        description?: string;
        options: Array<{
            id: string;
            text: string;
        }>;
        allowMultiple?: boolean;
    };
}

export function SurveyBlock({ data }: SurveyBlockProps) {
    const [selected, setSelected] = useState<string[]>([]);
    const [voted, setVoted] = useState(false);

    const toggleOption = (id: string) => {
        if (voted) return;
        if (data.allowMultiple) {
            setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
        } else {
            setSelected([id]);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4">
            <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                {/* Visual decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/10 via-primary to-primary/10"></div>

                <div className="flex items-start gap-4 mb-10">
                    <div className="size-12 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                        <Info size={24} weight="bold" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-primary rounded-full shrink-0"></span>
                            {data.question}
                        </h3>
                        {data.description && (
                            <p className="text-slate-500 text-sm font-normal leading-relaxed">
                                {data.description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-4 mb-10">
                    {data.options.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => toggleOption(option.id)}
                            disabled={voted}
                            className={cn(
                                "w-full flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 relative group",
                                selected.includes(option.id)
                                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                    : "bg-slate-50 border-slate-100 text-slate-600 hover:border-primary/30 hover:bg-slate-100"
                            )}
                        >
                            <div className={cn(
                                "size-6 rounded-full border-2 flex items-center justify-center transition-all",
                                selected.includes(option.id)
                                    ? "bg-white border-white text-primary"
                                    : "bg-white border-slate-200 group-hover:border-primary/50"
                            )}>
                                {selected.includes(option.id) && <Check size={14} weight="bold" />}
                            </div>
                            <span className="font-bold text-lg select-none">{option.text}</span>
                        </button>
                    ))}
                </div>

                {!voted ? (
                    <button
                        onClick={() => setVoted(true)}
                        disabled={selected.length === 0}
                        className="w-full py-5 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-red-700 transition-all duration-500 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                    >
                        Yanıtı Gönder
                    </button>
                ) : (
                    <div className="text-center p-6 bg-emerald-50 text-emerald-600 rounded-3xl font-bold animate-in zoom-in duration-500">
                        Katılımınız için teşekkür ederiz!
                    </div>
                )}
            </div>
        </div>
    );
}
