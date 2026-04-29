import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import {
  BookUser,
  ReceiptText,
  Calendar,
  PawPrint,
  CirclePlus,
  SquarePen,
} from "lucide-react";

type SectionHeaderProps = {
  icon?: LucideIcon;
  iconLabel?: string;
  title?: string;
  description?: string;
  addButtonText?: string;
  editButtonText?: string;
};

const SectionHeader = ({
  icon: Icon,
  iconLabel,
  title,
  description,
  addButtonText,
  editButtonText,
}: SectionHeaderProps) => {
  return (
    <Card className="flex-row justify-between items-center gap-6 p-6 rounded-b-4xl">
      <div>
        <span className="inline-flex items-center gap-2">
          {Icon && <Icon />}
          {iconLabel}
        </span>

        <h1 className="text-inherit text-[clamp(1.7rem,2.8vw,2.7rem)] mb-2">
          {title}
        </h1>

        <p>{description}</p>
      </div>

      <div className="flex flex-col gap-2">
        {addButtonText && (
          <Button>
            <CirclePlus />
            {addButtonText}
          </Button>
        )}

        {editButtonText && (
          <Button>
            <SquarePen />
            {editButtonText}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default SectionHeader
