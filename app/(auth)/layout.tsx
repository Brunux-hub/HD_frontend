
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      {/* children sera reemplazado por página actual (Login, Register) según la URL */}
      {children} 
    </main>
  );
}