"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"

const publicRoutes = ["/login", "/register", "/"]

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { initialize, isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (isLoading) return

    const isPublic = publicRoutes.some((route) => pathname === route || pathname?.startsWith("/_"))

    if (!isAuthenticated && !isPublic) {
      router.push("/login")
    }

    if (isAuthenticated && pathname === "/login" && pathname) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, pathname, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}
