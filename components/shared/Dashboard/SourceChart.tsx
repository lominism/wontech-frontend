"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
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
import type { SalesBySourceItem } from "@/lib/api/dashboard";

const compactBaht = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

type Props = {
  data: SalesBySourceItem[];
};

export function SourceChart({ data }: Props) {
  const t = useTranslations("dashboard.charts.salesBySource");
  const tSource = useTranslations("orders.newOrder.sources");

  const chartConfig = {
    value: { label: "Sales" },
    wontech: { label: tSource("wontech"), color: "var(--primary)" },
    lazada: { label: tSource("lazada"), color: "oklch(0.75 0.16 50)" },
    shopee: { label: tSource("shopee"), color: "oklch(0.83 0.13 75)" },
  } satisfies ChartConfig;

  const chartData = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        fill: `var(--color-${item.source})`,
      })),
    [data]
  );

  const total = useMemo(
    () => chartData.reduce((sum, item) => sum + item.value, 0),
    [chartData]
  );

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        {total === 0 ? (
          <div className="flex aspect-square max-h-[260px] items-center justify-center text-muted-foreground text-sm">
            {t("empty")}
          </div>
        ) : (
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
                data={chartData}
                dataKey="value"
                nameKey="source"
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
                            {t("totalSales")}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="source" />}
                className="-translate-y-1 flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
