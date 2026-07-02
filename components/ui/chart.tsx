"use client"

import * as React from "react"
import {
  ResponsiveContainer,
  Tooltip,
  type TooltipContentProps,
  type TooltipPayloadEntry,
} from "recharts"

import { cn } from "@/lib/utils"

export type ChartConfig = Record<
  string,
  {
    label?: string
    color?: string
  }
>

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("Chart components must be used inside <ChartContainer />.")
  }

  return context
}

function ChartContainer({
  id,
  className,
  config,
  children,
}: React.ComponentProps<"div"> & {
  config: ChartConfig
}) {
  const chartId = React.useId()
  const resolvedId = `chart-${id ?? chartId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={resolvedId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-pie-label-text]:fill-foreground [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-none",
          className
        )}
      >
        <ChartStyle id={resolvedId} config={config} />
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

function ChartStyle({
  id,
  config,
}: {
  id: string
  config: ChartConfig
}) {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          [data-chart=${id}] {
            ${colorConfig
              .map(([key, itemConfig]) => `--color-${key}: ${itemConfig.color};`)
              .join("\n")}
          }
        `,
      }}
    />
  )
}

function ChartTooltipContent({
  active,
  payload,
  label,
  labelFormatter,
  className,
}: Partial<TooltipContentProps<number, string>> & {
  className?: string
}) {
  const { config } = useChart()

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div
      className={cn(
        "min-w-44 rounded-xl border bg-popover/95 p-3 text-sm text-popover-foreground shadow-md backdrop-blur",
        className
      )}
    >
      {label ? (
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {labelFormatter ? labelFormatter(label, payload) : String(label)}
        </p>
      ) : null}
      <div className="space-y-2">
        {payload.map((item: TooltipPayloadEntry) => {
          const dataKey = String(item.dataKey ?? "")
          const itemConfig = config[dataKey]
          const displayLabel = itemConfig?.label ?? item.name ?? dataKey
          const indicatorColor =
            item.color ?? item.payload?.fill ?? `var(--color-${dataKey})`

          return (
            <div
              key={`${dataKey}-${item.value}`}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: indicatorColor }}
                />
                <span className="text-muted-foreground">{displayLabel}</span>
              </div>
              <span className="font-medium text-foreground">{item.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ChartTooltip({
  content,
  ...props
}: React.ComponentProps<typeof Tooltip>) {
  return <Tooltip cursor={false} content={content} {...props} />
}

export { ChartContainer, ChartTooltip, ChartTooltipContent }
