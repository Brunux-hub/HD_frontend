import { cn } from "@/lib/utils";

type TypographyH2Props = {
  someText?: string;
  className?: string;
};

const TypographyH2 = ({ someText, className }: TypographyH2Props) => {
  return (
    <h2
      className={cn(
        `text-center text-4xl scroll-m-20 tracking-normal text-balance`,
        className,
      )}
    >
      {someText}
    </h2>
  );
};

export default TypographyH2;
