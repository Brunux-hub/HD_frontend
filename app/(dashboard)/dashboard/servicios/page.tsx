import { ReceiptText } from "lucide-react";
import SectionHeader from "../_components/SectionHeader";
import ServiceTable from "./_components/ServiceTable";

const ServicesPage = () => {
  return (
    <div className="max-w-295 px-4 mx-auto border border-amber-500">
      <SectionHeader
        icon={ReceiptText}
        iconLabel="Servicios"
        title="Listado de Servicios"
        description="Vista donde podrás revisar y gestionar los servicios"
        addButtonText="Crear Servicio"
      />

      {/* TABLA DE SERVICIOS */}
      <ServiceTable/>
    </div>
  );
};

export default ServicesPage;
