// Mock announcement data types and content
// This will be replaced with Prisma queries when DB is ready

export type AnnouncementType = 'text' | 'survey' | 'media' | 'document';

export interface BaseAnnouncement {
    id: string;
    stageId: number;
    publishedAt: Date;
}

export interface TextAnnouncement extends BaseAnnouncement {
    type: 'text';
    title: string;
    content: string;
}

export interface SurveyAnnouncement extends BaseAnnouncement {
    type: 'survey';
    title: string;
    question: string;
    options: string[];
    results?: Record<string, number>; // option -> vote count
}

export interface MediaAnnouncement extends BaseAnnouncement {
    type: 'media';
    title: string;
    description: string;
    images: string[];
}

export interface DocumentAnnouncement extends BaseAnnouncement {
    type: 'document';
    title: string;
    description: string;
    fileUrl: string;
    fileName: string;
}

export type Announcement =
    | TextAnnouncement
    | SurveyAnnouncement
    | MediaAnnouncement
    | DocumentAnnouncement;

// Mock data for each stage
export const STAGE_ANNOUNCEMENTS: Record<number, Announcement[]> = {
    7: [ // Riskli Yapı İlanı (Active stage)
        {
            id: 'ann-7-1',
            type: 'text',
            stageId: 7,
            title: 'Riskli Yapı Kararı Yayınlandı',
            content: 'Sayın sakinlerimiz, yapımız için Üsküdar Belediyesi tarafından riskli yapı kararı alınmıştır. İlan 15 Ocak 2026 tarihinde resmi gazetede yayınlanmıştır. Süreç hakkında detaylı bilgi için toplantıya katılmanızı rica ederiz.',
            publishedAt: new Date('2026-01-22T10:00:00'),
        },
        {
            id: 'ann-7-2',
            type: 'survey',
            stageId: 7,
            title: 'Bilgilendirme Toplantısı Tarih Anketi',
            question: 'Bilgilendirme toplantısı için hangi tarih sizin için daha uygun?',
            options: ['25 Ocak Cumartesi 14:00', '27 Ocak Pazartesi 19:00', '29 Ocak Çarşamba 19:00'],
            results: {
                '25 Ocak Cumartesi 14:00': 12,
                '27 Ocak Pazartesi 19:00': 23,
                '29 Ocak Çarşamba 19:00': 8,
            },
            publishedAt: new Date('2026-01-20T15:30:00'),
        },
    ],
    6: [ // Karot Alımı
        {
            id: 'ann-6-1',
            type: 'text',
            stageId: 6,
            title: 'Karot Alma İşlemleri Tamamlandı',
            content: 'Zemin etüdü kapsamında karot alma işlemleri 10 Ocak 2026 tarihinde tamamlanmıştır. Rapor hazırlanma aşamasındadır.',
            publishedAt: new Date('2026-01-12T09:00:00'),
        },
    ],
    5: [ // Sözleşme
        {
            id: 'ann-5-1',
            type: 'document',
            stageId: 5,
            title: 'İmzalanan Sözleşme Metni',
            description: 'Müteahhit firma ile imzalanan sözleşme metnini inceleyebilirsiniz.',
            fileName: 'sozlesme_2025.pdf',
            fileUrl: '/documents/sozlesme_2025.pdf',
            publishedAt: new Date('2025-12-28T16:00:00'),
        },
    ],
};

// Helper: Get latest announcement for a stage
export function getLatestAnnouncement(stageId: number): Announcement | null {
    const announcements = STAGE_ANNOUNCEMENTS[stageId] || [];
    if (announcements.length === 0) return null;

    // Sort by publishedAt descending and return first
    return announcements.sort((a, b) =>
        b.publishedAt.getTime() - a.publishedAt.getTime()
    )[0];
}

// Helper: Get announcement preview text (first 100 chars)
export function getAnnouncementPreview(announcement: Announcement): string {
    let text = '';

    switch (announcement.type) {
        case 'text':
            text = announcement.content;
            break;
        case 'survey':
            text = announcement.question;
            break;
        case 'media':
            text = announcement.description;
            break;
        case 'document':
            text = announcement.description;
            break;
    }

    return text.length > 100 ? text.substring(0, 100) + '...' : text;
}
