// app/reset-password/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    useEffect(() => {
        const handleHash = async () => {
            const hash = window.location.hash.substring(1);
            const params = new URLSearchParams(hash);
            const access_token = params.get("access_token");
            const refresh_token = params.get("refresh_token");

            if (access_token && refresh_token) {
                const { error } = await supabase.auth.setSession({
                    access_token,
                    refresh_token,
                });
                if (error) {
                    setMessage("Invalid or expired token.");
                    return;
                }
                router.replace("/reset-password");
            }
        };

        handleHash();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            setMessage("Password updated successfully!");
            router.push("/login");
        } catch (error: any) {
            setMessage(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container flex flex-col items-center justify-center min-h-screen p-6 rounded-lg ">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Reset Password</h1>

            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                    required
                    className="w-full p-3 rounded-lg border border-black focus:outline-none focus:ring-2"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-3 bg-black text-white font-semibold rounded-lg hover:bg-black disabled:opacity-50"
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>

            {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
        </div>

    );
}