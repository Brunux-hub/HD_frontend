import { cn } from "@/lib/utils";

/** Avatar simple por inicial (las mascotas del backend no tienen foto). */
export default function PetAvatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl bg-teal-100 font-bold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
        className,
      )}
    >
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
}
