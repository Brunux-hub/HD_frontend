import Navbar from "@/ui/Navbar";
import Footer from "@/ui/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
