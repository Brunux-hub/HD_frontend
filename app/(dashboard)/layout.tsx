import AppSidebar from "./dashboard/_components/AppSidebar";
import Navbar from "./dashboard/_components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background via-background to-muted/30">

      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar/>
        <main className="w-full flex flex-col min-h-screen">
          <Navbar/>
          <div className="flex-1 px-6 py-6 lg:px-8">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}