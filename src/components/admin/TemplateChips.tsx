"use client";

import { CalendarCheck, ArrowsClockwise, WarningOctagon } from "@phosphor-icons/react";

interface TemplateChipsProps {
    onSelectTemplate: (content: string) => void;
}

const TEMPLATES = {
    meeting: {
        label: "Toplantı Daveti",
        icon: CalendarCheck,
        color: "bg-blue-50 text-blue-700 border-blue-200/50 hover:bg-blue-100 hover:border-blue-300 hover:shadow-sm",
        content: `📅 Toplantı Duyurusu

Sayın Malikler,

[Konu] hakkında bilgilendirme toplantısı düzenlenecektir.

📍 Yer: [Toplantı Yeri]
🕐 Tarih: [Tarih]
⏰ Saat: [Saat]

Katılımınızı bekliyoruz.`,
    },
    update: {
        label: "Süreç Güncelleme",
        icon: ArrowsClockwise,
        color: "bg-green-50 text-green-700 border-green-200/50 hover:bg-green-100 hover:border-green-300 hover:shadow-sm",
        content: `🔄 Süreç Güncellemesi

Sayın Malikler,

Kentsel dönüşüm sürecimizde yeni gelişme:

[Gelişme detayları buraya yazın]

Sorularınız için iletişime geçebilirsiniz.`,
    },
    urgent: {
        label: "Acil Duyuru",
        icon: WarningOctagon,
        color: "bg-red-50 text-red-700 border-red-200/50 hover:bg-red-100 hover:border-red-300 hover:shadow-sm",
        content: `⚠️ ÖNEMLİ DUYURU

Sayın Malikler,

[Acil durum/önemli bilgi buraya]

Lütfen en kısa sürede bilgi alın.

📞 İletişim: [Telefon]`,
    },
};

export function TemplateChips({ onSelectTemplate }: TemplateChipsProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs font-semibold tracking-tight text-slate-600 self-center">
                Hızlı Şablonlar:
            </span>
            {Object.entries(TEMPLATES).map(([key, template]) => {
                const Icon = template.icon;
                return (
                    <button
                        key={key}
                        type="button"
                        onClick={() => onSelectTemplate(template.content)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${template.color}`}
                    >
                        <Icon weight="thin" className="w-3.5 h-3.5" style={{ strokeWidth: '1.2px' }} />
                        {template.label}
                    </button>
                );
            })}
        </div>
    );
}
