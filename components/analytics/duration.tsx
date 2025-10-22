'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/shadcn/chart';
import type { DurationProps } from '@/types';

const chartConfig = {
  duration: {
    label: 'Duration',
    color: 'hsl(var(--chart-2))'
  },
  score: {
    label: 'Score',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig;

export default function Duration({ data }: { data: DurationProps }) {
  const chartData = data;

  const best = chartData.reduce((prev, curr) => (curr.score > prev.score ? curr : prev), chartData[0]);

  return (
    <Card className='bg-muted/50 flex flex-col justify-between'>
      <CardHeader>
        <CardTitle className='text-center'>Duration</CardTitle>
        <CardDescription className='text-center'>Performance per Time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='metric' tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='dashed' />} />
            <Bar dataKey='score' fill='var(--color-score)' radius={4} />
            <Bar dataKey='duration' fill='var(--color-duration)' radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-center gap-2 text-sm'>
        <p className='flex gap-2 text-center leading-none font-medium'>
          Best Time: {best.metric} with score {best.score} in {best.duration} secs
        </p>
        <p className='text-muted-foreground text-center leading-none'>Comparing performance by time</p>
      </CardFooter>
    </Card>
  );
}
