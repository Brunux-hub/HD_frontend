import AppSidebar from "./dashboard/_components/AppSidebar";
import Navbar from "./dashboard/_components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <AppSidebar/>
      <main className="w-full">
        <Navbar/>
        <div className="px-4">
          {children}
        </div>
      </main>
    </div>
  );
}