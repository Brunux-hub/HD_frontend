// components/atoms/DynamicIcon.tsx
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const Icon = (LucideIcons as any)[name]; 
  
  if (!Icon) {
    return <LucideIcons.HelpCircle {...props} />; // Icono por defecto si falla el nombre
  }

  return <Icon {...props} />;
};