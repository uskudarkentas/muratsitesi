import { PrismaClient, StageStatus, PostType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Clean up existing data (optional, but good for idempotent seeding)
    // Be careful in production, but this is a dev seed.
    await prisma.surveyVote.deleteMany();
    await prisma.post.deleteMany();
    await prisma.stage.deleteMany();

    // 1. Create Stages
    const stagesData = [
        {
            title: "Başvuru",
            slug: "basvuru",
            description: "Kentsel dönüşüm başvuru süreci tamamlandı.",
            status: StageStatus.COMPLETED,
            sequenceOrder: 1.0,
            iconKey: "folder_open"
        },
        {
            title: "Ön Teklif",
            slug: "on-teklif",
            description: "Ön teklif çalışmaları hazırlandı ve sunuldu.",
            status: StageStatus.COMPLETED,
            sequenceOrder: 2.0,
            iconKey: "description"
        },
        {
            title: "Kesin Teklif",
            slug: "kesin-teklif",
            description: "Kesin teklifler belirlendi ve onaylandı.",
            status: StageStatus.COMPLETED,
            sequenceOrder: 3.0,
            iconKey: "check_circle"
        },
        {
            title: "Uzlaşma Görüşmeleri",
            slug: "uzlasma-gorusmeleri",
            description: "Hak sahipleri ile uzlaşma sağlandı.",
            status: StageStatus.COMPLETED,
            sequenceOrder: 4.0,
            iconKey: "handshake"
        },
        {
            title: "Temsil Sözleşmesi",
            slug: "temsil-sozlesmesi",
            description: "Temsilciler heyeti ile sözleşme imzalandı.",
            status: StageStatus.COMPLETED,
            sequenceOrder: 5.0,
            iconKey: "star" // User requested Star specifically for Temsili Sozlesme logic in UI
        },
        {
            title: "Karot Alımı ve Teknik Analiz",
            slug: "karot-alimi",
            description: "Binalardan karot örnekleri alındı ve analiz edildi.",
            status: StageStatus.COMPLETED,
            sequenceOrder: 6.0,
            iconKey: "science"
        },
        {
            title: "Riskli Yapı İlanı",
            slug: "riskli-yapi-ilani",
            description: "Yapıların riskli olduğu resmen ilan edildi.",
            status: StageStatus.ACTIVE, // MAIN FOCUS
            sequenceOrder: 7.0,
            iconKey: "warning"
        },
        {
            title: "Tahliye ve Yıkım Süreci",
            slug: "tahliye-yikim",
            description: "Binaların tahliyesi ve yıkım işlemlerine başlanacak.",
            status: StageStatus.LOCKED,
            sequenceOrder: 8.0,
            iconKey: "domain_disabled"
        }
    ];

    for (const stage of stagesData) {
        await prisma.stage.create({
            data: stage
        });
    }

    console.log('✅ Stages created.');

    // 2. Create Posts for Active Stage (Riskli Yapı İlanı - id is dynamic, so find by slug)
    const activeStage = await prisma.stage.findUnique({
        where: { slug: "riskli-yapi-ilani" }
    });

    if (!activeStage) {
        throw new Error("Active stage not found after creation!");
    }

    // Post 1: Announcement (Belediye Onayı)
    await prisma.post.create({
        data: {
            stageId: activeStage.id,
            type: PostType.ANNOUNCEMENT,
            title: "Belediye Onayı Alındı",
            isPublished: true,
            publishedAt: new Date(), // Now
            content: {
                time: Date.now(),
                blocks: [
                    {
                        id: "b1",
                        type: "header",
                        data: {
                            text: "Resmi Onay Süreci Tamamlandı",
                            level: 3
                        }
                    },
                    {
                        id: "b2",
                        type: "paragraph",
                        data: {
                            text: "Üsküdar Belediyesi Kentsel Dönüşüm Müdürlüğü tarafından yapılan incelemeler sonucunda, sitemizdeki yapıların <b>6306 sayılı kanun kapsamında</b> riskli yapı olduğu onaylanmıştır."
                        }
                    },
                    {
                        id: "b3",
                        type: "paragraph",
                        data: {
                            text: "Bu karar, tüm kat maliklerimize tebligat yoluyla iletilecektir. Sürecin sağlıklı ilerlemesi adına aşağıdaki toplantıya katılımınızı önemle rica ederiz."
                        }
                    }
                ],
                version: "2.29.0"
            }
        }
    });

    // Post 2: Meeting (Bilgilendirme Toplantısı - Feb 2026)
    await prisma.post.create({
        data: {
            stageId: activeStage.id,
            type: PostType.MEETING,
            title: "Bilgilendirme Toplantısı",
            isPublished: true,
            publishedAt: new Date(Date.now() - 3600000), // 1 hour ago
            eventDate: new Date("2026-02-15T14:00:00Z"), // Specific future date
            content: {
                time: Date.now(),
                blocks: [
                    {
                        id: "m1",
                        type: "paragraph",
                        data: {
                            text: "Riskli yapı kararı sonrası atılacak adımların görüşüleceği toplantımız Site Yönetim Ofisi'nde yapılacaktır."
                        }
                    }
                ],
                version: "2.29.0"
            }
        }
    });

    // Post 3: Survey (Dış Cephe Renk Seçimi)
    await prisma.post.create({
        data: {
            stageId: activeStage.id,
            type: PostType.SURVEY,
            title: "Dış Cephe Renk Seçimi",
            isPublished: true,
            publishedAt: new Date(Date.now() - 7200000), // 2 hours ago
            eventDate: new Date("2026-03-01T00:00:00Z"), // Survey deadline
            content: {
                time: Date.now(),
                blocks: [
                    {
                        id: "s1",
                        type: "paragraph",
                        data: {
                            text: "Yeni yapılacak binalarımızın dış cephe rengini belirlemek için anketimize katılın."
                        }
                    }
                ],
                version: "2.29.0"
            }
            // Note: Survey options logic would typically be in content or separate relation,
            // simplifying here as per current schema which uses SurveyVote relation primarily,
            // but UI expects options in content or separate field? 
            // Schema survey_vote -> optionSelected.
            // The mock data had 'options' array. 
            // Current Schema `Post` doesn't have explicit options field, it's inside JSON `content` or inferred.
            // I will assume options are part of the JSON content for now or handled by frontend logic.
        }
    });

    console.log('✅ Posts created.');
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
