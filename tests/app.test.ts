import { describe, expect, it } from "vitest";

describe("Pruebas del sistema de la clinica veterinaria", () => {
  it("debe comprobar que una cantidad valida de vacunas es positiva", () => {
    const cantidad = 3;

    expect(cantidad).toBeGreaterThan(0);
  });

  it("debe comprobar que existe disponibilidad para una atencion", () => {
    const disponibilidad = 5;
    const cantidadSolicitada = 2;

    expect(disponibilidad).toBeGreaterThanOrEqual(cantidadSolicitada);
  });
});
