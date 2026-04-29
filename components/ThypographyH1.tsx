import { cn } from "@/lib/utils";

type TypographyH1Props = {
  someText?: string;
  className?: string;
};

const ThypographyH1 = ({ someText, className }: TypographyH1Props) => {
  return (
    <h1
      className={cn(
        "text-center text-5xl scroll-m-20  tracking-normal text-balance",
        className,
      )}
    >
      {someText}
    </h1>
  );
};

export default ThypographyH1;
