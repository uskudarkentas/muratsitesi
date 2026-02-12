import {
    Megaphone, FileText, User, Layout, FileEdit, CheckCircle2, Clock, AlertCircle
} from "lucide-react";
import { ActivityStatus, ActivityType } from "./types";

export const ACTIVITY_TYPE_ICONS: Record<ActivityType, React.ElementType> = {
    announcement: Megaphone,
    meeting: Clock, // Using Clock or Calendar
    survey: FileText,
    user: User,
    page: Layout,
    pager: Layout, // handling both cases just in case
    system: FileEdit, // using FileEdit as a default/system icon
};

export const ACTIVITY_STATUS_STYLES: Record<ActivityStatus, {
    container: string;
    dot: string;
    icon: React.ElementType;
}> = {
    "Başarılı": {
        container: "bg-emerald-50 text-emerald-600 border-emerald-200",
        dot: "bg-emerald-500",
        icon: CheckCircle2
    },
    "Yayınlandı": {
        container: "bg-emerald-50 text-emerald-600 border-emerald-200",
        dot: "bg-emerald-500",
        icon: CheckCircle2
    },
    "Güncellendi": {
        container: "bg-blue-50 text-blue-600 border-blue-200",
        dot: "bg-blue-500",
        icon: Clock
    },
    "İnceleniyor": {
        container: "bg-amber-50 text-amber-600 border-amber-200",
        dot: "bg-amber-500",
        icon: AlertCircle
    },
    "İşlendi": {
        container: "bg-purple-50 text-purple-600 border-purple-200",
        dot: "bg-purple-500",
        icon: CheckCircle2
    },
    "Tamamlandı": {
        container: "bg-green-50 text-green-600 border-green-200",
        dot: "bg-green-500",
        icon: CheckCircle2
    }
};

export const DEFAULT_STATUS_STYLE = {
    container: "bg-gray-50 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
    icon: Clock
};
