"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        console.log("🔐 Login attempt:", { username, password: "***" });

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            console.log("📡 Response status:", response.status);
            console.log("📡 Response ok:", response.ok);

            if (response.ok) {
                console.log("✅ Login successful, redirecting...");
                router.push("/admin");
                router.refresh();
            } else {
                const data = await response.json();
                console.log("❌ Login failed:", data);
                setError("Kullanıcı adı veya şifre hatalı");
            }
        } catch (err) {
            console.error("❌ Login error:", err);
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="relative h-16 w-[280px]">
                        <Image
                            src="/header-logo-final.png"
                            alt="Üsküdar Belediyesi - Kentaş"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="material-symbols-outlined text-primary !text-3xl">
                            admin_panel_settings
                        </span>
                        <h1 className="text-2xl font-bold text-foreground">
                            Yönetici Girişi
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                Kullanıcı Adı
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                placeholder="admin"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                Şifre
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                placeholder="••••••••"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-red-600 dark:text-red-400 !text-lg">
                                    error
                                </span>
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {error}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="material-symbols-outlined !text-lg animate-spin">
                                        progress_activity
                                    </span>
                                    Giriş yapılıyor...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined !text-lg">
                                        login
                                    </span>
                                    Giriş Yap
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-xs text-muted-foreground text-center">
                            Bu sayfa yalnızca yetkili yöneticiler içindir.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
