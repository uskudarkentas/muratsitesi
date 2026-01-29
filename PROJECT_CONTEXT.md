# Project: Kentsel Dönüşüm Takip Platformu (Urban Transformation Tracker)

## 1. Proje Vizyonu ve Özeti
Bu proje, Murat Reis Sitesi kentsel dönüşüm süreci için geliştirilen **kapalı devre (private)** bir bilgilendirme platformudur.
**Temel Amaç:** Süreç şeffaflığını sağlamak, bilgi kirliliğini önlemek ve sakinlerin tüm süreci (geçmiş, şu an ve gelecek) tek bir dikey timeline üzerinden "Instagram Story akıcılığında" takip etmesini sağlamaktır.

---

## 2. Teknoloji Yığını (Tech Stack)

* **Frontend Framework:** Next.js 14+ (App Router)
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** Prisma veya Drizzle ORM
* **Auth:** NextAuth.js / Lucia Auth (Role Based: Admin & Resident)
* **Styling:** Tailwind CSS + Shadcn/UI
* **Animations:** Framer Motion (Timeline snap, glow ve scale efektleri için zorunlu)
* **Rich Text Editor:** Editor.js veya Tiptap (Admin panelinde blok tabanlı içerik üretimi için)
* **Mobile Viewport:** `dvh` (Dynamic Viewport Height) birimleri (Safari address bar fix için)

---

## 3. Veritabanı Tasarımı (Schema Blueprint)

### A. Users Table (Kullanıcılar)
* `id`: UUID
* `email`: String (Unique)
* `password_hash`: String
* `role`: Enum (`ADMIN`, `RESIDENT`)
* `full_name`: String
* `apartment_info`: String (Blok/Daire No - Opsiyonel)
* `last_login`: DateTime

### B. Stages Table (Timeline Omurgası)
*Süreç adımları dinamiktir, araya sonradan adım eklenebilir.*
* `id`: Int (Primary Key)
* `title`: String (Örn: "Karot Alımı")
* `slug`: String (Unique, URL dostu)
* `description`: String (Kısa açıklama)
* `status`: Enum (`LOCKED`, `ACTIVE`, `COMPLETED`)
    * *Kural: Sistemde aynı anda sadece 1 adet `ACTIVE` aşama olabilir.*
* `sequence_order`: Float (Sıralama için kritik field. Örn: 1.0, 2.0. Araya adım eklemek için 1.5 kullanılabilir.)
* `is_visible`: Boolean (Default: True. İstenirse gizlenebilir.)
* `icon_key`: String (Frontend ikon mapping için)

### C. Posts Table (İçerikler)
* `id`: UUID
* `stage_id`: Int (Relation -> Stages)
* `type`: Enum (`ANNOUNCEMENT`, `MEETING`, `SURVEY`)
* `title`: String
* `content`: JSONB (Editor.js çıktısı - zengin metin blokları)
* `is_published`: Boolean (Taslak/Yayın durumu)
* `published_at`: DateTime (Sıralama ve "En Güncel" tespiti için baz alınır)
* `event_date`: DateTime (Toplantı tarihi veya Anket bitiş tarihi)

### D. Survey_Votes Table (Anket Oyları)
* `id`: UUID
* `post_id`: UUID
* `user_id`: UUID
* `option_selected`: String/JSON
* `created_at`: DateTime

### E. Analytics_Logs Table (Dashboard Verisi)
* `id`: UUID
* `user_id`: UUID
* `action`: Enum (`LOGIN`, `VIEW_POST`, `VOTE`)
* `target_id`: UUID (Post ID veya Stage ID)
* `ip_address`: String
* `timestamp`: DateTime

---

## 4. Kullanıcı Deneyimi (UX) ve Arayüz Kuralları

### 4.1. Timeline "Wheel" Davranışı (Merkez Odaklı Akış)
Ana ekrandaki timeline, bir tarih seçici (date picker) tekerleği gibi davranmalıdır.

* **Görünür Alan (Viewport):** Kullanıcı dikey eksende aynı anda 5 öğe görür:
    1.  **Üst (x2):** `COMPLETED` aşamalar (Geçmiş). Opaklık: %40.
    2.  **Merkez (x1):** `ACTIVE` veya Seçili aşama. Opaklık: %100, Scale: 1.2 (Büyük), Glow Efektli.
    3.  **Alt (x2):** `LOCKED` aşamalar (Gelecek). Opaklık: %40.
* **Scroll Mantığı:**
    * Listeyi **aşağı** çekince -> Geçmiş (Yukarıdaki) aşamalar merkeze gelir.
    * Listeyi **yukarı** itince -> Gelecek (Aşağıdaki) aşamalar merkeze gelir.
* **Snap-to-Center:** Kaydırma bırakıldığında timeline serbest durmaz; en yakın aşama manyetik bir şekilde merkeze yapışır (`scroll-snap-type: y mandatory`).

### 4.2. Dinamik İçerik Paneli (Sağ/Alt Alan)
* Merkezdeki (Active/Focused) aşama değiştiğinde, sağdaki içerik paneli anlık güncellenir.
* **"En Güncel" Kuralı:** Seçili aşamaya ait, `is_published: true` olan ve `published_at` tarihi en yeni olan içerik (Anket, Duyuru fark etmeksizin) otomatik gösterilir.

### 4.3. Mobil Uyumluluk (iPhone Safari)
* Tüm layout `100dvh` (dynamic viewport height) kullanmalıdır.
* Address bar gizlenip açıldığında sayfa zıplamamalıdır.
* Çentik (Safe Area) boşlukları `env(safe-area-inset-top)` ile yönetilmelidir.

---

## 5. Admin Panel (CMS) Gereksinimleri
Kentsel dönüşüm uzmanları için "Kodsuz" yönetim paneli.

1.  **Blok Editör:** WordPress Gutenberg benzeri; sürükle-bırak ile Paragraf, Görsel, Video ve Anket bloğu eklenebilmeli.
2.  **Aşama Yönetimi:**
    * "Aşama Tamamla" butonu ile mevcut aktif aşamayı `COMPLETED` yapıp, bir sonrakini `ACTIVE` duruma getiren fonksiyon.
    * "Araya Aşama Ekle" özelliği (`sequence_order` mantığı ile çalışır).
3.  **Dashboard (Analitik):**
    * Giriş yapan tekil sakin sayısı.
    * Duyuru okuma oranları (`VIEW_POST` loglarından).
    * Anket katılım grafikleri.

---

## 6. Güvenlik Kuralları
1.  **No-Index:** Tüm sayfalarda `X-Robots-Tag: noindex` header'ı olmalı.
2.  **Middleware:** `/giris` hariç tüm rotalar Auth korumalıdır.
3.  **RBAC:** `/admin` rotasına sadece `role: ADMIN` olanlar erişebilir.

---

## 7. Geliştirme Yol Haritası (Roadmap)
- [ ] Veritabanı şemasının (Prisma/Drizzle) oluşturulması.
- [ ] Auth katmanının (NextAuth) kurulması.
- [ ] Admin Editör (Editor.js) entegrasyonu.
- [ ] Frontend: Timeline "Wheel" komponentinin (Framer Motion) kodlanması.
- [ ] Backend: Araya aşama ekleme (`sequence_order`) mantığının yazılması.
- [ ] Analytics: Loglama servisinin entegrasyonu.