import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";
import { ComponentType } from "react";

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const icons = LucideIcons as unknown as Record<
    string,
    ComponentType<LucideProps>
  >;
  const Icon = icons[name];

  if (!Icon) {
    return <LucideIcons.HelpCircle {...props} />;
  }

  return <Icon {...props} />;
};
