import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";


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
