
import Sidebar from "./_components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside>
        <Sidebar />
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}