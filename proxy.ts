import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_COOKIE = "hd_vet_token";

/**
 * Protege las rutas del dashboard (convención "proxy" de Next 16):
 *  - Sin token e intentando entrar a /dashboard  -> redirige a /login
 *  - Con token e intentando entrar a /login       -> redirige a /dashboard
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  // Rutas protegidas: dashboard del staff y área del cliente.
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/cliente");
  const isLogin = pathname === "/login";

  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isLogin && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/cliente/:path*", "/login"],
};
