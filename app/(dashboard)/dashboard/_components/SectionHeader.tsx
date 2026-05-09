'use client'

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import {
  BookUser,
  ReceiptText,
  Calendar,
  PawPrint,
  CirclePlus,
} from "lucide-react";

import ServiceFormDialog from "../servicios/_components/ServiceFormDialog";

type SectionHeaderProps = {
  iconName?: string;
  iconLabel?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

const SectionHeader = ({
  iconName,
  iconLabel,
  title,
  description,
  action
}: SectionHeaderProps) => {
  return (
    <Card className="flex-row justify-between items-center gap-6 p-6 rounded-b-4xl">
      <div>
        <span className="inline-flex items-center gap-2">
          {iconName === "Icono Servicios" && <ReceiptText />}
          {iconLabel}
        </span>

        <h1 className="text-inherit text-[clamp(1.7rem,2.8vw,2.7rem)] mb-2">
          {title}
        </h1>

        <p>{description}</p>
      </div>

      <div className="flex flex-col gap-2">
        {/*Formulario */}
        {action}
      </div>
    </Card>
  );
};

export default SectionHeader;
