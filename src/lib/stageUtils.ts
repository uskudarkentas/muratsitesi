/**
 * Utility to extract hero block content (title and description) from stage JSON content.
 */
export function extractHeroContent(content: string | null) {
    if (!content) return null;

    try {
        // Content is a stringified JSON array of blocks
        const blocks = JSON.parse(content);
        if (!Array.isArray(blocks)) return null;

        // Find the hero block
        const heroBlock = blocks.find((block: any) => block.type === 'hero');

        if (heroBlock && heroBlock.data) {
            return {
                title: heroBlock.data.title || null,
                description: heroBlock.data.description || null
            };
        }
    } catch (error) {
        console.error("Error parsing stage content JSON:", error);
    }

    return null;
}
