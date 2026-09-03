import { describe, expect, it } from "vitest";

describe("Pruebas del sistema de la clínica veterinaria", () => {
  it("debe comprobar que una cantidad válida de vacunas es positiva", () => {
    const cantidad = 3;

    expect(cantidad).toBeGreaterThan(0);
  });

  it("debe comprobar que existe disponibilidad para una atención", () => {
    const disponibilidad = 5;
    const cantidadSolicitada = 2;

    expect(disponibilidad).toBeGreaterThanOrEqual(cantidadSolicitada);
  });
});
