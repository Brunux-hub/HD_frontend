import ThypographyH2 from "@/components/ThypographyH2";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { DynamicIcon } from "@/components/atoms/DynamicIcon";

import { FaWhatsapp } from "react-icons/fa6";

import servicios from "@/data/vetServicios.json";

export default function Services() {
  return (
    <section id="servicios" className="w-full bg-zinc-50 dark:bg-black py-4 ">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 border-4 border-sky-600">
        <div className="min-h-110 mt-6">
          <ThypographyH2
            someText="¿Qué Servicios Ofrecemos?"
            className="font-bold"
          />
          {/* Services CARD Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {servicios.map((servicio) => {
              return (
                <Card
                  key={servicio.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={servicio.imagenUrl}
                      alt={servicio.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      <DynamicIcon
                        name={servicio.iconName}
                        size={24}
                        className="text-primary"
                      />
                    </div>
                    <CardTitle>{servicio.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {servicio.descripcion}
                    </CardDescription>
                  </CardContent>
                  <Button className="mt-auto">
                    Me Interesa
                    <FaWhatsapp className="mr-2 h-4 w-4" />
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
