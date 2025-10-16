'use client';

import React, { useMemo } from 'react';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/shadcn/chart';
import type { AccuracyProps } from '@/types';

type Props = { data: AccuracyProps['data'] };

function AccuracyComponent({ data }: Props) {
  const safeData = useMemo(() => (Array.isArray(data) && data.length ? data : [{ correct: 0, incorrect: 0 }]), [data]);

  const { correct, incorrect } = safeData[0];
  const totalAttempts = useMemo(() => Number(correct) + Number(incorrect), [correct, incorrect]);
  const accuracy = useMemo(() => (totalAttempts > 0 ? Math.round((Number(correct) / totalAttempts) * 100) : 0), [correct, totalAttempts]);

  const chartConfig = useMemo<ChartConfig>(() => {
    return {
      incorrect: { label: 'Incorrect', color: 'hsl(var(--chart-1))' },
      correct: { label: 'Correct', color: 'hsl(var(--chart-2))' }
    };
  }, []);

  const chartData = useMemo(
    () =>
      safeData.map((d) => ({
        incorrect: Number(d.incorrect ?? 0),
        correct: Number(d.correct ?? 0)
      })),
    [safeData]
  );

  return (
    <Card className='flex flex-col justify-between bg-muted/50' aria-label='Accuracy card'>
      <CardHeader className='items-center'>
        <CardTitle>Accuracy</CardTitle>
        <CardDescription>Correct vs Wrong</CardDescription>
      </CardHeader>

      <CardContent className='flex flex-1 items-center pb-0'>
        <ChartContainer config={chartConfig} className='mx-auto aspect-square w-full max-w-[250px]'>
          <RadialBarChart data={chartData} endAngle={180} innerRadius={80} outerRadius={130}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }: any) =>
                  viewBox && typeof viewBox.cx === 'number' && typeof viewBox.cy === 'number' ? (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle'>
                      <tspan x={viewBox.cx} y={viewBox.cy - 16} className='fill-foreground text-2xl font-bold'>
                        {totalAttempts.toLocaleString()}
                      </tspan>
                      <tspan x={viewBox.cx} y={viewBox.cy + 4} className='fill-muted-foreground'>
                        {totalAttempts > 0 ? 'answers' : 'no answers'}
                      </tspan>
                    </text>
                  ) : null
                }
              />
            </PolarRadiusAxis>

            <RadialBar dataKey='incorrect' stackId='a' cornerRadius={5} fill='var(--color-incorrect)' className='stroke-transparent stroke-2' />
            <RadialBar dataKey='correct' fill='var(--color-correct)' stackId='a' cornerRadius={5} className='stroke-transparent stroke-2' />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className='flex-col text-center gap-2 text-sm'>
        <p className='font-medium leading-none'>Your answers are {accuracy}% accurate</p>
        <p className='leading-none text-muted-foreground'>
          Aced {correct} of {totalAttempts} attempts
        </p>
      </CardFooter>
    </Card>
  );
}

export default React.memo(AccuracyComponent);
