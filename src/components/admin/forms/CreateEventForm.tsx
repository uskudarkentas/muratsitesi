"use client";

import { useState } from "react";
import { createEvent } from "@/actions/admin";

interface Stage {
    id: number;
    title: string;
}

interface CreateEventFormProps {
    onClose: () => void;
    onSuccess: () => void;
    stages: Stage[];
    initialStageId?: number;
}

export function CreateEventForm({ onClose, onSuccess, stages, initialStageId }: CreateEventFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [eventTitle, setEventTitle] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventTime, setEventTime] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventStageId, setEventStageId] = useState<number>(initialStageId || (stages[0]?.id ?? 1));

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const dateTime = new Date(`${eventDate}T${eventTime}`);
            await createEvent({
                stageId: eventStageId,
                title: eventTitle,
                eventDate: dateTime,
                description: eventDescription,
            });

            onSuccess();
        } catch (error) {
            console.error("Error creating event:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <button
                onClick={onClose}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
                <span className="material-symbols-outlined !text-lg">arrow_back</span>
                Geri
            </button>

            <div>
                <label className="block text-sm font-medium mb-2">Toplantı/Etkinlik Başlığı *</label>
                <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Kurul Toplantısı"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Tarih *</label>
                    <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Saat *</label>
                    <input
                        type="time"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Açıklama</label>
                <textarea
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Toplantı detayları..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Aşama Seçin *</label>
                <select
                    value={eventStageId}
                    onChange={(e) => setEventStageId(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    {stages.map((stage) => (
                        <option key={stage.id} value={stage.id}>
                            {stage.title}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-lg border border-border hover:bg-secondary transition-colors"
                >
                    İptal
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!eventTitle || !eventDate || !eventTime || isSubmitting}
                    className="flex-1 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Ekleniyor..." : "Etkinlik Ekle"}
                </button>
            </div>
        </div>
    );
}
