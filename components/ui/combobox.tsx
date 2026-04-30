import * as React from "react";
import { cn } from "@/components/ui/cn";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  id?: string;
  name?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Selecciona una opcion",
  searchPlaceholder = "Buscar...",
  emptyText = "Sin resultados",
  className,
  id,
  name,
}: ComboboxProps) {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return options;
    }
    return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery));
  }, [options, query]);

  return (
    <div className={cn("relative", className)}>
      <input
        id={id}
        type="text"
        value={query}
        placeholder={selectedOption ? selectedOption.label : placeholder}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="w-full rounded border px-3 py-2 text-sm"
      />
      <input type="hidden" name={name} value={value ?? ""} />
      {open ? (
        <ul className="absolute z-40 mt-1 max-h-44 w-full overflow-auto rounded border bg-white p-1">
          <li className="px-2 py-1 text-xs opacity-70">{searchPlaceholder}</li>
          {filteredOptions.length === 0 ? (
            <li className="px-2 py-1 text-sm">{emptyText}</li>
          ) : (
            filteredOptions.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  className="w-full rounded px-2 py-1 text-left text-sm"
                  onClick={() => {
                    onChange?.(option.value);
                    setQuery("");
                    setOpen(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
