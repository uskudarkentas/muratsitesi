import { Activity } from "./types";

export const MOCK_ACTIVITIES: Activity[] = [
    {
        id: 1,
        admin: {
            name: "Özge Ayaz",
            role: "Yönetici",
            initials: "ÖA",
            color: "bg-blue-100 text-blue-700"
        },
        action: "Yeni duyuru yayınladı",
        target: "Otopark Bakım Çalışması",
        type: "announcement",
        timestamp: "2 dk önce",
        status: "Yayınlandı",
    },
    {
        id: 2,
        admin: {
            name: "Zeynep Demir",
            role: "Editör",
            initials: "ZD",
            color: "bg-purple-100 text-purple-700"
        },
        action: "Anket süresini uzattı",
        target: "Bina Mantolama Kararı",
        type: "survey",
        timestamp: "15 dk önce",
        status: "Güncellendi",
    },
    {
        id: 3,
        admin: {
            name: "Mehmet Kaya",
            role: "Moderatör",
            initials: "MK",
            color: "bg-amber-100 text-amber-700"
        },
        action: "Kullanıcı kaydını onayladı",
        target: "Ali Veli (Daire 12)",
        type: "user",
        timestamp: "45 dk önce",
        status: "Başarılı",
    },
    {
        id: 4,
        admin: {
            name: "Sistem",
            role: "Otomasyon",
            initials: "SYS",
            color: "bg-gray-100 text-gray-700"
        },
        action: "Haftalık rapor oluşturuldu",
        target: "Analiz Raporu #42",
        type: "system",
        timestamp: "1 saat önce",
        status: "Başarılı",
    },
    {
        id: 5,
        admin: {
            name: "Ahmet Yılmaz",
            role: "Yönetici",
            initials: "AY",
            color: "bg-blue-100 text-blue-700"
        },
        action: "Sayfa içeriğini düzenledi",
        target: "Hakkımızda Sayfası",
        type: "page",
        timestamp: "3 saat önce",
        status: "Güncellendi",
    }
];
