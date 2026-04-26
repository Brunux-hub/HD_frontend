import Image from "next/image";
import Hero from "./_components/Hero";
import Services from "./_components/Services";
import Team from "./_components/Team";
import About from "./_components/About";
import Contact from "./_components/Contact";

export default function Home() {
  return ( 
    // Contenido Pagina Inicio
    <div className="flex flex-col gap-8 items-center justify-center bg-zinc-500 font-sans dark:bg-black">
      <Hero />
      <About />
      <Services />
      <Team />
      <Contact />
    </div>
  );
}
