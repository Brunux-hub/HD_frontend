"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RecepcionistaHome() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/recepcionista/clientes");
  }, [router]);

  return null;
}
