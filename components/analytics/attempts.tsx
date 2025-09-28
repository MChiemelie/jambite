'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card';
import { ChartConfig, ChartContainer } from '@/components/shadcn/chart';
import { QuestionsAttemptsProps } from '@/types/analytics';
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

const chartConfig = {
  totalAttempts: {
    label: 'Total Attempts',
  },
  attempts: {
    label: 'attempts',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function Attempts({ totalAttempts, totalQuestions }: QuestionsAttemptsProps) {
  const attemptRate = totalQuestions > 0 ? (totalAttempts / totalQuestions) * 100 : 0;
  const startAngle = 90;
  const endAngle = startAngle - (attemptRate / 100) * 360;
  const innerRadius = 80 + attemptRate / 100;
  const outerRadius = 110 + attemptRate / 100;

  const chartData = [
    {
      attempts: 'attempts',
      totalAttempts,
      fill: 'var(--color-attempts)',
    },
  ];

  return (
    <Card className="flex flex-col justify-between bg-muted/50">
      <CardHeader className="items-center pb-0">
        <CardTitle>Attempts</CardTitle>
        <CardDescription>Total Questions Attempted</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart data={chartData} startAngle={startAngle} endAngle={endAngle} innerRadius={innerRadius} outerRadius={outerRadius}>
            <PolarGrid gridType="circle" radialLines={false} stroke="none" className="first:fill-muted last:fill-background" polarRadius={[86, 74]} />
            <RadialBar dataKey="totalAttempts" background cornerRadius={10} isAnimationActive={true} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-4xl font-bold">
                          {totalAttempts.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          attempts
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm text-center">
        <div className="flex items-center gap-2 font-medium leading-none">
          You attempted {attemptRate.toFixed()}% of {totalQuestions} questions.
        </div>
        <div className="leading-none text-muted-foreground">{totalAttempts} attempted questions</div>
      </CardFooter>
    </Card>
  );
}
