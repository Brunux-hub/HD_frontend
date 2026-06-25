"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/features/auth/auth-service"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = await authService.login(username, password)
      login(data.access_token, data.refresh_token, data.expires_in, data.user)
      router.push("/dashboard")
    } catch {
      setError("Credenciales incorrectas. Verifica tu usuario y contraseña.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden flex-1 flex-col items-center justify-center bg-gradient-to-br from-teal-300 via-teal-400 to-teal-600 p-8 lg:flex relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🐾</div>
          <div className="absolute bottom-20 right-10 text-9xl">🐾</div>
          <div className="absolute top-1/2 left-1/4 text-6xl">🐾</div>
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-white/20 backdrop-blur border-2 border-white/30 shadow-lg">
            <img src="/logovet2.jpg" alt="Healthy Pets" className="h-28 w-28 rounded-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">HealthyPets</h1>
          <p className="text-lg text-white/80 mb-8">Cuidando a tus mejores amigos 🐾</p>
          <div className="grid grid-cols-2 gap-3">
            {["🏥 Citas médicas", "💊 Medicamentos", "📋 Historial clínico", "🐾 Seguimiento"].map((s) => (
              <div key={s} className="rounded-xl bg-white/20 backdrop-blur px-4 py-3 text-sm font-semibold text-white border border-white/20">
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100">
              <img src="/logovet2.jpg" alt="Healthy Pets" className="h-12 w-12 rounded-full object-cover" />
            </div>
            <CardTitle className="text-xl">¡Bienvenido de vuelta!</CardTitle>
            <CardDescription>Ingresa a tu cuenta para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <a href="#" className="text-xs text-teal-600 hover:underline">¿Olvidaste tu contraseña?</a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600" disabled={loading}>
                {loading ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
