import ThypographyH3 from "@/components/ThypographyH3";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function About() {
  return (
    <section id="nosotros" className="w-full bg-zinc-50 dark:bg-black">
      <div className="mx-auto w-full max-w-7xl  px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 items-center justify-center ">
          <div>
            <ThypographyH3 someText="Nuestra Historia" />
            <CardContent>
              <CardDescription className="text-base">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Deserunt iste inventore reiciendis rerum qui suscipit quasi
                quibusdam eligendi dolorum tempora molestiae, eveniet in quos
                praesentium quidem! Ipsa incidunt ad cumque!
              </CardDescription>
            </CardContent>
            <img
              src="/logovet2.jpg"
              alt="logo"
              className="h-48 w-48 mx-auto block rounded-full pt-4"
            />
          </div>

          <div className="flex flex-col gap-8">
            <Card>
              <ThypographyH3 someText="Mision" />
              <CardContent>
                <CardDescription className="text-base">
                  Brindar atención veterinaria integral, preventiva y
                  especializada, promoviendo la salud, bienestar y calidad de
                  vida de las mascotas mediante un servicio profesional, ético y
                  humano.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <ThypographyH3 someText="Vision" />
              <CardContent>
                <CardDescription className="text-base">
                  Ser una veterinaria referente por excelencia, reconocida por
                  la calidad de atención, innovación médica y compromiso con el
                  cuidado responsable de los animales.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
