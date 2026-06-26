"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGameState } from "@/lib/useGameState";

export default function GameStateRedirect() {
  const { ending_open, loaded } = useGameState();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loaded) return;
    if (ending_open && pathname !== "/ending" && pathname !== "/admin") {
      router.push("/ending");
    }
  }, [ending_open, loaded, pathname, router]);

  return null;
}
