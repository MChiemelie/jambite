'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/shadcn/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/shadcn/chart';
import type { ChartData, SubjectAttempts } from '@/types/analytics';

const generateDynamicChartData = (data: SubjectAttempts[]): ChartData[] => {
  return data.map((item, index) => ({
    subject: item.subject,
    attempts: item.attempts,
    fill: `hsl(var(--chart-${index + 1}))`
  }));
};

const chartConfig: ChartConfig = {
  attempts: {
    label: 'Attempts'
  }
};

const getMostPracticedSubject = (data: SubjectAttempts[]): string[] => {
  const filteredData = data.filter((item) => item.subject !== 'Use of English');
  const maxAttempts = Math.max(...filteredData.map((item) => item.attempts));
  const mostPracticed = filteredData.filter(
    (item) => item.attempts === maxAttempts
  );
  return mostPracticed.map((item) => item.subject);
};

export default function Subjects({ data }: { data: SubjectAttempts[] }) {
  const chartData = React.useMemo(() => generateDynamicChartData(data), [data]);
  const numberOfSubjectsPracticed = React.useMemo(
    () => new Set(data.map((item) => item.subject)).size,
    [data]
  );
  const mostPracticedSubjects = React.useMemo(
    () => getMostPracticedSubject(data),
    [data]
  );

  return (
    <Card className='flex flex-col justify-between bg-muted/50'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Subjects</CardTitle>
        <CardDescription>Top Practiced Subjects</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='attempts'
              nameKey='subject'
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {numberOfSubjectsPracticed.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          subjects
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='text-center flex flex-col gap-2 text-sm'>
        <div className='font-medium leading-5'>
          You practiced
          {mostPracticedSubjects.map((subject, index) => {
            const subjectAttempts =
              data.filter((item) => item.subject === subject)[0]?.attempts ?? 0;
            return (
              <span key={subject}>
                {index > 0 ? ' and ' : ' '}
                <strong>{subject}</strong>
                <span> ({subjectAttempts} times)</span>
              </span>
            );
          })}
        </div>
        <div className='leading-none text-muted-foreground'>
          Use of English is not included
        </div>
      </CardFooter>
    </Card>
  );
}
