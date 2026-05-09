'use client'

import { Button } from "@/components/ui/button";

import { LucideIcon } from "lucide-react";

type TableButtonProps ={
  icon?: LucideIcon;
  buttonColor?: "secondary" | "destructive" ;
}

const TableButton = ({ icon: Icon, buttonColor}:TableButtonProps) => {
  return (
    <Button variant={buttonColor}>
      {Icon && <Icon/>}
    </Button>
  );
};

export default TableButton;
