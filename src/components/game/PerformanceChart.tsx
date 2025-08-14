"use client"

import type { Stats } from '@/lib/types';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface PerformanceChartProps {
  history: { turn: number; stats: Stats }[];
}

export default function PerformanceChart({ history }: PerformanceChartProps) {
  const chartData = history.map(entry => ({
    name: `T${entry.turn}`,
    Budget: entry.stats.budget,
    publicOpinion: entry.stats.publicOpinion,
    policeStrength: entry.stats.policeStrength,
    oppositionStrength: entry.stats.oppositionStrength,
    unemploymentRate: entry.stats.unemploymentRate
  }));

  const chartConfig = {
    publicOpinion: { label: "Public Opinion", color: "hsl(var(--primary))" },
    Budget: { label: "Budget Health", color: "hsl(var(--chart-2))" },
    policeStrength: { label: "Police", color: "hsl(var(--chart-3))" },
    oppositionStrength: { label: "Opposition", color: "hsl(var(--destructive))" },
    unemploymentRate: { label: "Unemployment", color: "hsl(var(--accent))" },
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-bold">Performance Overview</CardTitle>
        <CardDescription>Track the impact of your decisions on key metrics.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
            <LineChart accessibilityLayer data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                <Line dataKey="publicOpinion" type="monotone" stroke="var(--color-publicOpinion)" strokeWidth={2.5} dot={false} />
                <Line dataKey="Budget" type="monotone" stroke="var(--color-Budget)" strokeWidth={2} dot={false} />
                <Line dataKey="policeStrength" type="monotone" stroke="var(--color-policeStrength)" strokeWidth={2} dot={false} />
                <Line dataKey="oppositionStrength" type="monotone" stroke="var(--color-oppositionStrength)" strokeWidth={2} dot={false} />
                <Line dataKey="unemploymentRate" type="monotone" stroke="var(--color-unemploymentRate)" strokeWidth={2} dot={false} />
            </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
