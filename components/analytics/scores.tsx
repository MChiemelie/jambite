'use client';

import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/shadcn/chart';

const subjects = ['Use of English', 'Mathematics', 'Commerce', 'Accounting', 'Biology', 'Physics', 'Chemistry', 'Lit. In English', 'Government', 'Christian Rel. Know', 'Geography', 'Economics', 'Islamic Rel. Know', 'Civic Education', 'History'];
const parameters = ['Eng', 'Math', 'Com', 'Acc', 'Bio', 'Phy', 'Chem', 'Lit', 'Govt', 'CRK', 'Geo', 'Eco', 'IRK', 'Civic', 'His'];

export default function Scores({ data }: { data: { subject: string; score: number }[] }) {
  const generateDynamicChartData = (
    data: { subject: string; score: number }[]
  ): {
    subject: string;
    score: number;
    fill: string;
  }[] => {
    return data.map((item, index) => ({
      subject: item.subject,
      score: item.score,
      fill: `hsl(var(--chart-${index + 1}))`,
    }));
  };

  const mapSubjectToShortName = (subject: string): string => {
    const index = subjects.indexOf(subject);
    return index !== -1 ? parameters[index] : subject;
  };

  const filteredData = data.filter((item) => item.score > 0);

  const chartDataWithShortNames = filteredData.map((item) => ({
    subject: mapSubjectToShortName(item.subject),
    score: item.score,
  }));

  const dynamicChartData = generateDynamicChartData(chartDataWithShortNames);

  const chartConfig = {
    subject: {
      label: 'subject',
    },
  } satisfies ChartConfig;

  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle className="text-center">Scores</CardTitle>
        <CardDescription className="text-center">Best scores across subjects</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={dynamicChartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis dataKey="subject" type="category" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value} />
            <XAxis dataKey="score" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="score" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Best score is {Math.max(...data.map((item) => item.score))} in{' '}
          {(() => {
            const bestScoreItem = data.find((item) => item.score === Math.max(...data.map((item) => item.score)));
            return bestScoreItem ? bestScoreItem.subject : 'N/A';
          })()}
        </div>
        <div className="leading-none text-muted-foreground">Showing best scores across subjects</div>
      </CardFooter>
    </Card>
  );
}
