import TypographyH2 from "@/components/ThypographyH2";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <section id="contacto" className="w-full bg-zinc-50 dark:bg-black py-4">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 border-4 border-teal-600">
        <div className="flex-col flex items-center justify-center">
          <TypographyH2
            someText="Envianos un Mensaje"
            className="font-bold mb-4"
          />
          <form className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <FieldSet>
              <FieldLegend className="text-2xl font-semibold">
                Contáctanos
              </FieldLegend>

              <FieldDescription className="text-muted-foreground">
                Completa tus datos y te contactaremos para coordinar tu
                atención.
              </FieldDescription>

              <FieldGroup className="space-y-1">
                <Field className="space-y-1">
                  <FieldLabel htmlFor="name">Nombres y Apellidos</FieldLabel>
                  <Input
                    id="name"
                    autoComplete="off"
                    placeholder="Nombres y Apellidos"
                    className="rounded-xl"
                  />
                </Field>

                <Field className="space-y-1">
                  <FieldLabel htmlFor="email">Correo Electrónico</FieldLabel>
                  <Input
                    id="email"
                    autoComplete="off"
                    placeholder="Correo Electrónico"
                    className="rounded-xl"
                  />
                </Field>

                <Field className="space-y-1">
                  <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
                  <Input
                    id="phone"
                    autoComplete="off"
                    placeholder="Teléfono"
                    className="rounded-xl"
                  />
                </Field>

                <Field className="space-y-1">
                  <FieldLabel htmlFor="serviceDescription">
                    ¿Qué servicio necesitas?
                  </FieldLabel>
                  <Textarea
                    id="serviceDescription"
                    autoComplete="off"
                    placeholder="Describe el servicio..."
                    className="min-h-32 rounded-xl"
                  />
                </Field>

                <Button className="rounded-xl text-sm transition hover:opacity-90">
                  Enviar solicitud
                </Button>
              </FieldGroup>
            </FieldSet>
          </form>
        </div>
      </div>
    </section>
  );
}
