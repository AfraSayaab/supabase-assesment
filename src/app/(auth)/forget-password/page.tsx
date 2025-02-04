// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const supabase = createClient();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `https://supabase-assesment.vercel.app/reset-password`,
            });
            if (error) throw error;
            setMessage("Check your email for the reset link.");
        } catch (error: any) {
            setMessage(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="container flex h-screen flex-col items-center justify-center p-6 rounded-lg ">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Forgot Password</h1>

            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full p-3 rounded-lg border border-black focus:outline-none focus:ring-2 "
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-3 bg-black text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
            </form>

            {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
        </section>

    );
}