import { ReceiptText } from "lucide-react";
import SectionHeader from "../_components/SectionHeader";

const ServicesPage = () => {
  return (
    <div className="max-w-[1180px] px-4 mx-auto border border-amber-500">
      <SectionHeader
        icon={ReceiptText}
        iconLabel="Servicios"
        title="Listado de Servicios"
        description="Vista donde podrás revisar y gestionar los servicios"
        addButtonText="Crear Servicio"
        editButtonText="Editar Servicio"
      />

      {/* TABLA DE SERVICIOS */}
    </div>
  );
};

export default ServicesPage;
