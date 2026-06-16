"use client";

import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { mockSalesByCategory } from "@/lib/mock-data";

const chartConfig = {
  value: { label: "Sales" },
  skincare: { label: "Skincare", color: "var(--primary)" },
  devices: { label: "Devices", color: "oklch(0.75 0.16 50)" },
  consumables: { label: "Consumables", color: "oklch(0.83 0.13 75)" },
  supplements: { label: "Supplements", color: "oklch(0.72 0.03 264)" },
} satisfies ChartConfig;

const compactBaht = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function CategoryChart() {
  const total = useMemo(
    () => mockSalesByCategory.reduce((sum, item) => sum + item.value, 0),
    []
  );

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Sales by Category</CardTitle>
        <CardDescription>Revenue split across product lines</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[260px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={mockSalesByCategory}
              dataKey="value"
              nameKey="category"
              innerRadius={62}
              strokeWidth={4}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          ฿{compactBaht.format(total)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 22}
                          className="fill-muted-foreground text-xs"
                        >
                          Total Sales
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-1 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
