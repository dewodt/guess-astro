"use client";

import { StatisticsData } from "@/types/data";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Rectangle,
  CartesianGrid,
  type TooltipProps,
  type RectangleProps,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

// Custom tooltip component
const CustomToolTip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col gap-1 rounded-md border-2 border-border bg-background p-4">
        <p className="text-sm font-semibold text-secondary-foreground">{`Month ${label}`}</p>
        <p className="text-sm text-secondary-foreground">
          Score: {`${payload[0].value}`}
        </p>
      </div>
    );
  }
};

// Custom cursor
const CustomCursor = ({ x, y, width, height }: RectangleProps) => {
  return (
    <Rectangle
      className="fill-muted stroke-muted"
      radius={[4, 4, 0, 0]}
      x={x}
      y={y}
      width={width}
      height={height}
    />
  );
};

export const StatisticsChart = ({
  chartData,
}: {
  chartData: StatisticsData["chartData"];
}) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} margin={{ left: -10, right: 30 }}>
        {/* Grid */}
        <CartesianGrid vertical={false} strokeDasharray="8" />

        {/* X Axis */}
        <XAxis fontSize={12} dataKey="month" tickLine={false} axisLine={true} />

        {/* Y Axis */}
        <YAxis
          fontSize={12}
          tickLine={true}
          axisLine={true}
          tickFormatter={(value) => `${value}`}
        />

        {/* Tooltip */}
        <Tooltip content={<CustomToolTip />} cursor={<CustomCursor />} />

        {/* Bars */}
        <Bar dataKey="score" className="fill-primary" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
