'use client';

import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card';
import { ChartConfig, ChartContainer } from '@/components/shadcn/chart';

export default function Duration({ data }: { data: { duration: number }[] }) {
  const shortestDuration = data.length ? Math.min(...data.map((p) => p.duration)) : 0;
  const totalDuration = data.reduce((sum, p) => sum + p.duration, 0);
  const averageDuration = data.length ? totalDuration / data.length : 0;
  const totalPossibleDuration = 1200;
  const endAngle = 90 + (shortestDuration / totalPossibleDuration) * 180;
  const startAngle = 90 - (shortestDuration / totalPossibleDuration) * 180;
  const chartData = [{ time: 'secs', duration: shortestDuration, fill: 'var(--color-secs)' }];

  const chartConfig = {
    duration: {
      label: 'Duration',
    },
    secs: {
      label: 'secs',
      color: 'hsl(var(--chart-6))',
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col bg-muted/50">
      <CardHeader className="items-center pb-0">
        <CardTitle>Duration</CardTitle>
        <CardDescription>Shortest practice duration</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart data={chartData} startAngle={startAngle} endAngle={endAngle} innerRadius={80} outerRadius={140}>
            <PolarGrid gridType="circle" radialLines={false} stroke="none" className="first:fill-muted last:fill-background" polarRadius={[86, 74]} />
            <RadialBar dataKey="duration" background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-4xl font-bold">
                          {shortestDuration.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          secs
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
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">An average of {averageDuration.toFixed()}s per practice</div>
        <div className="leading-none text-muted-foreground">Shortest time spent on a practice.</div>
      </CardFooter>
    </Card>
  );
}
