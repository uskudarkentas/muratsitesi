export type ActivityType = "announcement" | "meeting" | "survey" | "user" | "pager" | "system" | "page";

export type ActivityStatus =
    | "Yayınlandı"
    | "Güncellendi"
    | "Başarılı"
    | "İnceleniyor"
    | "İşlendi"
    | "Tamamlandı";

export interface AdminInfo {
    name: string;
    role: string;
    initials: string;
    color: string;
}

export interface Activity {
    id: number;
    admin: AdminInfo;
    action: string;
    target: string;
    type: ActivityType;
    timestamp: string;
    status: ActivityStatus;
}
