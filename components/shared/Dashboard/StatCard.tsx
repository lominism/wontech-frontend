"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Props = {
  title: string;
  value: string;
  /** Optional control (e.g. a range filter) rendered in the card header. */
  action?: React.ReactNode;
};

export function StatCard({ title, value, action }: Props) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 p-4 pb-0">
        <span className="text-sm font-medium text-muted-foreground">
          {title}
        </span>
        {action}
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="text-2xl font-bold tracking-tight tabular-nums">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
