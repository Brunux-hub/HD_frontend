"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { login } from "@/services/auth/auth";
import { setRole, decodeToken, type Role } from "@/lib/auth";
import { ApiError } from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();

  // Precarga ambos destinos para que la navegación tras el login sea instantánea.
  useEffect(() => {
    router.prefetch("/admin");
    router.prefetch("/cliente");
    router.prefetch("/recepcionista");
    router.prefetch("/veterinario");
  }, [router]);
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!correo || !contrasenia) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const res = await login({ correo, contrasenia });
      const payload = decodeToken(res.token);
      const rawRol = payload?.rol ?? "ADMIN";
      const roleMap: Record<string, Role> = { ADMIN: "admin", VETERINARIO: "veterinario", RECEPCIONISTA: "recepcionista", CLIENTE: "cliente" };
      const role = roleMap[rawRol] ?? "admin";
      setRole(role);
      if (role === "cliente") router.push("/cliente");
      else if (role === "recepcionista") router.push("/recepcionista");
      else if (role === "veterinario") router.push("/veterinario");
      else router.push("/admin");
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 401
          ? "Usuario o contraseña incorrectos."
          : err instanceof Error
            ? err.message
            : "No se pudo iniciar sesión.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      width: "100vw", 
      height: "100vh", 
      margin: 0, 
      padding: 0, 
      overflow: "hidden",
      fontFamily: "'Nunito', sans-serif"
    }}>
      
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
        }
        :root {
          --text-dark: #1a1a2e;
          --text-gray: #6b7280;
        }
        .btn-pink {
          background: linear-gradient(135deg, #6dd4d7, #A6E9EB);
          color: white;
          border: none;
          border-radius: 14px;
          padding: 14px 24px;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          width: 100%;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(109,212,215,0.35);
          letter-spacing: 0.5px;
        }
        .btn-pink:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(109,212,215,0.5);
        }
        .input-field {
          width: 100%;
          padding: 13px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 15px;
          outline: none;
          transition: all 0.2s;
          background: #fafafa;
          color: var(--text-dark);
          box-sizing: border-box;
          font-weight: 500;
        }
        .input-field:focus {
          border-color: #6dd4d7;
          background: white;
          box-shadow: 0 0 0 4px rgba(109,212,215,0.08);
        }
        .paw-bg {
          position: absolute;
          opacity: 0.07;
          font-size: 120px;
          pointer-events: none;
        }
        .left-panel {
          background: linear-gradient(180deg, #a8f0f2 0%, #6dd4d7 50%, #3bb8bc 100%);
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 40px;
          height: 100vh;
        }
        .right-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          padding: 40px;
          height: 100vh;
          overflow-y: auto;
        }
        .card {
          width: 100%;
          max-width: 400px;
        }
        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Nunito', sans-serif;
          color: var(--text-dark);
          transition: all 0.2s;
          flex: 1;
        }
        .social-btn:hover {
          border-color: #6dd4d7;
          background: #e0f9fa;
        }
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
          color: var(--text-gray);
          font-size: 13px;
          font-weight: 600;
          font-family: 'Nunito', sans-serif;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }
        .floating-card {
          background: rgba(255,255,255,0.25);
          backdrop-filter: blur(12px);
          border-radius: 24px;
          padding: 24px 20px;
          border: 1px solid rgba(255,255,255,0.4);
          margin-top: 20px;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 16px;
        }
        .service-item {
          background: rgba(255,255,255,0.5);
          backdrop-filter: blur(4px);
          border-radius: 16px;
          padding: 12px 8px;
          text-align: center;
          font-weight: 700;
          font-size: 13px;
          color: #1a5f61;
          border: 1px solid rgba(255,255,255,0.6);
          transition: all 0.2s ease;
          cursor: default;
        }
        .service-item:hover {
          background: rgba(255,255,255,0.7);
          transform: translateY(-2px);
        }
        .service-item.full-width {
          grid-column: span 2;
        }
        /* Logo circular */
        .logo-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto 12px;
          border: 3px solid #6dd4d7;
          box-shadow: 0 4px 20px rgba(109,212,215,0.3);
          background-color: #6dd4d7;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
        @media (max-width: 768px) {
          .left-panel { display: none; }
          .right-panel { padding: 24px; }
        }
      `}</style>

      {/* Left decorative panel */}
      <div className="left-panel">
        <span className="paw-bg" style={{ top: "-20px", left: "-20px" }}>🐾</span>
        <span className="paw-bg" style={{ bottom: "40px", right: "-10px", fontSize: "160px" }}>🐾</span>
        <span className="paw-bg" style={{ top: "50%", left: "10px", fontSize: "80px" }}>🐾</span>

        <div style={{ textAlign: "center", position: "relative", zIndex: 1, width: "100%", maxWidth: "380px" }}>
          <Link href="/" aria-label="Ir al inicio" className="logo-circle" style={{ width: "140px", height: "140px", cursor: "pointer" }}>
            <img src="/logovet2.jpg" alt="Healthy Pets" />
          </Link>

          <h1 style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "28px",
            fontWeight: "900",
            margin: "0 0 4px",
            lineHeight: 1.2,
            color: "#1a5f61"
          }}>
            HealthyPets
          </h1>
          <p style={{ fontSize: "13px", fontWeight: 700, margin: "0 0 20px", color: "#1a5f61" }}>
            Cuidando a tus mejores amigos 🐾
          </p>

          <div className="floating-card">
            <p style={{ color: "#1a5f61", fontWeight: 800, fontSize: "16px", margin: "0 0 8px", textAlign: "center" }}>
              Todo en un solo lugar
            </p>
            
            <div className="services-grid">
              <div className="service-item">🏥 Citas médicas</div>
              <div className="service-item">💊 Medicamentos</div>
              <div className="service-item">📋 Historial</div>
              <div className="service-item">🛁 Grooming</div>
              <div className="service-item full-width">🐾 Seguimiento</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right login panel - CON EL LOGO PEQUEÑO */}
      <div className="right-panel">
        <div className="card">
          {/* Logo pequeño - exactamente como lo quieres */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <Link href="/" aria-label="Ir al inicio" className="logo-circle" style={{ cursor: "pointer" }}>
              <img src="/logovet2.jpg" alt="Healthy Pets" />
            </Link>
            <h2 style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "24px",
              fontWeight: "800",
              color: "var(--text-dark)",
              margin: "12px 0 4px"
            }}>
              ¡Bienvenido de vuelta!
            </h2>
            <p style={{ color: "var(--text-gray)", fontSize: "13px", margin: 0, fontWeight: 600 }}>
              Ingresa a tu cuenta para continuar
            </p>
          </div>

          {/* Social buttons */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "4px" }}>
            <button className="social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button className="social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>

          <div className="divider">o continúa con email</div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-dark)", display: "block", marginBottom: "6px" }}>
                Correo electrónico
              </label>
              <input
                className="input-field"
                type="text"
                placeholder="tu correo"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-dark)" }}>
                  Contraseña
                </label>
                <a href="#" style={{ fontSize: "12px", color: "#6dd4d7", fontWeight: "700", textDecoration: "none" }}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  className="input-field"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={contrasenia}
                  onChange={e => setContrasenia(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }}
                  style={{ paddingRight: "44px" }}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  style={{
                    position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", color: "var(--text-gray)",
                    fontSize: "18px", padding: 0
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input type="checkbox" id="remember" style={{ accentColor: "#6dd4d7", width: "16px", height: "16px", cursor: "pointer" }} />
              <label htmlFor="remember" style={{ fontSize: "13px", color: "var(--text-gray)", fontWeight: 600, cursor: "pointer" }}>
                Recordarme en este dispositivo
              </label>
            </div>

            {error && (
              <p style={{ color: "#dc2626", fontSize: "13px", fontWeight: 700, margin: 0, textAlign: "center" }}>
                {error}
              </p>
            )}

            <button
              className="btn-pink"
              onClick={handleSubmit}
              disabled={loading}
              style={loading ? { opacity: 0.7, cursor: "not-allowed" } : undefined}
            >
              {loading ? "Ingresando..." : "Iniciar sesión →"}
            </button>
          </div>

          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "var(--text-gray)", fontWeight: 600 }}>
            ¿No tienes cuenta?{" "}
            <Link href="/register" style={{ color: "#6dd4d7", fontWeight: "800", textDecoration: "none" }}>
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
