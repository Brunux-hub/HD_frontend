import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_COOKIE = "hd_vet_token";
const ROLE_COOKIE = "hd_vet_role";

/**
 * Protección de rutas + separación de áreas (convención "proxy" de Next 16):
 *  - Sin token en /dashboard o /cliente  -> /login
 *  - Con token en /login                 -> a su área según rol
 *  - Cliente intentando entrar a /dashboard -> /cliente
 *  - Staff intentando entrar a /cliente     -> /dashboard
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const role = request.cookies.get(ROLE_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isClient = pathname.startsWith("/cliente");

  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
  };

  if ((isDashboard || isClient) && !token) return redirectTo("/login");

  // Nota: NO redirigimos /login -> área aunque exista token; "Ingresar" siempre
  // muestra el formulario (login requerido). Solo evitamos el acceso cruzado.
  if (isDashboard && token && role === "client") return redirectTo("/cliente");
  if (isClient && token && role && role !== "client") return redirectTo("/dashboard");

  // Secciones del dashboard vetadas según el rol (defensa aunque no se muestren en el menú):
  //  - veterinario: no ve Clientes ni Veterinarios
  //  - recepcionista: no ve Recepcionistas
  const hiddenByRole: Record<string, string[]> = {
    veterinarian: ["/dashboard/clientes", "/dashboard/veterinarios"],
    receptionist: ["/dashboard/recepcionistas"],
  };
  if (isDashboard && token && role) {
    const blocked = hiddenByRole[role] ?? [];
    if (blocked.some((base) => pathname.startsWith(base))) {
      return redirectTo("/dashboard");
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/cliente/:path*", "/login"],
};
