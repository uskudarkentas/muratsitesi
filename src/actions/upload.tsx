"use server";

import { writeFile } from "fs/promises";
import { join } from "path";
import { revalidatePath } from "next/cache";

export async function uploadFile(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) {
            return { success: false, error: "Dosya bulunamadı" };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, "_"); // Sanitize
        const filename = `${timestamp}-${originalName}`;

        // Save to public/uploads
        const uploadDir = join(process.cwd(), "public", "uploads");
        const filepath = join(uploadDir, filename);

        await writeFile(filepath, buffer);

        // Return public URL
        const fileUrl = `/uploads/${filename}`;

        return { success: true, url: fileUrl };
    } catch (error) {
        console.error("Upload error:", error);
        return { success: false, error: "Dosya yüklenirken bir hata oluştu" };
    }
}
