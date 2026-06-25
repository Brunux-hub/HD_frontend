"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { SearchIcon } from "lucide-react"

interface CommandProps extends React.ComponentProps<"div"> {
  shouldFilter?: boolean
}

function Command({ className, ...props }: CommandProps) {
  return (
    <div
      data-slot="command"
      className={cn("flex h-full w-full flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground", className)}
      {...props}
    />
  )
}

function CommandInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="flex items-center border-b px-3">
      <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <input
        data-slot="command-input"
        className={cn("flex h-10 w-full rounded-lg bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className)}
        {...props}
      />
    </div>
  )
}

function CommandList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-list"
      className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
      {...props}
    />
  )
}

function CommandEmpty({ ...props }: React.ComponentProps<"div">) {
  return <div data-slot="command-empty" className="py-6 text-center text-sm text-muted-foreground" {...props} />
}

function CommandGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-group"
      className={cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className)}
      {...props}
    />
  )
}

interface CommandItemProps {
  className?: string
  children?: React.ReactNode
  value?: string
  onSelect?: (value: string) => void
  disabled?: boolean
}

function CommandItem({ className, children, value, onSelect, disabled }: CommandItemProps) {
  return (
    <div
      data-slot="command-item"
      role="option"
      aria-disabled={disabled}
      onClick={() => !disabled && onSelect?.(value ?? "")}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        className
      )}
    >
      {children}
    </div>
  )
}

export { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem }
