"use server";

import { db } from "@/core/database/client";
import { ContentBlock } from "@/types/page-builder";
import { revalidatePath } from "next/cache";

/**
 * Get page content by slug
 */
export async function getPageContent(slug: string) {
    try {
        // 1. Try to fetch from new PageContent table
        const pageContent = await db.pageContent.findUnique({
            where: { slug },
        });

        if (pageContent) {
            // Parse JSON blocks
            const blocks = JSON.parse(pageContent.blocks) as ContentBlock[];
            return {
                success: true,
                data: {
                    ...pageContent,
                    blocks,
                },
            };
        }

        // 2. If not found, check if it's a legacy STAGE page
        const stage = await db.stage.findUnique({
            where: { slug },
        });

        if (stage) {
            // Check if stage has legacy content
            if (stage.content) {
                try {
                    const legacyBlocks = typeof stage.content === 'string'
                        ? JSON.parse(stage.content)
                        : stage.content;

                    if (Array.isArray(legacyBlocks) && legacyBlocks.length > 0) {
                        // Migrate legacy blocks to new format
                        const migratedBlocks: ContentBlock[] = legacyBlocks.map((block: any, index: number) => {
                            const newId = `migrated-${index}-${Date.now()}`;

                            switch (block.type) {
                                case 'hero':
                                    return {
                                        id: newId,
                                        type: 'hero',
                                        order: index,
                                        data: {
                                            title: block.data.title || stage.title,
                                            description: block.data.subtitle || block.data.description || stage.description || '',
                                            backgroundImage: block.data.backgroundImage,
                                            ctaText: block.data.buttonText,
                                            ctaLink: block.data.buttonLink
                                        }
                                    };
                                case 'richtext':
                                case 'text':
                                    return {
                                        id: newId,
                                        type: 'text',
                                        order: index,
                                        data: {
                                            content: block.data.content || ''
                                        }
                                    };
                                case 'image':
                                    return {
                                        id: newId,
                                        type: 'image',
                                        order: index,
                                        data: {
                                            url: block.data.url || block.data.src || '',
                                            alt: block.data.alt || '',
                                            caption: block.data.caption
                                        }
                                    };
                                case 'pdf':
                                    return {
                                        id: newId,
                                        type: 'document-list',
                                        order: index,
                                        data: {
                                            title: block.data.title || 'Dokümanlar',
                                            documents: block.data.file ? [{
                                                id: `doc-${index}`,
                                                title: block.data.text || 'Doküman',
                                                fileUrl: block.data.file,
                                                type: 'pdf'
                                            }] : []
                                        }
                                    };
                                case 'infocards':
                                    return {
                                        id: newId,
                                        type: 'info-card-grid',
                                        order: index,
                                        data: {
                                            cards: Array.isArray(block.data.cards) ? block.data.cards.map((c: any, i: number) => ({
                                                id: `card-${index}-${i}`,
                                                icon: c.icon || 'info',
                                                title: c.title || '',
                                                description: c.description || ''
                                            })) : []
                                        }
                                    };
                                case 'announcement':
                                    return {
                                        id: newId,
                                        type: 'announcement-banner',
                                        order: index,
                                        data: {
                                            icon: block.data.icon || 'campaign',
                                            title: block.data.title || '',
                                            description: block.data.content || '',
                                            backgroundColor: block.data.type === 'warning' ? '#fef3c7' : '#98EB94'
                                        }
                                    };
                                default:
                                    // Fallback for unknown blocks -> convert to text debug
                                    return {
                                        id: newId,
                                        type: 'text',
                                        order: index,
                                        data: {
                                            content: `<p><em>Migrated unknown block: ${block.type}</em></p>`
                                        }
                                    };
                            }
                        });

                        return {
                            success: true,
                            data: {
                                id: 0, // Temp ID
                                slug: stage.slug,
                                blocks: migratedBlocks,
                                isTemplate: false,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        };
                    }
                } catch (e) {
                    console.error("Error migrating legacy content:", e);
                }
            }

            // Return empty content for new stage pages
            return {
                success: true,
                data: {
                    id: 0, // Temporary ID
                    slug: stage.slug,
                    blocks: [],
                    isTemplate: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            };
        }

        return {
            success: false,
            error: "Sayfa bulunamadı",
            data: null,
        };

    } catch (error) {
        console.error("Error fetching page content:", error);
        return {
            success: false,
            error: "Sayfa içeriği yüklenirken bir hata oluştu",
            data: null,
        };
    }
}

/**
 * Get all pages (static + dynamic stages)
 */
export async function getAllPages() {
    try {
        // 1. Get static pages defined in DB
        const staticPages = await db.pageContent.findMany({
            select: {
                slug: true,
                updatedAt: true,
            },
            where: {
                slug: {
                    in: ['home', 'contact', 'risk-notice']
                }
            }
        });

        // 2. Get all stages
        const stages = await db.stage.findMany({
            select: {
                title: true,
                slug: true,
                description: true
            },
            orderBy: {
                sequenceOrder: 'asc'
            }
        });

        // Combine them
        const defaultPages = [
            { slug: 'home', label: 'Ana Sayfa', description: 'Site ana sayfası' },
            { slug: 'contact', label: 'İletişim', description: 'İletişim sayfası' },
            { slug: 'risk-notice', label: 'Riskli Yapı İlanı', description: 'Riskli yapı ilanı sayfası' },
        ];

        const stagePages = stages.map(stage => ({
            slug: stage.slug,
            label: stage.title,
            description: stage.description || 'Proje aşaması'
        }));

        return {
            success: true,
            data: [...defaultPages, ...stagePages],
        };
    } catch (error) {
        console.error("Error fetching pages:", error);
        return {
            success: false,
            error: "Sayfalar yüklenirken bir hata oluştu",
            data: [],
        };
    }
}

/**
 * Save or update page content
 */
export async function savePageContent(slug: string, blocks: ContentBlock[], isTemplate: boolean = false) {
    try {
        const blocksJson = JSON.stringify(blocks);

        const pageContent = await db.pageContent.upsert({
            where: { slug },
            update: {
                blocks: blocksJson,
                isTemplate,
            },
            create: {
                slug,
                blocks: blocksJson,
                isTemplate,
            },
        });

        // Also update the legacy Stage.content field for backward compatibility if it's a stage page
        // This ensures the public site (which might still use the old renderer) works
        // BUT: Ideally we should update the public site to use the new renderer too.
        // For now, let's keep them separate to update public site later.

        // Revalidate the page
        revalidatePath(`/${slug}`);
        revalidatePath(`/asamalar/${slug}`);
        revalidatePath('/admin/page-builder');

        return {
            success: true,
            data: pageContent,
        };
    } catch (error) {
        console.error("Error saving page content:", error);
        return {
            success: false,
            error: "Sayfa kaydedilirken bir hata oluştu",
        };
    }
}

/**
 * Delete page content
 */
export async function deletePageContent(slug: string) {
    try {
        await db.pageContent.delete({
            where: { slug },
        });

        revalidatePath('/admin/page-builder');

        return {
            success: true,
        };
    } catch (error) {
        console.error("Error deleting page content:", error);
        return {
            success: false,
            error: "Sayfa silinirken bir hata oluştu",
        };
    }
}

/**
 * Get default template for stage pages
 */
export async function getStageTemplate() {
    try {
        const template = await db.pageContent.findFirst({
            where: {
                isTemplate: true,
                slug: 'stage-template',
            },
        });

        if (!template) {
            // Return default template if not found
            const defaultBlocks: ContentBlock[] = [
                {
                    id: 'hero-1',
                    type: 'hero',
                    order: 0,
                    data: {
                        title: 'Aşama Başlığı',
                        description: 'Aşama açıklaması buraya gelecek',
                    },
                },
            ];

            return {
                success: true,
                data: {
                    blocks: defaultBlocks,
                },
            };
        }

        const blocks = JSON.parse(template.blocks) as ContentBlock[];

        return {
            success: true,
            data: {
                blocks,
            },
        };
    } catch (error) {
        console.error("Error fetching stage template:", error);
        return {
            success: false,
            error: "Şablon yüklenirken bir hata oluştu",
            data: null,
        };
    }
}
