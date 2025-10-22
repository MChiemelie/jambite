'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/shadcn/chart';
import type { AcumenProps } from '@/types';

const chartConfig = {
  correct: {
    label: 'correct',
    color: 'hsl(var(--chart-1))'
  },
  incorrect: {
    label: 'incorrect',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

export default function Precision({ data }: AcumenProps) {
  const chartData = data;
  if (!data) return;

  const getTopSubjectByAccuracy = (data: AcumenProps['data']) => {
    const withRatio = data.map((item) => ({
      ...item,
      ratio: item.incorrect === 0 ? item.correct : item.correct / item.incorrect
    }));
    const top = withRatio.reduce((a, b) => (a.ratio > b.ratio ? a : b));
    return top;
  };
  const topSubject = getTopSubjectByAccuracy(chartData);

  return (
    <Card className='bg-muted/50 flex flex-col justify-between'>
      <CardHeader>
        <CardTitle className='text-center'>Precision</CardTitle>
        <CardDescription className='text-center'>Correct vs Incorrect by Subject</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='subject' tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey='correct' stackId='a' fill='var(--color-correct)' radius={[0, 0, 4, 4]} />
            <Bar dataKey='incorrect' stackId='a' fill='var(--color-incorrect)' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-center gap-2 text-center text-sm leading-none'>
        <p className='font-medium'>
          {topSubject.subject} with {topSubject.correct} correct and {topSubject.incorrect} incorect answers.
        </p>
        <p className='text-muted-foreground'>Showing excellence based on correct-incorrect ratio</p>
      </CardFooter>
    </Card>
  );
}
