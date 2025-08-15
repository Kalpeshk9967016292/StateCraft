
"use client"

import type { Stats } from '@/lib/types';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";

interface PerformanceChartProps {
  history: { turn: number; stats: Stats }[];
}

const chartConfig = {
  "Public Approval": { label: "Public Approval", color: "hsl(var(--chart-1))" },
  "Law & Order": { label: "Law & Order", color: "hsl(var(--chart-2))" },
  "Economic Health": { label: "Economic Health", color: "hsl(var(--chart-3))" },
  "Opposition Strength": { label: "Opposition", color: "hsl(var(--chart-4))" },
  "Corruption Level": { label: "Corruption", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;


export default function PerformanceChart({ history }: PerformanceChartProps) {
  const chartData = history.map(entry => ({
    name: `T${entry.turn}`,
    "Public Approval": entry.stats.publicApproval,
    "Law & Order": entry.stats.lawAndOrder,
    "Economic Health": entry.stats.economicHealth,
    "Opposition Strength": entry.stats.oppositionStrength,
    "Corruption Level": entry.stats.corruptionLevel
  })).filter(item => item.name !== 'T0'); // Filter out the initial state turn 0

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-bold">Performance Overview</CardTitle>
        <CardDescription>Track the impact of your decisions on key metrics (0-100 scale).</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
            <ResponsiveContainer>
                <LineChart accessibilityLayer data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickCount={6}
                        domain={[0, 100]}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                    />
                    <Legend />
                    <Line dataKey="Public Approval" type="monotone" stroke="var(--color-Public Approval)" strokeWidth={2.5} dot={true} />
                    <Line dataKey="Law & Order" type="monotone" stroke="var(--color-Law & Order)" strokeWidth={2} dot={true} />
                    <Line dataKey="Economic Health" type="monotone" stroke="var(--color-Economic Health)" strokeWidth={2} dot={true} />
                    <Line dataKey="Opposition Strength" type="monotone" stroke="var(--color-Opposition Strength)" strokeWidth={2} dot={true} strokeDasharray="3 3" />
                    <Line dataKey="Corruption Level" type="monotone" stroke="var(--color-Corruption Level)" strokeWidth={2} dot={true} strokeDasharray="3 3" />
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
