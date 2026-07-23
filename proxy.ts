import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_COOKIE = "hd_vet_token";
const ROLE_COOKIE = "hd_vet_role";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const role = request.cookies.get(ROLE_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const isAdmin = pathname.startsWith("/admin");
  const isCliente = pathname.startsWith("/cliente");
  const isRecepcionista = pathname.startsWith("/recepcionista");
  const isVeterinario = pathname.startsWith("/veterinario");

  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
  };

  if ((isAdmin || isCliente || isRecepcionista || isVeterinario) && !token)
    return redirectTo("/login");

  if (isAdmin && token && role === "cliente")
    return redirectTo("/cliente");
  if (isAdmin && token && role === "recepcionista")
    return redirectTo("/recepcionista");
  if (isAdmin && token && role === "veterinario")
    return redirectTo("/veterinario");

  if (isCliente && token && role && role !== "cliente")
    return redirectTo("/admin");
  if (isRecepcionista && token && role && role !== "recepcionista")
    return redirectTo("/admin");
  if (isVeterinario && token && role && role !== "veterinario")
    return redirectTo("/admin");

  const hiddenByRole: Record<string, string[]> = {
    veterinario: ["/admin/clientes", "/admin/veterinarios"],
    recepcionista: ["/admin/recepcionistas"],
  };
  if (isAdmin && token && role) {
    const blocked = hiddenByRole[role] ?? [];
    if (blocked.some((base) => pathname.startsWith(base)))
      return redirectTo("/admin");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cliente/:path*", "/recepcionista/:path*", "/veterinario/:path*", "/login"],
};
