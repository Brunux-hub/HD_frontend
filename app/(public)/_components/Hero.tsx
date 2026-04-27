
import LayoutContainer from "@/components/LayoutContainer";

export default function Hero() {
  return (
    <section className="w-full bg-zinc-50 dark:bg-black">
      <LayoutContainer>
        <div className="min-h-110 flex items-center justify-center border-4 border-white">
          <h1>Bienvenido a la seccion Hero</h1>
        </div>
      </LayoutContainer>
    </section>
  );
}
