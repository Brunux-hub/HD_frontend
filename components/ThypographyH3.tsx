import { cn } from "@/lib/utils";

type TypographyH3Props = {
  someText?: string;
  className?: string;
};

const ThypographyH3 = ({ someText, className }: TypographyH3Props) => {
  return (
    <h2
      className={cn(
        "text-center text-3xl scroll-m-20  tracking-normal text-balance",
        className,
      )}
    >
      {someText}
    </h2>
  );
};

export default ThypographyH3;
