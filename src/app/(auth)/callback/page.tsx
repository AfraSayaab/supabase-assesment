// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();
  const supabase = createClient();
  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data?.session) {
        router.push("/login");
        return;
      }

      // User is authenticated, redirect to dashboard
      router.push("/cardform");
    };

    handleAuth();
  }, [router]);

  return <div>Loading...</div>;
}