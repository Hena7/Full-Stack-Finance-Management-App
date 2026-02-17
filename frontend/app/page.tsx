"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100">
      <div className="animate-pulse">Loading BudgetWise...</div>
    </div>
  );
}
