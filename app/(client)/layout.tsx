import ClientNavbar from "./_components/ClientNavbar";
import ClientSidebar from "./_components/ClientSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <ClientSidebar />
      <div className="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-950">
        <ClientNavbar />
        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
