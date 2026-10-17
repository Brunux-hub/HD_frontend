import Hero from "./_components/Hero";
import ScrollytellingFrames from "./_components/ScrollytellingFrames";
import Services from "./_components/Services";
import Team from "./_components/Team";
import About from "./_components/About";
import Contact from "./_components/Contact";

export default function Home() {
  return (
    // Contenido Pagina Inicio con Apple Scrollytelling & Frames en Movimiento
    <div className="flex w-full flex-col font-sans dark:bg-black">
      <Hero />
      <ScrollytellingFrames />
      <About />
      <Services />
      <Team />
      <Contact />
    </div>
  );
}
