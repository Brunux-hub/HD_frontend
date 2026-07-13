import type { NextConfig } from "next";

// El backend Spring corre en :8080 y NO tiene CORS configurado.
// Usamos un rewrite para que el navegador llame a /api (mismo origen que el front)
// y Next lo reenvíe al backend, evitando problemas de CORS en desarrollo.
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
