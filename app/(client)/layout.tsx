import ClientSidebar from "./_components/ClientSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <ClientSidebar />
      <div className="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-950">
        {/* Barra superior solo en móvil: abre el menú lateral */}
        <header className="flex h-14 items-center gap-2 border-b border-teal-100 bg-white px-4 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <SidebarTrigger />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            Healthy<span className="text-teal-600 dark:text-teal-400">Pets</span>
          </span>
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
