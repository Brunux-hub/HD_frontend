import AppSidebar from "./dashboard/_components/AppSidebar";
import Navbar from "./dashboard/_components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // Cookies
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <div className="min-h-screen flex">

      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar/>
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