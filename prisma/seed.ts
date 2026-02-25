import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to get random item from array
const random = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

// Helper to generate wavy data count (sine wave pattern)
const getWavyCount = (dayIndex: number, base: number, amplitude: number) => {
    // dayIndex 0 to 29
    // Math.sin takes radians. Complete cycle in ~14 days?
    // 2 * Math.PI * (dayIndex / 14)
    return Math.floor(base + amplitude * Math.sin((dayIndex / 7) * Math.PI));
};

async function main() {
    console.log('🌱 Starting database seed...');

    // 1. Clean up existing data
    await prisma.analyticsLog.deleteMany();
    await prisma.surveyVote.deleteMany();
    await prisma.post.deleteMany();
    await prisma.stage.deleteMany();
    await prisma.user.deleteMany(); // Clear users too
    try {
        // @ts-ignore
        await prisma.projectUpdate.deleteMany();
    } catch (e) {
        console.log("ProjectUpdate table might not exist yet, skipping delete.");
    }

    console.log('🧹 Cleaned up existing data.');

    // 2. Create Users (1240 Residents)
    const firstNames = ["Ahmet", "Mehmet", "Ayşe", "Fatma", "Mustafa", "Zeynep", "Ali", "Elif", "Murat", "Hülya", "Can", "Selin", "Burak", "Ceren", "Emre", "Gamze", "Kaan", "Deniz", "Oğuz", "Sibel"];
    const lastNames = ["Yılmaz", "Demir", "Çelik", "Kaya", "Şahin", "Öztürk", "Aydın", "Özdemir", "Arslan", "Doğan", "Kılıç", "Aslan", "Çetin", "Kara", "Koç", "Kurt", "Özkan", "Şimşek", "Polat", "Öz"];

    const users = [];
    const targetUserCount = 1240;

    console.log(`Creating ${targetUserCount} users...`);
    const userBatchSize = 100; // Create in batches to avoid huge memory usage if needed, but 1240 is small enough for loop

    for (let i = 0; i < targetUserCount; i++) {
        const firstName = random(firstNames);
        const lastName = random(lastNames);
        const user = await prisma.user.create({
            data: {
                email: `user${i + 1}@example.com`,
                passwordHash: "dummyhash",
                fullName: `${firstName} ${lastName}`,
                role: "RESIDENT",
                apartmentInfo: `${Math.floor(i / 40) + 1}. Blok Daire ${i % 40 + 1}`,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)) // Random created in last 30 days
            }
        });
        users.push(user);
    }
    console.log(`👥 Created ${users.length} dummy users.`);

    // 3. Create Stages (3 COMPLETED, 1 ACTIVE, Rest LOCKED)
    const allStages = [
        { title: "Başvuru", slug: "basvuru", status: "COMPLETED", seq: 1.0, iconKey: "folder_open" },
        { title: "Ön Teklif", slug: "on-teklif", status: "COMPLETED", seq: 2.0, iconKey: "upload_file" },
        { title: "Kesin Teklif", slug: "kesin-teklif", status: "COMPLETED", seq: 3.0, iconKey: "check_box" },
        { title: "Uzlaşma Görüşmeleri", slug: "uzlasma-gorusmeleri", status: "LOCKED", seq: 4.0, iconKey: "groups" },
        { title: "Temsili Sözleşme", slug: "temsili-sozlesme", status: "LOCKED", seq: 5.0, iconKey: "star" },
        { title: "Karot Alımı", slug: "karot-alimi", status: "LOCKED", seq: 6.0, iconKey: "science" },
        { title: "Riskli Yapı İlanı", slug: "riskli-yapi-ilani", status: "ACTIVE", seq: 7.0, iconKey: "apartment" },
        { title: "Sözleşme", slug: "sozlesme", status: "LOCKED", seq: 8.0, iconKey: "signature" },
        { title: "Tahliye Süreci", slug: "tahliye-sureci", status: "LOCKED", seq: 9.0, iconKey: "moving" },
        { title: "Ruhsat Alımı", slug: "ruhsat-alimi", status: "LOCKED", seq: 10.0, iconKey: "article" },
        { title: "Yıkım Süreci", slug: "yikim-sureci", status: "LOCKED", seq: 11.0, iconKey: "domain_disabled" },
        { title: "Anahtar Teslim", slug: "anahtar-teslim", status: "LOCKED", seq: 12.0, iconKey: "key" }
    ];

    for (const s of allStages) {
        await prisma.stage.create({
            data: {
                title: s.title,
                slug: s.slug,
                description: `${s.title} aşaması açıklaması...`,
                status: s.status,
                sequenceOrder: s.seq,
                iconKey: s.iconKey,
                isVisible: true,
                variant: s.slug === "temsili-sozlesme" ? "small" : "default"
            }
        });
    }
    console.log('✅ Stages created.');

    const activeStage = await prisma.stage.findUnique({ where: { slug: "riskli-yapi-ilani" } });
    if (!activeStage) throw new Error("Active stage not found");

    // 4. Create Posts
    const survey = await prisma.post.create({
        data: {
            stageId: activeStage.id,
            type: "SURVEY",
            title: "Dış Cephe Renk Tercihi",
            content: JSON.stringify({ blocks: [{ type: "paragraph", data: { text: "Binalarımızın dış cephesi için renk tercihinizi belirtiniz." } }] }),
            isPublished: true,
            publishedAt: new Date(),
            expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
        }
    });

    await prisma.post.create({
        data: {
            stageId: activeStage.id,
            type: "MEETING",
            title: "Bilgilendirme Toplantısı (Geçmiş)",
            content: JSON.stringify({ blocks: [{ type: "paragraph", data: { text: "Geçmiş bilgilendirme toplantısı detayları." } }] }),
            isPublished: true,
            publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            eventDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
    });

    await prisma.post.create({
        data: {
            stageId: activeStage.id,
            type: "MEETING",
            title: "Genel Kurul Toplantısı",
            content: JSON.stringify({ blocks: [{ type: "paragraph", data: { text: "Önümüzdeki genel kurul toplantısı." } }] }),
            isPublished: true,
            publishedAt: new Date(),
            eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    });
    console.log('✅ Posts created.');

    // 5. Generate Analytics Logs
    console.log('Generating analytics logs...');
    const logsData = [];
    const today = new Date();

    // 5a. Generic Traffic (Page Views, etc.)
    for (let day = 0; day < 30; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (29 - day));

        // Random daily traffic
        let count = Math.floor(Math.random() * 20) + 5;

        for (let i = 0; i < count; i++) {
            const user = random(users);
            const logTime = new Date(date);
            logTime.setHours(9 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60));

            logsData.push({
                userId: user.id,
                action: "PAGE_VIEW",
                actionType: "VIEW",
                targetId: "home",
                ipAddress: "192.168.1.1",
                device: random(['MOBILE', 'DESKTOP', 'TABLET']),
                timestamp: logTime
            });
        }
    }

    // 5b. Specific KPI Logs (ANKET_VOTE & SOCIAL_SHARE)
    // KPI 1: 850 Survey Votes (ANKET_VOTE) in last 14 days
    console.log("Generating 850 ANKET_VOTE logs...");
    for (let i = 0; i < 850; i++) {
        const user = users[i % users.length]; // Cycle through users
        const daysAgo = Math.floor(Math.random() * 14); // Last 14 days
        const logTime = new Date(today);
        logTime.setDate(logTime.getDate() - daysAgo);
        logTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

        logsData.push({
            userId: user.id,
            action: "ANKET_VOTE",
            actionType: "ACTION",
            targetId: survey.id,
            ipAddress: "192.168.1.1",
            device: random(['MOBILE', 'DESKTOP', 'TABLET']),
            timestamp: logTime
        });
    }

    // KPI 2: 320 Social Shares (SOCIAL_SHARE) in last 14 days
    console.log("Generating 320 SOCIAL_SHARE logs...");
    for (let i = 0; i < 320; i++) {
        const user = users[i % users.length];
        const daysAgo = Math.floor(Math.random() * 14);
        const logTime = new Date(today);
        logTime.setDate(logTime.getDate() - daysAgo);
        logTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

        logsData.push({
            userId: user.id,
            action: "SOCIAL_SHARE",
            actionType: "ACTION",
            targetId: survey.id,
            ipAddress: "192.168.1.1",
            device: random(['MOBILE', 'DESKTOP', 'TABLET']),
            timestamp: logTime
        });
    }

    // KPI 3: Announcement Views (DUYURU)
    console.log("Generating 400 DUYURU_VIEW logs...");
    for (let i = 0; i < 400; i++) {
        const user = users[i % users.length];
        const daysAgo = Math.floor(Math.random() * 14);
        const logTime = new Date(today);
        logTime.setDate(logTime.getDate() - daysAgo);
        logTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

        logsData.push({
            userId: user.id,
            action: "DUYURU_VIEW",
            actionType: "VIEW",
            targetId: "announcement-1",
            ipAddress: "192.168.1.1",
            device: random(['MOBILE', 'DESKTOP', 'TABLET']),
            timestamp: logTime
        });
    }

    // KPI 4: Meeting Views (TOPLANTI)
    console.log("Generating 300 TOPLANTI_VIEW logs...");
    for (let i = 0; i < 300; i++) {
        const user = users[i % users.length];
        const daysAgo = Math.floor(Math.random() * 14);
        const logTime = new Date(today);
        logTime.setDate(logTime.getDate() - daysAgo);
        logTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

        logsData.push({
            userId: user.id,
            action: "TOPLANTI_VIEW",
            actionType: "VIEW",
            targetId: "meeting-1",
            ipAddress: "192.168.1.1",
            device: random(['MOBILE', 'DESKTOP', 'TABLET']),
            timestamp: logTime
        });
    }

    // Batch insert logs
    console.log(`Inserting ${logsData.length} logs...`);
    // Split into chunks of 500 to be safe
    const chunkSize = 500;
    for (let i = 0; i < logsData.length; i += chunkSize) {
        const chunk = logsData.slice(i, i + chunkSize);
        await prisma.analyticsLog.createMany({
            data: chunk
        });
    }

    // 6. Create Admin User & System Logs
    console.log("Creating Admin user and system logs...");

    // Check if admin exists or create one
    const adminUser = await prisma.user.create({
        data: {
            email: "admin@muratsitesi.com",
            passwordHash: "admin123",
            fullName: "Murat Yönetim",
            role: "ADMIN",
            createdAt: new Date()
        }
    });

    const systemActions = ['CREATE_POST', 'UPDATE_STAGE', 'UPDATE_PAGE', 'PUBLISH_SURVEY', 'ADD_BLOCK'];
    const systemLogs = [];

    for (let i = 0; i < 15; i++) {
        const action = random(systemActions);
        const logTime = new Date(today);
        logTime.setDate(logTime.getDate() - Math.floor(Math.random() * 30));
        logTime.setHours(9 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60));

        systemLogs.push({
            userId: adminUser.id,
            action: action,
            actionType: "SYSTEM",
            targetId: "system",
            ipAddress: "192.168.1.100",
            timestamp: logTime
        });
    }

    await prisma.analyticsLog.createMany({
        data: systemLogs
    });

    // 7. Create Urban Transformation Project Updates (Specific Request)
    console.log("Creating specific Urban Transformation project updates...");

    // Scenarios provided by user
    const urbanScenarios = [
        { title: "Bilgilendirme Toplantısı Eklendi", description: "C Blok sakinleri için haftalık ilerleme toplantısı takvime eklendi.", type: "EKLENDI", category: "TOPLANTI" },
        { title: "Yeni Aşama Yayında", description: "Proje süreci 'Riskli Yapı İlanı' aşamasına başarıyla geçirildi.", type: "YAYINLANDI", category: "AŞAMA" },
        { title: "Anayapı Sayfası Tasarlandı", description: "Page Builder üzerinden anasayfa görsel ve metinleri güncellendi.", type: "GUNCELLENDI", category: "TASARIM" },
        { title: "Yeni Anket Başlatıldı", description: "Sosyal tesis kullanım tercihleri için oylama süreci başladı.", type: "EKLENDI", category: "ANKET" },
        { title: "Duyuru Paylaşıldı", description: "Otopark girişlerindeki düzenleme hakkında genel duyuru yayınlandı.", type: "YAYINLANDI", category: "DUYURU" },
        { title: "Aşama Detayları Güncellendi", description: "Uzlaşma görüşmeleri takvimi ve gerekli belgeler listesi güncellendi.", type: "GUNCELLENDI", category: "AŞAMA" },
        { title: "Render Görüntüleri Eklendi", description: "Yeni blok tasarımlarına ait 3D yüksek çözünürlüklü görseller yüklendi.", type: "EKLENDI", category: "TASARIM" },
        { title: "Toplantı Notları Paylaşıldı", description: "Dünkü yönetim kurulu toplantısının özet kararları paylaşıldı.", type: "YAYINLANDI", category: "TOPLANTI" },
        { title: "Anket Tamamlandı", description: "Dış cephe renk seçimi anketi sonuçları sisteme kaydedildi.", type: "TAMAMLANDI", category: "ANKET" }
    ];

    const urbanLogs = urbanScenarios.map(scenario => {
        // Distribute strictly over last 7 days for realistic "X days ago" labels
        const logTime = new Date(today);
        const daysAgo = Math.floor(Math.random() * 7);
        const hoursAgo = Math.floor(Math.random() * 24);

        logTime.setDate(logTime.getDate() - daysAgo);
        logTime.setHours(logTime.getHours() - hoursAgo);

        return {
            title: scenario.title,
            description: scenario.description,
            type: scenario.type,
            category: scenario.category,
            createdAt: logTime
        };
    });

    try {
        // @ts-ignore
        await prisma.projectUpdate.createMany({
            data: urbanLogs
        });
        console.log(`✅ Generated ${urbanLogs.length} urban transformation project updates.`);
    } catch (e) {
        console.error("❌ Failed to create ProjectUpdate entries:", e);
    }
    console.log('🎉 Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
