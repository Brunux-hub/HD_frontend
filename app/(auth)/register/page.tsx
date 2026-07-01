"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { register } from "@/services/auth/auth";

export default function RegisterPage() {
  const router = useRouter();

  // Precarga el login para que el paso tras registrarse sea instantáneo.
  useEffect(() => {
    router.prefetch("/login");
  }, [router]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm: "",
    names: "",
    lastNames: "",
    email: "",
    phone: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!form.username || !form.password) {
      setError("Completa usuario y contraseña.");
      return;
    }
    if (form.password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await register({
        username: form.username,
        password: form.password,
        names: form.names,
        last_names: form.lastNames,
        email: form.email,
        phone_number: form.phone,
        address: form.address,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo completar el registro.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-teal-400 focus:bg-white";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-100 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-teal-100 bg-white p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-full ring-2 ring-teal-200">
            <img src="/logovet2.jpg" alt="Healthy Pets" className="h-full w-full object-cover" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Crear cuenta</h1>
          <p className="mt-1 text-sm text-slate-500">
            Regístrate como cliente para gestionar a tus mascotas
          </p>
        </div>

        {success ? (
          <div className="mt-6 space-y-4 text-center">
            <div className="rounded-xl bg-teal-50 p-4 text-sm font-medium text-teal-700">
              ¡Cuenta creada! Ya puedes iniciar sesión con tu usuario{" "}
              <span className="font-bold">{form.username}</span>.
            </div>
            <button
              onClick={() => router.push("/login")}
              className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Ir a iniciar sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Datos de acceso */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
                Datos de acceso
              </p>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Usuario</label>
                <input type="text" value={form.username} onChange={set("username")} placeholder="ej. mariat" className={inputClass} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Contraseña</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={set("password")}
                      placeholder="••••••••"
                      className={`${inputClass} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-lg"
                      aria-label="Mostrar u ocultar contraseña"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Confirmar</label>
                  <input type={showPassword ? "text" : "password"} value={form.confirm} onChange={set("confirm")} placeholder="••••••••" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Datos personales */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
                Tus datos
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Nombres</label>
                  <input type="text" value={form.names} onChange={set("names")} placeholder="Ej. María" className={inputClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Apellidos</label>
                  <input type="text" value={form.lastNames} onChange={set("lastNames")} placeholder="Ej. Torres" className={inputClass} />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                  <input type="email" value={form.email} onChange={set("email")} placeholder="tucorreo@email.com" className={inputClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Teléfono</label>
                  <input type="text" value={form.phone} onChange={set("phone")} placeholder="987 654 321" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Dirección</label>
                <input type="text" value={form.address} onChange={set("address")} placeholder="Av. Principal 123" className={inputClass} />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
            >
              {loading ? "Creando cuenta..." : "Registrarme"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-teal-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
