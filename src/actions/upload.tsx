"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { revalidatePath } from "next/cache";


export async function uploadFile(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) {
            console.error("Upload error: No file in formData");
            return { success: false, error: "Dosya bulunamadı" };
        }

        // Server-side guardrail: 30MB Max
        const MAX_SIZE = 30 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return { success: false, error: "Dosya boyutu çok büyük (Sınır: 30MB)" };
        }

        console.log(`Uploading file: ${file.name}, size: ${file.size} bytes`);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filename = `${timestamp}-${sanitizedName}`;

        // Save to public/uploads
        const uploadDir = join(process.cwd(), "public", "uploads");

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Already exists or other error handled by writeFile later
        }

        const filepath = join(uploadDir, filename);
        await writeFile(filepath, buffer);

        console.log(`File saved to: ${filepath}`);

        // Return public URL
        const fileUrl = `/uploads/${filename}`;
        return { success: true, url: fileUrl };
    } catch (error) {
        console.error("Upload server action error:", error);
        return { success: false, error: "Sunucu tarafında bir hata oluştu" };
    }
}

