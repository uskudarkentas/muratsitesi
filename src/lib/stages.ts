// Shared stage data with slug mapping
export const STAGES = [
    { id: 1, title: "Başvuru", icon: "folder_open", slug: "basvuru" },
    { id: 2, title: "Ön Teklif", icon: "upload_file", slug: "on-teklif" },
    { id: 3, title: "Kesin Teklif", icon: "check_box", slug: "kesin-teklif" },
    { id: 4, title: "Uzlaşma Görüşmeleri", icon: "groups", slug: "uzlasma-gorusmeleri" },
    { id: 5, title: "Sözleşme", icon: "signature", slug: "sozlesme" },
    { id: 6, title: "Karot Alımı", icon: "science", slug: "karot-alimi" },
    { id: 7, title: "Riskli Yapı İlanı", icon: "apartment", slug: "riskli-yapi-ilani" },
    { id: 8, title: "Tahliye Süreci", icon: "moving", slug: "tahliye-sureci" },
    { id: 9, title: "Ruhsat Alımı", icon: "article", slug: "ruhsat-alimi" },
    { id: 10, title: "Yıkım Süreci", icon: "domain_disabled", slug: "yikim-sureci" },
    { id: 11, title: "Anahtar Teslim", icon: "key", slug: "anahtar-teslim" },
];

export function getStageBySlug(slug: string) {
    return STAGES.find(s => s.slug === slug);
}

export function getStageById(id: number) {
    return STAGES.find(s => s.id === id);
}
