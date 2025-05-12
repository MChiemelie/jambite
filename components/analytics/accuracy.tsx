'use client';

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/shadcn/chart';
import { AccuracyProps } from '@/types';

export default function Accuracy({ data }:{data: AccuracyProps['data']}) {
  const { correct, incorrect } = data[0];
  const totalAttempts = correct + incorrect;
  const accuracy = totalAttempts > 0 ? Math.round((correct / totalAttempts) * 100) : 0;

  // Chart configuration
  const chartConfig = {
    incorrect: {
      label: 'Incorrect',
      color: 'hsl(var(--chart-1))',
    },
    correct: {
      label: 'Correct',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col bg-muted/50">
      <CardHeader className="items-center pb-0">
        <CardTitle>Accuracy</CardTitle>
        <CardDescription>Correct vs Incorrect</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[250px]">
          <RadialBarChart data={data} endAngle={180} innerRadius={80} outerRadius={130}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) =>
                  viewBox && 'cx' in viewBox && 'cy' in viewBox ? (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 16} className="fill-foreground text-2xl font-bold">
                        {totalAttempts.toLocaleString()}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} className="fill-muted-foreground">
                        answers
                      </tspan>
                    </text>
                  ) : null
                }
              />
            </PolarRadiusAxis>
            <RadialBar dataKey="incorrect" stackId="a" cornerRadius={5} fill="var(--color-incorrect)" className="stroke-transparent stroke-2" />
            <RadialBar dataKey="correct" fill="var(--color-correct)" stackId="a" cornerRadius={5} className="stroke-transparent stroke-2" />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col text-center gap-2 text-sm">
        <p className="font-medium leading-none">Your answers are {accuracy}% accurate</p>
        <p className="leading-none text-muted-foreground">
          Aced {correct} of {totalAttempts} attempts
        </p>
      </CardFooter>
    </Card>
  );
}
