import { z } from "zod";

export const SharedBlockSchema = z.object({
    anchorId: z.string().optional(),
    visibility: z.enum(["public", "hidden"]).default("public"),
    layout: z.enum(["full", "centered", "narrow"]).default("centered"),
    spacing: z.enum(["none", "small", "medium", "large"]).default("medium"),
});

export const HeroBlockSchema = SharedBlockSchema.extend({
    title: z.string(),
    description: z.string().optional(),
    accentColor: z.string().optional(),
    backgroundImage: z.string().optional(),
});

export const RichTextBlockSchema = SharedBlockSchema.extend({
    content: z.any(), // Editor.js JSON or Markdown
});

export const ImageBlockSchema = SharedBlockSchema.extend({
    url: z.string().url(),
    caption: z.string().optional(),
    alt: z.string().optional(),
    displayStyle: z.enum(["fit", "cover", "contain"]).default("fit"),
});

export const PdfBlockSchema = SharedBlockSchema.extend({
    url: z.string().url(),
    title: z.string(),
    description: z.string().optional(),
    fileName: z.string().optional(),
});

export const AnnouncementBlockSchema = SharedBlockSchema.extend({
    variant: z.enum(["single", "list"]).default("single"),
    items: z.array(z.object({
        title: z.string(),
        date: z.string().optional(),
        text: z.string(),
        link: z.string().optional(),
    })).optional(),
    title: z.string().optional(), // For single variant
    text: z.string().optional(), // For single variant
});

export const InfoCardsBlockSchema = SharedBlockSchema.extend({
    cards: z.array(z.object({
        icon: z.string().optional(),
        title: z.string(),
        description: z.string(),
    })),
    columns: z.number().min(1).max(4).default(3),
});

export const SurveyBlockSchema = SharedBlockSchema.extend({
    question: z.string(),
    description: z.string().optional(),
    options: z.array(z.object({
        id: z.string(),
        text: z.string(),
    })),
    allowMultiple: z.boolean().default(false),
});

export const BlockSchema = z.discriminatedUnion("type", [
    z.object({ type: z.literal("hero"), data: HeroBlockSchema }),
    z.object({ type: z.literal("richtext"), data: RichTextBlockSchema }),
    z.object({ type: z.literal("image"), data: ImageBlockSchema }),
    z.object({ type: z.literal("pdf"), data: PdfBlockSchema }),
    z.object({ type: z.literal("announcement"), data: AnnouncementBlockSchema }),
    z.object({ type: z.literal("infocards"), data: InfoCardsBlockSchema }),
    z.object({ type: z.literal("survey"), data: SurveyBlockSchema }),
]);

export type BlockData = z.infer<typeof BlockSchema>;
