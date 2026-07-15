"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VeterinarioHome() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/veterinario/citas");
  }, [router]);

  return null;
}