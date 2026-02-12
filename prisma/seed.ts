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

    console.log('🧹 Cleaned up existing data.');

    // 2. Create Users (20 Dummy Residents)
    const firstNames = ["Ahmet", "Mehmet", "Ayşe", "Fatma", "Mustafa", "Zeynep", "Ali", "Elif", "Murat", "Hülya", "Can", "Selin", "Burak", "Ceren", "Emre", "Gamze", "Kaan", "Deniz", "Oğuz", "Sibel"];
    const lastNames = ["Yılmaz", "Demir", "Çelik", "Kaya", "Şahin", "Öztürk", "Aydın", "Özdemir", "Arslan", "Doğan", "Kılıç", "Aslan", "Çetin", "Kara", "Koç", "Kurt", "Özkan", "Şimşek", "Polat", "Öz"];

    const users = [];
    for (let i = 0; i < 20; i++) {
        const firstName = random(firstNames);
        const lastName = random(lastNames);
        const user = await prisma.user.create({
            data: {
                email: `user${i}@example.com`,
                passwordHash: "dummyhash", // Not used for analytics, just placeholder
                fullName: `${firstName} ${lastName}`,
                role: "RESIDENT",
                apartmentInfo: `${Math.floor(i / 4) + 1}. Blok Daire ${i % 4 + 1}`, // A Blok Daire 1...
            }
        });
        users.push(user);
    }
    console.log('👥 Created 20 dummy users.');

    // 3. Create Stages (3 COMPLETED, 1 ACTIVE, Rest LOCKED)
    const stagesData = [
        { title: "Başvuru", slug: "basvuru", status: "COMPLETED", sequenceOrder: 1.0, iconKey: "folder_open" },
        { title: "Ön Teklif", slug: "on-teklif", status: "COMPLETED", sequenceOrder: 2.0, iconKey: "upload_file" },
        { title: "Kesin Teklif", slug: "kesin-teklif", status: "COMPLETED", sequenceOrder: 3.0, iconKey: "check_box" },
        { title: "Uzlaşma Görüşmeleri", slug: "uzlasma-gorusmeleri", status: "ACTIVE", sequenceOrder: 4.0, iconKey: "groups" }, // Changed to ACTIVE as per request "Riskli Yapı İlanı" was mentioned as active but let's stick to sequence. Wait, user said "Riskli Yapı İlanı" is active. Let's find it.
        // User said: "Ensure 3 Stages are 'COMPLETED', 1 is 'ACTIVE' (e.g., "Riskli Yapı İlanı")..."
        // Let's adjust statuses explicitly.
    ];

    // Full list definition with explicit statuses based on request
    const allStages = [
        { title: "Başvuru", slug: "basvuru", status: "COMPLETED", seq: 1.0, iconKey: "folder_open" },
        { title: "Ön Teklif", slug: "on-teklif", status: "COMPLETED", seq: 2.0, iconKey: "upload_file" },
        { title: "Kesin Teklif", slug: "kesin-teklif", status: "COMPLETED", seq: 3.0, iconKey: "check_box" },
        { title: "Uzlaşma Görüşmeleri", slug: "uzlasma-gorusmeleri", status: "LOCKED", seq: 4.0, iconKey: "groups" },
        { title: "Temsili Sözleşme", slug: "temsili-sozlesme", status: "LOCKED", seq: 5.0, iconKey: "star" },
        { title: "Karot Alımı", slug: "karot-alimi", status: "LOCKED", seq: 6.0, iconKey: "science" },
        { title: "Riskli Yapı İlanı", slug: "riskli-yapi-ilani", status: "ACTIVE", seq: 7.0, iconKey: "apartment" }, // Requested Active
        { title: "Sözleşme", slug: "sozlesme", status: "LOCKED", seq: 8.0, iconKey: "signature" },
        { title: "Tahliye Süreci", slug: "tahliye-sureci", status: "LOCKED", seq: 9.0, iconKey: "moving" },
        { title: "Ruhsat Alımı", slug: "ruhsat-alimi", status: "LOCKED", seq: 10.0, iconKey: "article" },
        { title: "Yıkım Süreci", slug: "yikim-sureci", status: "LOCKED", seq: 11.0, iconKey: "domain_disabled" },
        { title: "Anahtar Teslim", slug: "anahtar-teslim", status: "LOCKED", seq: 12.0, iconKey: "key" }
    ];

    for (const s of allStages) {
        // Adjust for "3 Completed": The first 3 are marked COMPLETED above.
        // Adjust for "1 Active": Riskli Yapı İlanı is marked ACTIVE.
        // Others LOCKED.
        // Re-verify logic:
        // If I make Riskli Yapı Active (7.0), usually previous ones should be completed.
        // But user specifically said "Ensure 3 Stages are 'COMPLETED', 1 is 'ACTIVE'".
        // This implies a gap or strict user overriding. I will follow user request exactly.

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
    // 4a. Active Survey (Expires in 5 days)
    const survey = await prisma.post.create({
        data: {
            stageId: activeStage.id,
            type: "SURVEY",
            title: "Dış Cephe Renk Tercihi",
            content: JSON.stringify({ blocks: [{ type: "paragraph", data: { text: "Binalarımızın dış cephesi için renk tercihinizi belirtiniz." } }] }),
            isPublished: true,
            publishedAt: new Date(),
            expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // +5 days
        }
    });

    // 4b. Past Meeting (Date passed)
    await prisma.post.create({
        data: {
            stageId: activeStage.id, // Or maybe a previous stage? Let's put in active for visibility
            type: "MEETING",
            title: "Bilgilendirme Toplantısı (Geçmiş)",
            content: JSON.stringify({ blocks: [{ type: "paragraph", data: { text: "Geçmiş bilgilendirme toplantısı detayları." } }] }),
            isPublished: true,
            publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            eventDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        }
    });

    // 4c. Upcoming Meeting (Future)
    await prisma.post.create({
        data: {
            stageId: activeStage.id,
            type: "MEETING",
            title: "Genel Kurul Toplantısı",
            content: JSON.stringify({ blocks: [{ type: "paragraph", data: { text: "Önümüzdeki genel kurul toplantısı." } }] }),
            isPublished: true,
            publishedAt: new Date(),
            eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // In 7 days
        }
    });
    console.log('✅ Posts created.');

    // 5. Generate Analytics Logs (~200 logs, wavy pattern, 30 days)
    console.log('Generating analytics logs...');

    // Distribution weights
    // VIEW: 60%, CLICK: 30%, ACTION: 10%
    const types = [
        ...Array(60).fill('VIEW'),
        ...Array(30).fill('CLICK'),
        ...Array(10).fill('ACTION')
    ];

    const logsData = [];
    const today = new Date();

    for (let day = 0; day < 30; day++) {
        // day 0 = 29 days ago, day 29 = today
        const date = new Date(today);
        date.setDate(date.getDate() - (29 - day));

        // Logs for this day: Base 5 + Amplitude 5 (0-10) -> range 5-15 logs/day?
        // User wants ~200 total logs. 200 / 30 = ~6.6 logs/day.
        // Let's use Base 3, Amplitude 4 -> 3 + [-4..4] -> wait, min 0.
        // Log count = 3 + 4 * sin(...) -> range 0 to 7? 7*30 = 210. Perfect.

        let count = Math.max(0, Math.floor(4 + 4 * Math.sin((day / 5) * Math.PI))); // Period ~10 days

        // Add random jitter
        count += Math.floor(Math.random() * 3);

        for (let i = 0; i < count; i++) {
            const user = random(users);
            const type = random(types);

            // Infer action string from type
            let actionName = "";
            let targetId = null;

            if (type === 'VIEW') {
                actionName = "PAGE_VIEW";
                targetId = "home";
            } else if (type === 'CLICK') {
                actionName = random(["OPEN_ACCORDION", "EXPAND_DETAILS", "CLICK_POST"]);
                targetId = "details";
            } else {
                actionName = random(["VOTE_SURVEY_1", "JOIN_MEETING", "DOWNLOAD_PDF"]);
                targetId = survey.id;
            }

            // Distribute timestamps within the day
            const logTime = new Date(date);
            logTime.setHours(9 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60)); // 09:00 - 21:00

            logsData.push({
                userId: user.id,
                action: actionName,
                actionType: type,
                targetId: targetId,
                ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
                timestamp: logTime
            });
        }
    }

    // Bulk insert (using individual create usually better for validity but createMany is faster if supported by SQLite/Prisma version for this model)
    // SQLite supports createMany in newer Prisma versions.
    // If createMany fails, we fall back to loop.
    try {
        await prisma.analyticsLog.createMany({
            data: logsData
        });
    } catch (e) {
        // Fallback for older prisma/sqlite combos if needed
        for (const log of logsData) {
            await prisma.analyticsLog.create({ data: log });
        }
    }

    console.log(`✅ Generated ${logsData.length} analytics logs.`);
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
