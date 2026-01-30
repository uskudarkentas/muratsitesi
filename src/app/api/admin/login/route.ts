import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        console.log("🔍 API Route called");

        const body = await request.json();
        console.log("📦 Request body:", body);

        const { username, password } = body;

        // Simple hardcoded auth for now - will be replaced with proper auth
        const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

        // Debug logging
        console.log("=== LOGIN ATTEMPT ===");
        console.log("Received username:", username);
        console.log("Received password:", password ? "***" : "empty");
        console.log("Expected username:", ADMIN_USERNAME);
        console.log("Expected password:", ADMIN_PASSWORD ? "***" : "empty");
        console.log("Username match:", username === ADMIN_USERNAME);
        console.log("Password match:", password === ADMIN_PASSWORD);
        console.log("====================");

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            console.log("✅ Login successful");

            // Create response with cookie
            const response = NextResponse.json({ success: true });
            response.cookies.set("admin_auth", "authenticated", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });

            return response;
        }

        console.log("❌ Login failed - credentials mismatch");
        return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 401 }
        );
    } catch (error) {
        console.error("❌ Login error:", error);
        return NextResponse.json(
            { error: "Internal server error", details: String(error) },
            { status: 500 }
        );
    }
}
