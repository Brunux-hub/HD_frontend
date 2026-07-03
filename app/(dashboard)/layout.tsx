import AppSidebar from "./dashboard/_components/AppSidebar";
import Navbar from "./dashboard/_components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import type { Role } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // El rol define qué secciones ve cada quien (se pasa desde el server para
  // evitar parpadeos: veterinario oculta Clientes/Veterinarios, recepcionista Recepcionistas).
  const cookieStore = await cookies();
  const role = (cookieStore.get("hd_vet_role")?.value ?? "worker") as Role;

  // Arranca colapsado (solo íconos); se expande al pasar el mouse.
  return (
    <div className="min-h-screen flex">

      <SidebarProvider defaultOpen={false}>
        <AppSidebar role={role} />
        <main className="w-full">
          <Navbar/>
          <div className="px-4">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}