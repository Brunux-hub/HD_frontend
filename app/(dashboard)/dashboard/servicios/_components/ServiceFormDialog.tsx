import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";

import { Servicio } from "@/types/servicio";

const ServiceForm = () => {
  return (
    
    <form>
      <FieldGroup>
        <FieldSet>
          <FieldLegend className="text-center font-semibold text-xl">Gestionar Servicios Veterinarios</FieldLegend>
          <FieldGroup>
            {/* SERVICIO */}
            <Field>
              <FieldLabel htmlFor="servicio">Servicio</FieldLabel>
              <Input id="servicio" placeholder="escribe un servicio" required />
            </Field>
            {/* CATEGORÍA */}
            <Field>
              <FieldLabel htmlFor="categoria">Elige una Categoria</FieldLabel>
              <Select defaultValue="">
                <SelectTrigger id="categoria">
                  <SelectValue placeholder="Elige un Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="consulta">Consulta</SelectItem>
                    <SelectItem value="cirugia">Cirugia</SelectItem>
                    <SelectItem value="grooming">Grooming</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            {/* DESCRIPCIÓN */}
            <Field>
              <FieldLabel htmlFor="descripcion">Comments</FieldLabel>
              <Textarea
                id="descripcion"
                placeholder="Agrea una descripción del Servicio"
                className="resize-none"
              />
            </Field>
            {/* PRECIO */}
            <Field>
              <FieldLabel htmlFor="precio">Precio</FieldLabel>
              <Input
                id="precio"
                placeholder="0.0"
                type="number"
                min="0"
                step="0.01"
                required
              />
            </Field>
            {/* ESTADO */}
            <Field>
              <Select defaultValue="">
                <SelectTrigger id="estado">
                  <SelectValue placeholder="Estado del Servicio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="true">Activo</SelectItem>
                    <SelectItem value="false">Inactivo</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            {/* BOTON SUBMIT */}
            <Field orientation="horizontal">
              <Button type="submit">Guardar</Button>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </form>
  );
};

export default ServiceForm;
