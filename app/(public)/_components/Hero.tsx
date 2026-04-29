import Image from "next/image";

import heroImg from "@/assets/hero_img.jpg";
import ThypographyH1 from "@/components/ThypographyH1";

export default function Hero() {
  return (
    <section className="w-full overflow-hidden bg-zinc-50 dark:bg-black">
      <div className=" relative max-w-7xl mx-auto">
        <div className="absolute inset-0">
          <Image
            src={heroImg}
            alt="hero_img"
            className="object-contain"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative mx-auto w-full min-h-40">
          <div className="grid grid-cols-1 lg:grid-cols-12 grid-rows-6 gap-5">
            <div className=" lg:col-span-12"></div>
            <div className="col-span-1 lg:col-span-12"></div>
            <div className="col-span-1 lg:col-span-12"></div>
            <div className="hidden lg:block lg:col-start-5 col-end-9">
              <div className="flex justify-center items-center font-hero-title text-5xl">
                <ThypographyH1 someText="Bienvenido a Healthy Peats" className="text-zinc-300"/>
              </div>
            </div>

            <div className="hidden lg:block col-start-5 col-end-9">
              <div className="text-center text-zinc-300">
                Brindamos atención veterinaria de primer nivel con un equipo
                dedicado exclusivamente a cuidar cada detalle de la salud de tu
                compañero.
              </div>
            </div>

            <div className="hidden lg:block col-start-4 col-end-10">
              <div>
                <div className="flex justify-evenly">
                  <div className="flex items-center gap-5">
                    <div className="h-5 w-5 bg-sky-500 rounded-full"></div>
                    <div className="flex flex-col text-zinc-300">
                      <span>Utilizamos Productos</span>
                      <span>Eco-Friendly</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="h-5 w-5 bg-sky-500 rounded-full"></div>
                    <div className="flex flex-col text-zinc-300">
                      <span>100% comprometidos</span>
                      <span>con tu mascota</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
