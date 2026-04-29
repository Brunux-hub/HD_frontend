import TypographyH2 from "@/components/ThypographyH2";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import veterinarios from "@/data/vetEquipo.json";

export default function Team() {
  return (
    <section id="equipo" className="w-full bg-zinc-50 dark:bg-black py-4 ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-12 text-center">
          <TypographyH2
            someText="Equipo de Veterinarios"
            className="font-bold mb-4"
          />
          <p className="text-muted-foreground max-w-2xl">
            Contamos con un equipo de experimentados profesionales comprometidos
            con la salud y bienestar integral de tus mascotas.
          </p>
        </div>

        {/* Grid responsivo: 1 columna en móvil, 3 en tablet, 5 en escritorio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {veterinarios.map((veterinario) => (
            <Card
              key={veterinario.id}
              className="flex flex-col items-center text-center p-6 bg-card border-muted/50 transition-all hover:shadow-lg"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10 shadow-inner">
                  <img
                    src={veterinario.imagenUrl}
                    alt={`${veterinario.nombre} ${veterinario.apellido}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
              </div>
              
              <CardContent className="p-0 flex flex-col gap-1">
                <CardTitle className="text-lg font-bold leading-tight">
                  {veterinario.nombre} <br /> {veterinario.apellido}
                </CardTitle>
                
                <span className="text-sm font-semibold text-primary/80 mt-1">
                  {veterinario.rol}
                </span>
                
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full w-fit mx-auto mt-2">
                  {veterinario.area}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
